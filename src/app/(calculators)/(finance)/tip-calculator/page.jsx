"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useTipCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const TipCalculator = () => {
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
      console.error("Error fetching calculator results:", err);
    }
  };

  useEffect(() => {
    handleFetchDetails();
  }, [url]);

  const [formData, setFormData] = useState({
    tech_for: "share",
    tech_x: 42,
    tech_xs: 4,
    tech_y: 22,
    tech_z: 12,
    tech_round: "no",
    tech_rounds: "no",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useTipCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.tech_for == "share") {
      if (
        !formData.tech_for ||
        !formData.tech_x ||
        !formData.tech_y ||
        !formData.tech_z ||
        !formData.tech_round
      ) {
        setFormError("Please fill in field");
        return;
      }
    } else {
      if (!formData.tech_for || !formData.tech_xs || !formData.tech_rounds) {
        setFormError("Please fill in field");
        return;
      }
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_for: formData.tech_for,
        tech_x: formData.tech_x,
        tech_xs: formData.tech_xs,
        tech_y: formData.tech_y,
        tech_z: formData.tech_z,
        tech_round: formData.tech_round,
        tech_rounds: formData.tech_rounds,
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
      tech_for: "share",
      tech_x: 42,
      tech_xs: 4,
      tech_y: 22,
      tech_z: 12,
      tech_round: "no",
      tech_rounds: "no",
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
            <div className="grid grid-cols-1  mt-3  gap-4">
              <div className=" px-2">
                <label htmlFor="tech_for" className="label">
                  {data?.payload?.tech_lang_keys["for"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_for"
                    id="tech_for"
                    value={formData.tech_for}
                    onChange={handleChange}
                  >
                    <option value="share">
                      {data?.payload?.tech_lang_keys["share"]}
                    </option>
                    <option value="single">
                      {data?.payload?.tech_lang_keys["single"]}{" "}
                    </option>
                  </select>
                </div>
              </div>
            </div>

            {formData?.tech_for == "share" && (
              <div className="share">
                <div className="grid grid-cols-1  lg:grid-cols-2 md:grid-cols-2 mt-3  gap-4">
                  <div className="px-2 pe-lg-4">
                    <label htmlFor="tech_x" className="label">
                      {data?.payload?.tech_lang_keys["x"]}:
                    </label>
                    <div className="py-2 relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_x"
                        id="tech_x"
                        className="input "
                        aria-label="input"
                        value={formData.tech_x}
                        onChange={handleChange}
                      />
                      <span className="text-blue input_unit">
                        {currency.symbol}
                      </span>
                    </div>
                  </div>
                  <div className="px-2 ps-lg-4 tip ">
                    <label htmlFor="tech_y" className="label">
                      {data?.payload?.tech_lang_keys["y"]}:
                    </label>
                    <div className="py-2 relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_y"
                        id="tech_y"
                        className="input "
                        aria-label="input"
                        value={formData.tech_y}
                        onChange={handleChange}
                      />
                      <span className="text-blue input_unit">%</span>
                    </div>
                  </div>
                  <div className="px-2 pe-lg-4 ppl">
                    <label htmlFor="tech_z" className="label">
                      {data?.payload?.tech_lang_keys["z"]}:
                    </label>
                    <div className="py-2 relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_z"
                        id="tech_z"
                        className="input "
                        aria-label="input"
                        value={formData.tech_z}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="px-2 ps-lg-4">
                    <label htmlFor="tech_round" className="label">
                      {data?.payload?.tech_lang_keys["round"]} {currency.symbol}
                      :
                    </label>
                    <div className="mt-2">
                      <select
                        className="input"
                        aria-label="select"
                        name="tech_round"
                        id="tech_round"
                        value={formData.tech_round}
                        onChange={handleChange}
                      >
                        <option value="yes">
                          {data?.payload?.tech_lang_keys["yes"]}
                        </option>
                        <option value="no">
                          {data?.payload?.tech_lang_keys["no"]}{" "}
                        </option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {formData?.tech_for == "single" && (
              <div className="single">
                <div className="grid grid-cols-1  lg:grid-cols-2 md:grid-cols-2 mt-3  gap-4">
                  <div className=" px-2 pe-lg-4">
                    <label htmlFor="tech_xs" className="label">
                      {data?.payload?.tech_lang_keys["x"]}:
                    </label>
                    <div className="py-2 relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_xs"
                        id="tech_xs"
                        className="input "
                        aria-label="input"
                        value={formData.tech_xs}
                        onChange={handleChange}
                      />
                      <span className="text-blue input_unit">
                        {currency.symbol}
                      </span>
                    </div>
                  </div>
                  <div className=" px-2 ps-lg-4">
                    <label htmlFor="tech_rounds" className="label">
                      {data?.payload?.tech_lang_keys["round"]} {currency.symbol}
                      :
                    </label>
                    <div className="mt-2">
                      <select
                        className="input"
                        aria-label="select"
                        name="tech_rounds"
                        id="tech_rounds"
                        value={formData.tech_rounds}
                        onChange={handleChange}
                      >
                        <option value="yes">
                          {data?.payload?.tech_lang_keys["yes"]}
                        </option>
                        <option value="no">
                          {data?.payload?.tech_lang_keys["no"]}{" "}
                        </option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}
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
                    <div className="w-full mt-3">
                      <div className="w-full">
                        <div className="w-full md:w-[90%] lg:w-[80%] text-[16px] overflow-auto">
                          {formData.tech_for == "single" ? (
                            <table className="w-full text-center">
                              <tbody>
                                <tr>
                                  <td className="border-b py-2">
                                    <strong>
                                      {data?.payload?.tech_lang_keys["y"]}
                                    </strong>
                                  </td>
                                  <td className="border-b py-2">
                                    <strong>
                                      {data?.payload?.tech_lang_keys["a"]}
                                    </strong>
                                  </td>
                                  <td className="border-b py-2">
                                    <strong>
                                      {data?.payload?.tech_lang_keys["b"]}
                                    </strong>
                                  </td>
                                </tr>
                                <tr>
                                  <td className="border-b py-2">
                                    <p>5%</p>
                                  </td>
                                  <td className="border-b py-2">
                                    {result
                                      ? formData?.rounds == "yes"
                                        ? Number(
                                            formData?.tech_xs * (5 / 100)
                                          ).toFixed(0)
                                        : Number(
                                            formData?.tech_xs * (5 / 100)
                                          ).toFixed(2)
                                      : "00"}{" "}
                                    {currency.symbol}
                                  </td>
                                  <td className="border-b py-2">
                                    {result
                                      ? formData?.rounds == "yes"
                                        ? Number(
                                            formData?.tech_xs * (5 / 100) +
                                              formData?.tech_xs
                                          ).toFixed(0)
                                        : Number(
                                            formData?.tech_xs * (5 / 100) +
                                              formData?.tech_xs
                                          ).toFixed(2)
                                      : "00"}{" "}
                                    {currency.symbol}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="border-b py-2">
                                    <p>10%</p>
                                  </td>
                                  <td className="border-b py-2">
                                    {result
                                      ? formData?.rounds == "yes"
                                        ? Number(
                                            formData?.tech_xs * (10 / 100)
                                          ).toFixed(0)
                                        : Number(
                                            formData?.tech_xs * (10 / 100)
                                          ).toFixed(2)
                                      : "00"}{" "}
                                    {currency.symbol}
                                  </td>
                                  <td className="border-b py-2">
                                    {result
                                      ? formData?.rounds == "yes"
                                        ? Number(
                                            formData?.tech_xs * (10 / 100) +
                                              formData?.tech_xs
                                          ).toFixed(0)
                                        : Number(
                                            formData?.tech_xs * (10 / 100) +
                                              formData?.tech_xs
                                          ).toFixed(2)
                                      : "00"}{" "}
                                    {currency.symbol}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="border-b py-2">
                                    <p>12%</p>
                                  </td>
                                  <td className="border-b py-2">
                                    {result
                                      ? formData?.rounds == "yes"
                                        ? Number(
                                            formData?.tech_xs * 0.12
                                          ).toFixed(0)
                                        : Number(
                                            formData?.tech_xs * 0.12
                                          ).toFixed(2)
                                      : "00"}{" "}
                                    {currency.symbol}
                                  </td>
                                  <td className="border-b py-2">
                                    {result
                                      ? formData?.rounds == "yes"
                                        ? Number(
                                            formData?.tech_xs * 0.12 +
                                              formData?.tech_xs
                                          ).toFixed(0)
                                        : Number(
                                            formData?.tech_xs * 0.12 +
                                              formData?.tech_xs
                                          ).toFixed(2)
                                      : "00"}{" "}
                                    {currency.symbol}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="border-b py-2">
                                    <p>14%</p>
                                  </td>
                                  <td className="border-b py-2">
                                    {result
                                      ? formData?.rounds == "yes"
                                        ? Number(
                                            formData?.tech_xs * 0.14
                                          ).toFixed(0)
                                        : Number(
                                            formData?.tech_xs * 0.14
                                          ).toFixed(2)
                                      : "00"}{" "}
                                    {currency.symbol}
                                  </td>
                                  <td className="border-b py-2">
                                    {result
                                      ? formData?.rounds == "yes"
                                        ? Number(
                                            formData?.tech_xs * 0.14 +
                                              formData?.tech_xs
                                          ).toFixed(0)
                                        : Number(
                                            formData?.tech_xs * 0.14 +
                                              formData?.tech_xs
                                          ).toFixed(2)
                                      : "00"}{" "}
                                    {currency.symbol}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="border-b py-2">
                                    <p>15%</p>
                                  </td>
                                  <td className="border-b py-2">
                                    {result
                                      ? formData?.rounds == "yes"
                                        ? Number(
                                            formData?.tech_xs * 0.15
                                          ).toFixed(0)
                                        : Number(
                                            formData?.tech_xs * 0.15
                                          ).toFixed(2)
                                      : "00"}{" "}
                                    {currency.symbol}
                                  </td>
                                  <td className="border-b py-2">
                                    {result
                                      ? formData?.rounds == "yes"
                                        ? Number(
                                            formData?.tech_xs * 0.15 +
                                              formData?.tech_xs
                                          ).toFixed(0)
                                        : Number(
                                            formData?.tech_xs * 0.15 +
                                              formData?.tech_xs
                                          ).toFixed(2)
                                      : "00"}{" "}
                                    {currency.symbol}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="border-b py-2">
                                    <p>18%</p>
                                  </td>
                                  <td className="border-b py-2">
                                    {result
                                      ? formData?.rounds == "yes"
                                        ? Number(
                                            formData?.tech_xs * 0.18
                                          ).toFixed(0)
                                        : Number(
                                            formData?.tech_xs * 0.18
                                          ).toFixed(2)
                                      : "00"}{" "}
                                    {currency.symbol}
                                  </td>
                                  <td className="border-b py-2">
                                    {result
                                      ? formData?.rounds == "yes"
                                        ? Number(
                                            formData?.tech_xs * 0.18 +
                                              formData?.tech_xs
                                          ).toFixed(0)
                                        : Number(
                                            formData?.tech_xs * 0.18 +
                                              formData?.tech_xs
                                          ).toFixed(2)
                                      : "00"}{" "}
                                    {currency.symbol}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="border-b py-2">
                                    <p>20%</p>
                                  </td>
                                  <td className="border-b py-2">
                                    {result
                                      ? formData?.rounds == "yes"
                                        ? Number(
                                            formData?.tech_xs * 0.2
                                          ).toFixed(0)
                                        : Number(
                                            formData?.tech_xs * 0.2
                                          ).toFixed(2)
                                      : "00"}{" "}
                                    {currency.symbol}
                                  </td>
                                  <td className="border-b py-2">
                                    {result
                                      ? formData?.rounds == "yes"
                                        ? Number(
                                            formData?.tech_xs * 0.2 +
                                              formData?.tech_xs
                                          ).toFixed(0)
                                        : Number(
                                            formData?.tech_xs * 0.2 +
                                              formData?.tech_xs
                                          ).toFixed(2)
                                      : "00"}{" "}
                                    {currency.symbol}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="border-b py-2">
                                    <p>25%</p>
                                  </td>
                                  <td className="border-b py-2">
                                    {result
                                      ? formData?.rounds == "yes"
                                        ? Number(
                                            formData?.tech_xs * 0.25
                                          ).toFixed(0)
                                        : Number(
                                            formData?.tech_xs * 0.25
                                          ).toFixed(2)
                                      : "00"}{" "}
                                    {currency.symbol}
                                  </td>
                                  <td className="border-b py-2">
                                    {result
                                      ? formData?.rounds == "yes"
                                        ? Number(
                                            formData?.tech_xs * 0.25 +
                                              formData?.tech_xs
                                          ).toFixed(0)
                                        : Number(
                                            formData?.tech_xs * 0.25 +
                                              formData?.tech_xs
                                          ).toFixed(2)
                                      : "00"}{" "}
                                    {currency.symbol}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="border-b py-2">
                                    <p>30%</p>
                                  </td>
                                  <td className="border-b py-2">
                                    {result
                                      ? formData?.rounds == "yes"
                                        ? Number(
                                            formData?.tech_xs * 0.3
                                          ).toFixed(0)
                                        : Number(
                                            formData?.tech_xs * 0.3
                                          ).toFixed(2)
                                      : "00"}{" "}
                                    {currency.symbol}
                                  </td>
                                  <td className="border-b py-2">
                                    {result
                                      ? formData?.rounds == "yes"
                                        ? Number(
                                            formData?.tech_xs * 0.3 +
                                              formData?.tech_xs
                                          ).toFixed(0)
                                        : Number(
                                            formData?.tech_xs * 0.3 +
                                              formData?.tech_xs
                                          ).toFixed(2)
                                      : "00"}{" "}
                                    {currency.symbol}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="border-b py-2">
                                    <p>50%</p>
                                  </td>
                                  <td className="border-b py-2">
                                    {result
                                      ? formData?.rounds == "yes"
                                        ? Number(
                                            formData?.tech_xs * 0.5
                                          ).toFixed(0)
                                        : Number(
                                            formData?.tech_xs * 0.5
                                          ).toFixed(2)
                                      : "00"}{" "}
                                    {currency.symbol}
                                  </td>
                                  <td className="border-b py-2">
                                    {result
                                      ? formData?.rounds == "yes"
                                        ? Number(
                                            formData?.tech_xs * 0.5 +
                                              formData?.tech_xs
                                          ).toFixed(0)
                                        : Number(
                                            formData?.tech_xs * 0.5 +
                                              formData?.tech_xs
                                          ).toFixed(2)
                                      : "00"}{" "}
                                    {currency.symbol}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          ) : (
                            <table className="w-full">
                              <tbody>
                                <tr>
                                  <td className="border-b py-2">
                                    <p>
                                      <strong>
                                        {data?.payload?.tech_lang_keys["a"]} :
                                      </strong>
                                    </p>
                                  </td>
                                  <td className="border-b py-2">
                                    {currency.symbol} {result?.tech_a ?? "0.0"}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="border-b py-2">
                                    <p>
                                      <strong>
                                        {data?.payload?.tech_lang_keys["b"]} :
                                      </strong>
                                    </p>
                                  </td>
                                  <td className="border-b py-2">
                                    {currency.symbol} {result?.tech_b ?? "0.0"}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="border-b py-2">
                                    <p>
                                      <strong>
                                        {data?.payload?.tech_lang_keys["c"]} :
                                      </strong>
                                    </p>
                                  </td>
                                  <td className="border-b py-2">
                                    {currency.symbol} {result?.tech_c ?? "0.0"}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="border-b py-2">
                                    <p>
                                      <strong>
                                        {data?.payload?.tech_lang_keys["d"]} :
                                      </strong>
                                    </p>
                                  </td>
                                  <td className="border-b py-2">
                                    {currency.symbol} {result?.tech_d ?? "0.0"}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
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

export default TipCalculator;

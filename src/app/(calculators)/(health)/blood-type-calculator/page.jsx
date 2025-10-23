"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useBloodTypeCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const BloodTypeCalculator = () => {
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
    tech_selection: "1",
    tech_c_unit: "1",
    tech_selection3: "3",
    tech_d_unit: "0",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useBloodTypeCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.tech_selection ||
      !formData.tech_c_unit ||
      !formData.tech_selection3 ||
      !formData.tech_d_unit
    ) {
      setFormError("Please fill in field.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_selection: formData.tech_selection,
        tech_c_unit: formData.tech_c_unit,
        tech_selection3: formData.tech_selection3,
        tech_d_unit: formData.tech_d_unit,
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
      tech_selection: "1",
      tech_c_unit: "1",
      tech_selection3: "3",
      tech_d_unit: "0",
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
  // majax
  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.5/MathJax.js?config=TeX-AMS_HTML";
    script.async = true;
    script.type = "text/javascript";
    script.onload = () => {
      window.MathJax &&
        window.MathJax.Hub.Queue(["Typeset", window.MathJax.Hub]);
    };
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [result]);
  // majax

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
        <div className="w-full mx-auto p-4 lg:p-8 md:p-8 input_form rounded-lg shadow-md space-y-6 mb-3">
          {formError && (
            <p className="text-red-500 text-lg font-semibold w-full">
              {formError}
            </p>
          )}

          <div className="lg:w-[60%] md:w-[80%] w-full mx-auto ">
            <div className="grid grid-cols-12 mt-3   gap-2 md:gap-4 lg:gap-4">
              <div className="col-span-6 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_selection" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_selection"
                    id="tech_selection"
                    value={formData.tech_selection}
                    onChange={handleChange}
                  >
                    <option value="0">o</option>
                    <option value="1">A</option>
                    <option value="2">B</option>
                    <option value="3">C</option>
                  </select>
                </div>
              </div>
              <div className="col-span-6 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_c_unit" className="label">
                  &nbsp
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_c_unit"
                    id="tech_c_unit"
                    value={formData.tech_c_unit}
                    onChange={handleChange}
                  >
                    <option value="0">Rh+</option>
                    <option value="1">Rh-</option>
                  </select>
                </div>
              </div>
              <div className="col-span-6 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_selection3" className="label">
                  {data?.payload?.tech_lang_keys["2"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_selection3"
                    id="tech_selection3"
                    value={formData.tech_selection3}
                    onChange={handleChange}
                  >
                    <option value="0">o</option>
                    <option value="1">A</option>
                    <option value="2">B</option>
                    <option value="3">AB</option>
                  </select>
                </div>
              </div>
              <div className="col-span-6 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_d_unit" className="label">
                  &nbsp
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_d_unit"
                    id="tech_d_unit"
                    value={formData.tech_d_unit}
                    onChange={handleChange}
                  >
                    <option value="0">Rh+</option>
                    <option value="1">Rh-</option>
                  </select>
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
                        <div className="grid grid-cols-12 gap-3">
                          <div className="col-span-12 md:col-span-6 lg:col-span-6">
                            <div className="flex flex-wrap items-center justify-between bg-sky bordered rounded-lg p-3">
                              <span className="text-[18px]">
                                {data?.payload?.tech_lang_keys["3"]} A
                              </span>
                              <strong className="text-[#119154] text-[18px] ps-2">
                                {result?.tech_A} %
                              </strong>
                            </div>
                          </div>
                          <div className="col-span-12 md:col-span-6 lg:col-span-6">
                            <div className="flex flex-wrap items-center justify-between bg-sky bordered rounded-lg p-3">
                              <span className="text-[18px]">
                                {data?.payload?.tech_lang_keys["3"]} B
                              </span>
                              <strong className="text-[#119154] text-[18px] ps-2">
                                {result?.tech_B} %
                              </strong>
                            </div>
                          </div>
                          <div className="col-span-12 md:col-span-6 lg:col-span-6">
                            <div className="flex flex-wrap items-center justify-between bg-sky bordered rounded-lg p-3">
                              <span className="text-[18px]">
                                {data?.payload?.tech_lang_keys["3"]} AB
                              </span>
                              <strong className="text-[#119154] text-[18px] ps-2">
                                {result?.tech_AB} %
                              </strong>
                            </div>
                          </div>
                          <div className="col-span-12 md:col-span-6 lg:col-span-6">
                            <div className="flex flex-wrap items-center justify-between bg-sky bordered rounded-lg p-3">
                              <span className="text-[18px]">
                                {data?.payload?.tech_lang_keys["3"]} O
                              </span>
                              <strong className="text-[#119154] text-[18px] ps-2">
                                {result?.tech_O} %
                              </strong>
                            </div>
                          </div>
                          <div className="col-span-12 md:col-span-6 lg:col-span-6">
                            <div className="flex flex-wrap items-center justify-between bg-sky bordered rounded-lg p-3">
                              <span className="text-[18px]">
                                {data?.payload?.tech_lang_keys["3"]} RH+
                              </span>
                              <strong className="text-[#119154] text-[18px] ps-2">
                                {result?.tech_rhpos} %
                              </strong>
                            </div>
                          </div>
                          <div className="col-span-12 md:col-span-6 lg:col-span-6">
                            <div className="flex flex-wrap items-center justify-between bg-sky bordered rounded-lg p-3">
                              <span className="text-[18px]">
                                {data?.payload?.tech_lang_keys["3"]} RH-
                              </span>
                              <strong className="text-[#119154] text-[18px] ps-2">
                                {result?.tech_rhneg} %
                              </strong>
                            </div>
                          </div>
                        </div>
                        <table className="w-full md:w-[80%] lg:w-[80%] px-lg-2">
                          <tbody>
                            <tr>
                              <td className="border-b py-3">
                                <strong className="text-blue">
                                  {data?.payload?.tech_lang_keys["4"]}
                                </strong>
                              </td>
                              <td className="border-b py-3">
                                <strong className="text-blue">
                                  {data?.payload?.tech_lang_keys["5"]}
                                </strong>
                              </td>
                            </tr>
                            <tr>
                              <td className="border-b py-3">A</td>
                              <td className="border-b py-3">AO or AA</td>
                            </tr>
                            <tr>
                              <td className="border-b py-3">B</td>
                              <td className="border-b py-3">BO or BB</td>
                            </tr>
                            <tr>
                              <td className="border-b py-3">AB</td>
                              <td className="border-b py-3">AB</td>
                            </tr>
                            <tr>
                              <td className="py-3">O</td>
                              <td className="py-3">OO</td>
                            </tr>
                          </tbody>
                        </table>
                        <p className="text-[18px] px-lg-2 mt-2">
                          <strong>{data?.payload?.tech_lang_keys["6"]}</strong>{" "}
                          {data?.payload?.tech_lang_keys["7"]}
                        </p>
                        <table className="w-full md:w-[80%] lg:w-[80%] px-lg-2">
                          <tbody>
                            <tr>
                              <td className="border-b py-3">
                                <strong className="text-blue">♂️\♀️ </strong>
                              </td>
                              <td className="border-b py-3">
                                <strong className="text-blue">A</strong>
                              </td>
                              <td className="border-b py-3">
                                <strong className="text-blue">O</strong>
                              </td>
                              <td className="border-b py-3">
                                <strong className="text-blue">A</strong>
                              </td>
                              <td className="border-b py-3">
                                <strong className="text-blue">A</strong>
                              </td>
                            </tr>
                            <tr>
                              <td className="border-b py-3">A</td>
                              <td className="border-b py-3">AO</td>
                              <td className="border-b py-3">AA</td>
                              <td className="border-b py-3">AA</td>
                              <td className="border-b py-3">&gt;AA</td>
                            </tr>
                            <tr>
                              <td className="py-3">B</td>
                              <td className="py-3">BB</td>
                              <td className="py-3">BO</td>
                              <td className="py-3">AB</td>
                              <td className="py-3">AB</td>
                            </tr>
                          </tbody>
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

export default BloodTypeCalculator;

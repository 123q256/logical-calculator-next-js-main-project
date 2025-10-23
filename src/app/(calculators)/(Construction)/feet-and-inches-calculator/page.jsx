"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useFeetAndInchesCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const FeetAndInchesCalculator = () => {
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
    tech_feet1: "5",
    tech_inches1: "4",
    tech_operations: "1",
    tech_feet2: "2",
    tech_inches2: "1",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useFeetAndInchesCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.tech_feet1 ||
      !formData.tech_inches1 ||
      !formData.tech_operations ||
      !formData.tech_feet2 ||
      !formData.tech_inches2
    ) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_feet1: formData.tech_feet1,
        tech_inches1: formData.tech_inches1,
        tech_operations: formData.tech_operations,
        tech_feet2: formData.tech_feet2,
        tech_inches2: formData.tech_inches2,
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
      tech_feet1: "5",
      tech_inches1: "4",
      tech_operations: "1",
      tech_feet2: "2",
      tech_inches2: "1",
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

  // result

  const ft = parseFloat(result?.tech_ft || 0);
  const inch = parseFloat(result?.tech_in || 0);
  const ft2 = parseFloat(result?.tech_ft2 || 0);
  const inch2 = parseFloat(result?.tech_in2 || 0);
  const ftDiv = parseFloat(result?.tech_ft_div || 0);

  const f_ft = inch / 12;
  const final_ft = ft + f_ft;
  const f_in = ft * 12;
  const final_in = inch + f_in;

  const f_ft2 = inch2 / 12;
  const final_ft2 = ft2 + f_ft2;
  const f_in2 = ft2 * 12;
  const final_in2 = inch2 + f_in2;

  const ft_div2 = ftDiv / 12;
  const ft_divin2 = ftDiv * 12;

  const m = final_ft / 3.281;
  const m2 = final_ft2 / 3.281;
  const div_m = ft_div2 / 3.281;

  const cm = final_in * 2.54;
  const cm2 = final_in2 * 2.54;
  const div_cm = ft_divin2 * 2.54;

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
        <div className="w-full mx-auto p-4 lg:p-8 md:p-8 input_form rounded-lg space-y-6 mb-3">
          {formError && (
            <p className="text-red-500 text-lg font-semibold w-full">
              {formError}
            </p>
          )}

          <div className="lg:w-[40%] md:w-[70%] w-full mx-auto ">
            <div className="grid grid-cols-3   gap-4">
              <div className="space-y-2"></div>
              <div className="space-y-2">
                <label htmlFor="tech_feet1" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_feet1"
                    id="tech_feet1"
                    className="input "
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_feet1}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="tech_inches1" className="label">
                  {data?.payload?.tech_lang_keys["2"]}:
                </label>
                <div className=" relative">
                  <input
                    type="text"
                    step="any"
                    name="tech_inches1"
                    id="tech_inches1"
                    className="input "
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_inches1}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 mt-4  gap-4">
              <div className="space-y-2">
                <label htmlFor="tech_operations" className="label">
                  &nbsp;
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_operations"
                    id="tech_operations"
                    value={formData.tech_operations}
                    onChange={handleChange}
                  >
                    <option value="1">+</option>
                    <option value="2">-</option>
                    <option value="3">×</option>
                    <option value="4">÷</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="tech_feet2" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_feet2"
                    id="tech_feet2"
                    className="input "
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_feet2}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="tech_inches2" className="label">
                  {data?.payload?.tech_lang_keys["2"]}:
                </label>
                <div className=" relative">
                  <input
                    type="text"
                    step="any"
                    name="tech_inches2"
                    id="tech_inches2"
                    className="input "
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_inches2}
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

                  <div className="rounded-lg flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="grid grid-cols-12 gap-2">
                        <div className="col-span-12 md:col-span-6 overflow-auto lg:text-[18px] md:text-[18px] text-[16px]">
                          <table className="w-full">
                            <tbody>
                              <tr>
                                <td className="border-b py-2">
                                  <strong>Answer</strong>
                                </td>
                                <td className="border-b py-2">
                                  {result?.tech_ft_div ? (
                                    <b>{ftDiv.toFixed(2)}</b>
                                  ) : result?.tech_ft || result?.tech_in ? (
                                    <>
                                      {result?.tech_ft && (
                                        <>
                                          <b>{ft}</b>{" "}
                                          <span className="font-s-14">
                                            {result?.tech_ft_unit}
                                          </span>
                                        </>
                                      )}
                                      {result?.tech_in && (
                                        <>
                                          <b>{inch}</b>{" "}
                                          <span className="font-s-14">
                                            {result?.tech_in_unit}
                                          </span>
                                        </>
                                      )}
                                    </>
                                  ) : (
                                    <>
                                      {result?.tech_in2 && (
                                        <>
                                          <b>{inch2.toFixed(2)}</b>{" "}
                                          <span className="font-s-14">
                                            {result?.tech_ft_unit}
                                            <sup>2</sup>
                                          </span>
                                        </>
                                      )}
                                      {result?.tech_ft2 && (
                                        <>
                                          <b>{ft2.toFixed(2)}</b>{" "}
                                          <span className="font-s-14">
                                            {result?.tech_in_unit}
                                            <sup>2</sup>
                                          </span>
                                        </>
                                      )}
                                    </>
                                  )}
                                </td>
                              </tr>

                              <tr>
                                <td colSpan="2" className="pt-2">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["3"]}
                                  </strong>
                                </td>
                              </tr>

                              <tr>
                                {["1", "2"].includes(
                                  formData?.tech_operations
                                ) &&
                                  result?.tech_ft && (
                                    <>
                                      <td className="border-b py-2">
                                        {final_ft.toFixed(2)} ft
                                      </td>
                                      <td className="border-b py-2">
                                        {final_in} in
                                      </td>
                                    </>
                                  )}

                                {formData?.tech_operations === "3" &&
                                  result?.tech_ft2 && (
                                    <>
                                      <td className="border-b py-2">
                                        {final_ft2.toFixed(2)} ft
                                      </td>
                                      <td className="border-b py-2">
                                        {final_in2.toFixed(2)} in
                                      </td>
                                    </>
                                  )}

                                {formData?.tech_operations === "4" &&
                                  result?.tech_ft_div && (
                                    <>
                                      <td className="border-b py-2">
                                        {ft_div2.toFixed(2)} ft
                                      </td>
                                      <td className="border-b py-2">
                                        {ft_divin2.toFixed(2)} in
                                      </td>
                                    </>
                                  )}
                              </tr>

                              <tr>
                                <td colSpan="2" className="pt-2">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["4"]}
                                  </strong>
                                </td>
                              </tr>

                              <tr>
                                {["1", "2"].includes(
                                  formData?.tech_operations
                                ) &&
                                  result?.tech_ft && (
                                    <>
                                      <td className="border-b py-2">
                                        {m.toFixed(2)} m
                                      </td>
                                      <td className="border-b py-2">
                                        {cm.toFixed(2)} cm
                                      </td>
                                    </>
                                  )}

                                {formData?.tech_operations === "3" &&
                                  result?.tech_ft2 && (
                                    <>
                                      <td className="border-b py-2">
                                        {m2.toFixed(2)} m
                                      </td>
                                      <td className="border-b py-2">
                                        {cm2.toFixed(2)} cm
                                      </td>
                                    </>
                                  )}

                                {formData?.tech_operations === "4" &&
                                  result?.tech_ft_div && (
                                    <>
                                      <td className="border-b py-2">
                                        {div_m.toFixed(2)} m
                                      </td>
                                      <td className="border-b py-2">
                                        {div_cm.toFixed(2)} cm
                                      </td>
                                    </>
                                  )}
                              </tr>
                            </tbody>
                          </table>
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

export default FeetAndInchesCalculator;

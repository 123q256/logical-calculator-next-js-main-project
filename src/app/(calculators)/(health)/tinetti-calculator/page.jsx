"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useTinettiCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const TinettiCalculator = () => {
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
    tech_a1: 1,
    tech_a2: 1,
    tech_a3: 1,
    tech_a4: 1,
    tech_a5: 1,
    tech_a6: 1,
    tech_a7: 1,
    tech_a8: 1,
    tech_a9: 1,
    tech_a10: 1,
    tech_b1: 1,
    tech_b2: 1,
    tech_b3: 1,
    tech_b4: 1,
    tech_b5: 1,
    tech_b6: 1,
    tech_b7: 1,
    tech_b8: 1,
    tech_b9: 1,
    tech_b10: 1,
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useTinettiCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.tech_a1 ||
      !formData.tech_a2 ||
      !formData.tech_a3 ||
      !formData.tech_a4 ||
      !formData.tech_a5 ||
      !formData.tech_a6 ||
      !formData.tech_a7 ||
      !formData.tech_a8 ||
      !formData.tech_a9 ||
      !formData.tech_a10 ||
      !formData.tech_b1 ||
      !formData.tech_b2 ||
      !formData.tech_b3 ||
      !formData.tech_b4 ||
      !formData.tech_b5 ||
      !formData.tech_b6 ||
      !formData.tech_b7 ||
      !formData.tech_b8 ||
      !formData.tech_b9 ||
      !formData.tech_b10
    ) {
      setFormError("Please fill in field.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_a1: formData.tech_a1,
        tech_a2: formData.tech_a2,
        tech_a3: formData.tech_a3,
        tech_a4: formData.tech_a4,
        tech_a5: formData.tech_a5,
        tech_a6: formData.tech_a6,
        tech_a7: formData.tech_a7,
        tech_a8: formData.tech_a8,
        tech_a9: formData.tech_a9,
        tech_a10: formData.tech_a10,
        tech_b1: formData.tech_b1,
        tech_b2: formData.tech_b2,
        tech_b3: formData.tech_b3,
        tech_b4: formData.tech_b4,
        tech_b5: formData.tech_b5,
        tech_b6: formData.tech_b6,
        tech_b7: formData.tech_b7,
        tech_b8: formData.tech_b8,
        tech_b9: formData.tech_b9,
        tech_b10: formData.tech_b10,
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
      tech_a1: 1,
      tech_a2: 1,
      tech_a3: 1,
      tech_a4: 1,
      tech_a5: 1,
      tech_a6: 1,
      tech_a7: 1,
      tech_a8: 1,
      tech_a9: 1,
      tech_a10: 1,
      tech_b1: 1,
      tech_b2: 1,
      tech_b3: 1,
      tech_b4: 1,
      tech_b5: 1,
      tech_b6: 1,
      tech_b7: 1,
      tech_b8: 1,
      tech_b9: 1,
      tech_b10: 1,
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
            <div className="grid grid-cols-12   gap-2 md:gap-4 lg:gap-4">
              <div className="col-span-12">
                <strong className="text-blue-500 border-b">
                  {data?.payload?.tech_lang_keys["1"]}
                </strong>
              </div>
              <div className="col-span-6">
                <label htmlFor="tech_a1" className="label">
                  {data?.payload?.tech_lang_keys["2"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_a1"
                    id="tech_a1"
                    value={formData.tech_a1}
                    onChange={handleChange}
                  >
                    <option value="0">
                      {data?.payload?.tech_lang_keys["3"]}
                    </option>
                    <option value="1">
                      {data?.payload?.tech_lang_keys["4"]}
                    </option>
                  </select>
                </div>
              </div>
              <div className="col-span-6">
                <label htmlFor="tech_a2" className="label">
                  {data?.payload?.tech_lang_keys["5"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_a2"
                    id="tech_a2"
                    value={formData.tech_a2}
                    onChange={handleChange}
                  >
                    <option value="0">
                      {data?.payload?.tech_lang_keys["6"]}
                    </option>
                    <option value="1">
                      {data?.payload?.tech_lang_keys["7"]}
                    </option>
                    <option value="2">
                      {data?.payload?.tech_lang_keys["8"]}
                    </option>
                  </select>
                </div>
              </div>
              <div className="col-span-6">
                <label htmlFor="tech_a3" className="label">
                  {data?.payload?.tech_lang_keys["9"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_a3"
                    id="tech_a3"
                    value={formData.tech_a3}
                    onChange={handleChange}
                  >
                    <option value="0">
                      {data?.payload?.tech_lang_keys["10"]}
                    </option>
                    <option value="1">
                      {data?.payload?.tech_lang_keys["11"]}
                    </option>
                    <option value="2">
                      {data?.payload?.tech_lang_keys["12"]}
                    </option>
                  </select>
                </div>
              </div>
              <div className="col-span-6">
                <label htmlFor="tech_a4" className="label">
                  {data?.payload?.tech_lang_keys["13"]} (5s):
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_a4"
                    id="tech_a4"
                    value={formData.tech_a4}
                    onChange={handleChange}
                  >
                    <option value="0">
                      {data?.payload?.tech_lang_keys["14"]}
                    </option>
                    <option value="1">
                      {data?.payload?.tech_lang_keys["15"]}
                    </option>
                    <option value="2">
                      {data?.payload?.tech_lang_keys["16"]}
                    </option>
                  </select>
                </div>
              </div>
              <div className="col-span-6">
                <label htmlFor="tech_a5" className="label">
                  {data?.payload?.tech_lang_keys["17"]} :
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_a5"
                    id="tech_a5"
                    value={formData.tech_a5}
                    onChange={handleChange}
                  >
                    <option value="0">
                      {data?.payload?.tech_lang_keys["14"]}
                    </option>
                    <option value="1">
                      {data?.payload?.tech_lang_keys["18"]}
                    </option>
                    <option value="2">
                      {data?.payload?.tech_lang_keys["19"]}
                    </option>
                  </select>
                </div>
              </div>
              <div className="col-span-6">
                <label htmlFor="tech_a6" className="label">
                  {data?.payload?.tech_lang_keys["20"]} :
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_a6"
                    id="tech_a6"
                    value={formData.tech_a6}
                    onChange={handleChange}
                  >
                    <option value="0">
                      {data?.payload?.tech_lang_keys["21"]}
                    </option>
                    <option value="1">
                      {data?.payload?.tech_lang_keys["22"]}
                    </option>
                    <option value="2">
                      {data?.payload?.tech_lang_keys["23"]}
                    </option>
                  </select>
                </div>
              </div>
              <div className="col-span-6">
                <label htmlFor="tech_a7" className="label">
                  {data?.payload?.tech_lang_keys["24"]} :
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_a7"
                    id="tech_a7"
                    value={formData.tech_a7}
                    onChange={handleChange}
                  >
                    <option value="0">
                      {data?.payload?.tech_lang_keys["14"]}
                    </option>
                    <option value="1">
                      {data?.payload?.tech_lang_keys["23"]}
                    </option>
                  </select>
                </div>
              </div>
              <div className="col-span-6">
                <label htmlFor="tech_a8" className="label">
                  {data?.payload?.tech_lang_keys["25"]} :
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_a8"
                    id="tech_a8"
                    value={formData.tech_a8}
                    onChange={handleChange}
                  >
                    <option value="0">
                      {data?.payload?.tech_lang_keys["26"]}
                    </option>
                    <option value="1">
                      {data?.payload?.tech_lang_keys["27"]}
                    </option>
                  </select>
                </div>
              </div>
              <div className="col-span-6">
                <label htmlFor="tech_a9" className="label">
                  {data?.payload?.tech_lang_keys["28"]} :
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_a9"
                    id="tech_a9"
                    value={formData.tech_a9}
                    onChange={handleChange}
                  >
                    <option value="0">
                      {data?.payload?.tech_lang_keys["29"]}
                    </option>
                    <option value="1">
                      {data?.payload?.tech_lang_keys["23"]}
                    </option>
                  </select>
                </div>
              </div>
              <div className="col-span-6">
                <label htmlFor="tech_a10" className="label">
                  {data?.payload?.tech_lang_keys["30"]} :
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_a10"
                    id="tech_a10"
                    value={formData.tech_a10}
                    onChange={handleChange}
                  >
                    <option value="0">
                      {data?.payload?.tech_lang_keys["31"]}
                    </option>
                    <option value="1">
                      {data?.payload?.tech_lang_keys["32"]}
                    </option>
                    <option value="2">
                      {data?.payload?.tech_lang_keys["33"]}
                    </option>
                  </select>
                </div>
              </div>
              <div className="col-span-12">
                <strong className="text-blue-500 border-b">
                  {data?.payload?.tech_lang_keys["34"]}
                </strong>
              </div>
              <div className="col-span-6">
                <label htmlFor="tech_b1" className="label">
                  {data?.payload?.tech_lang_keys["37"]} :
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_b1"
                    id="tech_b1"
                    value={formData.tech_b1}
                    onChange={handleChange}
                  >
                    <option value="0">
                      {data?.payload?.tech_lang_keys["35"]}
                    </option>
                    <option value="1">
                      {data?.payload?.tech_lang_keys["36"]}
                    </option>
                  </select>
                </div>
              </div>
              <div className="col-span-6">
                <label htmlFor="tech_b2" className="label">
                  {data?.payload?.tech_lang_keys["38"]} :
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_b2"
                    id="tech_b2"
                    value={formData.tech_b2}
                    onChange={handleChange}
                  >
                    <option value="0">
                      {data?.payload?.tech_lang_keys["39"]}
                    </option>
                    <option value="1">
                      {data?.payload?.tech_lang_keys["40"]}
                    </option>
                  </select>
                </div>
              </div>
              <div className="col-span-6">
                <label htmlFor="tech_b3" className="label">
                  {data?.payload?.tech_lang_keys["41"]} :
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_b3"
                    id="tech_b3"
                    value={formData.tech_b3}
                    onChange={handleChange}
                  >
                    <option value="0">
                      {data?.payload?.tech_lang_keys["39"]}
                    </option>
                    <option value="1">
                      {data?.payload?.tech_lang_keys["42"]}
                    </option>
                  </select>
                </div>
              </div>
              <div className="col-span-6">
                <label htmlFor="tech_b4" className="label">
                  {data?.payload?.tech_lang_keys["43"]} :
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_b4"
                    id="tech_b4"
                    value={formData.tech_b4}
                    onChange={handleChange}
                  >
                    <option value="0">
                      {data?.payload?.tech_lang_keys["44"]}
                    </option>
                    <option value="1">
                      {data?.payload?.tech_lang_keys["45"]}
                    </option>
                  </select>
                </div>
              </div>
              <div className="col-span-6">
                <label htmlFor="tech_b5" className="label">
                  {data?.payload?.tech_lang_keys["46"]} :
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_b5"
                    id="tech_b5"
                    value={formData.tech_b5}
                    onChange={handleChange}
                  >
                    <option value="0">
                      {data?.payload?.tech_lang_keys["44"]}
                    </option>
                    <option value="1">
                      {data?.payload?.tech_lang_keys["47"]}
                    </option>
                  </select>
                </div>
              </div>
              <div className="col-span-6">
                <label htmlFor="tech_b6" className="label">
                  {data?.payload?.tech_lang_keys["48"]} :
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_b6"
                    id="tech_b6"
                    value={formData.tech_b6}
                    onChange={handleChange}
                  >
                    <option value="0">
                      {data?.payload?.tech_lang_keys["49"]}
                    </option>
                    <option value="1">
                      {data?.payload?.tech_lang_keys["50"]}
                    </option>
                  </select>
                </div>
              </div>
              <div className="col-span-6">
                <label htmlFor="tech_b7" className="label">
                  {data?.payload?.tech_lang_keys["51"]} :
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_b7"
                    id="tech_b7"
                    value={formData.tech_b7}
                    onChange={handleChange}
                  >
                    <option value="0">
                      {data?.payload?.tech_lang_keys["52"]}
                    </option>
                    <option value="1">
                      {data?.payload?.tech_lang_keys["53"]}
                    </option>
                  </select>
                </div>
              </div>
              <div className="col-span-6">
                <label htmlFor="tech_b8" className="label">
                  {data?.payload?.tech_lang_keys["54"]} :
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_b8"
                    id="tech_b8"
                    value={formData.tech_b8}
                    onChange={handleChange}
                  >
                    <option value="0">
                      {data?.payload?.tech_lang_keys["55"]}
                    </option>
                    <option value="1">
                      {data?.payload?.tech_lang_keys["56"]}
                    </option>
                    <option value="2">
                      {data?.payload?.tech_lang_keys["57"]}
                    </option>
                  </select>
                </div>
              </div>
              <div className="col-span-6">
                <label htmlFor="tech_b9" className="label">
                  {data?.payload?.tech_lang_keys["58"]} :
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_b9"
                    id="tech_b9"
                    value={formData.tech_b9}
                    onChange={handleChange}
                  >
                    <option value="0">
                      {data?.payload?.tech_lang_keys["59"]}
                    </option>
                    <option value="1">
                      {data?.payload?.tech_lang_keys["60"]}
                    </option>
                    <option value="2">
                      {data?.payload?.tech_lang_keys["61"]}
                    </option>
                  </select>
                </div>
              </div>
              <div className="col-span-6">
                <label htmlFor="tech_b10" className="label">
                  {data?.payload?.tech_lang_keys["62"]} :
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_b10"
                    id="tech_b10"
                    value={formData.tech_b10}
                    onChange={handleChange}
                  >
                    <option value="0">
                      {data?.payload?.tech_lang_keys["63"]}
                    </option>
                    <option value="1">
                      {data?.payload?.tech_lang_keys["64"]}
                    </option>
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
              <div className="w-full  mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg  space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg  flex items-center justify-center">
                    <div className="w-full  p-3 mt-3">
                      <div className="w-full ">
                        <div className="w-full  overflow-auto mb-2">
                          <table
                            className="w-full md:w-[60%] lg:w-[60%] "
                            cellSpacing="0"
                          >
                            <tbody>
                              <tr>
                                <td className="text-blue-500 border-b py-2">
                                  {data?.payload?.tech_lang_keys["65"]}
                                </td>
                                <td className="border-b py-2">
                                  <strong>{result?.tech_add1} / 16</strong>
                                </td>
                              </tr>
                              <tr>
                                <td className="text-blue-500 border-b py-2">
                                  {data?.payload?.tech_lang_keys["66"]}
                                </td>
                                <td className="border-b py-2">
                                  <strong>{result?.tech_add2} / 12</strong>
                                </td>
                              </tr>
                              <tr>
                                <td className="text-blue-500 py-2">
                                  {data?.payload?.tech_lang_keys["67"]}
                                </td>
                                <td className="py-2">
                                  <strong>
                                    {result?.tech_add1 + result?.tech_add2} / 28
                                  </strong>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        {result?.tech_add3 < 19 ? (
                          <p>
                            <strong className="text-blue-500">
                              {data?.payload?.tech_lang_keys["68"]}{" "}
                              {data?.payload?.tech_lang_keys["71"]}.
                            </strong>
                          </p>
                        ) : result?.tech_add3 >= 19 &&
                          result?.tech_add3 <= 23 ? (
                          <p>
                            <strong className="text-blue-500">
                              {data?.payload?.tech_lang_keys["69"]}{" "}
                              {data?.payload?.tech_lang_keys["71"]}.
                            </strong>
                          </p>
                        ) : result?.tech_add3 > 23 ? (
                          <p>
                            <strong className="text-blue-500">
                              {data?.payload?.tech_lang_keys["70"]}{" "}
                              {data?.payload?.tech_lang_keys["71"]}.
                            </strong>
                          </p>
                        ) : null}
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

export default TinettiCalculator;

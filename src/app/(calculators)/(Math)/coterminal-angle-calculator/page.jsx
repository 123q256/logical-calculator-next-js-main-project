"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useCoterminalAngleCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const CoterminalAngleCalculator = () => {
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
    tech_want: 1,
    tech_unit: 1,
    tech_angle: 55,
    tech_angle2: 75,
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useCoterminalAngleCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_want) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_want: formData.tech_want,
        tech_unit: formData.tech_unit,
        tech_angle: formData.tech_angle,
        tech_angle2: formData.tech_angle2,
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
      tech_want: 1,
      tech_unit: 1,
      tech_angle: 55,
      tech_angle2: 75,
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

          <div className="lg:w-[40%] md:w-[60%] w-full mx-auto ">
            <div className="grid grid-cols-12 mt-3   gap-2 md:gap-4 lg:gap-4">
              <div className="col-span-12">
                <label htmlFor="tech_want" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
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
                    <option value="1">
                      {data?.payload?.tech_lang_keys["2"]}{" "}
                    </option>
                    <option value="2">
                      {data?.payload?.tech_lang_keys["3"]}{" "}
                    </option>
                  </select>
                </div>
              </div>
              <div className="col-span-12">
                <label htmlFor="tech_unit" className="label">
                  {data?.payload?.tech_lang_keys["4"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_unit"
                    id="tech_unit"
                    value={formData.tech_unit}
                    onChange={handleChange}
                  >
                    <option value="1">
                      {data?.payload?.tech_lang_keys["5"]}°{" "}
                    </option>
                    <option value="2">
                      π {data?.payload?.tech_lang_keys["6"]}{" "}
                    </option>
                  </select>
                </div>
              </div>
              <div className="col-span-12">
                <label htmlFor="tech_angle" className="label">
                  {data?.payload?.tech_lang_keys["7"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_angle"
                    id="tech_angle"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_angle}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-span-12 angle2_show ">
                <label htmlFor="tech_angle2" className="label">
                  {data?.payload?.tech_lang_keys["7"]} 2:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_angle2"
                    id="tech_angle2"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_angle2}
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

                  <div className="rounded-lg  flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="w-full">
                        {result?.tech_want == 1 && result?.tech_unit == 1 ? (
                          <>
                            <div className="w-full md:w-[80%] lg:w-[80%] overflow-auto mt-2">
                              <table className="w-full text-[16px]">
                                <tbody>
                                  <tr>
                                    <td className="py-2 border-b" width="60%">
                                      <strong>
                                        {data?.payload?.tech_lang_keys["8"]}
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {result?.tech_angle + 360}°,{" "}
                                      {result?.tech_angle + 360 * 2}°,{" "}
                                      {result?.tech_angle + 360 * 3}°,{" "}
                                      {result?.tech_angle + 360 * 4}° ....
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b" width="60%">
                                      <strong>
                                        {data?.payload?.tech_lang_keys["9"]}
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {result?.tech_angle - 360}°,{" "}
                                      {result?.tech_angle - 360 * 2}°,{" "}
                                      {result?.tech_angle - 360 * 3}°,{" "}
                                      {result?.tech_angle - 360 * 4}° ....
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b" colSpan="2">
                                      <strong>
                                        {result?.tech_angle}° ={" "}
                                        {result?.tech_upr}
                                        {"/"}
                                        {result?.tech_btm} π ≈{" "}
                                        {result?.tech_rad} π
                                      </strong>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </>
                        ) : result?.tech_want == 1 && result?.tech_unit == 2 ? (
                          <>
                            <div className="w-full md:w-[80%] lg:w-[80%] overflow-auto mt-2">
                              <table className="w-full text-[16px]">
                                <tbody>
                                  <tr>
                                    <td className="py-2 border-b" colSpan="2">
                                      Coterminal angle in [0, 2π) range:{" "}
                                      <strong>{result?.tech_two} π</strong>,
                                      located in the{" "}
                                      <strong>{result?.tech_q}</strong>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b" width="60%">
                                      <strong>
                                        {data?.payload?.tech_lang_keys["8"]}
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {result?.tech_pos}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b" width="60%">
                                      <strong>
                                        {data?.payload?.tech_lang_keys["9"]}
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {result?.tech_neg}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b" colSpan="2">
                                      {result?.tech_angle} π ={" "}
                                      {result?.tech_deg}°
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="w-full text-center my-2 overflow-auto">
                              <p>
                                {result?.tech_check == 1 ? (
                                  <>
                                    <strong className="bg-[#2845F5] px-3 py-2 md:text-[22px] rounded-lg text-white">
                                      {" "}
                                      {data?.payload?.tech_lang_keys["10"]}{" "}
                                    </strong>
                                  </>
                                ) : (
                                  <>
                                    <strong className="bg-[#2845F5] px-3 py-2 md:text-[22px] rounded-lg text-white">
                                      {" "}
                                      {data?.payload?.tech_lang_keys["11"]}{" "}
                                    </strong>
                                  </>
                                )}
                              </p>
                            </div>
                          </>
                        )}
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

export default CoterminalAngleCalculator;

"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useStandardFormTolopeInterceptFormMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const StandardFormToSlopeInterceptFormCalculator = () => {
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
    tech_to: "1",
    tech_a: "2",
    tech_b: "-6",
    tech_c: "-13",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useStandardFormTolopeInterceptFormMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_to) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_a: formData.tech_a,
        tech_b: formData.tech_b,
        tech_c: formData.tech_c,
        tech_to: formData.tech_to,
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
      tech_to: "1",
      tech_a: "2",
      tech_b: "-6",
      tech_c: "-13",
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

  // reult

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
            <div className="grid grid-cols-12 mt-3   gap-2 md:gap-4 lg:gap-4">
              <div className="col-span-12">
                <label htmlFor="tech_to" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_to"
                    id="tech_to"
                    value={formData.tech_to}
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
              <p className="col-span-12 text-center my-3 text-[18px]">
                {formData.tech_to == "2" ? (
                  <>
                    <strong id="changeText">
                      {data?.payload?.tech_lang_keys[6]}: y = mx + c
                    </strong>
                  </>
                ) : (
                  <>
                    <strong id="changeText">
                      {data?.payload?.tech_lang_keys[4]}: Ax + By + C = 0{" "}
                    </strong>
                  </>
                )}
              </p>
              <div
                className={
                  formData.tech_to === "1" ? "col-span-4" : "col-span-6"
                }
                id="aInput"
              >
                <label htmlFor="tech_a" className="label">
                  {data?.payload?.tech_lang_keys["5"]}{" "}
                  <span id="enter_a">A</span>
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_a"
                    id="tech_a"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_a}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div
                className={
                  formData.tech_to === "1" ? "col-span-4" : "col-span-6"
                }
                id="bInput"
              >
                <label htmlFor="tech_b" className="label">
                  {data?.payload?.tech_lang_keys["5"]}{" "}
                  <span id="enter_b">B</span>
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_b"
                    id="tech_b"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_b}
                    onChange={handleChange}
                  />
                </div>
              </div>
              {formData.tech_to == "1" && (
                <>
                  <div className="col-span-4" id="cInput">
                    <label htmlFor="tech_c" className="label">
                      {data?.payload?.tech_lang_keys["5"]}{" "}
                      <span id="enter_b">C</span>
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_c"
                        id="tech_c"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_c}
                        onChange={handleChange}
                      />
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
          <div className="w-full mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg shadow-md space-y-6 result">
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
                      <div className="w-full">
                        {formData?.tech_to == "1" ? (
                          <>
                            <div className="col-span-12 text-center text-[16px] overflow-auto">
                              <p>{data?.payload?.tech_lang_keys["6"]}</p>

                              <p className="my-3">
                                <strong>y = mx + c</strong>
                              </p>

                              <div className="flex justify-center">
                                <p className="text-[25px] bg-[#2845F5] text-white rounded-lg px-3 py-2  my-3">
                                  <strong className="flex bg-[#2845F5] px-3 py-2 text-[22px] rounded-[10px] text-white">
                                    y = {result?.tech_m?.toFixed(3)}x{" "}
                                    {result?.tech_nb < 0
                                      ? "+ " +
                                        Math.abs(result.tech_nb).toFixed(3)
                                      : "- " + result.tech_nb?.toFixed(3)}
                                  </strong>
                                </p>
                              </div>

                              <p className="my-3 text-[16px]">
                                That is, the slope-intercept form y = mx + b of
                                your line has the following coefficients:
                              </p>
                              <div className="flex justify-center mt-4 overflow-auto">
                                <strong className="bg-[#2845F5] px-3 py-2 text-[22px] rounded-lg text-white ">
                                  {" "}
                                  m = {Number(result?.tech_m).toFixed(3)}{" "}
                                </strong>
                                <strong className="bg-[#2845F5] px-3 py-2 text-[22px] rounded-lg text-white mx-2">
                                  {" "}
                                  c = {Number(result.tech_nb).toFixed(3)}{" "}
                                </strong>
                              </div>
                            </div>

                            <div className="col-span-12 text-[16px] overflow-auto">
                              <p className="mt-2">
                                <strong>
                                  {data?.payload?.tech_lang_keys[7]}:
                                </strong>
                              </p>

                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys[4]}:
                              </p>

                              <p className="mt-2">
                                {formData?.tech_a}x{" "}
                                {formData?.tech_b < 0
                                  ? "- " + Math.abs(formData?.tech_b)
                                  : "+ " + formData?.tech_b}
                                y {formData?.tech_c} = 0
                              </p>

                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys[8]} 'x'{" "}
                                {data?.payload?.tech_lang_keys[9]}:
                              </p>

                              <p className="mt-2">
                                {formData?.tech_b}y = {-1 * formData?.tech_a}x{" "}
                                {formData?.tech_c < 0
                                  ? "+ " + Math.abs(formData?.tech_c)
                                  : "- " + formData?.tech_c}
                              </p>

                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys[10]} y:
                              </p>

                              <p className="mt-2">
                                y = ({-1 * formData?.tech_a}x{" "}
                                {formData?.tech_c < 0
                                  ? "+ " + Math.abs(formData?.tech_c)
                                  : "- " + formData?.tech_c}
                                ) / {formData?.tech_b}
                              </p>

                              <p className="mt-2">
                                y = ({-1 * formData?.tech_a}/{formData?.tech_b}
                                )x (
                                {formData?.tech_c < 0
                                  ? "+ " + Math.abs(formData?.tech_c)
                                  : "- " + formData?.tech_c}
                                /{formData?.tech_b})
                              </p>

                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys[6]}
                              </p>

                              <p className="mt-2">
                                y = {result?.tech_m}x{" "}
                                {result?.tech_nb < 0
                                  ? "+ " + Math.abs(result?.tech_nb)
                                  : "- " + result?.tech_nb}
                              </p>
                            </div>
                            <div className="col-span-12 mt-2 overflow-auto">
                              <table className="w-full text-[16px]">
                                <tbody>
                                  <tr>
                                    <td className="py-2 border-b w-[60%]">
                                      {data?.payload?.tech_lang_keys[11]} (m)
                                    </td>
                                    <td className="py-2 border-b">
                                      <strong>
                                        {result?.tech_m !== ""
                                          ? result.tech_m
                                          : "0.0"}
                                      </strong>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b w-[60%]">
                                      Y - {data?.payload?.tech_lang_keys[12]}{" "}
                                      (c)
                                    </td>
                                    <td className="py-2 border-b">
                                      <strong>
                                        {result?.tech_nb < 0
                                          ? "+ " + Math.abs(result.tech_nb)
                                          : "- " + result.tech_nb}
                                      </strong>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b w-[60%]">
                                      X - {data?.payload?.tech_lang_keys[12]}
                                    </td>
                                    <td className="py-2 border-b">
                                      <strong>
                                        {result?.tech_m
                                          ? (
                                              (-1 * result.tech_nb) /
                                              result.tech_m
                                            ).toFixed(2)
                                          : "NaN"}
                                      </strong>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b w-[60%]">
                                      {data?.payload?.tech_lang_keys[13]}
                                    </td>
                                    <td className="py-2 border-b">
                                      <strong>
                                        {(result?.tech_m * 100).toFixed(2)} %
                                      </strong>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b w-[60%]">
                                      {data?.payload?.tech_lang_keys[14]} (θ)
                                    </td>
                                    <td className="py-2 border-b">
                                      <strong>
                                        {result?.tech_angle !== ""
                                          ? result.tech_angle
                                          : "0.0"}{" "}
                                        deg
                                      </strong>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="col-span-12 text-center text-[20px] overflow-auto">
                              <p>{data?.payload?.tech_lang_keys["4"]}</p>

                              <p className="my-3">
                                <strong className="text-[20px]">
                                  Ax + By + C = 0
                                </strong>
                              </p>

                              <p className="my-3">
                                <strong className="bg-[#2845F5] px-3 py-2 text-[32px] rounded-[10px] text-white">
                                  {(result?.tech_A !== 1
                                    ? result?.tech_A
                                    : "") + "x "}
                                  {result?.tech_B < 0
                                    ? "- " + Math.abs(result.tech_B) + "y "
                                    : "+ " + result?.tech_B + "y "}
                                  {result?.tech_C < 0
                                    ? "- " + Math.abs(result.tech_C)
                                    : "+ " + Math.abs(result.tech_C)}{" "}
                                  = 0
                                </strong>
                              </p>
                              <p className="my-3 text-[16px]">
                                That is, the standard form Ax + By + C = 0 of
                                your line has the following coefficients:
                              </p>
                              <div className="d-flex justify-content-center mt-4">
                                <strong className="bg-[#2845F5] px-3 py-2 text-[22px] rounded-lg text-white ">
                                  {" "}
                                  A = {result?.tech_A}{" "}
                                </strong>

                                <strong className="bg-[#2845F5] px-3 py-2 text-[22px] rounded-lg text-white mx-2">
                                  {" "}
                                  B = {result.tech_B}{" "}
                                </strong>

                                <strong className="bg-[#2845F5] px-3 py-2 text-[22px] rounded-lg text-white ">
                                  C = {result.tech_C}
                                </strong>
                              </div>
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

export default StandardFormToSlopeInterceptFormCalculator;

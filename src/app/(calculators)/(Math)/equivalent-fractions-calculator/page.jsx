"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useEquivalentFractionsCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const EquivalentFractionsCalculator = () => {
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
    tech_want_to: "1",
    tech_is_frac: "1",
    tech_s1: "3",
    tech_n1: "2",
    tech_d1: "5",
    tech_no: "5",
    tech_s2: "1",
    tech_n2: "2",
    tech_d2: "4",
    tech_s3: "2",
    tech_n3: "5",
    tech_d3: "11",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useEquivalentFractionsCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_want_to) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_want_to: formData.tech_want_to,
        tech_is_frac: formData.tech_is_frac,
        tech_s1: formData.tech_s1,
        tech_n1: formData.tech_n1,
        tech_d1: formData.tech_d1,
        tech_no: formData.tech_no,
        tech_s2: formData.tech_s2,
        tech_n2: formData.tech_n2,
        tech_d2: formData.tech_d2,
        tech_s3: formData.tech_s3,
        tech_n3: formData.tech_n3,
        tech_d3: formData.tech_d3,
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
      tech_want_to: "1",
      tech_is_frac: "1",
      tech_s1: "3",
      tech_n1: "2",
      tech_d1: "5",
      tech_no: "5",
      tech_s2: "1",
      tech_n2: "2",
      tech_d2: "4",
      tech_s3: "2",
      tech_n3: "5",
      tech_d3: "11",
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
  const upper = result?.tech_upper || [];
  const bottom = result?.tech_bottom || [];
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
            <div className="grid grid-cols-12 mt-3   gap-2 md:gap-4 lg:gap-4">
              <div className="col-span-12 my-4 mx-0">
                <div className="grid grid-cols-12 mt-3   gap-2 md:gap-4 lg:gap-4">
                  <div className="col-span-12 md:col-span-6 lg:col-span-6">
                    <label htmlFor="tech_want_to" className="label">
                      {data?.payload?.tech_lang_keys["1"]}:
                    </label>
                    <div className="mt-2">
                      <select
                        className="input"
                        aria-label="select"
                        name="tech_want_to"
                        id="tech_want_to"
                        value={formData.tech_want_to}
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
                  <div className="col-span-12 md:col-span-6 lg:col-span-6">
                    <label htmlFor="tech_is_frac" className="label">
                      {data?.payload?.tech_lang_keys["4"]}:
                    </label>
                    <div className="mt-2">
                      <select
                        className="input"
                        aria-label="select"
                        name="tech_is_frac"
                        id="tech_is_frac"
                        value={formData.tech_is_frac}
                        onChange={handleChange}
                      >
                        <option value="1">
                          {data?.payload?.tech_lang_keys["5"]}{" "}
                        </option>
                        <option value="2">
                          {data?.payload?.tech_lang_keys["6"]}{" "}
                        </option>
                      </select>
                    </div>
                  </div>

                  {formData.tech_want_to == "1" && (
                    <>
                      <div className="col-span-12  mx-auto firstt ">
                        <table className="w-full">
                          <tbody>
                            <tr>
                              {formData.tech_is_frac == "2" && (
                                <>
                                  <td rowspan="2" className="frist_p">
                                    <input
                                      type="number"
                                      step="any"
                                      name="tech_s1"
                                      id="tech_s1"
                                      className="input my-2"
                                      aria-label="input"
                                      placeholder="whole number"
                                      value={formData.tech_s1}
                                      onChange={handleChange}
                                    />
                                  </td>
                                </>
                              )}
                              <td className="pb-1">
                                <input
                                  type="number"
                                  step="any"
                                  name="tech_n1"
                                  id="tech_n1"
                                  className="input my-2"
                                  aria-label="input"
                                  placeholder="numerator"
                                  value={formData.tech_n1}
                                  onChange={handleChange}
                                />
                              </td>
                            </tr>

                            <tr>
                              <td className="bdr-top pt-1">
                                <input
                                  type="number"
                                  step="any"
                                  name="tech_d1"
                                  min="1"
                                  id="tech_d1"
                                  className="input my-2"
                                  aria-label="input"
                                  placeholder="denominator"
                                  value={formData.tech_d1}
                                  onChange={handleChange}
                                />
                              </td>
                            </tr>
                          </tbody>
                        </table>
                        <div className="col-12">
                          <label htmlFor="tech_no" className="label">
                            {data?.payload?.tech_lang_keys["6"]}:
                          </label>
                          <div className=" relative">
                            <input
                              type="number"
                              step="any"
                              min="1"
                              max="100"
                              name="tech_no"
                              id="tech_no"
                              className="input my-2"
                              aria-label="input"
                              value={formData.tech_no}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                  {formData.tech_want_to == "2" && (
                    <>
                      <div className="col-span-6 second ">
                        <table className="w-full">
                          <tbody>
                            <p className="mt-3 label text-center">
                              {data?.payload?.tech_lang_keys["7"]}:
                            </p>
                            <tr>
                              {formData.tech_is_frac == "2" && (
                                <>
                                  <td rowspan="2" className="second_wNum  pe-2">
                                    <input
                                      type="number"
                                      step="any"
                                      name="tech_s2"
                                      id="tech_s2"
                                      className="input my-2"
                                      aria-label="input"
                                      placeholder="whole number"
                                      value={formData.tech_s2}
                                      onChange={handleChange}
                                    />
                                  </td>
                                </>
                              )}
                              <td className="pb-1">
                                <input
                                  type="number"
                                  step="any"
                                  name="tech_n2"
                                  id="tech_n2"
                                  className="input my-2"
                                  aria-label="input"
                                  placeholder="numerator"
                                  value={formData.tech_n2}
                                  onChange={handleChange}
                                />
                              </td>
                            </tr>
                            <tr>
                              <td className="bdr-top pt-1">
                                <input
                                  type="number"
                                  step="any"
                                  name="tech_d2"
                                  min="1"
                                  id="tech_d2"
                                  className="input my-2"
                                  aria-label="input"
                                  placeholder="denominator"
                                  value={formData.tech_d2}
                                  onChange={handleChange}
                                />
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <div className="col-span-6 second  ">
                        <table className="w-full">
                          <tbody>
                            <p className="mt-3 label text-center">
                              {data?.payload?.tech_lang_keys["8"]}:
                            </p>
                            <tr>
                              {formData.tech_is_frac == "2" && (
                                <>
                                  <td rowspan="2" className="pe-2 second_wNum ">
                                    <input
                                      type="number"
                                      step="any"
                                      name="tech_s3"
                                      id="tech_s3"
                                      className="input my-2"
                                      aria-label="input"
                                      placeholder="whole number"
                                      value={formData.tech_s3}
                                      onChange={handleChange}
                                    />
                                  </td>
                                </>
                              )}
                              <td className="pb-1">
                                <input
                                  type="number"
                                  step="any"
                                  name="tech_n3"
                                  id="tech_n3"
                                  className="input my-2"
                                  aria-label="input"
                                  placeholder="numerator"
                                  value={formData.tech_n3}
                                  onChange={handleChange}
                                />
                              </td>
                            </tr>
                            <tr>
                              <td className="bdr-top pt-1">
                                <input
                                  type="number"
                                  step="any"
                                  name="tech_d3"
                                  min="1"
                                  id="tech_d3"
                                  className="input my-2"
                                  aria-label="input"
                                  placeholder="denominator"
                                  value={formData.tech_d3}
                                  onChange={handleChange}
                                />
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </>
                  )}
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
                {data?.payload?.tech_lang_keys["locale"] == "en"
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
                        <p className="text-[16px] my-2 clr">
                          {data?.payload?.tech_lang_keys["9"]}
                        </p>

                        <div>
                          {formData?.tech_want_to == 1 ? (
                            <>
                              {upper[0] < bottom[0] ? (
                                <p className="text-[16px]">
                                  {data?.payload?.tech_lang_keys["9"]}
                                </p>
                              ) : upper[0] > bottom[0] ? (
                                <p className="text-[16px] mt-1">
                                  {data?.payload?.tech_lang_keys["10"]}
                                </p>
                              ) : (
                                <p className="text-[16px] mt-1">
                                  {data?.payload?.tech_lang_keys["11"]}
                                </p>
                              )}

                              <p className="text-[16px] mt-1">
                                {data?.payload?.tech_lang_keys["12"]}
                              </p>
                              <p className="text-[20px] text-blue-800 my-3 text-center">
                                <strong>
                                  {data?.payload?.tech_lang_keys["13"]}
                                </strong>
                              </p>

                              {/* First Table (just fractions in 4 columns per row) */}
                              <div className="w-full overflow-auto">
                                <table className="w-full text-[16px] text-center">
                                  <tbody>
                                    {upper.map((val, key) => {
                                      if (key % 4 == 0) {
                                        return (
                                          <tr key={key}>
                                            {[0, 1, 2, 3].map((offset) => {
                                              const idx = key + offset;
                                              if (idx < upper.length) {
                                                return (
                                                  <td
                                                    key={idx}
                                                    className="border py-2"
                                                  >
                                                    {upper[idx]}/{bottom[idx]}
                                                  </td>
                                                );
                                              }
                                              return null;
                                            })}
                                          </tr>
                                        );
                                      }
                                      return null;
                                    })}
                                  </tbody>
                                </table>
                              </div>
                              <p className="text-[20px] text-blue-800 my-3">
                                <strong>
                                  {data?.payload?.tech_lang_keys["14"]}:
                                </strong>
                              </p>

                              {/* Second Table (fraction x j/j = new frac), 2 per row */}
                              <div className="w-full overflow-auto">
                                <table className="w-full text-[16px] text-center">
                                  <tbody>
                                    {upper.map((val, key) => {
                                      if (key % 2 == 0) {
                                        return (
                                          <tr key={key}>
                                            {[0, 1].map((offset) => {
                                              const idx = key + offset;
                                              if (idx < upper.length) {
                                                return (
                                                  <td
                                                    key={idx}
                                                    className="border py-2"
                                                  >
                                                    {`${upper[0]}/${
                                                      bottom[0]
                                                    } x ${idx + 1}/${
                                                      idx + 1
                                                    } = ${upper[idx]}/${
                                                      bottom[idx]
                                                    }`}
                                                  </td>
                                                );
                                              }
                                              return null;
                                            })}
                                          </tr>
                                        );
                                      }
                                      return null;
                                    })}
                                  </tbody>
                                </table>
                              </div>
                            </>
                          ) : (
                            <>
                              {result?.tech_same == "yes" ? (
                                <p>{data?.payload?.tech_lang_keys["15"]}</p>
                              ) : (
                                <p>{data?.payload?.tech_lang_keys["16"]}</p>
                              )}
                              <div className="w-full overflow-auto">
                                <table className="w-full text-[16px] text-center">
                                  <tbody>
                                    <tr>
                                      <td className="border py-2">
                                        {result?.tech_input1}
                                      </td>
                                      <td className="border py-2">
                                        {result?.tech_sign}
                                      </td>
                                      <td className="border py-2">
                                        {result?.tech_input2}
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </>
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

export default EquivalentFractionsCalculator;

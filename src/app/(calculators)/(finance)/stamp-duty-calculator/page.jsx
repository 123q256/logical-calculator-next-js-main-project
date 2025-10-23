"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useStampDutyCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency";
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const StampDutyCalculator = () => {
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
    tech_unit_type: "uk", // aus   uk
    tech_uk_method: "first",
    value: "5000000",
    tech_ausval: 1345,
    tech_aus_method: "nt", // vic  nsw qld   wa  sa  nt  act  tas
    tech_first: "no",
    tech_property: "Live-in", // Vacant Land  Investment
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useStampDutyCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_unit_type || !formData.tech_uk_method) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_unit_type: formData.tech_unit_type,
        tech_uk_method: formData.tech_uk_method,
        value: formData.value,
        tech_ausval: formData.tech_ausval,
        tech_aus_method: formData.tech_aus_method,
        tech_first: formData.tech_first,
        tech_property: formData.tech_property,
      }).unwrap();
      setResult(response?.payload); // Assuming the response has 'lovePercentage'
      console.log(result?.tech_aus_a);
      toast.success("Successfully Calculated");
    } catch (err) {
      setFormError("Error in calculating.");
      toast.error("Error in calculating.");
    }
  };

  // Handle reset form
  const handleReset = () => {
    setFormData({
      tech_unit_type: "uk", // aus   uk
      tech_uk_method: "first",
      value: "5000000",
      tech_ausval: 1345,
      tech_aus_method: "nt", // vic  nsw qld   wa  sa  nt  act  tas
      tech_first: "no",
      tech_property: "Live-in", // Vacant Land  Investment
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
            <div className="col-12 col-lg-9 mx-auto mt-2 w-full">
              <input
                type="hidden"
                name="tech_unit_type"
                id="calculator_time"
                value={formData.tech_unit_type}
              />
              <div className="flex flex-wrap items-center bg-blue-100 border border-blue-500 text-center rounded-lg px-1">
                <div className="lg:w-1/2 w-full px-2 py-1">
                  <div
                    className={`bg-white px-3 py-2 cursor-pointer rounded-md transition-colors duration-300 hover_tags hover:text-white pacetab ${
                      formData.tech_unit_type === "uk" ? "tagsUnit" : ""
                    }`}
                    id="uk"
                    onClick={() => {
                      setFormData({ ...formData, tech_unit_type: "uk" });
                      setResult(null);
                      setFormError(null);
                    }}
                  >
                    {data?.payload?.tech_lang_keys["uk"]}
                  </div>
                </div>
                <div className="lg:w-1/2 w-full px-2 py-1">
                  <div
                    className={`bg-white px-3 py-2 cursor-pointer rounded-md transition-colors duration-300 hover_tags hover:text-white pacetab ${
                      formData.tech_unit_type === "aus" ? "tagsUnit" : ""
                    }`}
                    id="aus"
                    onClick={() => {
                      setFormData({ ...formData, tech_unit_type: "aus" });
                      setResult(null);
                      setFormError(null);
                    }}
                  >
                    {data?.payload?.tech_lang_keys["aus"]}
                  </div>
                </div>
              </div>
            </div>
            {formData?.tech_unit_type == "uk" ? (
              <div
                className="grid grid-cols-1 lg:grid-cols-2 md:grid-cols-2 mt-4 gap-4"
                id="test2"
              >
                <div className="space-y-2">
                  <label htmlFor="tech_uk_method" className="label">
                    {data?.payload?.tech_lang_keys["t_cal"]}:
                  </label>
                  <div className="mt-2">
                    <select
                      className="input"
                      aria-label="select"
                      name="tech_uk_method"
                      id="tech_uk_method"
                      value={formData.tech_uk_method}
                      onChange={handleChange}
                    >
                      <option value="single">
                        {data?.payload?.tech_lang_keys["s"]}
                      </option>
                      <option value="add">
                        {data?.payload?.tech_lang_keys["a"]}
                      </option>
                      <option value="first">
                        {data?.payload?.tech_lang_keys["f"]}
                      </option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="value" className="label">
                    {data?.payload?.tech_lang_keys["purchase_price"]}:
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="any"
                      name="value"
                      id="value"
                      className="input mt-2"
                      aria-label="input"
                      value={formData.value}
                      onChange={handleChange}
                    />
                    <span className="input_unit">£</span>
                  </div>
                </div>
              </div>
            ) : (
              <div
                className="grid grid-cols-1 lg:grid-cols-2 md:grid-cols-2 mt-4 gap-4"
                id="test1"
              >
                <div className="space-y-2">
                  <label htmlFor="tech_ausval" className="label">
                    {data?.payload?.tech_lang_keys["purchase_price"]}:
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="any"
                      name="tech_ausval"
                      id="tech_ausval"
                      className="input mt-2"
                      aria-label="input"
                      value={formData.tech_ausval}
                      onChange={handleChange}
                    />
                    <span className="input_unit">£</span>
                  </div>
                </div>

                <div className="space-y-2 relative">
                  <label htmlFor="tech_aus_method" className="label">
                    {data?.payload?.tech_lang_keys["state"]}:
                  </label>
                  <div className="mt-2">
                    <select
                      className="input"
                      aria-label="select"
                      name="tech_aus_method"
                      id="tech_aus_method"
                      value={formData.tech_aus_method}
                      onChange={handleChange}
                    >
                      <option value="nsw">
                        {data?.payload?.tech_lang_keys["nsw"]}
                      </option>
                      <option value="act">
                        {data?.payload?.tech_lang_keys["act"]}
                      </option>
                      <option value="nt">
                        {data?.payload?.tech_lang_keys["nt"]}
                      </option>
                      <option value="qld">
                        {data?.payload?.tech_lang_keys["qld"]}
                      </option>
                      <option value="sa">
                        {data?.payload?.tech_lang_keys["sa"]}
                      </option>
                      <option value="tas">
                        {data?.payload?.tech_lang_keys["tas"]}
                      </option>
                      <option value="vic">
                        {data?.payload?.tech_lang_keys["vic"]}
                      </option>
                      <option value="wa">
                        {data?.payload?.tech_lang_keys["wa"]}
                      </option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2 relative">
                  <label htmlFor="tech_first" className="label">
                    {data?.payload?.tech_lang_keys["f"]}:
                  </label>
                  <div className="mt-2">
                    <select
                      className="input"
                      aria-label="select"
                      name="tech_first"
                      id="tech_first"
                      value={formData.tech_first}
                      onChange={handleChange}
                    >
                      <option value="no">
                        {data?.payload?.tech_lang_keys["no"]}
                      </option>
                      <option value="yes">
                        {data?.payload?.tech_lang_keys["yes"]}
                      </option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2 relative">
                  <label htmlFor="tech_property" className="label">
                    {data?.payload?.tech_lang_keys["property"]}:
                  </label>
                  <div className="mt-2">
                    <select
                      className="input"
                      aria-label="select"
                      name="tech_property"
                      id="tech_property"
                      value={formData.tech_property}
                      onChange={handleChange}
                    >
                      <option value="live">
                        {data?.payload?.tech_lang_keys["pa"]}
                      </option>
                      <option value="invest">
                        {data?.payload?.tech_lang_keys["pb"]}
                      </option>
                      <option value="land">
                        {data?.payload?.tech_lang_keys["pc"]}
                      </option>
                    </select>
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
                    <div className="w-full p-3 rounded-lg mt-3">
                      {result?.Add && (
                        <>
                          <div className="w-full mt-2 overflow-auto">
                            <table className="w-full text-[16px]">
                              <tbody>
                                <tr>
                                  <td
                                    className="py-2 border-b"
                                    style={{ width: "70%" }}
                                  >
                                    <strong>
                                      {
                                        data?.payload?.tech_lang_keys[
                                          "stamp_duty"
                                        ]
                                      }
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {result?.stamp_duty
                                      ? `£${result.stamp_duty}`
                                      : "£0"}
                                  </td>
                                </tr>
                                <tr>
                                  <td
                                    className="py-2 border-b"
                                    style={{ width: "70%" }}
                                  >
                                    <strong>
                                      {
                                        data?.payload?.tech_lang_keys[
                                          "effective_data"
                                        ]
                                      }
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b">
                                    {result?.percent
                                      ? `${result.percent}%`
                                      : "0%"}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>

                          <div className="w-full mt-2 overflow-auto">
                            <table className="w-full text-base">
                              <tbody>
                                <tr>
                                  <td className="py-2 border-b font-bold">
                                    {data?.payload?.tech_lang_keys["tax_bnad"]}
                                  </td>
                                  <td className="py-2 border-b font-bold">%</td>
                                  <td className="py-2 border-b font-bold">
                                    {
                                      data?.payload?.tech_lang_keys[
                                        "taxable_sum"
                                      ]
                                    }
                                  </td>
                                  <td className="py-2 border-b font-bold">
                                    {data?.payload?.tech_lang_keys["tax"]}
                                  </td>
                                </tr>

                                {/* Row 1 */}
                                <tr>
                                  <td className="py-2 border-b">
                                    less than £125k
                                  </td>
                                  <td className="py-2 border-b">0</td>
                                  <td className="py-2 border-b">
                                    £{result?.as || 0}
                                  </td>
                                  <td className="py-2 border-b">
                                    £{result?.a || 0}
                                  </td>
                                </tr>

                                {/* Row 2 */}
                                <tr>
                                  <td className="py-2 border-b">
                                    £125k to £250k
                                  </td>
                                  <td className="py-2 border-b">2</td>
                                  <td className="py-2 border-b">
                                    £{result?.bs || 0}
                                  </td>
                                  <td className="py-2 border-b">
                                    £{result?.b || 0}
                                  </td>
                                </tr>

                                {/* Row 3 */}
                                <tr>
                                  <td className="py-2 border-b">
                                    £250k to £925k
                                  </td>
                                  <td className="py-2 border-b">5</td>
                                  <td className="py-2 border-b">
                                    £{result?.cs || 0}
                                  </td>
                                  <td className="py-2 border-b">
                                    £{result?.c || 0}
                                  </td>
                                </tr>

                                {/* Row 4 */}
                                <tr>
                                  <td className="py-2 border-b">
                                    £925k to £1.5m
                                  </td>
                                  <td className="py-2 border-b">10</td>
                                  <td className="py-2 border-b">
                                    £{result?.ds || 0}
                                  </td>
                                  <td className="py-2 border-b">
                                    £{result?.d || 0}
                                  </td>
                                </tr>

                                {/* Row 5 */}
                                <tr>
                                  <td className="py-2 border-b">
                                    rest over £1.5m
                                  </td>
                                  <td className="py-2 border-b">12</td>
                                  <td className="py-2 border-b">
                                    £{result?.es || 0}
                                  </td>
                                  <td className="py-2 border-b">
                                    £{result?.e || 0}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </>
                      )}

                      {result?.tech_sub && (
                        <div className="w-full mt-2 overflow-auto">
                          <table className="w-full text-[16px]">
                            <tbody>
                              <tr>
                                <td className="py-2 border-b">
                                  <p>{data?.payload?.tech_lang_keys["t_a"]}</p>
                                </td>
                                <td className="py-2 border-b">
                                  <b>
                                    {result?.tech_aus_a != ""
                                      ? `$${result?.tech_aus_a}`
                                      : "$0.0"}
                                  </b>
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b">
                                  <p>
                                    {data?.payload?.tech_lang_keys["1st_ans"]}
                                  </p>
                                </td>
                                <td className="py-2 border-b">
                                  <b>
                                    {result?.tech_aus_b != ""
                                      ? `$${result?.tech_aus_b}`
                                      : "$0.0"}
                                  </b>
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b">
                                  <p>
                                    {data?.payload?.tech_lang_keys["2nd_ans"]}
                                  </p>
                                </td>
                                <td className="py-2 border-b">
                                  <b>
                                    {result?.tech_aus_c != ""
                                      ? `$${result?.tech_aus_c}`
                                      : "$0.0"}
                                  </b>
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b">
                                  <p>
                                    {data?.payload?.tech_lang_keys["3rd_ans"]}
                                  </p>
                                </td>
                                <td className="py-2 border-b">
                                  <b>
                                    {result?.tech_aus_d != ""
                                      ? `$${result?.tech_aus_d}`
                                      : "$0.0"}
                                  </b>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      )}
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

export default StampDutyCalculator;

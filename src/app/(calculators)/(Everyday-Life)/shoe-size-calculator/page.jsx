"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useShoeSizeCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const ShoeSizeCalculator = () => {
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
    tech_gen: "c", // ad   c
    tech_country: "m", // us uk eu ko  mj fcm fin m
    tech_size: 8,
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useShoeSizeCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_gen || !formData.tech_country || !formData.tech_size) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_gen: formData.tech_gen,
        tech_country: formData.tech_country,
        tech_size: formData.tech_size,
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
      tech_gen: "c", // ad   c
      tech_country: "m", // us uk eu ko  mj fcm fin m
      tech_size: 8,
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

          <div className="lg:w-[50%] md:w-[80%] w-full mx-auto ">
            <div className="grid lg:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-4">
              <div className="space-y-2">
                <label htmlFor="tech_gen" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_gen"
                    id="tech_gen"
                    value={formData.tech_gen}
                    onChange={handleChange}
                  >
                    <option value="ad">
                      {data?.payload?.tech_lang_keys["2"]}
                    </option>
                    <option value="c">
                      {data?.payload?.tech_lang_keys["3"]}
                    </option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="tech_country" className="label">
                  {data?.payload?.tech_lang_keys["4"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_country"
                    id="tech_country"
                    value={formData.tech_country}
                    onChange={handleChange}
                  >
                    <option value="us">
                      {data?.payload?.tech_lang_keys["5"]}
                    </option>
                    <option value="uk">
                      {data?.payload?.tech_lang_keys["6"]}
                    </option>
                    <option value="eu">
                      {data?.payload?.tech_lang_keys["7"]}
                    </option>
                    <option value="ko">
                      {data?.payload?.tech_lang_keys["8"]}
                    </option>
                    <option value="mj">
                      {data?.payload?.tech_lang_keys["9"]}
                    </option>
                    <option value="fcm">
                      {data?.payload?.tech_lang_keys["10"]}
                    </option>
                    <option value="fin">
                      {data?.payload?.tech_lang_keys["11"]}
                    </option>
                    <option value="m">
                      {data?.payload?.tech_lang_keys["12"]}
                    </option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="tech_size" className="label">
                  {data?.payload?.tech_lang_keys["13"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_size"
                    id="tech_size"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_size}
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
              <div className="w-full result mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg flex items-center">
                    <div className="w-full md:w-[60%] bg-light-blue rounded-lg mt-6">
                      <div className="flex flex-col lg:flex-row my-4">
                        <div className="w-full text-base overflow-auto">
                          <table className="w-full text-[16px]">
                            <tbody>
                              <tr>
                                <td className="border-b border-gray-300 py-3">
                                  <strong>
                                    {result?.tech_gen === "c"
                                      ? data?.payload?.tech_lang_keys[3]
                                      : result?.tech_gen === "ad"
                                      ? data?.payload?.tech_lang_keys[2]
                                      : ""}
                                  </strong>
                                </td>

                                <td className="border-b border-gray-300 py-3">
                                  {result?.tech_country === "us"
                                    ? Number(result?.tech_us).toFixed(2)
                                    : result?.tech_country === "uk"
                                    ? Number(result?.tech_uk).toFixed(2)
                                    : result?.tech_country === "eu"
                                    ? Number(result?.tech_eu).toFixed(2)
                                    : result?.tech_country === "ko"
                                    ? Number(result?.tech_ko).toFixed(2)
                                    : result?.tech_country === "mj"
                                    ? Number(result?.tech_mj).toFixed(2)
                                    : result?.tech_country === "fin"
                                    ? Number(result?.tech_fin).toFixed(2)
                                    : result?.tech_country === "fcm"
                                    ? Number(result?.tech_fcm).toFixed(2)
                                    : result?.tech_country === "m"
                                    ? Number(result?.tech_m).toFixed(2)
                                    : ""}
                                </td>
                              </tr>

                              <tr>
                                <th colSpan="2" className="text-center py-3">
                                  <strong>
                                    {data?.payload?.tech_lang_keys[14]}
                                  </strong>
                                </th>
                              </tr>

                              {result?.tech_gen === "ad" && (
                                <tr>
                                  <td className="border-b border-gray-300 py-3">
                                    {data?.payload?.tech_lang_keys[20]}
                                  </td>
                                  <td className="border-b border-gray-300 py-3 text-right">
                                    {Number(result?.tech_wo).toFixed(2)}
                                  </td>
                                </tr>
                              )}

                              <tr>
                                <td className="border-b border-gray-300 py-3">
                                  {data?.payload?.tech_lang_keys[15]}
                                </td>
                                <td className="border-b border-gray-300 py-3 text-right">
                                  {Number(result?.tech_us).toFixed(2)}
                                </td>
                              </tr>

                              <tr>
                                <td className="border-b border-gray-300 py-3">
                                  {data?.payload?.tech_lang_keys[16]}
                                </td>
                                <td className="border-b border-gray-300 py-3 text-right">
                                  {Number(result?.tech_eu).toFixed(2)}
                                </td>
                              </tr>

                              <tr>
                                <td className="border-b border-gray-300 py-3">
                                  {data?.payload?.tech_lang_keys[17]}
                                </td>
                                <td className="border-b border-gray-300 py-3 text-right">
                                  {Number(result?.tech_uk).toFixed(2)}
                                </td>
                              </tr>

                              <tr>
                                <td className="border-b border-gray-300 py-3">
                                  {data?.payload?.tech_lang_keys[18]}
                                </td>
                                <td className="border-b border-gray-300 py-3 text-right">
                                  {Number(result?.tech_mj).toFixed(2)}
                                </td>
                              </tr>

                              <tr>
                                <td className="border-b border-gray-300 py-3">
                                  {data?.payload?.tech_lang_keys[19]}
                                </td>
                                <td className="border-b border-gray-300 py-3 text-right">
                                  {Number(result?.tech_ko).toFixed(2)}
                                </td>
                              </tr>

                              <tr>
                                <td className="border-b border-gray-300 py-3">
                                  {data?.payload?.tech_lang_keys[12]}
                                </td>
                                <td className="border-b border-gray-300 py-3 text-right">
                                  {Number(result?.tech_m).toFixed(2)}
                                </td>
                              </tr>

                              <tr>
                                <td className="border-b border-gray-300 py-3">
                                  {data?.payload?.tech_lang_keys[10]}
                                </td>
                                <td className="border-b border-gray-300 py-3 text-right">
                                  {Number(result?.tech_fcm).toFixed(2)} cm
                                </td>
                              </tr>

                              <tr>
                                <td className="border-b border-gray-300 py-3">
                                  {data?.payload?.tech_lang_keys[11]}
                                </td>
                                <td className="border-b border-gray-300 py-3 text-right">
                                  {Number(result?.tech_fin).toFixed(2)} in
                                </td>
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

export default ShoeSizeCalculator;

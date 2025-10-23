"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useDihybridCrossCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const DihybridCrossCalculator = () => {
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
    tech_mtype1: "0", // 0 1 2
    tech_mtype2: "0", // 0 1 2
    tech_ftype1: "0", // 0 1 2
    tech_ftype2: "0", // 0 1 2
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useDihybridCrossCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.tech_mtype1 ||
      !formData.tech_mtype2 ||
      !formData.tech_ftype1 ||
      !formData.tech_ftype2
    ) {
      setFormError("Please fill in field.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_mtype1: formData.tech_mtype1,
        tech_mtype2: formData.tech_mtype2,
        tech_ftype1: formData.tech_ftype1,
        tech_ftype2: formData.tech_ftype2,
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
      tech_mtype1: "0", // 0 1 2
      tech_mtype2: "0", // 0 1 2
      tech_ftype1: "0", // 0 1 2
      tech_ftype2: "0", // 0 1 2
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
            <div className="grid grid-cols-12  gap-2 md:gap-4 lg:gap-4">
              <div className="col-span-12">
                <span className="text-blue font-s-14 border-end pe-2 pe-md-3">
                  A, B - {data?.payload?.tech_lang_keys[1]}
                </span>
                <span className="text-blue font-s-14 ps-2 ps-md-3">
                  a, b - {data?.payload?.tech_lang_keys[2]}
                </span>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_mtype1" className="label">
                  {data?.payload?.tech_lang_keys["3"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_mtype1"
                    id="tech_mtype1"
                    value={formData.tech_mtype1}
                    onChange={handleChange}
                  >
                    <option value="0">AA</option>
                    <option value="1">Aa</option>
                    <option value="2">aa</option>
                  </select>
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_mtype2" className="label">
                  {data?.payload?.tech_lang_keys["3"]} 2:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_mtype2"
                    id="tech_mtype2"
                    value={formData.tech_mtype2}
                    onChange={handleChange}
                  >
                    <option value="0">BB</option>
                    <option value="1">Bb</option>
                    <option value="2">bb</option>
                  </select>
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_ftype1" className="label">
                  {data?.payload?.tech_lang_keys["4"]} 1:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_ftype1"
                    id="tech_ftype1"
                    value={formData.tech_ftype1}
                    onChange={handleChange}
                  >
                    <option value="0">AA</option>
                    <option value="1">Aa</option>
                    <option value="2">aa</option>
                  </select>
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_ftype2" className="label">
                  {data?.payload?.tech_lang_keys["4"]} 2:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_ftype2"
                    id="tech_ftype2"
                    value={formData.tech_ftype2}
                    onChange={handleChange}
                  >
                    <option value="0">BB</option>
                    <option value="1">Bb</option>
                    <option value="2">bb</option>
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
                      <div className="w-full">
                        <div className="w-full overflow-auto">
                          <table
                            className="w-full md:w-[60%] lg:w-[60%] "
                            cellSpacing="0"
                          >
                            <tbody>
                              <tr>
                                <td className="border-b py-2">AABB</td>
                                <td className="border-b">
                                  <strong>
                                    {result?.tech_finalRes * 100}%
                                  </strong>
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">AABb</td>
                                <td className="border-b">
                                  <strong>
                                    {result?.tech_tablResults[1] * 100}%
                                  </strong>
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">AAbb</td>
                                <td className="border-b">
                                  <strong>
                                    {result?.tech_tablResults[2] * 100}%
                                  </strong>
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">AaBB</td>
                                <td className="border-b">
                                  <strong>
                                    {result?.tech_tablResults[3] * 100}%
                                  </strong>
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">AaBb</td>
                                <td className="border-b">
                                  <strong>
                                    {result?.tech_tablResults[4] * 100}%
                                  </strong>
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">Aabb</td>
                                <td className="border-b">
                                  <strong>
                                    {result?.tech_tablResults[5] * 100}%
                                  </strong>
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">aaBB</td>
                                <td className="border-b">
                                  <strong>
                                    {result?.tech_tablResults[6] * 100}%
                                  </strong>
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">aaBb</td>
                                <td className="border-b">
                                  <strong>
                                    {result?.tech_tablResults[7] * 100}%
                                  </strong>
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2">aabb</td>
                                <td>
                                  <strong>
                                    {result?.tech_tablResults[8] * 100}%
                                  </strong>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        <p className="mt-2">
                          <strong className="text-blue font-s-18">
                            {data?.payload?.tech_lang_keys[5]}
                          </strong>
                        </p>
                        <div
                          className="w-full overflow-auto"
                          dangerouslySetInnerHTML={{
                            __html: result.tech_table,
                          }}
                        ></div>

                        <p className="mt-2">
                          <strong className="text-blue font-s-18">
                            {data?.payload?.tech_lang_keys[6]}
                          </strong>
                        </p>
                        <div className="w-full overflow-auto">
                          <table
                            className="w-full md:w-[60%] lg:w-[60%] "
                            cellSpacing="0"
                          >
                            <tbody>
                              <tr>
                                <td className="border-b py-2">
                                  <b>{data?.payload?.tech_lang_keys["res"]}</b>
                                </td>
                                <td className="border-b">
                                  <b>{data?.payload?.tech_lang_keys[7]}</b>
                                </td>
                                <td className="border-b">
                                  <b>{data?.payload?.tech_lang_keys[8]}</b>
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">AABB</td>
                                <td className="border-b">AABB</td>
                                <td className="border-b">AB</td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">AABb</td>
                                <td className="border-b">AABb</td>
                                <td className="border-b">AB</td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">AaBB</td>
                                <td className="border-b">AaBB</td>
                                <td className="border-b">AB</td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">AaBb</td>
                                <td className="border-b">AaBb</td>
                                <td className="border-b">AB</td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">AAbb</td>
                                <td className="border-b">AAbb</td>
                                <td className="border-b">Ab</td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">Aabb</td>
                                <td className="border-b">Aabb</td>
                                <td className="border-b">Ab</td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">aaBB</td>
                                <td className="border-b">aaBB</td>
                                <td className="border-b">aB</td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">aaBb</td>
                                <td className="border-b">aaBb</td>
                                <td className="border-b">aB</td>
                              </tr>
                              <tr>
                                <td className="py-2">aabb</td>
                                <td>aabb</td>
                                <td>ab</td>
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

export default DihybridCrossCalculator;

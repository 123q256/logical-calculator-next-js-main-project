"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import {
  useGetSingleCalculatorDetailsMutation,
  useMillionBillionLakhCroreMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const MillionBillionLakhCroreConverter = () => {
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
    tech_from: 10000,
    tech_calFrom: "Million",
    tech_calto: "Crore",
    tech_from_new: "",
    tech_calFrom_new: "",
    tech_calto_new: "",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useMillionBillionLakhCroreMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_from: formData.tech_from,
        tech_calFrom: formData.tech_calFrom,
        tech_calto: formData.tech_calto,
        tech_from_new: formData.tech_from_new,
        tech_calFrom_new: formData.tech_calFrom_new,
        tech_calto_new: formData.tech_calto_new,
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
      tech_from: 10000,
      tech_calFrom: "Million",
      tech_calto: "Crore",
      tech_from_new: "",
      tech_calFrom_new: "",
      tech_calto_new: "",
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

  const handleSwap = () => {
    setFormData((prev) => ({
      ...prev,
      tech_calFrom: prev.tech_calto,
      tech_calto: prev.tech_calFrom,
    }));

    setResult(null);
    setFormError(null);
  };

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
            <div className="grid grid-cols-12 mt-3 gap-2 md:gap-4 lg:gap-4">
              <div className="col-span-12">
                <label htmlFor="tech_from" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_from"
                    id="tech_from"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_from}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-span-5">
                <label htmlFor="tech_calFrom" className="label">
                  {data?.payload?.tech_lang_keys["2"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_calFrom"
                    id="tech_calFrom"
                    value={formData.tech_calFrom}
                    onChange={handleChange}
                  >
                    <option value="Hundred">
                      {data?.payload?.tech_lang_keys["3"]}
                    </option>
                    <option value="Thousand">
                      {data?.payload?.tech_lang_keys["4"]}
                    </option>
                    <option value="Lakh">
                      {data?.payload?.tech_lang_keys["5"]}
                    </option>
                    <option value="Million">
                      {data?.payload?.tech_lang_keys["6"]}
                    </option>
                    <option value="Crore">
                      {data?.payload?.tech_lang_keys["7"]}
                    </option>
                    <option value="Billion">
                      {data?.payload?.tech_lang_keys["8"]}
                    </option>
                    <option value="Trillion">
                      {data?.payload?.tech_lang_keys["9"]}
                    </option>
                    <option value="Arab">
                      {data?.payload?.tech_lang_keys["10"]}
                    </option>
                    <option value="Kharab">
                      {data?.payload?.tech_lang_keys["11"]}
                    </option>
                  </select>
                </div>
              </div>

              <div className="col-span-2 my-auto text-center flex items-center">
                <button
                  type="button"
                  className="calculate mt-9 bg-[#2845F5] text-white rounded-lg px-5 py-2"
                  onClick={handleSwap}
                >
                  ⇄
                </button>
              </div>

              <div className="col-span-5">
                <label htmlFor="tech_calto" className="label">
                  {data?.payload?.tech_lang_keys["12"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_calto"
                    id="tech_calto"
                    value={formData.tech_calto}
                    onChange={handleChange}
                  >
                    <option value="Hundred">
                      {data?.payload?.tech_lang_keys["3"]}
                    </option>
                    <option value="Thousand">
                      {data?.payload?.tech_lang_keys["4"]}
                    </option>
                    <option value="Lakh">
                      {data?.payload?.tech_lang_keys["5"]}
                    </option>
                    <option value="Million">
                      {data?.payload?.tech_lang_keys["6"]}
                    </option>
                    <option value="Crore">
                      {data?.payload?.tech_lang_keys["7"]}
                    </option>
                    <option value="Billion">
                      {data?.payload?.tech_lang_keys["8"]}
                    </option>
                    <option value="Trillion">
                      {data?.payload?.tech_lang_keys["9"]}
                    </option>
                    <option value="Arab">
                      {data?.payload?.tech_lang_keys["10"]}
                    </option>
                    <option value="Kharab">
                      {data?.payload?.tech_lang_keys["11"]}
                    </option>
                  </select>
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
                        <div className="col-12 text-[16px]">
                          <p className="mt-2 text-[18px]">
                            <strong>
                              {Number(result?.tech_from_input)}{" "}
                              {result?.tech_f_u_input} = {result?.tech_to}{" "}
                              {result?.tech_t_u_input}
                            </strong>
                          </p>
                          <p className="mt-2">
                            {data?.payload?.tech_lang_keys["13"]}:
                          </p>
                          <p className="mt-2">
                            <strong className="ans"></strong>
                          </p>
                          <p className="mt-2">
                            <strong>
                              {formData?.tech_calFrom}{" "}
                              {data?.payload?.tech_lang_keys["12"]}:
                            </strong>
                          </p>
                          <div className="w-full md:w-[80%] lg:w-[80%] mt-2  overflow-auto">
                            <table className="w-full text-[16px]">
                              <tbody>
                                <tr>
                                  <td className="py-2 border-b">
                                    {Number(formData?.tech_from)}{" "}
                                    {formData?.tech_calFrom} ={" "}
                                  </td>
                                  <td className="py-2 border-b">
                                    {result?.tech_t1}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b">
                                    {Number(formData?.tech_from)}{" "}
                                    {formData?.tech_calFrom} ={" "}
                                  </td>
                                  <td className="py-2 border-b">
                                    {result?.tech_t2}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b">
                                    {Number(formData?.tech_from)}{" "}
                                    {formData?.tech_calFrom} ={" "}
                                  </td>
                                  <td className="py-2 border-b">
                                    {result?.tech_t3}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b">
                                    {Number(formData?.tech_from)}{" "}
                                    {formData?.tech_calFrom} ={" "}
                                  </td>
                                  <td className="py-2 border-b">
                                    {result?.tech_t4}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b">
                                    {Number(formData?.tech_from)}{" "}
                                    {formData?.tech_calFrom} ={" "}
                                  </td>
                                  <td className="py-2 border-b">
                                    {result?.tech_t5}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b">
                                    {Number(formData?.tech_from)}{" "}
                                    {formData?.tech_calFrom} ={" "}
                                  </td>
                                  <td className="py-2 border-b">
                                    {result?.tech_t6}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b">
                                    {Number(formData?.tech_from)}{" "}
                                    {formData?.tech_calFrom} ={" "}
                                  </td>
                                  <td className="py-2 border-b">
                                    {result?.tech_t7}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 border-b">
                                    {Number(formData?.tech_from)}{" "}
                                    {formData?.tech_calFrom} ={" "}
                                  </td>
                                  <td className="py-2 border-b">
                                    {result?.tech_t8}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          {/* <input type="hidden" name="tech_from_new" className="from"/>
                                  <input type="hidden" name="tech_calFrom_new" className="calFrom"/>
                                  <input type="hidden" name="tech_calto_new" className="calto"/>
                                  <p className="my-2"><strong>{data?.payload?.tech_lang_keys['14']}</strong></p>
                                      <div className="grid grid-cols-12 mt-3   gap-2 md:gap-4 lg:gap-4" dangerouslySetInnerHTML={{ __html: result.tech_table }} /> */}
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

export default MillionBillionLakhCroreConverter;

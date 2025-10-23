"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useBinaryCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const BinaryCalculator = () => {
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
    tech_bnr_frs: "110111",
    tech_bnr_tpe1: "binary",
    tech_bnr_slc: "add", // add  sub  mult  divd
    tech_bnr_sec: "11011",
    tech_bnr_tpe2: "binary",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useBinaryCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_bnr_slc) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_bnr_frs: formData.tech_bnr_frs,
        tech_bnr_tpe1: formData.tech_bnr_tpe1,
        tech_bnr_slc: formData.tech_bnr_slc,
        tech_bnr_sec: formData.tech_bnr_sec,
        tech_bnr_tpe2: formData.tech_bnr_tpe2,
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
      tech_bnr_frs: "110111",
      tech_bnr_tpe1: "binary",
      tech_bnr_slc: "add", // add  sub  mult  divd
      tech_bnr_sec: "11011",
      tech_bnr_tpe2: "binary",
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

          <div className="lg:w-[60%] md:w-[90%] w-full mx-auto ">
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-4 md:block hidden ">
                <label htmlFor="bnr_slc" className="label">
                  &nbsp;
                </label>
              </div>
              <div className="col-span-6 md:col-span-4 lg:col-span-4  ">
                <label htmlFor="tech_bnr_frs" className="label">
                  {data?.payload?.tech_lang_keys["6"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_bnr_frs"
                    id="tech_bnr_frs"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_bnr_frs}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-span-6 md:col-span-4 lg:col-span-4 ">
                <label htmlFor="tech_bnr_tpe1" className="label">
                  &nbsp;
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_bnr_tpe1"
                    id="tech_bnr_tpe1"
                    value={formData.tech_bnr_tpe1}
                    onChange={handleChange}
                  >
                    <option value="binary">
                      {data?.payload?.tech_lang_keys["2"]}{" "}
                    </option>
                    <option value="decimal">
                      {data?.payload?.tech_lang_keys["3"]}{" "}
                    </option>
                    <option value="hexadecimal">
                      {data?.payload?.tech_lang_keys["4"]}{" "}
                    </option>
                    <option value="octal">
                      {data?.payload?.tech_lang_keys["5"]}{" "}
                    </option>
                  </select>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-12  mt-4 gap-4">
              <div className="col-span-12 md:col-span-4 lg:col-span-4 ">
                <label htmlFor="tech_bnr_slc" className="label">
                  &nbsp;
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_bnr_slc"
                    id="tech_bnr_slc"
                    value={formData.tech_bnr_slc}
                    onChange={handleChange}
                  >
                    <option value="add">+ </option>
                    <option value="sub">- </option>
                    <option value="mult">* </option>
                    <option value="divd">/ </option>
                  </select>
                </div>
              </div>
              <div className="col-span-6 md:col-span-4 lg:col-span-4 order-1 md:order-2">
                <label htmlFor="tech_bnr_sec" className="label">
                  {data?.payload?.tech_lang_keys["7"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_bnr_sec"
                    id="tech_bnr_sec"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_bnr_sec}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-span-6 md:col-span-4 lg:col-span-4 order-2 ">
                <label htmlFor="tech_bnr_tpe2" className="label">
                  &nbsp;
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_bnr_tpe2"
                    id="tech_bnr_tpe2"
                    value={formData.tech_bnr_tpe2}
                    onChange={handleChange}
                  >
                    <option value="binary">
                      {data?.payload?.tech_lang_keys["2"]}{" "}
                    </option>
                    <option value="decimal">
                      {data?.payload?.tech_lang_keys["3"]}{" "}
                    </option>
                    <option value="hexadecimal">
                      {data?.payload?.tech_lang_keys["4"]}{" "}
                    </option>
                    <option value="octal">
                      {data?.payload?.tech_lang_keys["5"]}{" "}
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
              <div className=" w-full h-[30px] bg-gray-500 animate-pulse rounded-[10px] mb-4"></div>
              <div className="w-[75%] h-[20px] bg-gray-500 animate-pulse rounded-[10px] mb-3"></div>
              <div className="w-[50%] h-[20px] bg-gray-500 animate-pulse rounded-[10px] mb-3"></div>
              <div className="w-[25%] h-[20px] bg-gray-500 animate-pulse rounded-[10px]"></div>
            </div>
          </div>
        ) : (
          result && (
            <>
              <div className="w-full mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg  flex items-center justify-center">
                    <div className="w-full bg-light-blue  rounded-lg mt-3">
                      <div className="flex flex-col">
                        <div className="lg:w-1/2 mt-2 overflow-auto">
                          <table className="w-full text-[16px] md:text-[18px]">
                            <tbody>
                              <tr>
                                <td className="py-2 border-b w-3/5 font-bold">
                                  {data?.payload?.tech_lang_keys["2"]}
                                </td>
                                <td className="py-2 border-b">
                                  {result?.tech_bn}
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b w-3/5 font-bold">
                                  {data?.payload?.tech_lang_keys["3"]}
                                </td>
                                <td className="py-2 border-b">
                                  {result?.tech_dc}
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b w-3/5 font-bold">
                                  {data?.payload?.tech_lang_keys["4"]}
                                </td>
                                <td className="py-2 border-b">
                                  {result?.tech_hx}
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b w-3/5 font-bold">
                                  {data?.payload?.tech_lang_keys["5"]}
                                </td>
                                <td className="py-2 border-b">
                                  {result?.tech_oc}
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

export default BinaryCalculator;

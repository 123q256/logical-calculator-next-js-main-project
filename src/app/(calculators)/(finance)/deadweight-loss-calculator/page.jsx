"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useDeadweightLossCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const DeadweightLossCalculator = () => {
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
    tech_original_price: 6,
    tech_new_price: 7,
    tech_original_quantity: 2200,
    tech_new_quantity: 1760,
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useDeadweightLossCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.tech_original_price ||
      !formData.tech_new_price ||
      !formData.tech_original_quantity ||
      !formData.tech_new_quantity
    ) {
      setFormError("Please fill in field.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_original_price: formData.tech_original_price,
        tech_new_price: formData.tech_new_price,
        tech_original_quantity: formData.tech_original_quantity,
        tech_new_quantity: formData.tech_new_quantity,
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
      tech_original_price: 100,
      tech_new_price: 79,
      tech_original_quantity: 500,
      tech_new_quantity: 4400,
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

          <div className="lg:w-[60%] md:w-[80%] w-full mx-auto ">
            <div className="grid grid-cols-12 mt-3  gap-4">
              <div className="lg:col-span-6 md:col-span-6 col-span-12">
                <label htmlFor="tech_original_price" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_original_price"
                    id="tech_original_price"
                    className="input my-2"
                    aria-label="input"
                    value={formData.tech_original_price}
                    onChange={handleChange}
                  />
                  <span className="input_unit">
                    {data?.payload?.tech_lang_keys["2"]}
                  </span>
                </div>
              </div>
              <div className="lg:col-span-6 md:col-span-6 col-span-12">
                <label htmlFor="tech_new_price" className="label">
                  {data?.payload?.tech_lang_keys["3"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_new_price"
                    id="tech_new_price"
                    className="input my-2"
                    aria-label="input"
                    value={formData.tech_new_price}
                    onChange={handleChange}
                  />
                  <span className="input_unit">
                    {data?.payload?.tech_lang_keys["2"]}
                  </span>
                </div>
              </div>
              <div className="lg:col-span-6 md:col-span-6 col-span-12">
                <label htmlFor="tech_original_quantity" className="label">
                  {data?.payload?.tech_lang_keys["4"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_original_quantity"
                    id="tech_original_quantity"
                    className="input my-2"
                    aria-label="input"
                    value={formData.tech_original_quantity}
                    onChange={handleChange}
                  />
                  <span className="input_unit">
                    {data?.payload?.tech_lang_keys["5"]}
                  </span>
                </div>
              </div>
              <div className="lg:col-span-6 md:col-span-6 col-span-12">
                <label htmlFor="tech_new_quantity" className="label">
                  {data?.payload?.tech_lang_keys["6"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_new_quantity"
                    id="tech_new_quantity"
                    className="input my-2"
                    aria-label="input"
                    value={formData.tech_new_quantity}
                    onChange={handleChange}
                  />
                  <span className="input_unit">
                    {data?.payload?.tech_lang_keys["5"]}
                  </span>
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
                    <div className="w-full mt-3">
                      <div className="w-full md:w-[60%] lg:w-[60%]  mt-2">
                        <table className="w-full text-[18px]">
                          <tbody>
                            <tr>
                              <td className="py-2 border-b" width="60%">
                                <strong>
                                  {data?.payload?.tech_lang_keys["7"]}{" "}
                                </strong>
                              </td>
                              <td className="py-2 border-b">
                                Rs {Number(result?.tech_deadweight).toFixed()}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <div className="w-full text-[16px]">
                        <p className="mt-2">
                          <strong>{data?.payload?.tech_lang_keys["12"]}</strong>
                        </p>
                        <p className="mt-2">
                          {data?.payload?.tech_lang_keys["9"]}
                        </p>
                        <p className="mt-2">
                          {" "}
                          {data?.payload?.tech_lang_keys["10"]} = (Pn - Po) \
                          (Qo - Qn)2
                        </p>
                        <p className="mt-2">Where:</p>
                        <p className="mt-2 mx-2">
                          Po = {data?.payload?.tech_lang_keys["1"]}
                        </p>
                        <p className="mt-2 mx-2">
                          Pn = {data?.payload?.tech_lang_keys["3"]}
                        </p>
                        <p className="mt-2 mx-2">
                          Qo = {data?.payload?.tech_lang_keys["4"]}
                        </p>
                        <p className="mt-2 mx-2">
                          Qn = {data?.payload?.tech_lang_keys["6"]}
                        </p>
                        <p className="mt-2">
                          {data?.payload?.tech_lang_keys["10"]} = (
                          {formData?.tech_new_price} -{" "}
                          {formData?.tech_original_price}) x (
                          {formData?.tech_original_quantity} -{" "}
                          {formData?.tech_new_quantity})/2
                        </p>
                        <p className="mt-2">
                          {data?.payload?.tech_lang_keys["10"]} ={" "}
                          {result?.tech_total_price} x{" "}
                          {result?.tech_total_quantity} / 2
                        </p>
                        <p className="mt-2">
                          {data?.payload?.tech_lang_keys["10"]} ={" "}
                          {result?.tech_dead} /2{" "}
                        </p>
                        <p className="mt-2">
                          {data?.payload?.tech_lang_keys["11"]}{" "}
                          {data?.payload?.tech_lang_keys["10"]}: Rs{" "}
                          {result?.tech_deadweight}
                        </p>
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

export default DeadweightLossCalculator;

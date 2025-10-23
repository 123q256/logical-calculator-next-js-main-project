"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useUnitRateCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const UnitRateCalculator = () => {
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
    tech_a: "30",
    tech_b: "2.5",
    tech_c: "miles",
    tech_d: "hours",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useUnitRateCalculatorMutation();

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
        tech_a: formData.tech_a,
        tech_b: formData.tech_b,
        tech_c: formData.tech_c,
        tech_d: formData.tech_d,
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
      tech_a: "30",
      tech_b: "2.5",
      tech_c: "miles",
      tech_d: "hours",
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

  // Helper functions to simulate PHP's is_numeric and is_float
  const isNumeric = (val) => !isNaN(parseFloat(val)) && isFinite(val);
  const isFloat = (n) => Number(n) === n && n % 1 !== 0;

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
              <div className="col-span-12 flex items-center">
                <div className="px-2">
                  <p className="font-s-14 text-blue text-center py-2">
                    <strong>({data?.payload?.tech_lang_keys[1]})</strong>
                  </p>
                  <input
                    type="text"
                    step="any"
                    name="tech_a"
                    id="tech_a"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_a}
                    onChange={handleChange}
                  />
                  <hr />
                  <input
                    type="text"
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
                <div className="px-2">
                  <p className="font-s-14 text-blue text-center py-2">
                    <strong>({data?.payload?.tech_lang_keys[2]})</strong>
                  </p>
                  <input
                    type="text"
                    step="any"
                    name="tech_c"
                    id="tech_c"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_c}
                    onChange={handleChange}
                  />
                  <hr />
                  <input
                    type="text"
                    step="any"
                    name="tech_d"
                    id="tech_d"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_d}
                    onChange={handleChange}
                  />
                </div>
                <div className="px-2 font-s-20 mt-4 flex">
                  <p>
                    <strong>= ?</strong>
                  </p>
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

                  <div className="rounded-lg flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="w-full">
                        {/* Result Table */}
                        <div className="w-full md:w-[80%] lg:w-[60%] overflow-auto mt-2">
                          <table className="w-full text-[16px]">
                            <tbody>
                              <tr>
                                <td className="py-2 border-b w-[60%]">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["3"]}
                                  </strong>
                                </td>
                                <td className="py-2 border-b">
                                  {result?.tech_ans}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>

                        {/* Solution Details */}
                        <div className="w-full text-[16px] overflow-auto">
                          <p className="mt-3">
                            <strong>Solution</strong>
                          </p>

                          <p className="mt-3">
                            {data?.payload?.tech_lang_keys[4]}:
                          </p>
                          <p className="mt-3">
                            {result?.tech_ans} {formData?.tech_c} per{" "}
                            {formData?.tech_d}
                          </p>

                          <p className="mt-3">
                            {data?.payload?.tech_lang_keys[5]}:
                          </p>
                          <p className="mt-3">
                            {data?.payload?.tech_lang_keys[3]} = a/b
                          </p>
                          <p className="mt-3">
                            {data?.payload?.tech_lang_keys[3]} ={" "}
                            {formData?.tech_a}/{formData?.tech_b} ={" "}
                            {isNumeric(result?.tech_ans)
                              ? `${result?.tech_ans}/1`
                              : isFloat(result?.tech_ans)
                              ? `${formData?.tech_a}/${formData?.tech_b}`
                              : ""}
                          </p>

                          <p className="mt-3">
                            {data?.payload?.tech_lang_keys[6]}:
                          </p>
                          <p className="mt-3">
                            {data?.payload?.tech_lang_keys[3]} = a/b u1/u2
                          </p>
                          <p className="mt-3">
                            {data?.payload?.tech_lang_keys[3]} ={" "}
                            {formData?.tech_a}/{formData?.tech_b} ={" "}
                            {isNumeric(result?.tech_ans2)
                              ? `${result?.tech_ans2}/1 u1/u2`
                              : isFloat(result?.tech_ans2)
                              ? `${formData?.tech_a}/${formData?.tech_b} u1/u2`
                              : ""}
                          </p>

                          <p className="mt-3">
                            {data?.payload?.tech_lang_keys[3]} ={" "}
                            {result?.tech_ans} {formData?.tech_c} /{" "}
                            {formData?.tech_d}
                          </p>

                          <p className="mt-3">
                            {data?.payload?.tech_lang_keys[7]}:
                          </p>
                          <p className="mt-3">
                            {data?.payload?.tech_lang_keys[8]} = a:b
                          </p>
                          <p className="mt-3">
                            {data?.payload?.tech_lang_keys[8]} ={" "}
                            {formData?.tech_a}:{formData?.tech_b} ={" "}
                            {isNumeric(result?.tech_ans3)
                              ? `${result?.tech_ans3}:1`
                              : isFloat(result?.tech_ans3)
                              ? `${formData?.tech_a}:${formData?.tech_b}`
                              : ""}
                          </p>
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

export default UnitRateCalculator;

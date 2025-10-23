"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { InlineMath, BlockMath } from "react-katex";
import "katex/dist/katex.min.css";

import {
  useGetSingleCalculatorDetailsMutation,
  useInverseModuloCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const InverseModuloCalculator = () => {
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
    tech_opr: 2, // 1  2
    tech_a: 2,
    tech_b: 5,
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useInverseModuloCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_opr) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_opr: formData.tech_opr,
        tech_a: formData.tech_a,
        tech_b: formData.tech_b,
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
      tech_opr: 2, // 1  2
      tech_a: 2,
      tech_b: 5,
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
          <div className="lg:w-[50%] md:w-[80%] w-full mx-auto ">
            <div className="grid grid-cols-12 mt-3 gap-2 md:gap-4 lg:gap-4">
              <div className="col-span-12 text-center my-3 text-[18px]">
                {formData.tech_opr === "2" ? (
                  <BlockMath math={`a + x \\equiv 0 \\mod m`} />
                ) : (
                  <BlockMath math={`a \\cdot x \\equiv 1 \\mod m`} />
                )}
              </div>

              <div className="col-span-12">
                <label htmlFor="tech_opr" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_opr"
                    id="tech_opr"
                    value={formData.tech_opr}
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
              <div className="col-span-6">
                <label htmlFor="tech_a" className="label">
                  {data?.payload?.tech_lang_keys["4"]} a
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
              <div className="col-span-6">
                <label htmlFor="tech_b" className="label">
                  {data?.payload?.tech_lang_keys["5"]} m
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
              <div className=" w-full h-[30px] bg-gray-200 animate-pulse rounded-[10px] mb-4"></div>
              <div className="w-[75%] h-[20px] bg-gray-200 animate-pulse rounded-[10px] mb-3"></div>
              <div className="w-[50%] h-[20px] bg-gray-200 animate-pulse rounded-[10px] mb-3"></div>
              <div className="w-[25%] h-[20px] bg-gray-200 animate-pulse rounded-[10px]"></div>
            </div>
          </div>
        ) : (
          result && (
            <>
              <div className="w-full result mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="w-full overflow-auto">
                        {result?.tech_res === "no" ? (
                          <div className="w-full text-center">
                            <p>
                              <strong className="bg-sky px-3 py-2 text-[22px] rounded-lg text-blue">
                                {data?.payload?.tech_lang_keys["6"]}
                              </strong>
                            </p>
                          </div>
                        ) : (
                          <>
                            <div className="w-full md:w-[60%] lg:w-[60%] overflow-auto mt-2">
                              <table className="w-full text-[16px]">
                                <tbody>
                                  <tr>
                                    <td className="py-2 border-b w-[60%]">
                                      <strong>Inverse Modulo</strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {result?.tech_res}
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>

                            <div className="w-full text-[16px] overflow-auto mt-3 space-y-2">
                              <p>
                                <strong>
                                  {data?.payload?.tech_lang_keys[7]}
                                </strong>
                              </p>

                              {/* a * x = 1 mod b */}
                              <BlockMath
                                math={`${formData?.tech_a} ${
                                  formData?.tech_opr === 1 ? "\\cdot" : "+"
                                } x = 1 \\mod ${formData?.tech_b}`}
                              />

                              {/* x = res */}
                              <BlockMath math={`x = ${result?.tech_res}`} />

                              {/* a * res = a+res */}
                              <BlockMath
                                math={`${formData?.tech_a} ${
                                  formData?.tech_opr === 1 ? "\\cdot" : "+"
                                } ${result?.tech_res} = ${
                                  formData?.tech_a + result?.tech_res
                                }`}
                              />

                              {/* final mod check */}
                              <BlockMath
                                math={`${
                                  formData?.tech_a + result?.tech_res
                                } \\equiv 1 \\mod ${formData?.tech_b}`}
                              />
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

export default InverseModuloCalculator;

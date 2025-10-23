"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useBondOrderCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const BondOrderCalculator = () => {
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
    tech_calculationType: "1", // 1 2 3
    tech_firstInput: "10",
    tech_secondInput: "5",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateActivationCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useBondOrderCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.tech_calculationType ||
      !formData.tech_firstInput ||
      !formData.tech_secondInput
    ) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateActivationCalculator({
        tech_calculationType: formData.tech_calculationType,
        tech_firstInput: formData.tech_firstInput,
        tech_secondInput: formData.tech_secondInput,
      }).unwrap();
      setResult(response?.payload); // Assuming the response'
      toast.success("Successfully Calculated");
    } catch (err) {
      setFormError(err.data.payload.error);
      toast.error(err.data.payload.error);
    }
  };

  // Handle reset form
  const handleReset = () => {
    setFormData({
      tech_calculationType: "1", // 1 2 3
      tech_firstInput: "10",
      tech_secondInput: "5",
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
  {
    /* <span className="text-blue input_unit">{currency.symbol}</span> */
  }
  // currency code

  // majax
  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.5/MathJax.js?config=TeX-AMS_HTML";
    script.async = true;
    script.type = "text/javascript";
    script.onload = () => {
      window.MathJax &&
        window.MathJax.Hub.Queue(["Typeset", window.MathJax.Hub]);
    };
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [result]);
  // majax

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

          <div className="lg:w-[60%] md:w-[92%] w-full mx-auto ">
            <div className="grid grid-cols-12 gap-1  md:gap-2">
              <div className="col-span-12 md:col-span-6 relative">
                <label htmlFor="tech_calculationType" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_calculationType"
                    id="tech_calculationType"
                    value={formData.tech_calculationType}
                    onChange={handleChange}
                  >
                    <option value="1">
                      {data?.payload?.tech_lang_keys["3"]}
                    </option>
                    <option value="2">
                      {data?.payload?.tech_lang_keys["2"]}
                    </option>
                    <option value="3">
                      {data?.payload?.tech_lang_keys["1"]}
                    </option>
                  </select>
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 relative">
                {formData.tech_calculationType == "1" && (
                  <>
                    <label htmlFor="tech_firstInput" className="label">
                      {data?.payload?.tech_lang_keys["2"]}:
                    </label>
                  </>
                )}
                {formData.tech_calculationType == "2" && (
                  <>
                    <label htmlFor="tech_firstInput" className="label">
                      {data?.payload?.tech_lang_keys["3"]}:
                    </label>
                  </>
                )}
                {formData.tech_calculationType == "3" && (
                  <>
                    <label htmlFor="tech_firstInput" className="label">
                      {data?.payload?.tech_lang_keys["3"]}:
                    </label>
                  </>
                )}
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_firstInput"
                    id="tech_firstInput"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_firstInput}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 relative">
                {formData.tech_calculationType == "1" && (
                  <>
                    <label htmlFor="tech_secondInput" className="label">
                      {data?.payload?.tech_lang_keys["1"]}:
                    </label>
                  </>
                )}
                {formData.tech_calculationType == "2" && (
                  <>
                    <label htmlFor="tech_secondInput" className="label">
                      {data?.payload?.tech_lang_keys["1"]}:
                    </label>
                  </>
                )}
                {formData.tech_calculationType == "3" && (
                  <>
                    <label htmlFor="tech_secondInput" className="label">
                      {data?.payload?.tech_lang_keys["2"]}:
                    </label>
                  </>
                )}

                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_secondInput"
                    id="tech_secondInput"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_secondInput}
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
              <div className=" w-full h-[30px] bg-gray-300 animate-pulse rounded-[10px] mb-4"></div>
              <div className="w-[75%] h-[20px] bg-gray-300 animate-pulse rounded-[10px] mb-3"></div>
              <div className="w-[50%] h-[20px] bg-gray-300 animate-pulse rounded-[10px] mb-3"></div>
              <div className="w-[25%] h-[20px] bg-gray-300 animate-pulse rounded-[10px]"></div>
            </div>
          </div>
        ) : (
          result && (
            <>
              <div className="w-full  mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="w-full">
                        <div className="bg-sky bordered rounded-lg px-3 py-2">
                          <strong>
                            {formData.tech_calculationType === "1"
                              ? data?.payload?.tech_lang_keys[3]
                              : formData.tech_calculationType === "2"
                              ? data?.payload?.tech_lang_keys[2]
                              : data?.payload?.tech_lang_keys[1]}{" "}
                            =
                          </strong>
                          <strong className="text-[#119154] md:text-[25px] lg:text-[25px]">
                            {Number(result?.tech_calculatedAnswer).toFixed(2)}
                          </strong>
                        </div>

                        <div className="col-12">
                          <p className="mt-3">
                            <strong>{data?.payload?.tech_lang_keys[5]}</strong>
                          </p>

                          {formData.tech_calculationType === "1" && (
                            <>
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys[2]} ={" "}
                                {formData.tech_firstInput}
                              </p>
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys[1]} ={" "}
                                {formData.tech_secondInput}
                              </p>
                              <p className="mt-3">
                                <strong>
                                  {data?.payload?.tech_lang_keys[6]}
                                </strong>
                              </p>
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys[7]} = 1/2 * (Be -
                                Ae)
                              </p>
                              <p className="mt-2">
                                Bo = 0.5 * ({formData.tech_firstInput} -{" "}
                                {formData.tech_secondInput})
                              </p>
                              <p className="mt-2">
                                Bo = {result?.tech_calculatedAnswer}
                              </p>
                            </>
                          )}

                          {formData.tech_calculationType === "2" && (
                            <>
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys[3]} ={" "}
                                {formData.tech_firstInput}
                              </p>
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys[1]} ={" "}
                                {formData.tech_secondInput}
                              </p>
                              <p className="mt-3">
                                <strong>
                                  {data?.payload?.tech_lang_keys[6]}
                                </strong>
                              </p>
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys[7]} = (2 * Bo) +
                                Ae
                              </p>
                              <p className="mt-2">
                                Be = (2 * {formData.tech_firstInput}) +{" "}
                                {formData.tech_secondInput}
                              </p>
                              <p className="mt-2">
                                Be = {result?.tech_calculatedAnswer}
                              </p>
                            </>
                          )}

                          {formData.tech_calculationType !== "1" &&
                            formData.tech_calculationType !== "2" && (
                              <>
                                <p className="mt-2">
                                  {data?.payload?.tech_lang_keys[3]} ={" "}
                                  {formData.tech_firstInput}
                                </p>
                                <p className="mt-2">
                                  {data?.payload?.tech_lang_keys[2]} ={" "}
                                  {formData.tech_secondInput}
                                </p>
                                <p className="mt-3">
                                  <strong>
                                    {data?.payload?.tech_lang_keys[6]}
                                  </strong>
                                </p>
                                <p className="mt-2">
                                  {data?.payload?.tech_lang_keys[7]} = -1 * ((Bo
                                  * 2) - Be)
                                </p>
                                <p className="mt-2">
                                  Ae = -1 * (({formData.tech_firstInput} * 2) -{" "}
                                  {formData.tech_secondInput})
                                </p>
                                <p className="mt-2">
                                  Ae = {result?.tech_calculatedAnswer}
                                </p>
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

export default BondOrderCalculator;

"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { BlockMath } from "react-katex";
import "katex/dist/katex.min.css";

import {
  useGetSingleCalculatorDetailsMutation,
  useMixedNumbersToImproperFractionsMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const MixedNumbersToImproperFractionsCalculator = () => {
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
    tech_whole: 3,
    tech_uper: 2,
    tech_btm: 5,
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useMixedNumbersToImproperFractionsMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_whole || !formData.tech_uper || !formData.tech_btm) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_whole: formData.tech_whole,
        tech_uper: formData.tech_uper,
        tech_btm: formData.tech_btm,
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
      tech_whole: 3,
      tech_uper: 2,
      tech_btm: 5,
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
          <div className="lg:w-[40%] md:w-[40%] w-full mx-auto ">
            <div className="grid grid-cols-12  mt-3   gap-2 md:gap-4 lg:gap-4">
              <div className="col-span-12  flex items-center">
                <div className="pe-2">
                  <input
                    type="number"
                    step="any"
                    name="tech_whole"
                    id="tech_whole"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_whole}
                    onChange={handleChange}
                  />
                </div>
                <div className="ps-2">
                  <input
                    type="number"
                    step="any"
                    name="tech_uper"
                    id="tech_uper"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_uper}
                    onChange={handleChange}
                  />
                  <hr />
                  <input
                    type="number"
                    step="any"
                    name="tech_btm"
                    id="tech_btm"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_btm}
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
              <div className="w-full mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="w-full text-[16px] overflow-auto">
                        {/* Fraction */}
                        <div className="mt-3 text-[18px]">
                          <BlockMath
                            math={`\\dfrac{${result?.tech_plus}}{${formData?.tech_btm}}`}
                          />
                        </div>

                        {/* Language Key 2 */}
                        <p className="mt-3">
                          {data?.payload?.tech_lang_keys["2"]}:
                        </p>

                        {/* Language Key 3 */}
                        <p className="mt-3">
                          {data?.payload?.tech_lang_keys["3"]}
                        </p>

                        {/* Whole number conversion step 1 */}
                        <div className="mt-3">
                          <BlockMath
                            math={`${formData?.tech_whole} = \\dfrac{(${formData?.tech_whole}) \\times (${formData?.tech_btm})}{${formData?.tech_btm}}`}
                          />
                        </div>

                        {/* Whole number conversion step 2 */}
                        <div className="mt-3">
                          <BlockMath
                            math={`${formData?.tech_whole} = \\dfrac{${result?.tech_multi}}{${formData?.tech_btm}}`}
                          />
                        </div>

                        {/* Language Key 4 */}
                        <p className="mt-3">
                          {data?.payload?.tech_lang_keys["4"]}.
                        </p>

                        {/* Addition step */}
                        <div className="mt-3">
                          <BlockMath
                            math={`= \\dfrac{(${result?.tech_multi}) + (${formData?.tech_uper})}{${formData?.tech_btm}}`}
                          />
                        </div>

                        {/* Final answer */}
                        <div className="mt-3">
                          <BlockMath
                            math={`= \\dfrac{${result?.tech_plus}}{${formData?.tech_btm}}`}
                          />
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

export default MixedNumbersToImproperFractionsCalculator;

"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useCatAgeCalculationMutation,
  useGetSingleCalculatorDetailsMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const CatAgeCalculator = () => {
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
    tech_Year: "4",
    tech_Month: "5",
    tech_Method: "2",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    CatAgeCalculator,
    { isLoading: calculateDogLoading, isError, error: calculateLoveError },
  ] = useCatAgeCalculationMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_Year || !formData.tech_Month || !formData.tech_Method) {
      setFormError("Please fill in field");
      return;
    }
    setFormError("");
    try {
      const response = await CatAgeCalculator({
        tech_Year: Number(formData.tech_Year),
        tech_Month: Number(formData.tech_Month),
        tech_Method: Number(formData.tech_Method),
      }).unwrap();
      setResult(response?.payload); // Assuming the response has 'lovePercentage'
      toast.success("Calculate Successfully");
    } catch (err) {
      setFormError("Error calculating.");
      toast.error("Error calculating.");
    }
  };

  // Handle reset form
  const handleReset = () => {
    setFormData({
      tech_Year: "4",
      tech_Month: "5",
      tech_Method: "2",
    });
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

          <div className="lg:w-[60%] md:w-[60%] w-full mx-auto ">
            <div className="grid grid-cols-2  lg:grid-cols-2 md:grid-cols-2  gap-4">
              <div className="space-y-2 relative">
                <label htmlFor="tech_Method" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
                </label>
                <div className=" ">
                  <select
                    className="input mt-2"
                    aria-label="select"
                    name="tech_Method"
                    id="tech_Method"
                    value={formData.tech_Method}
                    onChange={handleChange}
                  >
                    <option value="1">
                      {data?.payload?.tech_lang_keys["2"]}
                    </option>
                    <option value="2">
                      {data?.payload?.tech_lang_keys["3"]} (%)
                    </option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="tech_Year" className="label">
                  {formData.tech_Method === "1"
                    ? data?.payload?.tech_lang_keys[5]
                    : data?.payload?.tech_lang_keys[4]}
                  ({data?.payload?.tech_lang_keys["6"]})
                </label>
                <input
                  type="number"
                  name="tech_Year"
                  id="tech_Year"
                  className="input my-2"
                  aria-label="input"
                  value={formData.tech_Year}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="tech_Month" className="label">
                  ({data?.payload?.tech_lang_keys["7"]})
                </label>
                <input
                  type="number"
                  name="tech_Month"
                  id="tech_Month"
                  className="input my-2"
                  aria-label="input"
                  value={formData.tech_Month}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-3 mb-6 mt-10">
            <Button type="submit" isLoading={calculateDogLoading}>
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
        {calculateDogLoading ? (
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
                    <div className="w-full bg-light-blue result p-3 rounded-lg mt-3">
                      <div className="flex justify-center">
                        <div className="w-full lg:w-auto text-center text-lg">
                          <p>
                            {formData.tech_Method === "1"
                              ? data?.payload?.tech_lang_keys[8]
                              : data?.payload?.tech_lang_keys[9]}
                          </p>

                          <p className="bg-[#2845F5] text-white inline-block rounded-lg px-3 py-2 my-3">
                            <strong className="text-blue lg:text-4xl md:text-4xl">
                              {result?.tech_ans}{" "}
                              {data?.payload?.tech_lang_keys["6"]}
                            </strong>
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

export default CatAgeCalculator;

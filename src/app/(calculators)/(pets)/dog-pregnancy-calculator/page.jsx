"use client";

import React, { useEffect, useState } from "react";
import { FormWrap } from "../../../../components/Calculator";
import { usePathname } from "next/navigation";

import {
  useDogPregnancyCalculationMutation,
  useGetSingleCalculatorDetailsMutation,
} from "../../../../redux/services/calculator/calculatorApi";
import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import Button from "../../../../components/Calculator/Button";
import ResetButton from "../../../../components/Calculator/ResetButton";

const DogPregnancyCalculator = () => {
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
    tech_e_date: "",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook

  const [
    DogPregnancyCalculator,
    { isLoading: calculateDogLoading, isError, error: calculateLoveError },
  ] = useDogPregnancyCalculationMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_e_date) {
      setFormError("Please fill in field");
      return;
    }
    setFormError("");
    try {
      const response = await DogPregnancyCalculator({
        tech_e_date: formData.tech_e_date,
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
      tech_e_date: "",
    });
    setResult(null);
    setFormError(null);
  };

  const [dropdownVisible, setDropdownVisible] = useState(false);
  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };
  const setUnitHandler = (newUnit) => {
    setFormData((prev) => ({
      ...prev,
      weight_unit: newUnit,
    }));

    setDropdownVisible(false);
  };

  // Set current date on mount
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0]; // Format: YYYY-MM-DD
    setFormData((prev) => ({ ...prev, tech_e_date: today }));
  }, []);

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

          <div className="lg:w-[40%] md:w-[40%] mx-auto">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <label htmlFor="you" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
                </label>
                <input
                  type="date"
                  name="tech_e_date"
                  id="tech_e_date"
                  className="input my-2"
                  aria-label="input"
                  placeholder={data?.payload?.tech_lang_keys["1"]}
                  value={formData.tech_e_date}
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

                  <div className="rounded-lg  flex items-center justify-center">
                    <div className="w-full  p-1 rounded-lg mt-6">
                      <div className="w-full text-center mt-4">
                        <p className="text-lg font-bold">
                          {data?.payload?.tech_lang_keys[2]}
                        </p>
                        <p className="lg:text-3xl md:text-3xl text-md my-3 bg-[#2845F5] text-white rounded-lg px-4 py-2 font-bold">
                          {result?.tech_date}
                        </p>
                        <p className="text-blue-500 text-2xl pt-1">
                          {data?.payload?.tech_lang_keys[3]}
                        </p>

                        <div className="lg:w-3/4 bg-sky text-black bordered rounded-lg p-4 mt-4 mx-auto">
                          <p className="font-bold">{result?.tech_line}</p>
                          <p className="lg:text-[16px] md:text-[16px] text-[14px]">
                            {data?.payload?.tech_lang_keys[4]}
                          </p>
                        </div>

                        <div className="lg:w-3/4 bg-sky text-black bordered rounded-lg p-4 mt-4 mx-auto">
                          <p className="font-bold">{result?.tech_line0}</p>
                          <p className="lg:text-[16px] md:text-[16px] text-[14px]">
                            {data?.payload?.tech_lang_keys[5]}
                          </p>
                        </div>

                        <div className="lg:w-3/4 bg-sky text-black bordered rounded-lg p-4 mt-4 mx-auto">
                          <p className="font-bold">{result?.tech_line1}</p>
                          <p className="lg:text-[16px] md:text-[16px] text-[14px]">
                            {data?.payload?.tech_lang_keys[6]}
                          </p>
                        </div>

                        <div className="lg:w-3/4 bg-sky text-black bordered rounded-lg p-4 mt-4 mx-auto">
                          <p className="font-bold">{result?.tech_line2}</p>
                          <p className="lg:text-[16px] md:text-[16px] text-[14px]">
                            {data?.payload?.tech_lang_keys[7]}
                          </p>
                        </div>

                        <div className="lg:w-3/4 bg-sky text-black bordered rounded-lg p-4 mt-4 mx-auto">
                          <p className="font-bold">{result?.tech_line3}</p>
                          <p className="lg:text-[16px] md:text-[16px] text-[14px]">
                            {data?.payload?.tech_lang_keys[8]}
                          </p>
                        </div>

                        <div className="lg:w-3/4 bg-sky text-black bordered rounded-lg p-4 mt-4 mx-auto">
                          <p className="font-bold">{result?.tech_line4}</p>
                          <p className="lg:text-[16px] md:text-[16px] text-[14px]">
                            {data?.payload?.tech_lang_keys[9]}
                          </p>
                        </div>

                        <div className="lg:w-3/4 bg-sky text-black bordered rounded-lg p-4 mt-4 mx-auto">
                          <p className="font-bold">{result?.tech_line5}</p>
                          <p className="lg:text-[16px] md:text-[16px] text-[14px]">
                            {data?.payload?.tech_lang_keys[10]}
                          </p>
                        </div>

                        <div className="lg:w-3/4 bg-sky text-black bordered rounded-lg p-4 mt-4 mx-auto">
                          <p className="font-bold">{result?.tech_line6}</p>
                          <p className="lg:text-[16px] md:text-[16px] text-[14px]">
                            {data?.payload?.tech_lang_keys[11]}
                          </p>
                        </div>

                        <div className="lg:w-3/4 bg-sky text-black bordered rounded-lg p-4 mt-4 mx-auto">
                          <p className="font-bold">{result?.tech_line7}</p>
                          <p className="lg:text-[16px] md:text-[16px] text-[14px]">
                            {data?.payload?.tech_lang_keys[12]}
                          </p>
                        </div>

                        <div className="lg:w-3/4 bg-sky text-black bordered rounded-lg p-4 mt-4 mx-auto">
                          <p className="font-bold">
                            {data?.payload?.tech_lang_keys[13]}
                          </p>
                          <p className="lg:text-[16px] md:text-[16px] text-[14px]">
                            {data?.payload?.tech_lang_keys[14]}
                          </p>
                        </div>

                        <div className="lg:w-3/4 bg-sky text-black bordered rounded-lg p-4 mt-4 mx-auto">
                          <p className="font-bold">{result?.tech_line_l}</p>
                          <p className="lg:text-[16px] md:text-[16px] text-[14px]">
                            {data?.payload?.tech_lang_keys[15]}
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

export default DogPregnancyCalculator;

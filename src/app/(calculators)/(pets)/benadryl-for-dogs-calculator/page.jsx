"use client";

import React, { useEffect, useState } from "react";
import { FormWrap } from "../../../../components/Calculator";
import { usePathname } from "next/navigation";

import {
  useBenadrylForDogsCalculationMutation,
  useGetSingleCalculatorDetailsMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import Button from "../../../../components/Calculator/Button";
import ResetButton from "../../../../components/Calculator/ResetButton";

const BenadrylforDogsCalculator = () => {
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
    dog_weight: "25",
    weight_unit: "g",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    BenadrylforDogsCalculator,
    { isLoading: calculatebenadrylLoading, isError, error: calculateLoveError },
  ] = useBenadrylForDogsCalculationMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.dog_weight) {
      setFormError("Please fill in field");
      return;
    }
    setFormError("");
    try {
      const response = await BenadrylforDogsCalculator({
        dog_weight: formData.dog_weight,
        weight_unit: formData.weight_unit,
      }).unwrap();
      setResult(response?.payload); // Assuming the response has 'lovePercentage'
      toast.success("Calculate Successfully");
    } catch (err) {
      setFormError("Error calculating");
      toast.error("Error calculating");
    }
  };

  // Handle reset form
  const handleReset = () => {
    setFormData({
      weight_unit: "g",
      dog_weight: "25",
    });
    setResult(null);
    setFormError(null);
  };

  //dropdown states
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const setUnitHandler = (unit) => {
    setFormData((prev) => ({ ...prev, weight_unit: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
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

          <div className="lg:w-[40%] md:w-[40%] w-full mx-auto">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2 ">
                <label htmlFor="dog_weight" className="label">
                  {data?.payload?.tech_lang_keys["1"]}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="dog_weight"
                    step="any"
                    className="border border-gray-300 p-2 rounded-lg focus:ring-2 w-full  mt-1"
                    value={formData.dog_weight}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-5"
                    onClick={toggleDropdown}
                  >
                    {formData.weight_unit} ▾
                  </label>
                  {dropdownVisible && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "grams (g)", value: "g" },
                        { label: "decagrams (dag)", value: "dag" },
                        { label: "kilograms (kg)", value: "kg" },
                        { label: "ounces (oz)", value: "oz" },
                        { label: "pounds (lbs)", value: "lbs" },
                        { label: "stone", value: "stone" },
                      ].map((unit, index) => (
                        <p
                          key={index}
                          className="p-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => setUnitHandler(unit.value)}
                        >
                          {unit.label}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-3 mb-6 mt-10">
            <Button type="submit" isLoading={calculatebenadrylLoading}>
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
        {calculatebenadrylLoading ? (
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
              <div className="w-full mx-auto p-4 lg:p-8 md:p-8 result_calculator  rounded-lg space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />
                  <div className="rounded-lg flex items-center justify-center">
                    <div className="w-full bg-light-blue p-1 md:p-3 rounded-lg mt-3">
                      <div className="w-full md:w-[90%] mx-auto">
                        {/* First Row */}
                        <div className="bordered bg-sky text-black rounded-lg p-3 text-[12px] md:text-[14px]">
                          <strong>
                            {data?.payload?.tech_lang_keys["2"]} (mg) =
                          </strong>
                          <span className="text-green-500 font-bold">
                            {" "}
                            {Math.round(result?.benadrylDosage * 100) /
                              100}{" "}
                            (mg)
                          </span>
                        </div>

                        {/* Second Row */}
                        <div className="bordered bg-sky text-black rounded-lg p-3 text-[12px] md:text-[14px] mt-4">
                          <strong>
                            {data?.payload?.tech_lang_keys["3"]} (12.5 mg / 5
                            mL) =
                          </strong>
                          <span className="text-green-500 font-bold">
                            {" "}
                            {Math.round(result?.liquidDosage * 100) / 100} (ml)
                          </span>
                        </div>

                        {/* Table */}
                        <div className="w-full overflow-auto mt-4">
                          <table className="w-[90%] mx-auto border-collapse lg:text-[16px] md:text-[16px] text-[14px]">
                            <tbody>
                              <tr>
                                <td className="border-b py-2">
                                  <p>
                                    {data?.payload?.tech_lang_keys["4"]}{" "}
                                    <strong>
                                      25 <span>(mg)</span>{" "}
                                      {data?.payload?.tech_lang_keys["7"]}
                                    </strong>
                                  </p>
                                </td>
                                <td className="border-b text-right">
                                  <p>
                                    {Math.floor(result?.benadrylDosage / 25)}
                                  </p>
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  <p>
                                    {data?.payload?.tech_lang_keys["4"]}{" "}
                                    <strong>
                                      12.5 <span>(mg)</span>{" "}
                                      {data?.payload?.tech_lang_keys["5"]}
                                    </strong>
                                  </p>
                                </td>
                                <td className="border-b text-right">
                                  <p className="lg:text-[16px] md:text-[16px] text-[14px]">
                                    {Math.floor(result?.benadrylDosage / 12.5)}
                                  </p>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>

                        {/* Time Info */}
                        <div className="mt-4 text-[14px] md:text-[14px] mx-3 md:mx-0">
                          <p>
                            <strong>
                              🕒 {data?.payload?.tech_lang_keys["6"]}.
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

export default BenadrylforDogsCalculator;

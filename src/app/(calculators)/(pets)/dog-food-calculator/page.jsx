"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { toast } from "react-toastify";
import {
  useDogFoodCalculationMutation,
  useGetSingleCalculatorDetailsMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const DogFoodCalculator = () => {
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
    tech_type_unit: "Working dog - moderate work",
    tech_weight: "56",
    tech_weight_unit: "kg",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    DogFoodCalculator,
    { isLoading: calculateDogLoading, isError, error: calculateLoveError },
  ] = useDogFoodCalculationMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
  };

  // handle form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.tech_type_unit ||
      !formData.tech_weight ||
      !formData.tech_weight_unit
    ) {
      setFormError("Please fill in field");
      return;
    }
    setFormError("");
    try {
      const response = await DogFoodCalculator({
        tech_type_unit: formData.tech_type_unit,
        tech_weight: formData.tech_weight,
        tech_weight_unit: formData.tech_weight_unit,
      }).unwrap();
      setResult(response?.payload?.payload); // Assuming the response has 'lovePercentage'
      toast.success("Calculate Successfully");
    } catch (err) {
      setFormError("Error calculating");
      toast.error("Error calculating");
    }
  };

  // Handle reset form
  const handleReset = () => {
    setFormData({
      tech_type_unit: "Working dog - moderate work",
      tech_weight: "56",
      tech_weight_unit: "kg",
    });
    setResult(null);
    setFormError(null);
  };

  //dropdown states
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const setUnitHandler = (unit) => {
    setFormData((prev) => ({ ...prev, tech_weight_unit: unit }));
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

          <div className="lg:w-[40%] md:w-[40%] w-full mx-auto ">
            <div className="grid grid-cols-1  gap-4">
              <div className="space-y-2">
                <label htmlFor="tech_type_unit" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
                </label>
                <div className="">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_type_unit"
                    id="tech_type_unit"
                    value={formData.tech_type_unit}
                    onChange={handleChange}
                  >
                    <option value={data?.payload?.tech_lang_keys["4"]}>
                      {data?.payload?.tech_lang_keys["4"]}
                    </option>
                    <option value={data?.payload?.tech_lang_keys["5"]}>
                      {data?.payload?.tech_lang_keys["5"]}
                    </option>
                    <option value={data?.payload?.tech_lang_keys["6"]}>
                      {data?.payload?.tech_lang_keys["6"]}
                    </option>
                    <option value={data?.payload?.tech_lang_keys["7"]}>
                      {data?.payload?.tech_lang_keys["7"]}
                    </option>
                    <option value={data?.payload?.tech_lang_keys["8"]}>
                      {data?.payload?.tech_lang_keys["8"]}
                    </option>
                    <option value={data?.payload?.tech_lang_keys["9"]}>
                      {data?.payload?.tech_lang_keys["9"]}
                    </option>
                    <option value={data?.payload?.tech_lang_keys["10"]}>
                      {data?.payload?.tech_lang_keys["10"]}
                    </option>
                    <option value={data?.payload?.tech_lang_keys["11"]}>
                      {data?.payload?.tech_lang_keys["11"]}
                    </option>
                    <option value={data?.payload?.tech_lang_keys["12"]}>
                      {data?.payload?.tech_lang_keys["12"]}
                    </option>
                    <option value={data?.payload?.tech_lang_keys["13"]}>
                      {data?.payload?.tech_lang_keys["13"]}
                    </option>
                    <option value={data?.payload?.tech_lang_keys["14"]}>
                      {data?.payload?.tech_lang_keys["14"]}
                    </option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="tech_weight" className="label" id="textChanged">
                  {data?.payload?.tech_lang_keys["2"]}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_weight"
                    step="any"
                    className="border border-gray-300 p-2 rounded-lg focus:ring-2 w-full  mt-1"
                    value={formData.tech_weight}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-5"
                    onClick={toggleDropdown}
                  >
                    {formData.tech_weight_unit} ▾
                  </label>
                  {dropdownVisible && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "g", value: "g" },
                        { label: "dag", value: "dag" },
                        { label: "kg", value: "kg" },
                        { label: "lb", value: "lb" },
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
              <div className="w-full result mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg flex items-center justify-center">
                    <div className="w-full bg-light-blue rounded-lg p-4 mt-6">
                      <div className="my-4">
                        <div className="text-center">
                          <p className="text-lg font-bold">
                            {data?.payload?.tech_lang_keys["3"]}
                          </p>
                          <p className="text-4xl bg-[#2845F5] text-white px-4 py-2 rounded-lg inline-block my-4">
                            <strong>
                              {Math.round(result?.tech_answer)}
                              <span className="text-lg"> Cal</span>
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

export default DogFoodCalculator;

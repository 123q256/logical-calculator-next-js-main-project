"use client";

import React, { useEffect, useState } from "react";
import { FormWrap } from "../../../../components/Calculator";
import { usePathname } from "next/navigation";
import {
  useCatCalorieCalculationMutation,
  useGetSingleCalculatorDetailsMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const CatCalorieCalculator = () => {
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

  const [getSingleCalculatorDetails, { data, isLoading }] =
    useGetSingleCalculatorDetailsMutation();

  const [calculateCalories, { isLoading: isCalculating }] =
    useCatCalorieCalculationMutation();

  const [formData, setFormData] = useState({
    tech_cat_weight: "15",
    tech_unit: "kg",
    tech_cat_condition: "Neutered adult",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const unitOptions = ["kg", "oz", "lbs"];
  const conditionOptions = [
    "Neutered adult",
    "Non-neutered adult",
    "Weight loss",
    "Weight gain",
    "0-4 months old kitten",
    "4 months to adult cat",
  ];

  useEffect(() => {
    handleFetchDetails();
  }, [url]);

  const handleFetchDetails = async () => {
    try {
      await getSingleCalculatorDetails({ tech_calculator_link: url });
    } catch (err) {
      console.error("Error fetching calculator details:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setResult(null);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const setUnitHandler = (unit) => {
    setFormData((prev) => ({ ...prev, tech_unit: unit }));
    setDropdownVisible(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { tech_cat_weight, tech_unit, tech_cat_condition } = formData;

    if (!tech_cat_weight || !tech_unit || !tech_cat_condition) {
      setFormError("Please fill in all fields.");
      return;
    }

    setFormError("");

    try {
      const response = await calculateCalories({
        ...formData,
      }).unwrap();

      setResult(response?.payload);
      toast.success("Calculated successfully!");
    } catch (err) {
      console.error(err);
      setFormError("Something went wrong.");
      toast.error("Error calculating.");
    }
  };

  const handleReset = () => {
    setFormData({
      tech_cat_weight: "15",
      tech_unit: "kg",
      tech_cat_condition: "Neutered adult",
    });
    setResult(null);
    setFormError("");
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
          path: pathname,
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

          <div className="lg:w-[40%] md:w-[40%] w-full mx-auto">
            <div className="grid grid-cols-1 gap-4">
              {/* Weight Input + Unit */}
              <div className="space-y-2">
                <label className="label" htmlFor="tech_cat_weight">
                  {data?.payload?.tech_lang_keys["1"]}:
                </label>
                <div className="relative w-full">
                  <input
                    type="number"
                    name="tech_cat_weight"
                    step="any"
                    className="border border-gray-300 p-2 rounded-lg focus:ring-2 w-full"
                    value={formData.tech_cat_weight}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown}
                  >
                    {formData.tech_unit} ▾
                  </label>
                  {dropdownVisible && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {unitOptions.map((unit, index) => (
                        <p
                          key={index}
                          className="p-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => setUnitHandler(unit)}
                        >
                          {unit === "kg"
                            ? "kilograms (kg)"
                            : unit === "oz"
                            ? "ounces (oz)"
                            : "pounds (lbs)"}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              {/* Condition Select */}
              <div className="space-y-2">
                <label
                  htmlFor="tech_cat_condition"
                  className="label"
                  dangerouslySetInnerHTML={{
                    __html: data?.payload?.tech_lang_keys["2"],
                  }}
                />
                <select
                  name="tech_cat_condition"
                  className="input border border-gray-300 p-2 rounded-lg focus:ring-2 w-full"
                  value={formData.tech_cat_condition}
                  onChange={handleChange}
                >
                  <option value="">-- Select condition --</option>
                  {conditionOptions.map((option, index) => (
                    <option value={option} key={index}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-center gap-3 mb-6 mt-10">
            <Button type="submit" isLoading={isCalculating}>
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
      </form>

      {/* Result Section */}
      {isCalculating ? (
        <div className="w-full mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg  space-y-6 result">
          <div className="animate-pulse">
            <div className="w-full h-[30px] bg-gray-300 rounded-[10px] mb-4"></div>
            <div className="w-[75%] h-[20px] bg-gray-300 rounded-[10px] mb-3"></div>
            <div className="w-[50%] h-[20px] bg-gray-300 rounded-[10px] mb-3"></div>
          </div>
        </div>
      ) : (
        result && (
          <>
            <div className="w-full mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg space-y-6 result">
              <div>
                <ResultActions lang={data?.payload?.tech_lang_keys} />

                <div className="rounded-lg flex items-center justify-center">
                  <div className="w-full bg-light-blue rounded-lg p-4 mt-6">
                    <div className="w-full">
                      <div className="flex flex-col md:flex-row md:justify-between md:w-[60%] mx-auto">
                        {/* Resting Energy */}
                        <div className="text-center md:text-left">
                          <p>
                            <strong>
                              {data?.payload?.tech_lang_keys?.["3"]}
                            </strong>
                          </p>
                          <p>
                            <strong className="text-[#119154] text-[32px]">
                              {result?.tech_resting_energy?.toFixed(2)}
                            </strong>
                            <span className="text-lg"> kcal</span>
                          </p>
                        </div>

                        {/* Divider */}
                        <div className="hidden md:block border-r mx-4" />

                        {/* Maintenance Energy */}
                        <div className="text-center md:text-left">
                          <p>
                            <strong>
                              {data?.payload?.tech_lang_keys?.["4"]}
                            </strong>
                          </p>
                          <p>
                            <strong className="text-[#119154] text-[32px]">
                              {result?.tech_maintenance_energy?.toFixed(2)}
                            </strong>
                            <span className="text-lg"> kcal</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )
      )}
      {result && (
        <CalculatorFeedback calName={data?.payload?.tech_calculator_title} />
      )}
    </Calculator>
  );
};

export default CatCalorieCalculator;

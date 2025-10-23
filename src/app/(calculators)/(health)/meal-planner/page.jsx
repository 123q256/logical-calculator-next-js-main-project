"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useMealPlannerMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const MealPlanner = () => {
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
      await getSingleCalculatorDetails({ tech_calculator_link: url });
    } catch (err) {
      console.error("Error fetching calculator details:", err);
    }
  };

  useEffect(() => {
    handleFetchDetails();
  }, [url]);

  // Meal Planner Form Data
  const [formData, setFormData] = useState({
    age: "",
    gender: "male",
    weight: "",
    height: "",
    activity_level: "moderate",
    goal: "maintain",
    dietary_preference: "general",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateMealPlanner,
    { isLoading: mealPlannerLoading, isError, error: calculateMealError },
  ] = useMealPlannerMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Calculate BMR (Basal Metabolic Rate)
  const calculateBMR = () => {
    const { age, gender, weight, height } = formData;
    if (!age || !weight || !height) return 0;

    // Mifflin-St Jeor Equation
    if (gender === "male") {
      return (
        10 * parseFloat(weight) +
        6.25 * parseFloat(height) -
        5 * parseFloat(age) +
        5
      );
    } else {
      return (
        10 * parseFloat(weight) +
        6.25 * parseFloat(height) -
        5 * parseFloat(age) -
        161
      );
    }
  };

  // Calculate TDEE (Total Daily Energy Expenditure)
  const calculateTDEE = () => {
    const bmr = calculateBMR();
    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      extreme: 1.9,
    };
    return bmr * activityMultipliers[formData.activity_level];
  };

  // Calculate target calories based on goal
  const calculateTargetCalories = () => {
    const tdee = calculateTDEE();
    const goalAdjustments = {
      lose: -500,
      maintain: 0,
      gain: 500,
    };
    return tdee + goalAdjustments[formData.goal];
  };

  // Calculate macronutrients
  const calculateMacros = (calories) => {
    return {
      protein: Math.round((calories * 0.25) / 4), // 25% of calories, 4 cal/gram
      carbs: Math.round((calories * 0.45) / 4), // 45% of calories, 4 cal/gram
      fat: Math.round((calories * 0.3) / 9), // 30% of calories, 9 cal/gram
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.age || !formData.weight || !formData.height) {
      setFormError("Please fill in all required fields (age, weight, height).");
      return;
    }

    if (parseFloat(formData.age) < 1 || parseFloat(formData.age) > 120) {
      setFormError("Please enter a valid age between 1 and 120.");
      return;
    }

    if (parseFloat(formData.weight) < 1 || parseFloat(formData.weight) > 500) {
      setFormError("Please enter a valid weight between 1 and 500 kg.");
      return;
    }

    if (parseFloat(formData.height) < 50 || parseFloat(formData.height) > 250) {
      setFormError("Please enter a valid height between 50 and 250 cm.");
      return;
    }

    setFormError("");

    try {
      const bmr = calculateBMR();
      const tdee = calculateTDEE();
      const targetCalories = calculateTargetCalories();
      const macros = calculateMacros(targetCalories);

      // Generate meal suggestions based on calculations
      const mealPlan = {
        breakfast: {
          calories: Math.round(targetCalories * 0.25),
          suggestions: [
            "Oatmeal with fruits",
            "Eggs with toast",
            "Smoothie bowl",
          ],
        },
        lunch: {
          calories: Math.round(targetCalories * 0.35),
          suggestions: [
            "Chicken rice bowl",
            "Dal rice",
            "Grilled fish with quinoa",
          ],
        },
        dinner: {
          calories: Math.round(targetCalories * 0.3),
          suggestions: [
            "Grilled chicken salad",
            "Fish curry",
            "Vegetable stir-fry",
          ],
        },
        snacks: {
          calories: Math.round(targetCalories * 0.1),
          suggestions: ["Mixed nuts", "Greek yogurt", "Fruit"],
        },
      };

      const calculatedResult = {
        bmr: Math.round(bmr),
        tdee: Math.round(tdee),
        targetCalories: Math.round(targetCalories),
        macros,
        mealPlan,
        userInfo: formData,
      };

      // You can call your API here if needed
      // const response = await calculateMealPlanner(formData).unwrap();

      setResult(calculatedResult);
      toast.success("Meal plan calculated successfully!");
    } catch (err) {
      setFormError("Error in calculating meal plan.");
      toast.error("Error in calculating meal plan.");
    }
  };

  // Handle reset form
  const handleReset = () => {
    setFormData({
      age: "",
      gender: "male",
      weight: "",
      height: "",
      activity_level: "moderate",
      goal: "maintain",
      dietary_preference: "general",
    });
    setResult(null);
    setFormError("");
  };

  // Currency code
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

          {/* Personal Information Section */}
          <div className="grid grid-cols-12 gap-4">
            <h3 className="col-span-12 text-xl font-semibold text-gray-800 border-b pb-2">
              Personal Information
            </h3>
            {/* Age Input */}
            <div className="col-span-6">
              <label className="text-sm font-medium text-gray-700 mb-2">
                Age (years) *
              </label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                className="input my-2"
                placeholder="Enter your age"
                min="1"
                max="120"
              />
            </div>

            {/* Gender Selection */}
            <div className="col-span-6">
              <label className="text-sm font-medium text-gray-700 mb-2">
                Gender *
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="input my-2"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>

            {/* Weight Input */}
            <div className="col-span-6">
              <label className="text-sm font-medium text-gray-700 mb-2">
                Weight (kg) *
              </label>
              <input
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                className="input my-2"
                placeholder="Enter your weight"
                min="1"
                max="500"
                step="0.1"
              />
            </div>

            {/* Height Input */}
            <div className="col-span-6">
              <label className="text-sm font-medium text-gray-700 mb-2">
                Height (cm) *
              </label>
              <input
                type="number"
                name="height"
                value={formData.height}
                onChange={handleChange}
                className="input my-2"
                placeholder="Enter your height"
                min="50"
                max="250"
                step="0.1"
              />
            </div>
          </div>

          {/* Activity & Goals Section */}
          <div className="grid grid-cols-12 gap-4">
            <h3 className="col-span-12 text-xl font-semibold text-gray-800 border-b pb-2">
              Activity & Goals
            </h3>

            {/* Activity Level */}
            <div className="col-span-6">
              <label className="text-sm font-medium text-gray-700 mb-2">
                Activity Level *
              </label>
              <select
                name="activity_level"
                value={formData.activity_level}
                onChange={handleChange}
                className="input my-2"
              >
                <option value="sedentary">
                  Sedentary (Little/No Exercise)
                </option>
                <option value="light">Light (1-3 days/week)</option>
                <option value="moderate">Moderate (3-5 days/week)</option>
                <option value="active">Very Active (6-7 days/week)</option>
                <option value="extreme">Extremely Active (2x/day)</option>
              </select>
            </div>

            {/* Goal Selection */}
            <div className="col-span-6">
              <label className="text-sm font-medium text-gray-700 mb-2">
                Goal *
              </label>
              <select
                name="goal"
                value={formData.goal}
                onChange={handleChange}
                className="input my-2"
              >
                <option value="lose">Weight Loss (-0.5 kg/week)</option>
                <option value="maintain">Maintain Weight</option>
                <option value="gain">Weight Gain (+0.5 kg/week)</option>
              </select>
            </div>

            {/* Dietary Preference */}
            <div className="col-span-6">
              <label className="text-sm font-medium text-gray-700 mb-2">
                Dietary Preference
              </label>
              <select
                name="dietary_preference"
                value={formData.dietary_preference}
                onChange={handleChange}
                className="input my-2"
              >
                <option value="general">General</option>
                <option value="vegetarian">Vegetarian</option>
                <option value="vegan">Vegan</option>
                <option value="keto">Keto</option>
                <option value="paleo">Paleo</option>
                <option value="mediterranean">Mediterranean</option>
              </select>
            </div>
          </div>

          {/* Submit and Reset Buttons */}
          <div className="mb-6 mt-10 text-center space-x-2">
            <Button type="submit" isLoading={mealPlannerLoading}>
              {data?.payload?.tech_lang_keys["calculate"] ||
                "Calculate Meal Plan"}
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

        {/* Loading State */}
        {mealPlannerLoading ? (
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

                  {/* Results Display */}
                  <div className="space-y-6">
                    {/* Basic Calculations */}
                    <div className="bg-blue-50 p-4 rounded-lg mt-4">
                      <h4 className="text-lg font-semibold text-blue-800 mb-3">
                        Your Daily Requirements
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-blue-600">
                            {result.bmr}
                          </p>
                          <p className="text-sm text-gray-600">
                            BMR (calories)
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-green-600">
                            {result.tdee}
                          </p>
                          <p className="text-sm text-gray-600">
                            TDEE (calories)
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-purple-600">
                            {result.targetCalories}
                          </p>
                          <p className="text-sm text-gray-600">
                            Target (calories)
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Macronutrients */}
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="text-lg font-semibold text-green-800 mb-3">
                        Daily Macronutrients
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-red-500">
                            {result.macros.protein}g
                          </p>
                          <p className="text-sm text-gray-600">Protein</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-yellow-500">
                            {result.macros.carbs}g
                          </p>
                          <p className="text-sm text-gray-600">Carbohydrates</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-orange-500">
                            {result.macros.fat}g
                          </p>
                          <p className="text-sm text-gray-600">Fats</p>
                        </div>
                      </div>
                    </div>

                    {/* Meal Distribution */}
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <h4 className="text-lg font-semibold text-purple-800 mb-3">
                        Recommended Meal Distribution
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center">
                          <p className="text-xl font-bold text-orange-600">
                            {Math.round(result.targetCalories * 0.25)}
                          </p>
                          <p className="text-sm text-gray-600">Breakfast</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xl font-bold text-green-600">
                            {Math.round(result.targetCalories * 0.35)}
                          </p>
                          <p className="text-sm text-gray-600">Lunch</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xl font-bold text-blue-600">
                            {Math.round(result.targetCalories * 0.3)}
                          </p>
                          <p className="text-sm text-gray-600">Dinner</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xl font-bold text-pink-600">
                            {Math.round(result.targetCalories * 0.1)}
                          </p>
                          <p className="text-sm text-gray-600">Snacks</p>
                        </div>
                      </div>
                    </div>

                    {/* Meal Suggestions */}
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <h4 className="text-lg font-semibold text-yellow-800 mb-3">
                        Sample Meal Ideas
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {Object.entries(result.mealPlan).map(
                          ([mealType, mealInfo]) => (
                            <div
                              key={mealType}
                              className="bg-white p-3 rounded-lg shadow"
                            >
                              <h5 className="font-semibold capitalize text-gray-800 mb-2">
                                {mealType}
                              </h5>
                              <p className="text-sm text-gray-600 mb-2">
                                Target: {mealInfo.calories} calories
                              </p>
                              <ul className="text-xs text-gray-600 space-y-1">
                                {mealInfo.suggestions.map(
                                  (suggestion, index) => (
                                    <li key={index}>• {suggestion}</li>
                                  )
                                )}
                              </ul>
                            </div>
                          )
                        )}
                      </div>
                    </div>

                    {/* Additional Tips */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="text-lg font-semibold text-gray-800 mb-3">
                        Tips for Success
                      </h4>
                      <ul className="text-sm text-gray-600 space-y-2">
                        <li>• Drink at least 8-10 glasses of water daily</li>
                        <li>• Eat meals at regular intervals</li>
                        <li>• Include a variety of colorful vegetables</li>
                        <li>• Choose whole grains over refined grains</li>
                        <li>
                          • Monitor portion sizes and listen to hunger cues
                        </li>
                        <li>
                          • Consult a nutritionist for personalized advice
                        </li>
                      </ul>
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

export default MealPlanner;

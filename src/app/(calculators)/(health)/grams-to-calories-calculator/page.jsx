"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useGramsToCaloriesCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const GramsToCaloriesCalculator = () => {
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

  console.log(data);

  const [formData, setFormData] = useState({
    tech_carbohydrate: "25",
    tech_carbo_unit: "g",
    tech_protein: "25",
    tech_protein_unit: "g",
    tech_fat: "25",
    tech_fat_unit: "g",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useGramsToCaloriesCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));

    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.tech_carbohydrate ||
      !formData.tech_carbo_unit ||
      !formData.tech_protein ||
      !formData.tech_protein_unit ||
      !formData.tech_fat ||
      !formData.tech_fat_unit
    ) {
      setFormError("Please fill in field.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_carbohydrate: formData.tech_carbohydrate,
        tech_carbo_unit: formData.tech_carbo_unit,
        tech_protein: formData.tech_protein,
        tech_protein_unit: formData.tech_protein_unit,
        tech_fat: formData.tech_fat,
        tech_fat_unit: formData.tech_fat_unit,
      }).unwrap();
      setResult(response?.payload); // Assuming the response has 'lovePercentage'
      toast.success("Successfully Calculated");
    } catch (err) {
      setFormError("Error in calculating.");
      toast.error("Error in calculating.");
    }
  };

  // Handle reset form
  const handleReset = () => {
    setFormData({
      tech_carbohydrate: "25",
      tech_carbo_unit: "g",
      tech_protein: "25",
      tech_protein_unit: "g",
      tech_fat: "25",
      tech_fat_unit: "g",
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

  //dropdown states
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const setUnitHandler = (unit) => {
    setFormData((prev) => ({ ...prev, tech_carbo_unit: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  //dropdown states  1
  const [dropdownVisible1, setDropdownVisible1] = useState(false);

  const setUnitHandler1 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_protein_unit: unit }));
    setDropdownVisible1(false);
  };

  const toggleDropdown1 = () => {
    setDropdownVisible1(!dropdownVisible1);
  };

  //dropdown states 2
  const [dropdownVisible2, setDropdownVisible2] = useState(false);

  const setUnitHandler2 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_fat_unit: unit }));
    setDropdownVisible2(false);
  };

  const toggleDropdown2 = () => {
    setDropdownVisible2(!dropdownVisible2);
  };

  const round = (value, decimalPlaces = 3) => {
    if (value !== undefined && value !== null) {
      return Number(value).toFixed(decimalPlaces);
    }
    return "-"; // Return '-' if value is undefined or null
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
            <div className="grid grid-cols-1  lg:grid-cols-2 md:grid-cols-2 mt-3 gap-2 md:gap-4 lg:gap-4">
              <div className="col-span-12 mb-2">
                <p>
                  <strong className="text-blue-700">
                    Convert Macronutrient from Grams to Calories!
                  </strong>
                </p>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_carbohydrate" className="label">
                  {data?.payload?.tech_lang_keys["1"]}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_carbohydrate"
                    step="any"
                    className="border border-gray-300 p-2 rounded-lg focus:ring-2 w-full  mt-1"
                    value={formData.tech_carbohydrate}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-5"
                    onClick={toggleDropdown}
                  >
                    {formData.tech_carbo_unit} ▾
                  </label>
                  {dropdownVisible && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "grams (g)", value: "g" },
                        { label: "decagrams (dag)", value: "dag" },
                        { label: "ounces (oz)", value: "oz" },
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
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_protein" className="label">
                  {data?.payload?.tech_lang_keys["2"]}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_protein"
                    step="any"
                    className="border border-gray-300 p-2 rounded-lg focus:ring-2 w-full  mt-1"
                    value={formData.tech_protein}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-5"
                    onClick={toggleDropdown1}
                  >
                    {formData.tech_protein_unit} ▾
                  </label>
                  {dropdownVisible1 && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "grams (g)", value: "g" },
                        { label: "decagrams (dag)", value: "dag" },
                        { label: "ounces (oz)", value: "oz" },
                      ].map((unit, index) => (
                        <p
                          key={index}
                          className="p-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => setUnitHandler1(unit.value)}
                        >
                          {unit.label}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_fat" className="label">
                  {data?.payload?.tech_lang_keys["3"]}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_fat"
                    step="any"
                    className="border border-gray-300 p-2 rounded-lg focus:ring-2 w-full  mt-1"
                    value={formData.tech_fat}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-5"
                    onClick={toggleDropdown2}
                  >
                    {formData.tech_fat_unit} ▾
                  </label>
                  {dropdownVisible2 && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "grams (g)", value: "g" },
                        { label: "decagrams (dag)", value: "dag" },
                        { label: "ounces (oz)", value: "oz" },
                      ].map((unit, index) => (
                        <p
                          key={index}
                          className="p-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => setUnitHandler2(unit.value)}
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

                  <div className="rounded-lg  flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="w-full">
                        <div className="grid grid-cols-12  gap-2 md:gap-4 lg:gap-4">
                          <div className="col-span-12 md:col-span-6 lg:col-span-6">
                            <div className="bg-sky bordered rounded-[10px] p-3">
                              <span>
                                {data?.payload?.tech_lang_keys["4"]} =
                              </span>
                              <strong className="text-[#119154] text-[18px]">
                                {round(result?.tech_carbs, 3)}
                              </strong>
                              <strong>(kcal)</strong>
                            </div>
                          </div>
                          <div className="col-span-12 md:col-span-6 lg:col-span-6">
                            <div className="bg-sky bordered rounded-[10px] p-3">
                              <span>
                                {data?.payload?.tech_lang_keys["5"]} =
                              </span>
                              <strong className="text-[#119154] text-[18px]">
                                {round(result?.tech_pr, 3)}
                              </strong>
                              <strong>(kcal)</strong>
                            </div>
                          </div>
                          <div className="col-span-12 md:col-span-6 lg:col-span-6">
                            <div className="bg-sky bordered rounded-[10px] p-3">
                              <span>
                                {data?.payload?.tech_lang_keys["6"]} =
                              </span>
                              <strong className="text-[#119154] text-[18px]">
                                {round(result?.tech_cf, 3)}
                              </strong>
                              <strong>(kcal)</strong>
                            </div>
                          </div>
                          <div className="col-span-12 md:col-span-6 lg:col-span-6">
                            <div className="bg-sky bordered rounded-[10px] p-3">
                              <span>
                                {data?.payload?.tech_lang_keys["7"]} =
                              </span>
                              <strong className="text-[#119154] text-[18px]">
                                {round(result?.tech_tc, 3)}
                              </strong>
                              <strong>(kcal)</strong>
                            </div>
                          </div>
                        </div>
                        <p className="text-[18px] px-3 mb-lg-1 my-4">
                          <strong className="text-blue-700">
                            {data?.payload?.tech_lang_keys["8"]} :
                          </strong>
                        </p>
                        <div className="grid grid-cols-12  gap-2 md:gap-4 lg:gap-4">
                          <div className="col-span-12 md:col-span-3 lg:col-span-3">
                            <p>
                              <strong className="text-blue-700">
                                1- {data?.payload?.tech_lang_keys["9"]}
                              </strong>
                            </p>
                            <p>
                              = 4{" "}
                              <span className="text-[16px]">
                                <strong>(kcal)</strong>
                              </span>{" "}
                              * ({result?.tech_cv})
                            </p>
                            <p>
                              ={" "}
                              <strong className="text-[#119154]">
                                {result?.tech_carbs}
                              </strong>
                              <span className="text-[16px]">
                                <strong> (kcal)</strong>
                              </span>
                            </p>
                          </div>
                          <div className="col-span-1 border-r pe-3 hidden md:block lg:block"></div>
                          <div className="col-span-12 md:col-span-3 lg:col-span-3">
                            <p>
                              <strong className="text-blue-700">
                                2- {data?.payload?.tech_lang_keys["10"]}
                              </strong>
                            </p>
                            <p>
                              = 4{" "}
                              <span className="text-[16px]">
                                <strong>(kcal)</strong>
                              </span>{" "}
                              * ({result?.tech_pv})
                            </p>
                            <p>
                              ={" "}
                              <strong className="text-[#119154]">
                                {result?.tech_pr}
                              </strong>
                              <span className="text-[16px]">
                                <strong> (kcal)</strong>
                              </span>
                            </p>
                          </div>
                          <div className="col-span-1 border-r pe-3 hidden md:block lg:block"></div>
                          <div className="col-span-12 md:col-span-3 lg:col-span-3">
                            <p>
                              <strong className="text-blue-700">
                                3- {data?.payload?.tech_lang_keys["11"]}
                              </strong>
                            </p>
                            <p>
                              = 9{" "}
                              <span className="text-[16px]">
                                <strong>(kcal)</strong>
                              </span>{" "}
                              * ({result?.tech_fv})
                            </p>
                            <p>
                              ={" "}
                              <strong className="text-[#119154]">
                                {result?.tech_cf}
                              </strong>
                              <span className="text-[16px]">
                                <strong> (kcal)</strong>
                              </span>
                            </p>
                          </div>
                        </div>
                        <div className="w-full mt-3">
                          <p>
                            <strong className="text-blue-700">
                              4- {data?.payload?.tech_lang_keys["12"]}
                            </strong>
                          </p>
                          <p>
                            = {data?.payload?.tech_lang_keys["9"]} +{" "}
                            {data?.payload?.tech_lang_keys["10"]} +{" "}
                            {data?.payload?.tech_lang_keys["11"]}{" "}
                          </p>
                          <p>
                            = ({result?.tech_carbs}{" "}
                            <span className="black-text text-[16px]">
                              <strong>kcal</strong>
                            </span>
                            ) + ({result?.tech_pr}{" "}
                            <span className="black-text text-[16px]">
                              <strong>kcal</strong>
                            </span>
                            ) + ({result?.tech_cf}{" "}
                            <span className="black-text text-[16px]">
                              <strong>kcal</strong>
                            </span>
                            )
                          </p>
                          <p className=" dk">
                            ={" "}
                            <strong className="text-[#119154]">
                              {result?.tech_tc}
                            </strong>
                            <span className="text-[16px]">
                              <strong> (kcal)</strong>
                            </span>
                          </p>
                        </div>
                        <div className="w-full mt-3">
                          <span>Related Calculators : </span>
                          <span>
                            <a
                              className="text-blue-700 text-decoration-none underline"
                              href="https://calculator-logical.com/calculator/calorie-calculator"
                              title="Sine Calculator"
                              target="_blank"
                              rel="noopener"
                            >
                              Calorie Calculator
                            </a>
                          </span>
                          ,
                          <span>
                            <a
                              className="text-blue-700 text-decoration-none underline"
                              href="https://calculator-logical.com/calculator/calorie-deficit-calculator"
                              title="ArcSine Calculator"
                              target="_blank"
                              rel="noopener"
                            >
                              Calorie Deficit Calculator
                            </a>
                          </span>
                          ,
                          <span>
                            <a
                              className="text-blue-700 text-decoration-none underline"
                              href="https://calculator-logical.com/calculator/steps-to-calories-calculator"
                              title="Cosecant Calculator"
                              target="_blank"
                              rel="noopener"
                            >
                              Steps to Calories Calculator
                            </a>
                          </span>
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

export default GramsToCaloriesCalculator;

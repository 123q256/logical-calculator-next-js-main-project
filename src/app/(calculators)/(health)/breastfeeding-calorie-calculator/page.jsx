"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useBreastfeedingCalorieCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const BreastfeedingCalorieCalculator = () => {
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
    tech_unit_type: "kg", // lbs  kg
    tech_age: 23,
    tech_ft_in: 69,
    tech_height_cm: 175.26,
    tech_weight: 92.97,
    tech_activity: 1.375,
    tech_bf: 400,
    tech_pregnant: 340,
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useBreastfeedingCalorieCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.tech_unit_type == "lbs") {
      if (
        !formData.tech_unit_type ||
        !formData.tech_age ||
        !formData.tech_ft_in ||
        !formData.tech_weight ||
        !formData.tech_activity ||
        !formData.tech_bf ||
        !formData.tech_pregnant
      ) {
        setFormError("Please fill in field");
        return;
      }
    } else {
      if (
        !formData.tech_unit_type ||
        !formData.tech_age ||
        !formData.tech_height_cm ||
        !formData.tech_weight ||
        !formData.tech_activity ||
        !formData.tech_bf ||
        !formData.tech_pregnant
      ) {
        setFormError("Please fill in field");
        return;
      }
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_unit_type: formData.tech_unit_type,
        tech_age: formData.tech_age,
        tech_ft_in: formData.tech_ft_in,
        tech_height_cm: formData.tech_height_cm,
        tech_weight: formData.tech_weight,
        tech_activity: formData.tech_activity,
        tech_bf: formData.tech_bf,
        tech_pregnant: formData.tech_pregnant,
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
      tech_unit_type: "kg", // lbs  kg
      tech_age: 23,
      tech_ft_in: 69,
      tech_height_cm: 175.26,
      tech_weight: 92.97,
      tech_activity: 1.375,
      tech_bf: 400,
      tech_pregnant: 340,
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

  const heightOptions = [
    { name: "4ft 7in", value: "55" },
    { name: "4ft 8in", value: "56" },
    { name: "4ft 9in", value: "57" },
    { name: "4ft 10in", value: "58" },
    { name: "4ft 11in", value: "59" },
    { name: "5ft 0in", value: "60" },
    { name: "5ft 1in", value: "61" },
    { name: "5ft 2in", value: "62" },
    { name: "5ft 3in", value: "63" },
    { name: "5ft 4in", value: "64" },
    { name: "5ft 5in", value: "65" },
    { name: "5ft 6in", value: "66" },
    { name: "5ft 7in", value: "67" },
    { name: "5ft 8in", value: "68" },
    { name: "5ft 9in", value: "69" },
    { name: "5ft 10in", value: "70" },
    { name: "5ft 11in", value: "71" },
    { name: "6ft 0in", value: "72" },
    { name: "6ft 1in", value: "73" },
    { name: "6ft 2in", value: "74" },
    { name: "6ft 3in", value: "75" },
    { name: "6ft 4in", value: "76" },
    { name: "6ft 5in", value: "77" },
    { name: "6ft 6in", value: "78" },
    { name: "6ft 7in", value: "79" },
    { name: "6ft 8in", value: "80" },
    { name: "6ft 9in", value: "81" },
    { name: "6ft 10in", value: "82" },
    { name: "6ft 11in", value: "83" },
    { name: "7ft 0in", value: "84" },
  ];

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
        <div className="w-full mx-auto p-4 lg:p-8 md:p-8 bg-white rounded-lg input_form space-y-6 mb-3">
          {formError && (
            <p className="text-red-500 text-lg font-semibold w-full">
              {formError}
            </p>
          )}

          <div className="lg:w-[60%] md:w-[80%] w-full mx-auto ">
            <div className="grid grid-cols-12   gap-2 md:gap-4 lg:gap-4">
              <div className="col-span-12">
                <div className="grid grid-cols-12  lg:gap-4">
                  <div className="col-span-12 md:col-span-12 lg:col-span-12">
                    <input
                      type="hidden"
                      name="tech_unit_type"
                      id="calculator_time"
                      value={formData.tech_unit_type}
                    />
                    <div className="flex flex-wrap items-center bg-blue-100 border border-blue-500 text-center rounded-lg px-1">
                      {/* Date Cal Tab */}
                      <div className="lg:w-1/2 w-full px-2 py-1">
                        <div
                          className={`bg-white px-3 py-2 cursor-pointer rounded-md transition-colors duration-300 hover_tags hover:text-white pacetab  ${
                            formData.tech_unit_type === "lbs" ? "tagsUnit" : ""
                          }`}
                          id="lbs"
                          onClick={() => {
                            setFormData({ ...formData, tech_unit_type: "lbs" });
                            setResult(null);
                            setFormError(null);
                          }}
                        >
                          {data?.payload?.tech_lang_keys["imperial"]}
                        </div>
                      </div>
                      {/* Time Cal Tab */}
                      <div className="lg:w-1/2 w-full px-2 py-1">
                        <div
                          className={`bg-white px-3 py-2 cursor-pointer rounded-md transition-colors duration-300 hover_tags hover:text-white pacetab ${
                            formData.tech_unit_type === "kg" ? "tagsUnit" : ""
                          }`}
                          id="kg"
                          onClick={() => {
                            setFormData({ ...formData, tech_unit_type: "kg" });
                            setResult(null);
                            setFormError(null);
                          }}
                        >
                          {data?.payload?.tech_lang_keys["metric"]}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_age" className="label">
                  {data?.payload?.tech_lang_keys["age"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_age"
                    id="tech_age"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_age}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {formData?.tech_unit_type == "lbs" && (
                <div className="col-span-12 md:col-span-6 lg:col-span-6 height_ft_in">
                  <label htmlFor="tech_ft_in" className="label">
                    {data?.payload?.tech_lang_keys["height"]}:
                  </label>
                  <div className="mt-2">
                    <select
                      className="input"
                      aria-label="select"
                      name="tech_ft_in"
                      id="tech_ft_in"
                      value={formData.tech_ft_in}
                      onChange={handleChange}
                    >
                      {heightOptions.map((option, index) => (
                        <option key={index} value={option.value}>
                          {option.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
              {formData?.tech_unit_type == "kg" && (
                <div className="col-span-12 md:col-span-6 lg:col-span-6 height_cm ">
                  <label htmlFor="tech_height_cm" className="label">
                    {data?.payload?.tech_lang_keys["height"]}:
                  </label>
                  <div className=" relative">
                    <input
                      type="number"
                      step="any"
                      name="tech_height_cm"
                      id="tech_height_cm"
                      className="input my-2"
                      aria-label="input"
                      placeholder="00"
                      value={formData.tech_height_cm}
                      onChange={handleChange}
                    />
                    <span className="input_unit">cm</span>
                  </div>
                </div>
              )}

              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_weight" className="label">
                  {data?.payload?.tech_lang_keys["weight"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_weight"
                    id="tech_weight"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_weight}
                    onChange={handleChange}
                  />
                  <span className="input_unit">
                    {formData?.tech_unit_type == "kg" ? "kg" : "lbs"}
                  </span>
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_activity" className="label">
                  {data?.payload?.tech_lang_keys["activity"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_activity"
                    id="tech_activity"
                    value={formData.tech_activity}
                    onChange={handleChange}
                  >
                    <option value="1.2">Little to no exercise</option>
                    <option value="1.25">
                      Light exercise (1-3 days per week){" "}
                    </option>
                    <option value="1.375">
                      Moderate Exercise (3-5 days per week){" "}
                    </option>
                    <option value="1.55">
                      Heavy Exercise (6-7 days per week){" "}
                    </option>
                    <option value="1.725">
                      Very Heavy Exercise (twice per day){" "}
                    </option>
                  </select>
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_bf" className="label">
                  {data?.payload?.tech_lang_keys["bf"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_bf"
                    id="tech_bf"
                    value={formData.tech_bf}
                    onChange={handleChange}
                  >
                    <option value="500">Exclusive Breastfeeding</option>
                    <option value="400">Mostly Breastfeeding </option>
                    <option value="250">Partial Breastfeeding </option>
                    <option value="0">Not Breastfeeding </option>
                  </select>
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_pregnant" className="label">
                  {data?.payload?.tech_lang_keys["pregnant"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_pregnant"
                    id="tech_pregnant"
                    value={formData.tech_pregnant}
                    onChange={handleChange}
                  >
                    <option value="0">Not Pregnant</option>
                    <option value="50">First Trimester </option>
                    <option value="340">Second Trimester </option>
                    <option value="450">Third Trimester </option>
                    <option value="700">Third Trimester (Twins) </option>
                  </select>
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
              <div className="w-full mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg  space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg  flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="w-full">
                        <div className="flex flex-wrap justify-between">
                          <div className="mt-2">
                            <p>
                              <strong>
                                {data?.payload?.tech_lang_keys["maintain"]}
                              </strong>
                            </p>
                            <p>
                              <strong className="text-[28px] text-[#119154]">
                                {result?.tech_maintain}
                              </strong>
                              <span className="text-[#2845F5] text-[20px]">
                                Kcal/day
                              </span>
                            </p>
                          </div>
                          <div className="border-r hidden md:block lg:block">
                            &nbsp;
                          </div>
                          <div className="mt-2">
                            <p>
                              <strong>
                                {data?.payload?.tech_lang_keys["lose"]}
                              </strong>
                            </p>
                            <p>
                              <strong className="text-[28px] text-[#119154]">
                                {result?.tech_lose}
                              </strong>
                              <span className="text-[#2845F5] text-[20px]">
                                Kcal/day
                              </span>
                            </p>
                          </div>
                          <div className="border-r hidden md:block lg:block">
                            &nbsp;
                          </div>
                          <div className="mt-2">
                            <p>
                              <strong>
                                {data?.payload?.tech_lang_keys["supply"]}
                              </strong>
                            </p>
                            <p>
                              <strong className="text-[28px] text-[#119154]">
                                {result?.tech_supply}
                              </strong>
                              <span className="text-[#2845F5] text-[20px]">
                                Kcal/day
                              </span>
                            </p>
                          </div>
                        </div>
                        <div className="grid grid-cols-12 gap-2 md:gap-4 lg:gap-4 mt-4">
                          <div className="col-span-12 md:col-span-6 lg:col-span-6">
                            <table className="w-full" cellSpacing="0">
                              <tbody>
                                <tr>
                                  <td className="border-b py-2">
                                    <strong>
                                      {data?.payload?.tech_lang_keys["carbo"]}
                                    </strong>
                                  </td>
                                  <td className="border-b py-2">
                                    <strong className="clr_blue">
                                      {result?.tech_carbos1}g
                                    </strong>
                                  </td>
                                </tr>
                                <tr className="bdr-top">
                                  <td className="border-b py-2">
                                    <strong>
                                      {
                                        data?.payload?.tech_lang_keys[
                                          "proteins"
                                        ]
                                      }
                                    </strong>
                                  </td>
                                  <td className="border-b py-2">
                                    <strong className="clr_blue">
                                      {result?.tech_proteins1}g
                                    </strong>
                                  </td>
                                </tr>
                                <tr className="bdr-top boder_bottom_none">
                                  <td className="border-b py-2">
                                    <strong>
                                      {data?.payload?.tech_lang_keys["fats"]}
                                    </strong>
                                  </td>
                                  <td className="border-b py-2">
                                    <strong className="clr_blue">
                                      {result?.tech_fats1}g
                                    </strong>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          <div className="col-span-12 md:col-span-6 lg:col-span-6 md:border-l-2 lg:border-l-2 md:px-3 lg:px-3">
                            <table className="w-full" cellSpacing="0">
                              <tbody>
                                <tr>
                                  <td className="border-b py-2">
                                    <strong>
                                      {data?.payload?.tech_lang_keys["carbo"]}
                                    </strong>
                                  </td>
                                  <td className="border-b py-2">
                                    <strong className="clr_blue">
                                      {result?.tech_carbos2}g
                                    </strong>
                                  </td>
                                </tr>
                                <tr className="bdr-top">
                                  <td className="border-b py-2">
                                    <strong>
                                      {
                                        data?.payload?.tech_lang_keys[
                                          "proteins"
                                        ]
                                      }
                                    </strong>
                                  </td>
                                  <td className="border-b py-2">
                                    <strong className="clr_blue">
                                      {result?.tech_proteins2}g
                                    </strong>
                                  </td>
                                </tr>
                                <tr className="bdr-top boder_bottom_none">
                                  <td className="border-b py-2">
                                    <strong>
                                      {data?.payload?.tech_lang_keys["fats"]}
                                    </strong>
                                  </td>
                                  <td className="border-b py-2">
                                    <strong className="clr_blue">
                                      {result?.tech_fats2}g
                                    </strong>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
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
      </form>
      {result && (
        <CalculatorFeedback calName={data?.payload?.tech_calculator_title} />
      )}
    </Calculator>
  );
};

export default BreastfeedingCalorieCalculator;

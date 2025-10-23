"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useFoodCostCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const FoodCostCalculator = () => {
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
    tech_food_type: "food_case", //  food_case
    tech_menu: 45,
    tech_measure_unit: "Units",
    tech_units_case: 45,
    tech_cost_unit: 45,
    tech_serving_size: 45,
    tech_other: 45,
    tech_menu_price: 45,
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useFoodCostCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_food_type || !formData.tech_menu) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_food_type: formData.tech_food_type,
        tech_menu: formData.tech_menu,
        tech_measure_unit: formData.tech_measure_unit,
        tech_units_case: formData.tech_units_case,
        tech_cost_unit: formData.tech_cost_unit,
        tech_serving_size: formData.tech_serving_size,
        tech_other: formData.tech_other,
        tech_menu_price: formData.tech_menu_price,
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
      tech_food_type: "food_case", //  food_case
      tech_menu: 45,
      tech_measure_unit: "Units",
      tech_units_case: 45,
      tech_cost_unit: 45,
      tech_serving_size: 45,
      tech_other: 45,
      tech_menu_price: 45,
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
        <div className="w-full mx-auto p-4 lg:p-8 md:p-8 input_form rounded-lg  space-y-6 mb-3">
          {formError && (
            <p className="text-red-500 text-lg font-semibold w-full">
              {formError}
            </p>
          )}

          <div className="lg:w-[60%] md:w-[80%] w-full mx-auto ">
            <div className="grid grid-cols-1  lg:grid-cols-2 md:grid-cols-2 mt-3   gap-2 md:gap-4 lg:gap-4">
              <div className="col-span-12">
                <div className="col-12  mx-auto mt-2 w-full">
                  <input
                    type="hidden"
                    name="tech_food_type"
                    id="calculator_time"
                    value={formData.tech_food_type}
                  />
                  <div className="flex flex-wrap items-center bg-blue-100 border border-blue-500 text-center rounded-lg px-1">
                    {/* Date Cal Tab */}
                    <div className="lg:w-1/2 w-full px-2 py-1">
                      <div
                        className={`bg-white px-3 py-2 cursor-pointer rounded-md transition-colors duration-300 hover_tags hover:text-white pacetab  ${
                          formData.tech_food_type === "food_piece"
                            ? "tagsUnit"
                            : ""
                        }`}
                        id="food_piece"
                        onClick={() => {
                          setFormData({
                            ...formData,
                            tech_food_type: "food_piece",
                          });
                          setResult(null);
                          setFormError(null);
                        }}
                      >
                        {data?.payload?.tech_lang_keys["1"]}
                      </div>
                    </div>
                    {/* Time Cal Tab */}
                    <div className="lg:w-1/2 w-full px-2 py-1">
                      <div
                        className={`bg-white px-3 py-2 cursor-pointer rounded-md transition-colors duration-300 hover_tags hover:text-white pacetab ${
                          formData.tech_food_type === "food_case"
                            ? "tagsUnit"
                            : ""
                        }`}
                        id="food_case"
                        onClick={() => {
                          setFormData({
                            ...formData,
                            tech_food_type: "food_case",
                          });
                          setResult(null);
                          setFormError(null);
                        }}
                      >
                        {data?.payload?.tech_lang_keys["2"]}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_menu" className="label">
                  {data?.payload?.tech_lang_keys["3"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_menu"
                    id="tech_menu"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_menu}
                    onChange={handleChange}
                  />
                  <span className="input_unit">{currency.symbol}</span>
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_measure_unit" className="label">
                  {data?.payload?.tech_lang_keys["4"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_measure_unit"
                    id="tech_measure_unit"
                    value={formData.tech_measure_unit}
                    onChange={handleChange}
                  >
                    <option value="Units">Units</option>
                    <option value="Pieces">Pieces </option>
                    <option value="Cups">Cups </option>
                    <option value="Ounces">Ounces </option>
                    <option value="Sheets">Sheets </option>
                    <option value="Pounds">Pounds </option>
                    <option value="Grams">Grams </option>
                    <option value="Liters">Liters </option>
                    <option value="Meters">Meters </option>
                  </select>
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_units_case" className="label">
                  <span className="text-blue change_unit">
                    {data?.payload?.tech_lang_keys["5"]}
                  </span>{" "}
                  {data?.payload?.tech_lang_keys["6"]}
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_units_case"
                    id="tech_units_case"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_units_case}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_cost_unit" className="label">
                  {formData.tech_food_type === "food_piece"
                    ? data?.payload?.tech_lang_keys["7"]
                    : formData.tech_food_type === "food_case"
                    ? data?.payload?.tech_lang_keys["16"]
                    : null}
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_cost_unit"
                    id="tech_cost_unit"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_cost_unit}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_serving_size" className="label">
                  {data?.payload?.tech_lang_keys["8"]} (
                  <span className="text-blue change_unit">
                    {data?.payload?.tech_lang_keys["5"]}
                  </span>
                  )
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_serving_size"
                    id="tech_serving_size"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_serving_size}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_other" className="label">
                  {data?.payload?.tech_lang_keys["9"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_other"
                    id="tech_other"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_other}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_menu_price" className="label">
                  {data?.payload?.tech_lang_keys["10"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_menu_price"
                    id="tech_menu_price"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_menu_price}
                    onChange={handleChange}
                  />
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
                    <div className="w-full  mt-3">
                      <div className="w-full mt-2">
                        <div className="w-full overflow-auto">
                          <table
                            className="w-full md:w-[50%] lg:w-[50%]"
                            cellSpacing="0"
                          >
                            <tbody>
                              <tr>
                                <td className="border-b py-2">
                                  <strong>
                                    {data?.payload?.tech_lang_keys[11]}
                                  </strong>
                                </td>
                                <td className="border-b py-2">
                                  <strong>{result?.tech_food_cost} %</strong>
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  <strong>
                                    {data?.payload?.tech_lang_keys[12]}
                                  </strong>
                                </td>
                                <td className="border-b py-2">
                                  <strong>
                                    {result?.tech_costPerServing <= 0
                                      ? "-"
                                      : ""}{" "}
                                    {currency.symbol}{" "}
                                    {Math.ceil(result?.tech_costPerServing)}
                                  </strong>
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  <strong>
                                    {data?.payload?.tech_lang_keys[13]}
                                  </strong>
                                </td>
                                <td className="border-b py-2">
                                  <strong>
                                    {result?.tech_costPerPlate <= 0 ? "-" : ""}{" "}
                                    {currency.symbol}{" "}
                                    {Math.ceil(result?.tech_costPerPlate)}
                                  </strong>
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  <strong>
                                    {data?.payload?.tech_lang_keys[14]}
                                  </strong>
                                </td>
                                <td className="border-b py-2">
                                  <strong>
                                    {result?.tech_contributionPerPlate <= 0
                                      ? "-"
                                      : ""}{" "}
                                    {currency.symbol}{" "}
                                    {Math.ceil(
                                      result?.tech_contributionPerPlate
                                    )}
                                  </strong>
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  <strong>
                                    {data?.payload?.tech_lang_keys[15]}
                                  </strong>
                                </td>
                                <td className="border-b py-2">
                                  <strong>
                                    {result?.tech_profitPerCase <= 0 ? "-" : ""}{" "}
                                    {currency.symbol}{" "}
                                    {Math.ceil(result?.tech_profitPerCase)}
                                  </strong>
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2">
                                  <strong>
                                    {data?.payload?.tech_lang_keys[7]}
                                  </strong>
                                </td>
                                <td className="py-2">
                                  <strong>
                                    {result?.tech_costPerUnit <= 0 ? "-" : ""}{" "}
                                    {currency.symbol}{" "}
                                    {Math.ceil(result?.tech_costPerUnit)}
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

export default FoodCostCalculator;

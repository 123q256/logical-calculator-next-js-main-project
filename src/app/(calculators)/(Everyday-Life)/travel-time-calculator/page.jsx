"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useTravelTimeCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const TravelTimeCalculator = () => {
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
    tech_distance: "240",
    tech_distance_unit: "km",
    tech_speed: "240",
    tech_speed_unit: "kmpl",
    tech_break_hrs: "5",
    tech_break_min: "5",
    tech_dep_time: "2023-01-06T11:30",
    tech_fule_effi: "240",
    tech_fule_effi_unit: "kmpl",
    tech_price: "240",
    tech_price_unit: "liter",
    tech_passenger: "5",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useTravelTimeCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.tech_distance ||
      !formData.tech_distance_unit ||
      !formData.tech_speed ||
      !formData.tech_speed_unit ||
      !formData.tech_break_hrs ||
      !formData.tech_break_min ||
      !formData.tech_dep_time ||
      !formData.tech_fule_effi ||
      !formData.tech_fule_effi_unit ||
      !formData.tech_price ||
      !formData.tech_price_unit ||
      !formData.tech_passenger
    ) {
      setFormError("Please fill in field.");
      return;
    }
    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_distance: formData.tech_distance,
        tech_distance_unit: formData.tech_distance_unit,
        tech_speed: formData.tech_speed,
        tech_speed_unit: formData.tech_speed_unit,
        tech_break_hrs: formData.tech_break_hrs,
        tech_break_min: formData.tech_break_min,
        tech_dep_time: formData.tech_dep_time,
        tech_fule_effi: formData.tech_fule_effi,
        tech_fule_effi_unit: formData.tech_fule_effi_unit,
        tech_price: formData.tech_price,
        tech_price_unit: formData.tech_price_unit,
        tech_passenger: formData.tech_passenger,
      }).unwrap();
      setResult(response); // Assuming the response has 'lovePercentage'
      toast.success("Successfully Calculated");
    } catch (err) {
      setFormError(err.data.error);
      toast.error(err.data.error);
    }
  };

  // Handle reset form
  const handleReset = () => {
    setFormData({
      tech_distance: "240",
      tech_distance_unit: "km",
      tech_speed: "240",
      tech_speed_unit: "kmpl",
      tech_break_hrs: "5",
      tech_break_min: "5",
      tech_dep_time: "2023-01-06T11:30",
      tech_fule_effi: "240",
      tech_fule_effi_unit: "kmpl",
      tech_price: "240",
      tech_price_unit: " liter",
      tech_passenger: "5",
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
    setFormData((prev) => ({ ...prev, tech_distance_unit: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  //dropdown states 1
  const [dropdownVisible1, setDropdownVisible1] = useState(false);

  const setUnitHandler1 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_speed_unit: unit }));
    setDropdownVisible1(false);
  };

  const toggleDropdown1 = () => {
    setDropdownVisible1(!dropdownVisible1);
  };

  //dropdown states 2
  const [dropdownVisible2, setDropdownVisible2] = useState(false);

  const setUnitHandler2 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_fule_effi_unit: unit }));
    setDropdownVisible2(false);
  };

  const toggleDropdown2 = () => {
    setDropdownVisible2(!dropdownVisible2);
  };

  //dropdown states 3
  const [dropdownVisible3, setDropdownVisible3] = useState(false);

  const setUnitHandler3 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_price_unit: unit }));
    setDropdownVisible3(false);
  };

  const toggleDropdown3 = () => {
    setDropdownVisible3(!dropdownVisible3);
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
        <div className="w-full mx-auto p-4 lg:p-8 md:p-8 input_form rounded-lg  space-y-6 mb-3">
          {formError && (
            <p className="text-red-500 text-lg font-semibold w-full">
              {formError}
            </p>
          )}

          <div className="lg:w-[60%] md:w-[100%] w-full mx-auto ">
            <div className="grid grid-cols-12 mt-3  gap-4">
              <div className="lg:col-span-6 md:col-span-6 col-span-12">
                <label htmlFor="tech_distance" className="label">
                  {data?.payload?.tech_lang_keys["1"]}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_distance"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_distance}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown}
                  >
                    {formData.tech_distance_unit} ▾
                  </label>
                  {dropdownVisible && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "km", value: "km" },
                        { label: "mi", value: "mi" },
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
              <div className="lg:col-span-6 md:col-span-6 col-span-12">
                <label htmlFor="tech_speed" className="label">
                  {data?.payload?.tech_lang_keys["2"]}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_speed"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_speed}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown1}
                  >
                    {formData.tech_speed_unit} ▾
                  </label>
                  {dropdownVisible1 && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "kmpl", value: "kmpl" },
                        { label: "mpg", value: "mpg" },
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
              <div className="lg:col-span-6 md:col-span-6 col-span-12">
                <label htmlFor="tech_break_hrs" className="label">
                  {data?.payload?.tech_lang_keys["3"]}:
                </label>
                <div className="grid grid-cols-12 mt-2  gap-2">
                  <div className="col-span-6 relative">
                    <input
                      type="number"
                      step="any"
                      name="tech_break_hrs"
                      id="tech_break_hrs"
                      className="input "
                      aria-label="input"
                      placeholder="00"
                      value={formData.tech_break_hrs}
                      onChange={handleChange}
                    />
                    <span className="input_unit text-blue">hrs</span>
                  </div>
                  <div className="col-span-6 relative">
                    <input
                      type="number"
                      step="any"
                      name="tech_break_min"
                      id="tech_break_min"
                      className="input "
                      aria-label="input"
                      placeholder="00"
                      value={formData.tech_break_min}
                      onChange={handleChange}
                    />
                    <span className="input_unit text-blue">min</span>
                  </div>
                </div>
              </div>
              <div className="lg:col-span-6 md:col-span-6 col-span-12">
                <label htmlFor="tech_dep_time" className="label">
                  {data?.payload?.tech_lang_keys["4"]}:
                </label>
                <div className=" relative">
                  <input
                    type="datetime-local"
                    step="any"
                    name="tech_dep_time"
                    id="tech_dep_time"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_dep_time}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <p className="col-span-12 font-bold">
                {data?.payload?.tech_lang_keys["5"]}
              </p>
              <div className="lg:col-span-6 md:col-span-6 col-span-12">
                <label htmlFor="tech_fule_effi" className="label">
                  {data?.payload?.tech_lang_keys["6"]}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_fule_effi"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_fule_effi}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown2}
                  >
                    {formData.tech_fule_effi_unit} ▾
                  </label>
                  {dropdownVisible2 && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "kmpl", value: "kmpl" },
                        { label: "mpg", value: "mpg" },
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
              <div className="lg:col-span-6 md:col-span-6 col-span-12">
                <label htmlFor="tech_price" className="label">
                  {data?.payload?.tech_lang_keys["7"]}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_price"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_price}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown3}
                  >
                    {formData.tech_price_unit} ▾
                  </label>
                  {dropdownVisible3 && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        {
                          label: " liter",
                          value: " liter",
                        },
                        {
                          label: " gallon",
                          value: " gallon",
                        },
                      ].map((unit, index) => (
                        <p
                          key={index}
                          className="p-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => setUnitHandler3(unit.value)}
                        >
                          {unit.label}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="lg:col-span-6 md:col-span-6 col-span-12">
                <label htmlFor="tech_passenger" className="label">
                  {data?.payload?.tech_lang_keys["8"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_passenger"
                    id="tech_passenger"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_passenger}
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
                      <div className="w-full my-2">
                        <div className="w-full md:w-[70%] lg:w-[70%]  text-[16px] overflow-auto">
                          <table className="w-full">
                            <tbody>
                              <tr>
                                <td className="border-b py-2" width="60%">
                                  <strong>
                                    {data?.payload?.tech_lang_keys[12]}
                                  </strong>{" "}
                                  :
                                </td>
                                <td className="border-b py-2">
                                  {result?.tech_hours}
                                  <span className="text-[14px]">
                                    {" "}
                                    Hours{" "}
                                  </span>{" "}
                                  {Number(result?.tech_mins).toFixed(1)}
                                  <span className="text-[14px]"> Minutes </span>
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  {data?.payload?.tech_lang_keys[13]} :
                                </td>
                                <td className="border-b py-2">
                                  {result?.tech_depature}
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  {data?.payload?.tech_lang_keys[14]} :
                                </td>
                                <td className="border-b py-2">
                                  {result?.tech_arrival}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                          <p className="pt-2">
                            <strong>
                              {data?.payload?.tech_lang_keys["15"]}
                            </strong>
                          </p>
                          <table className="w-full">
                            <tbody>
                              <tr>
                                <td width="60%" className="border-b ">
                                  {data?.payload?.tech_lang_keys["16"]} :
                                </td>
                                <td className="border-b py-2">
                                  {currency.symbol} {result?.tech_fule_price}
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b ">
                                  {data?.payload?.tech_lang_keys["17"]} :
                                </td>
                                <td className="border-b py-2">
                                  {currency.symbol} {result?.tech_per_person}
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

export default TravelTimeCalculator;

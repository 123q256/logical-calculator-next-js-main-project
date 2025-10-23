"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useSixminuteWalkTestMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const SixMinuteWalkTestCalculator = () => {
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
    tech_age: 56,
    tech_gender: "Male", // Male  Female
    tech_height_ft: 5,
    tech_height_in: 12,
    tech_unit_h: "ft/in",
    tech_height_cm: "12",
    tech_unit_h_cm: "cm",
    tech_weight: 46,
    tech_unit: "lbs",
    tech_distance: 56,
    tech_dis_unit: "ft",
    tech_unit_ft_in: "ft/in",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useSixminuteWalkTestMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_age || !formData.tech_weight) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_age: formData.tech_age,
        tech_weight: formData.tech_weight,
        tech_distance: formData.tech_distance,
        tech_height_ft: formData.tech_height_ft,
        tech_height_in: formData.tech_height_in,
        tech_height_cm: formData.tech_height_cm,
        tech_unit: formData.tech_unit,
        tech_unit_ft_in: formData.tech_unit_ft_in,
        tech_gender: formData.tech_gender,
        tech_dis_unit: formData.tech_dis_unit,
        tech_unit_h: formData.tech_unit_h,
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
      tech_age: 56,
      tech_weight: 46,
      tech_distance: 56,
      tech_height_ft: 5,
      tech_height_in: 12,
      tech_height_cm: "cm",
      tech_unit: "lbs",
      tech_unit_ft_in: "ft/in",
      tech_gender: "Male", // Male  Female
      tech_dis_unit: "ft",
      tech_unit_h: "cm",
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
  const [dropdownVisible0, setDropdownVisible0] = useState(false);

  const setUnitHandler0 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_dis_unit: unit }));
    setDropdownVisible0(false);
  };

  const toggleDropdown0 = () => {
    setDropdownVisible0(!dropdownVisible0);
  };

  //dropdown states
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const setUnitHandler = (unit) => {
    setFormData((prev) => ({ ...prev, tech_unit: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  //dropdown states 1
  const [dropdownVisible1, setDropdownVisible1] = useState(false);

  const setUnitHandler1 = (unit) => {
    setFormData((prev) => ({
      ...prev,
      tech_unit_h: unit,
      tech_unit_ft_in: unit,
    }));
    setDropdownVisible1(false);
  };

  const toggleDropdown1 = () => {
    setDropdownVisible1(!dropdownVisible1);
  };

  //dropdown states 2
  const [dropdownVisible2, setDropdownVisible2] = useState(false);

  const setUnitHandler2 = (unit) => {
    setFormData((prev) => ({
      ...prev,
      tech_unit_h_cm: unit,
      tech_unit_ft_in: unit,
    }));
    setDropdownVisible2(false);
  };

  const toggleDropdown2 = () => {
    setDropdownVisible2(!dropdownVisible2);
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

          <div className="lg:w-[60%] md:w-[85%] w-full mx-auto ">
            <div className="grid grid-cols-1  lg:grid-cols-2 md:grid-cols-2  gap-4">
              <div className="space-y-2 relative">
                <label htmlFor="tech_age" className="label">
                  {data?.payload?.tech_lang_keys["age_year"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_age"
                    id="tech_age"
                    className="input mt-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_age}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="space-y-2 relative">
                <label htmlFor="tech_gender" className="label">
                  {data?.payload?.tech_lang_keys["gender"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_gender"
                    id="tech_gender"
                    value={formData.tech_gender}
                    onChange={handleChange}
                  >
                    <option value="Male">
                      {data?.payload?.tech_lang_keys["male"]}
                    </option>
                    <option value="Female">
                      {data?.payload?.tech_lang_keys["female"]}
                    </option>
                  </select>
                </div>
              </div>
              <div className="space-y-2 flex">
                <input
                  type="hidden"
                  step="any"
                  name="tech_unit_ft_in"
                  id="tech_unit_ft_in"
                  className="input my-2"
                  aria-label="input"
                  value={formData.tech_unit_ft_in}
                  onChange={handleChange}
                />
                {formData.tech_unit_ft_in == "ft/in" && (
                  <>
                    <div className="w-[50%] ft_in  mt-2 mr-2">
                      <label htmlFor="tech_height_ft" className="label">
                        {data?.payload?.tech_lang_keys["height"]}:
                      </label>
                      <div className=" relative">
                        <input
                          type="number"
                          step="any"
                          name="tech_height_ft"
                          id="tech_height_ft"
                          className="input my-2"
                          aria-label="input"
                          placeholder="00"
                          value={formData.tech_height_ft}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="w-[50%] ft_in">
                      <label htmlFor="tech_height_in" className="label">
                        &nbsp;
                      </label>
                      <div className="relative w-full ">
                        <input
                          type="number"
                          name="tech_height_in"
                          step="any"
                          className="mt-2 input"
                          value={formData.tech_height_in}
                          placeholder="00"
                          onChange={handleChange}
                        />
                        <label
                          className="absolute cursor-pointer text-sm underline right-4 top-5"
                          onClick={toggleDropdown1}
                        >
                          {formData.tech_unit_h} ▾
                        </label>
                        {dropdownVisible1 && (
                          <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                            {[
                              {
                                label: "feet / inches (ft/in)",
                                value: "ft/in",
                              },
                              { label: "centimeters (cm)", value: "cm" },
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
                  </>
                )}
                {formData.tech_unit_ft_in == "cm" && (
                  <>
                    <div className="space-y-2 h_cm  w-full">
                      <label htmlFor="tech_height_cm" className="label">
                        {data?.payload?.tech_lang_keys["height"]} (cm):
                      </label>
                      <div className="relative w-full mt-1 ">
                        <input
                          type="number"
                          name="tech_height_cm"
                          step="any"
                          className="mt-1 input"
                          value={formData.tech_height_cm}
                          placeholder="00"
                          onChange={handleChange}
                        />
                        <label
                          className="absolute cursor-pointer text-sm underline right-4 top-5"
                          onClick={toggleDropdown2}
                        >
                          {formData.tech_unit_h_cm} ▾
                        </label>
                        {dropdownVisible2 && (
                          <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                            {[
                              {
                                label: "feet / inches (ft/in)",
                                value: "ft/in",
                              },
                              { label: "centimeters (cm)", value: "cm" },
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
                  </>
                )}
              </div>

              <div className="space-y-2 relative">
                <label htmlFor="tech_weight" className="label">
                  {data?.payload?.tech_lang_keys["weight"]}:
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_weight"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_weight}
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
                      {[
                        { label: "pounds (lbs)", value: "lbs" },
                        { label: "kilograms (kg)", value: "kg" },
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
              <div className="space-y-2 relative">
                <label htmlFor="tech_distance" className="label">
                  {data?.payload?.tech_lang_keys["Dis_walked"]}:
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
                    onClick={toggleDropdown0}
                  >
                    {formData.tech_dis_unit} ▾
                  </label>
                  {dropdownVisible0 && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "feet (ft)", value: "ft" },
                        { label: "meters (m)", value: "m" },
                      ].map((unit, index) => (
                        <p
                          key={index}
                          className="p-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => setUnitHandler0(unit.value)}
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
          <div className="w-full mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg  space-y-6 result">
            <div className="animate-pulse">
              <div className=" w-full h-[30px] bg-gray-200 animate-pulse rounded-[10px] mb-4"></div>
              <div className="w-[75%] h-[20px] bg-gray-200 animate-pulse rounded-[10px] mb-3"></div>
              <div className="w-[50%] h-[20px] bg-gray-200 animate-pulse rounded-[10px] mb-3"></div>
              <div className="w-[25%] h-[20px] bg-gray-200 animate-pulse rounded-[10px]"></div>
            </div>
          </div>
        ) : (
          result && (
            <>
              <div className="w-full  mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg  space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg  flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="grid grid-cols-12   gap-2 md:gap-4 lg:gap-4">
                        <div className="col-span-12 md:col-span-4 lg:col-span-4 text-center">
                          <div className="bg-sky bordered rounded-lg p-3 text-center flex justify-center">
                            <div>
                              <img
                                src="/images/walk_boy.png"
                                alt="6MWT"
                                width="70"
                                height="62"
                                className="rounded-lg"
                              />
                              <p>
                                <strong className="text-blue-500 text-[28px]">
                                  {result?.tech_Ans}
                                </strong>
                                <sub className="text-[18px]">
                                  {data?.payload?.tech_lang_keys["meters"]}
                                </sub>
                              </p>
                            </div>
                          </div>
                          <p className="mt-2">
                            {data?.payload?.tech_lang_keys["expected"]}
                          </p>
                        </div>
                        <div className="col-span-12 md:col-span-4 lg:col-span-4  text-center">
                          <div className="bg-sky bordered rounded-lg p-3 text-center  flex justify-center">
                            <div>
                              <img
                                src="/images/exp_dist.png"
                                alt="6 minute walk test"
                                width="70"
                                height="62"
                                className="rounded-lg"
                              />
                              <p>
                                <strong className="text-blue-500 text-[28px]">
                                  {result?.tech_Percent}
                                </strong>
                                <sub className="text-[18px]">%</sub>
                              </p>
                            </div>
                          </div>
                          <p className="mt-2">
                            {data?.payload?.tech_lang_keys["percentage"]}
                          </p>
                        </div>
                        <div className="col-span-12 md:col-span-4 lg:col-span-4  text-center">
                          <div className="bg-sky bordered rounded-lg p-3 text-center  flex justify-center">
                            <div>
                              <img
                                src="/images/limit.png"
                                alt="Lower limit of normal"
                                width="70"
                                height="62"
                                className="rounded-lg"
                              />
                              <p>
                                <strong className="text-blue-500 text-[28px]">
                                  {result?.tech_limit}
                                </strong>
                                <sub className="text-[18px]">
                                  {data?.payload?.tech_lang_keys["meters"]}
                                </sub>
                              </p>
                            </div>
                          </div>
                          <p className="mt-2">Lower limit of normal</p>
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

export default SixMinuteWalkTestCalculator;

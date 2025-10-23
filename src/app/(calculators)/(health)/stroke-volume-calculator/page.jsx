"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useStrokeVolumeCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const StrokeVolumeCalculator = () => {
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
    tech_Cardiac: "10",
    tech_Cardiac_unit: "/min l",
    tech_heart: "20",
    tech_height_ft: 10,
    tech_unit_ft_in: "ft/in",
    tech_height_in: 10,
    tech_unit_h: "mm",
    tech_height_cm: 24,
    tech_unit_h_cm: "ft/in",
    tech_weight: "20",
    tech_weight_unit: "kg",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useStrokeVolumeCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_Cardiac || !formData.tech_Cardiac_unit) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_Cardiac: formData.tech_Cardiac,
        tech_Cardiac_unit: formData.tech_Cardiac_unit,
        tech_heart: formData.tech_heart,
        tech_height_ft: formData.tech_height_ft,
        tech_unit_ft_in: formData.tech_unit_ft_in,
        tech_height_in: formData.tech_height_in,
        tech_unit_h: formData.tech_unit_h,
        tech_height_cm: formData.tech_height_cm,
        tech_unit_h_cm: formData.tech_unit_h_cm,
        tech_weight: formData.tech_weight,
        tech_weight_unit: formData.tech_weight_unit,
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
      tech_Cardiac: "10",
      tech_Cardiac_unit: "/min l",
      tech_heart: "20",
      tech_height_ft: 10,
      tech_unit_ft_in: "ft/in",
      tech_height_in: 10,
      tech_unit_h: "mm",
      tech_height_cm: 24,
      tech_unit_h_cm: "ft/in",
      tech_weight: "20",
      tech_weight_unit: "kg",
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
    setFormData((prev) => ({ ...prev, tech_unit: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  //dropdown states
  const [dropdownVisible1, setDropdownVisible1] = useState(false);

  const setUnitHandler1 = (unit) => {
    setFormData((prev) => ({
      ...prev,
      tech_unit_h: unit,
      tech_unit_ft_in: unit, // hidden input bhi update ho jaega
    }));
    setDropdownVisible1(false);
  };

  const toggleDropdown1 = () => {
    setDropdownVisible1(!dropdownVisible1);
  };

  //dropdown states
  const [dropdownVisible2, setDropdownVisible2] = useState(false);

  const setUnitHandler2 = (unit) => {
    setFormData((prev) => ({
      ...prev,
      tech_unit_h_cm: unit,
      tech_unit_ft_in: unit, // hidden input bhi update ho jaega
    }));
    setDropdownVisible2(false);
  };

  const toggleDropdown2 = () => {
    setDropdownVisible2(!dropdownVisible2);
  };

  //dropdown states
  const [dropdownVisible3, setDropdownVisible3] = useState(false);

  const setUnitHandler3 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_weight_unit: unit }));
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

          <div className="lg:w-[60%] md:w-[80%] w-full mx-auto ">
            <div className="grid grid-cols-12   gap-2 md:gap-4 lg:gap-4">
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_Cardiac" className="label">
                  {data?.payload?.tech_lang_keys["2"]}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_Cardiac"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_Cardiac}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown}
                  >
                    {formData.tech_Cardiac_unit} ▾
                  </label>
                  {dropdownVisible && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "/min mm³", value: "/min mm³" },
                        { label: "/min cm³", value: "/min cm³" },
                        { label: "/min dm³", value: "/min dm³" },
                        { label: "/min in³", value: "/min in³" },
                        { label: "/min ft³", value: "/min ft³" },
                        { label: "/min yd³", value: "/min yd³" },
                        { label: "/min ml", value: "/min ml" },
                        { label: "/min cl", value: "/min cl" },
                        { label: "/min l", value: "/min l" },
                        { label: "/min US gal", value: "/min US gal" },
                        { label: "/min UK gal", value: "/min UK gal" },
                        { label: "/min US fl oz", value: "/min US fl oz" },
                        { label: "/min cups", value: "/min cups" },
                        { label: "/min tbsp", value: "/min tbsp" },
                        { label: "/min tsp", value: "/min tsp" },
                        { label: "/min US qt", value: "/min US qt" },
                        { label: "/min UK qt", value: "/min UK qt" },
                        { label: "/min US pt", value: "/min US pt" },
                        { label: "/min UK pt", value: "/min UK pt" },
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
                <label htmlFor="tech_heart" className="label">
                  {data?.payload?.tech_lang_keys["3"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_heart"
                    id="tech_heart"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_heart}
                    onChange={handleChange}
                  />
                  <span className="input_unit">bpm</span>
                </div>
              </div>
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

              {(formData.tech_unit_ft_in == "ft/in" ||
                formData.tech_unit_ft_in == "m/cm") && (
                <>
                  <div className="col-span-6 md:col-span-3 lg:col-span-3  ft_in">
                    <label htmlFor="tech_height_ft" className="label">
                      {data?.payload?.tech_lang_keys["5"]}:
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
                  <div className="col-span-6 md:col-span-3 lg:col-span-3  ft_in">
                    <label htmlFor="tech_height_in" className="label">
                      &nbsp;
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_height_in"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_height_in}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown1}
                      >
                        {formData.tech_unit_h} ▾
                      </label>
                      {dropdownVisible1 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "millimeters (mm)", value: "mm" },
                            { label: "centimeters (cm)", value: "cm" },
                            { label: "meters (m)", value: "m" },
                            { label: "kilometers (km)", value: "km" },
                            { label: "inches (in)", value: "in" },
                            { label: "feet (ft)", value: "ft" },
                            { label: "yards (yd)", value: "yd" },
                            { label: "miles (mi)", value: "mi" },
                            { label: "nautical miles (nmi)", value: "nmi" },
                            { label: "feet / inches (ft/in)", value: "ft/in" },
                            {
                              label: "meters / centimeters (m/cm)",
                              value: "m/cm",
                            },
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
              {(formData.tech_unit_ft_in == "mm" ||
                formData.tech_unit_ft_in == "cm" ||
                formData.tech_unit_ft_in == "m" ||
                formData.tech_unit_ft_in == "km" ||
                formData.tech_unit_ft_in == "in" ||
                formData.tech_unit_ft_in == "ft" ||
                formData.tech_unit_ft_in == "yd" ||
                formData.tech_unit_ft_in == "mi" ||
                formData.tech_unit_ft_in == "nmi") && (
                <>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6 ">
                    <label htmlFor="tech_height_cm" className="label">
                      {data?.payload?.tech_lang_keys["5"]}
                      {formData.tech_unit_ft_in == "mm" ? (
                        <span className="text-blue height_unit">(mm)</span>
                      ) : formData.tech_unit_ft_in == "cm" ? (
                        <span className="text-blue height_unit">(cm)</span>
                      ) : formData.tech_unit_ft_in == "m" ? (
                        <span className="text-blue height_unit">(m)</span>
                      ) : formData.tech_unit_ft_in == "km" ? (
                        <span className="text-blue height_unit">(km)</span>
                      ) : formData.tech_unit_ft_in == "in" ? (
                        <span className="text-blue height_unit">(in)</span>
                      ) : formData.tech_unit_ft_in == "ft" ? (
                        <span className="text-blue height_unit">(ft)</span>
                      ) : formData.tech_unit_ft_in == "yd" ? (
                        <span className="text-blue height_unit">(yd)</span>
                      ) : formData.tech_unit_ft_in == "mi" ? (
                        <span className="text-blue height_unit">(mi)</span>
                      ) : formData.tech_unit_ft_in == "nmi" ? (
                        <span className="text-blue height_unit">(nmi)</span>
                      ) : null}
                    </label>
                    <div className="relative w-full ">
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
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown2}
                      >
                        {formData.tech_unit_h_cm} ▾
                      </label>
                      {dropdownVisible2 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "millimeters (mm)", value: "mm" },
                            { label: "centimeters (cm)", value: "cm" },
                            { label: "meters (m)", value: "m" },
                            { label: "kilometers (km)", value: "km" },
                            { label: "inches (in)", value: "in" },
                            { label: "feet (ft)", value: "ft" },
                            { label: "yards (yd)", value: "yd" },
                            { label: "miles (mi)", value: "mi" },
                            { label: "nautical miles (nmi)", value: "nmi" },
                            { label: "feet / inches (ft/in)", value: "ft/in" },
                            {
                              label: "meters / centimeters (m/cm)",
                              value: "m/cm",
                            },
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

              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_weight" className="label">
                  {data?.payload?.tech_lang_keys["6"]} :
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
                    onClick={toggleDropdown3}
                  >
                    {formData.tech_weight_unit} ▾
                  </label>
                  {dropdownVisible3 && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "micrograms (µg)", value: "µg" },
                        { label: "milligrams (mg)", value: "mg" },
                        { label: "grams (g)", value: "g" },
                        { label: "decagrams (dag)", value: "dag" },
                        { label: "kilograms (kg)", value: "kg" },
                        { label: "tons (t)", value: "t" },
                        { label: "grain (gr)", value: "gr" },
                        { label: "dram (dr)", value: "dr" },
                        { label: "ounces (oz)", value: "oz" },
                        { label: "pounds (lbs)", value: "lbs" },
                        { label: "stone (st)", value: "st" },
                        { label: "US ton", value: "US ton" },
                        { label: "long ton", value: "long ton" },
                        { label: "Earths", value: "Earths" },
                        { label: "me", value: "me" },
                        { label: "u", value: "u" },
                        { label: "oz t", value: "oz t" },
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
              <div className="w-full mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg  space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg  flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="w-full mt-2">
                        <div className="bg-sky bordered rounded-lg">
                          <div className="w-full px-3 py-2">
                            <div className="grid grid-cols-12   gap-2 md:gap-4 lg:gap-4">
                              <div className="col-span-12 md:col-span-5 lg:col-span-5">
                                <p>
                                  <strong>
                                    {data?.payload?.tech_lang_keys["1"]}
                                  </strong>
                                </p>
                                <p>
                                  <strong className="text-[#119154] text-[30px]">
                                    {Number(result?.tech_stroke_volume).toFixed(
                                      4
                                    )}
                                  </strong>
                                  <span className="text-[#119154] text-[18px]">
                                    l
                                  </span>
                                </p>
                              </div>
                              <div className="col-span-12 md:col-span-2 lg:col-span-2 hidden md:block lg:block justify-center">
                                <div
                                  className="border"
                                  style={{ width: "1px" }}
                                ></div>
                              </div>
                              <div className="col-span-12 md:col-span-5 lg:col-span-5 ps-md-4">
                                <p>
                                  <strong>
                                    {data?.payload?.tech_lang_keys["4"]}
                                  </strong>
                                </p>
                                <p>
                                  <strong className="text-[#119154] text-[30px]">
                                    {Number(result?.tech_bsa).toFixed(4)}
                                  </strong>
                                  <span className="text-[#119154] text-[18px]">
                                    m²
                                  </span>
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="w-full  px-3 py-2">
                          <div className="grid grid-cols-12   gap-2 md:gap-4 lg:gap-4">
                            <div className="col-span-12 md:col-span-5 lg:col-span-5">
                              <p>
                                <strong>
                                  {data?.payload?.tech_lang_keys["7"]}
                                </strong>
                              </p>
                              <p>
                                <strong className="text-[#119154] text-[30px]">
                                  {Number(
                                    result?.tech_stroke_val_index
                                  ).toFixed(4)}
                                </strong>
                                <span className="text-[#119154] text-[18px]">
                                  l/(min·m²)
                                </span>
                              </p>
                            </div>
                            <div className="col-span-12 md:col-span-2 lg:col-span-2 hidden md:block lg:block justify-center">
                              <div
                                className="border"
                                style={{ width: "1px" }}
                              ></div>
                            </div>
                            <div className="col-span-12 md:col-span-5 lg:col-span-5 ps-md-4">
                              <p>
                                <strong>
                                  {data?.payload?.tech_lang_keys["8"]}
                                </strong>
                              </p>
                              <p>
                                <strong className="text-[#119154] text-[30px]">
                                  {Number(result?.tech_stroke_index).toFixed(4)}
                                </strong>
                                <span className="text-[#119154] text-[18px]">
                                  l/m²
                                </span>
                              </p>
                            </div>
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

export default StrokeVolumeCalculator;

"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useCircumferenceCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const CircumferenceCalculator = () => {
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
    tech_radius: "",
    tech_unit_r: "yd",
    tech_diameter: "",
    tech_unit_d: "cm",
    tech_circumference: "15",
    tech_unit_c: "cm",
    tech_area: "",
    tech_unit_a: "cm",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useCircumferenceCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_radius: formData.tech_radius,
        tech_unit_r: formData.tech_unit_r,
        tech_diameter: formData.tech_diameter,
        tech_unit_d: formData.tech_unit_d,
        tech_circumference: formData.tech_circumference,
        tech_unit_c: formData.tech_unit_c,
        tech_area: formData.tech_area,
        tech_unit_a: formData.tech_unit_a,
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
      tech_radius: "",
      tech_unit_r: "yd",
      tech_diameter: "",
      tech_unit_d: "cm",
      tech_circumference: "15",
      tech_unit_c: "cm",
      tech_area: "",
      tech_unit_a: "cm",
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
    setFormData((prev) => ({ ...prev, tech_unit_r: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  //dropdown states
  const [dropdownVisible1, setDropdownVisible1] = useState(false);

  const setUnitHandler1 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_unit_d: unit }));
    setDropdownVisible1(false);
  };

  const toggleDropdown1 = () => {
    setDropdownVisible1(!dropdownVisible1);
  };

  //dropdown states
  const [dropdownVisible2, setDropdownVisible2] = useState(false);

  const setUnitHandler2 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_unit_c: unit }));
    setDropdownVisible2(false);
  };

  const toggleDropdown2 = () => {
    setDropdownVisible2(!dropdownVisible2);
  };

  //dropdown states
  const [dropdownVisible3, setDropdownVisible3] = useState(false);

  const setUnitHandler3 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_unit_a: unit }));
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
        <div className="w-full mx-auto p-4 lg:p-8 md:p-8 input_form rounded-lg space-y-6 mb-3">
          {formError && (
            <p className="text-red-500 text-lg font-semibold w-full">
              {formError}
            </p>
          )}
          <div className="lg:w-[60%] md:w-[80%] w-full mx-auto ">
            <p className="w-full my-3">
              {data?.payload?.tech_lang_keys["note_value"]}
            </p>
            <div className="grid grid-cols-2  lg:grid-cols-2 md:grid-cols-2  gap-4">
              <div className="space-y-2">
                <label htmlFor="tech_radius" className="label">
                  {data?.payload?.tech_lang_keys["radius"]}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_radius"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_radius}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown}
                  >
                    {formData.tech_unit_r} ▾
                  </label>
                  {dropdownVisible && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "centimeters (cm)", value: "cm" },
                        { label: "milimeters (mm)", value: "mm" },
                        { label: "meters (m)", value: "m" },
                        { label: "kilometers (km)", value: "km" },
                        { label: "inches (in)", value: "in" },
                        { label: "yards (yd)", value: "yd" },
                        { label: "miles (mi)", value: "mi" },
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
              <div className="space-y-2">
                <label htmlFor="tech_diameter" className="label">
                  {data?.payload?.tech_lang_keys["diameter"]}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_diameter"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_diameter}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown1}
                  >
                    {formData.tech_unit_d} ▾
                  </label>
                  {dropdownVisible1 && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "centimeters (cm)", value: "cm" },
                        { label: "milimeters (mm)", value: "mm" },
                        { label: "meters (m)", value: "m" },
                        { label: "kilometers (km)", value: "km" },
                        { label: "inches (in)", value: "in" },
                        { label: "yards (yd)", value: "yd" },
                        { label: "miles (mi)", value: "mi" },
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
              <div className="space-y-2">
                <label htmlFor="tech_circumference" className="label">
                  {data?.payload?.tech_lang_keys["circumference"]}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_circumference"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_circumference}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown2}
                  >
                    {formData.tech_unit_c} ▾
                  </label>
                  {dropdownVisible2 && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "centimeters (cm)", value: "cm" },
                        { label: "milimeters (mm)", value: "mm" },
                        { label: "meters (m)", value: "m" },
                        { label: "kilometers (km)", value: "km" },
                        { label: "inches (in)", value: "in" },
                        { label: "yards (yd)", value: "yd" },
                        { label: "miles (mi)", value: "mi" },
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
              <div className="space-y-2">
                <label htmlFor="tech_area" className="label">
                  {data?.payload?.tech_lang_keys["area"]}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_area"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_area}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown3}
                  >
                    {formData.tech_unit_a} ▾
                  </label>
                  {dropdownVisible3 && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "centimeters (cm)", value: "cm" },
                        { label: "milimeters (mm)", value: "mm" },
                        { label: "meters (m)", value: "m" },
                        { label: "kilometers (km)", value: "km" },
                        { label: "inches (in)", value: "in" },
                        { label: "yards (yd)", value: "yd" },
                        { label: "miles (mi)", value: "mi" },
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

          <div className="mb-6 mt-10 text-center space-x-2">
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

                  <div className="rounded-lg flex items-center">
                    <div className="w-full md:w-[60%] bg-light-blue rounded-lg mt-3">
                      <div className="flex flex-wrap">
                        <div className="w-full">
                          <table className="w-full">
                            <tbody>
                              {!formData?.tech_radius && (
                                <tr>
                                  <td className="py-2 border-b w-2/5">
                                    <strong>
                                      {data?.payload?.tech_lang_keys["radius"]}
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b text-right">
                                    <strong>r</strong>
                                  </td>
                                  <td className="py-2 border-b text-right">
                                    {result?.tech_Radius} cm
                                  </td>
                                </tr>
                              )}

                              {!formData?.tech_diameter && (
                                <tr>
                                  <td className="py-2 border-b">
                                    <strong>
                                      {
                                        data?.payload?.tech_lang_keys[
                                          "diameter"
                                        ]
                                      }
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b text-right">
                                    <strong>2r</strong>
                                  </td>
                                  <td className="py-2 border-b text-right">
                                    {Number(result?.tech_Radius * 2).toFixed(5)}{" "}
                                    cm
                                  </td>
                                </tr>
                              )}

                              {!formData?.tech_circumference && (
                                <tr>
                                  <td className="py-2 border-b">
                                    <strong>
                                      {
                                        data?.payload?.tech_lang_keys[
                                          "circumference"
                                        ]
                                      }
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b text-right">
                                    <strong>2πr</strong>
                                  </td>
                                  <td className="py-2 border-b text-right">
                                    {Number(
                                      result?.tech_Radius * 3.14159 * 2
                                    ).toFixed(5)}{" "}
                                    cm
                                  </td>
                                </tr>
                              )}

                              {!formData?.tech_area && (
                                <tr>
                                  <td className="py-2 border-b">
                                    <strong>
                                      {data?.payload?.tech_lang_keys["area"]}
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b text-right">
                                    <strong>πr²</strong>
                                  </td>
                                  <td className="py-2 border-b text-right">
                                    {Number(
                                      Math.pow(result?.tech_Radius, 2) * 3.14159
                                    ).toFixed(5)}{" "}
                                    cm
                                  </td>
                                </tr>
                              )}
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

export default CircumferenceCalculator;

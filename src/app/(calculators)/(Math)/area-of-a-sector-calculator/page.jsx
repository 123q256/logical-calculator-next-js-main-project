"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useAreaOfASectorCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const AreaOfASectorCalculator = () => {
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
    tech_angle: "120",
    tech_angle_unit: "deg",
    tech_rad: "120",
    tech_rad_unit: "cm",
    tech_diameter: "",
    tech_diameter_unit: "cm",
    tech_area: "",
    tech_area_unit: "cm²",
    tech_arc: "",
    tech_arc_unit: "cm",
    tech_c: "",
    tech_c_unit: "cm",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useAreaOfASectorCalculatorMutation();

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
        tech_angle: formData.tech_angle,
        tech_angle_unit: formData.tech_angle_unit,
        tech_rad: formData.tech_rad,
        tech_rad_unit: formData.tech_rad_unit,
        tech_diameter: formData.tech_diameter,
        tech_diameter_unit: formData.tech_diameter_unit,
        tech_area: formData.tech_area,
        tech_area_unit: formData.tech_area_unit,
        tech_arc: formData.tech_arc,
        tech_arc_unit: formData.tech_arc_unit,
        tech_c: formData.tech_c,
        tech_c_unit: formData.tech_c_unit,
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
      tech_angle: "120",
      tech_angle_unit: "deg",
      tech_rad: "120",
      tech_rad_unit: "cm",
      tech_diameter: "",
      tech_diameter_unit: "cm",
      tech_area: "",
      tech_area_unit: "cm²",
      tech_arc: "",
      tech_arc_unit: "cm",
      tech_c: "",
      tech_c_unit: "cm",
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
    setFormData((prev) => ({ ...prev, tech_angle_unit: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  //dropdown states
  const [dropdownVisible1, setDropdownVisible1] = useState(false);

  const setUnitHandler1 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_rad_unit: unit }));
    setDropdownVisible1(false);
  };

  const toggleDropdown1 = () => {
    setDropdownVisible1(!dropdownVisible1);
  };

  //dropdown states
  const [dropdownVisible2, setDropdownVisible2] = useState(false);

  const setUnitHandler2 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_diameter_unit: unit }));
    setDropdownVisible2(false);
  };

  const toggleDropdown2 = () => {
    setDropdownVisible2(!dropdownVisible2);
  };

  //dropdown states
  const [dropdownVisible3, setDropdownVisible3] = useState(false);

  const setUnitHandler3 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_area_unit: unit }));
    setDropdownVisible3(false);
  };

  const toggleDropdown3 = () => {
    setDropdownVisible3(!dropdownVisible3);
  };

  //dropdown states
  const [dropdownVisible4, setDropdownVisible4] = useState(false);

  const setUnitHandler4 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_arc_unit: unit }));
    setDropdownVisible4(false);
  };

  const toggleDropdown4 = () => {
    setDropdownVisible4(!dropdownVisible4);
  };

  //dropdown states
  const [dropdownVisible5, setDropdownVisible5] = useState(false);

  const setUnitHandler5 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_c_unit: unit }));
    setDropdownVisible5(false);
  };

  const toggleDropdown5 = () => {
    setDropdownVisible5(!dropdownVisible5);
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
            <div className="grid grid-cols-12 mt-3   gap-2 md:gap-4 lg:gap-4">
              <p className="col-span-12  mb-2">
                <strong>{data?.payload?.tech_lang_keys["8"]}:</strong>{" "}
                {data?.payload?.tech_lang_keys["9"]}.
              </p>
              <div className="col-span-6">
                <label htmlFor="tech_angle" className="label">
                  {data?.payload?.tech_lang_keys["1"]}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    min="1"
                    name="tech_angle"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_angle}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown}
                  >
                    {formData.tech_angle_unit} ▾
                  </label>
                  {dropdownVisible && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "degrees (deg)", value: "deg" },
                        { label: "radiana (rad)", value: "rad" },
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
              <div className="col-span-6">
                <label htmlFor="tech_rad" className="label">
                  {data?.payload?.tech_lang_keys["2"]}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    min="1"
                    name="tech_rad"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_rad}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown1}
                  >
                    {formData.tech_rad_unit} ▾
                  </label>
                  {dropdownVisible1 && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "centimeters (cm)", value: "cm" },
                        { label: "meters (m)", value: "m" },
                        { label: "inches (in)", value: "in" },
                        { label: "feets (ft)", value: "ft" },
                        { label: "yards (yd)", value: "yd" },
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
              <div className="col-span-6">
                <label htmlFor="tech_diameter" className="label">
                  {data?.payload?.tech_lang_keys["3"]}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    min="1"
                    name="tech_diameter"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_diameter}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown2}
                  >
                    {formData.tech_diameter_unit} ▾
                  </label>
                  {dropdownVisible2 && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "centimeters (cm)", value: "cm" },
                        { label: "meters (m)", value: "m" },
                        { label: "inches (in)", value: "in" },
                        { label: "feets (ft)", value: "ft" },
                        { label: "yards (yd)", value: "yd" },
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
              <div className="col-span-6">
                <label htmlFor="tech_area" className="label">
                  {data?.payload?.tech_lang_keys["4"]} (A)
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    min="1"
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
                    {formData.tech_area_unit} ▾
                  </label>
                  {dropdownVisible3 && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "square centimeters (cm²)", value: "cm²" },
                        { label: "square meters (m²)", value: "m²" },
                        { label: "square inches (in²)", value: "in²" },
                        { label: "square feets (ft²)", value: "ft²" },
                        { label: "square yards (yd²)", value: "yd²" },
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
              <div className="col-span-6">
                <label htmlFor="tech_arc" className="label">
                  {data?.payload?.tech_lang_keys["5"]} (L)
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    min="1"
                    name="tech_arc"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_arc}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown4}
                  >
                    {formData.tech_arc_unit} ▾
                  </label>
                  {dropdownVisible4 && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "centimeters (cm)", value: "cm" },
                        { label: "meters (m)", value: "m" },
                        { label: "inches (in)", value: "in" },
                        { label: "feets (ft)", value: "ft" },
                        { label: "yards (yd)", value: "yd" },
                      ].map((unit, index) => (
                        <p
                          key={index}
                          className="p-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => setUnitHandler4(unit.value)}
                        >
                          {unit.label}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="col-span-6">
                <label htmlFor="tech_c" className="label">
                  {data?.payload?.tech_lang_keys["6"]} (c)
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    min="1"
                    name="tech_c"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_c}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown5}
                  >
                    {formData.tech_c_unit} ▾
                  </label>
                  {dropdownVisible5 && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "centimeters (cm)", value: "cm" },
                        { label: "meters (m)", value: "m" },
                        { label: "inches (in)", value: "in" },
                        { label: "feets (ft)", value: "ft" },
                        { label: "yards (yd)", value: "yd" },
                      ].map((unit, index) => (
                        <p
                          key={index}
                          className="p-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => setUnitHandler5(unit.value)}
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
              <div className="w-full h-[30px] bg-gray-300 animate-pulse rounded-[10px] mb-4"></div>
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
                        <div className="w-full md:w-[60%] lg:w-[60%] overflow-auto mt-2">
                          <table className="w-full text-[16px]">
                            <tbody>
                              {result?.tech_mode == 1 ? (
                                <>
                                  <tr>
                                    <td className="py-2 border-b">
                                      <strong>
                                        {data?.payload?.tech_lang_keys["4"]} (A)
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {Number(result?.tech_area).toFixed(5)}{" "}
                                      {result?.tech_unit}²
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b">
                                      <strong>
                                        {data?.payload?.tech_lang_keys["5"]} (L)
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {Number(result?.tech_arc).toFixed(5)}{" "}
                                      {result?.tech_unit}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b">
                                      <strong>
                                        {data?.payload?.tech_lang_keys["6"]} (c)
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {Number(result?.tech_c).toFixed(5)}{" "}
                                      {result?.tech_unit}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b">
                                      <strong>
                                        {data?.payload?.tech_lang_keys["3"]}
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {Number(result?.tech_dia).toFixed(5)}{" "}
                                      {result?.tech_unit}
                                    </td>
                                  </tr>
                                </>
                              ) : result?.tech_mode == 2 ? (
                                <>
                                  <tr>
                                    <td className="py-2 border-b">
                                      <strong>
                                        {data?.payload?.tech_lang_keys["4"]} (A)
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {Number(result?.tech_area).toFixed(5)}{" "}
                                      {result?.tech_unit}²
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b">
                                      <strong>
                                        {data?.payload?.tech_lang_keys["5"]} (L)
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {Number(result?.tech_arc).toFixed(5)}{" "}
                                      {result?.tech_unit}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b">
                                      <strong>
                                        {data?.payload?.tech_lang_keys["6"]} (c)
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {Number(result?.tech_c).toFixed(5)}{" "}
                                      {result?.tech_unit}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b">
                                      <strong>
                                        {data?.payload?.tech_lang_keys["2"]}
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {Number(result?.tech_rad).toFixed(5)}{" "}
                                      {result?.tech_unit}
                                    </td>
                                  </tr>
                                </>
                              ) : result?.tech_mode == 3 ? (
                                <>
                                  <tr>
                                    <td className="py-2 border-b">
                                      <strong>
                                        {data?.payload?.tech_lang_keys["7"]}
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {Number(result?.tech_angle).toFixed(5)}{" "}
                                      rad /{" "}
                                      {Number(
                                        rad2deg(result?.tech_angle)
                                      ).toFixed(5)}{" "}
                                      deg
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b">
                                      <strong>
                                        {data?.payload?.tech_lang_keys["5"]} (L)
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {Number(result?.tech_arc).toFixed(5)}{" "}
                                      {result?.tech_unit}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b">
                                      <strong>
                                        {data?.payload?.tech_lang_keys["6"]} (c)
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {Number(result?.tech_c).toFixed(5)}{" "}
                                      {result?.tech_unit}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b">
                                      <strong>
                                        {data?.payload?.tech_lang_keys["3"]}
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {Number(result?.tech_dia).toFixed(5)}{" "}
                                      {result?.tech_unit}
                                    </td>
                                  </tr>
                                </>
                              ) : result?.tech_mode == 4 ? (
                                <>
                                  <tr>
                                    <td className="py-2 border-b">
                                      <strong>
                                        {data?.payload?.tech_lang_keys["2"]}
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {Number(result?.tech_rad).toFixed(5)}{" "}
                                      {result?.tech_unit}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b">
                                      <strong>
                                        {data?.payload?.tech_lang_keys["5"]} (L)
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {Number(result?.tech_arc).toFixed(5)}{" "}
                                      {result?.tech_unit}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b">
                                      <strong>
                                        {data?.payload?.tech_lang_keys["6"]} (c)
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {Number(result?.tech_c).toFixed(5)}{" "}
                                      {result?.tech_unit}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b">
                                      <strong>
                                        {data?.payload?.tech_lang_keys["3"]}
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {Number(result?.tech_dia).toFixed(5)}{" "}
                                      {result?.tech_unit}
                                    </td>
                                  </tr>
                                </>
                              ) : result?.tech_mode == 5 ? (
                                <>
                                  <tr>
                                    <td className="py-2 border-b">
                                      <strong>
                                        {data?.payload?.tech_lang_keys["4"]} (A)
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {Number(result?.tech_area).toFixed(5)}{" "}
                                      {result?.tech_unit}²
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b">
                                      <strong>
                                        {data?.payload?.tech_lang_keys["2"]} (L)
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {Number(result?.tech_rad).toFixed(5)}{" "}
                                      {result?.tech_unit}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b">
                                      <strong>
                                        {data?.payload?.tech_lang_keys["6"]} (c)
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {Number(result?.tech_c).toFixed(5)}{" "}
                                      {result?.tech_unit}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b">
                                      <strong>
                                        {data?.payload?.tech_lang_keys["3"]}
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {Number(result?.tech_dia).toFixed(5)}{" "}
                                      {result?.tech_unit}
                                    </td>
                                  </tr>
                                </>
                              ) : result?.tech_mode == 6 ? (
                                <>
                                  <tr>
                                    <td className="py-2 border-b">
                                      <strong>
                                        {data?.payload?.tech_lang_keys["4"]} (A)
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {Number(result?.tech_area).toFixed(5)}{" "}
                                      {result?.tech_unit}²
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b">
                                      <strong>
                                        {data?.payload?.tech_lang_keys["2"]} (L)
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {Number(result?.tech_rad).toFixed(5)}{" "}
                                      {result?.tech_unit}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b">
                                      <strong>
                                        {data?.payload?.tech_lang_keys["5"]} (L)
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {Number(result?.tech_c).toFixed(5)}{" "}
                                      {result?.tech_unit}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b">
                                      <strong>
                                        {data?.payload?.tech_lang_keys["3"]}
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {Number(result?.tech_dia).toFixed(5)}{" "}
                                      {result?.tech_unit}
                                    </td>
                                  </tr>
                                </>
                              ) : result?.tech_mode == 7 ? (
                                <>
                                  <tr>
                                    <td className="py-2 border-b">
                                      <strong>
                                        {data?.payload?.tech_lang_keys["4"]} (A)
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {Number(result?.tech_area).toFixed(5)}{" "}
                                      {result?.tech_unit}²
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b">
                                      <strong>
                                        {data?.payload?.tech_lang_keys["7"]}
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {Number(result?.tech_angle).toFixed(5)}{" "}
                                      rad /{" "}
                                      {Number(
                                        rad2deg(result?.tech_angle)
                                      ).toFixed(5)}{" "}
                                      deg
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b">
                                      <strong>
                                        {data?.payload?.tech_lang_keys["6"]} (c)
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {Number(result?.tech_c).toFixed(5)}{" "}
                                      {result?.tech_unit}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b">
                                      <strong>
                                        {data?.payload?.tech_lang_keys["3"]}
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {Number(result?.tech_dia).toFixed(5)}{" "}
                                      {result?.tech_unit}
                                    </td>
                                  </tr>
                                </>
                              ) : result?.tech_mode == 8 ? (
                                <>
                                  <tr>
                                    <td className="py-2 border-b">
                                      <strong>
                                        {data?.payload?.tech_lang_keys["4"]} (A)
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {Number(result?.tech_area).toFixed(5)}{" "}
                                      {result?.tech_unit}²
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b">
                                      <strong>
                                        {data?.payload?.tech_lang_keys["7"]}
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {Number(result?.tech_angle).toFixed(5)}{" "}
                                      rad /{" "}
                                      {Number(
                                        rad2deg(result?.tech_angle)
                                      ).toFixed(5)}{" "}
                                      deg
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b">
                                      <strong>
                                        {data?.payload?.tech_lang_keys["5"]} (L)
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {Number(result?.tech_arc).toFixed(5)}{" "}
                                      {result?.tech_unit}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b">
                                      <strong>
                                        {data?.payload?.tech_lang_keys["3"]}
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {Number(result?.tech_dia).toFixed(5)}{" "}
                                      {result?.tech_unit}
                                    </td>
                                  </tr>
                                </>
                              ) : result?.tech_mode == 9 ? (
                                <>
                                  <tr>
                                    <td className="py-2 border-b">
                                      <strong>
                                        {data?.payload?.tech_lang_keys["7"]}
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {Number(result?.tech_angle).toFixed(5)}{" "}
                                      rad /{" "}
                                      {Number(
                                        rad2deg(result?.tech_angle)
                                      ).toFixed(5)}{" "}
                                      deg
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b">
                                      <strong>
                                        {data?.payload?.tech_lang_keys["5"]} (L)
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {Number(result?.tech_arc).toFixed(5)}{" "}
                                      {result?.tech_unit}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b">
                                      <strong>
                                        {data?.payload?.tech_lang_keys["6"]} (c)
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {Number(result?.tech_c).toFixed(5)}{" "}
                                      {result?.tech_unit}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b">
                                      <strong>
                                        {data?.payload?.tech_lang_keys["2"]}
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {Number(result?.tech_rad).toFixed(5)}{" "}
                                      {result?.tech_unit}
                                    </td>
                                  </tr>
                                </>
                              ) : result?.tech_mode == 10 ? (
                                <>
                                  <tr>
                                    <td className="py-2 border-b">
                                      <strong>
                                        {data?.payload?.tech_lang_keys["4"]} (A)
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {Number(result?.tech_area).toFixed(5)}{" "}
                                      {result?.tech_unit}²
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b">
                                      <strong>
                                        {data?.payload?.tech_lang_keys["7"]}
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {Number(result?.tech_angle).toFixed(5)}{" "}
                                      rad /{" "}
                                      {Number(
                                        rad2deg(result?.tech_angle)
                                      ).toFixed(5)}{" "}
                                      deg
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b">
                                      <strong>
                                        {data?.payload?.tech_lang_keys["6"]} (c)
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {Number(result?.tech_c).toFixed(5)}{" "}
                                      {result?.tech_unit}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b">
                                      <strong>
                                        {data?.payload?.tech_lang_keys["2"]}
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {Number(result?.tech_rad).toFixed(5)}{" "}
                                      {result?.tech_unit}
                                    </td>
                                  </tr>
                                </>
                              ) : result?.tech_mode == 11 ? (
                                <>
                                  <tr>
                                    <td className="py-2 border-b">
                                      <strong>
                                        {data?.payload?.tech_lang_keys["4"]} (A)
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {Number(result?.tech_area).toFixed(5)}{" "}
                                      {result?.tech_unit}²
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b">
                                      <strong>
                                        {data?.payload?.tech_lang_keys["7"]}
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {Number(result?.tech_angle).toFixed(5)}{" "}
                                      rad /{" "}
                                      {Number(
                                        rad2deg(result?.tech_angle)
                                      ).toFixed(5)}{" "}
                                      deg
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b">
                                      <strong>
                                        {data?.payload?.tech_lang_keys["5"]} (L)
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {Number(result?.tech_arc).toFixed(5)}{" "}
                                      {result?.tech_unit}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b">
                                      <strong>
                                        {data?.payload?.tech_lang_keys["2"]}
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {Number(result?.tech_rad).toFixed(5)}{" "}
                                      {result?.tech_unit}
                                    </td>
                                  </tr>
                                </>
                              ) : (
                                <>
                                  <tr>
                                    <td className="py-2 border-b">
                                      <strong>
                                        {data?.payload?.tech_lang_keys["6"]} (c)
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {Number(result?.tech_c).toFixed(5)}{" "}
                                      {result?.tech_unit}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b">
                                      <strong>
                                        {data?.payload?.tech_lang_keys["2"]}
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {Number(result?.tech_rad).toFixed(5)}{" "}
                                      {result?.tech_unit}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b">
                                      <strong>
                                        {data?.payload?.tech_lang_keys["3"]}
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {Number(result?.tech_dia).toFixed(5)}{" "}
                                      {result?.tech_unit}
                                    </td>
                                  </tr>
                                </>
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

export default AreaOfASectorCalculator;

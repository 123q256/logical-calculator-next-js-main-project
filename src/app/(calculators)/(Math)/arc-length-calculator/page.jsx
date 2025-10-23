"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import {
  useGetSingleCalculatorDetailsMutation,
  useArcLengthCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const ArcLengthCalculator = () => {
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
    tech_find: "0",
    tech_angle: 124,
    tech_angle_unit: "arcsec",
    tech_rad: 121,
    tech_rad_unit: "km",
    tech_diameter: 20,
    tech_diameter_unit: "m",
    tech_area: 20,
    tech_area_unit: "cm²",
    tech_chrd_len: 100,
    tech_chrd_len_unit: "m",
    tech_seg_height: 100,
    tech_seg_height_unit: "m",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useArcLengthCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_find) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_find: formData.tech_find,
        tech_angle: formData.tech_angle,
        tech_angle_unit: formData.tech_angle_unit,
        tech_rad: formData.tech_rad,
        tech_rad_unit: formData.tech_rad_unit,
        tech_diameter: formData.tech_diameter,
        tech_diameter_unit: formData.tech_diameter_unit,
        tech_area: formData.tech_area,
        tech_area_unit: formData.tech_area_unit,
        tech_chrd_len: formData.tech_chrd_len,
        tech_chrd_len_unit: formData.tech_chrd_len_unit,
        tech_seg_height: formData.tech_seg_height,
        tech_seg_height_unit: formData.tech_seg_height_unit,
      }).unwrap();
      setResult(response?.payload); // Assuming the response has 'lovePercentage'
      toast.success("Successfully Calculated");
    } catch (err) {
      setFormError(err.data.payload.error);
      toast.error(err.data.payload.error);
    }
  };

  // Handle reset form
  const handleReset = () => {
    setFormData({
      tech_find: "0",
      tech_angle: 124,
      tech_angle_unit: "arcsec",
      tech_rad: 121,
      tech_rad_unit: "km",
      tech_diameter: 20,
      tech_diameter_unit: "m",
      tech_area: 20,
      tech_area_unit: "cm²",
      tech_chrd_len: 100,
      tech_chrd_len_unit: "m",
      tech_seg_height: 100,
      tech_seg_height_unit: "m",
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
    setFormData((prev) => ({ ...prev, tech_chrd_len_unit: unit }));
    setDropdownVisible4(false);
  };

  const toggleDropdown4 = () => {
    setDropdownVisible4(!dropdownVisible4);
  };

  //dropdown states
  const [dropdownVisible5, setDropdownVisible5] = useState(false);

  const setUnitHandler5 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_seg_height_unit: unit }));
    setDropdownVisible5(false);
  };

  const toggleDropdown5 = () => {
    setDropdownVisible5(!dropdownVisible5);
  };

  function rad2deg(radian) {
    return radian * (180 / Math.PI);
  }

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
              <div className="lg:col-span-6 md:col-span-6 col-span-12">
                <div className="col-span-12">
                  <label htmlFor="tech_find" className="label">
                    {data?.payload?.tech_lang_keys["1"]}:
                  </label>
                  <div className="mt-2">
                    <select
                      className="input"
                      aria-label="select"
                      name="tech_find"
                      id="tech_find"
                      value={formData.tech_find}
                      onChange={handleChange}
                    >
                      <option value="0">
                        {data?.payload?.tech_lang_keys["2"]}{" "}
                      </option>
                      <option value="1">
                        {data?.payload?.tech_lang_keys["3"]}{" "}
                      </option>
                      <option value="2">
                        {data?.payload?.tech_lang_keys["4"]}{" "}
                      </option>
                      <option value="3">
                        {data?.payload?.tech_lang_keys["5"]}{" "}
                      </option>
                      <option value="4">
                        {data?.payload?.tech_lang_keys["6"]}{" "}
                      </option>
                      <option value="5">
                        {data?.payload?.tech_lang_keys["7"]}{" "}
                      </option>
                      <option value="6">
                        {data?.payload?.tech_lang_keys["8"]}{" "}
                      </option>
                      <option value="7">
                        {data?.payload?.tech_lang_keys["9"]}{" "}
                      </option>
                    </select>
                  </div>
                </div>
                {(formData.tech_find == "0" ||
                  formData.tech_find == "4" ||
                  formData.tech_find == "5" ||
                  formData.tech_find == "6" ||
                  formData.tech_find == "7") && (
                  <>
                    <div className="col-span-12" id="angleInput">
                      <label htmlFor="tech_angle" className="label">
                        {data?.payload?.tech_lang_keys["10"]}{" "}
                        {data?.payload?.tech_lang_keys["21"]} (θ)
                      </label>
                      <div className="relative w-full ">
                        <input
                          type="number"
                          name="tech_angle"
                          step="any"
                          min="1"
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
                              { label: "radians (rad)", value: "rad" },
                              { label: "gradians (gon)", value: "gon" },
                              { label: "(tr)", value: "tr" },
                              { label: "arcminute (arcmin)", value: "arcmin" },
                              { label: "Arc Second (arcsec)", value: "arcsec" },
                              { label: "milliradians (mrad)", value: "mrad" },
                              { label: "microradians (μrad)", value: "μrad" },
                              { label: "* π rad (pirad)", value: "pirad" },
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
                  </>
                )}
                {(formData.tech_find == "0" ||
                  formData.tech_find == "1" ||
                  formData.tech_find == "2" ||
                  formData.tech_find == "3") && (
                  <>
                    <div className="col-span-12 " id="radianInput">
                      <label htmlFor="tech_rad" className="label">
                        {data?.payload?.tech_lang_keys["11"]} (r)
                      </label>
                      <div className="relative w-full ">
                        <input
                          type="number"
                          name="tech_rad"
                          step="any"
                          min="1"
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
                              { label: "millimeters (mm)", value: "mm" },
                              { label: "centimeters (cm)", value: "cm" },
                              { label: "meters (m)", value: "m" },
                              { label: "kilometers (km)", value: "km" },
                              { label: "inches (in)", value: "in" },
                              { label: "feets (ft)", value: "ft" },
                              { label: "yards (yd)", value: "yd" },
                              { label: "miles (mi)", value: "mi" },
                              { label: "nautical miles (nmi)", value: "nmi" },
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
                {formData.tech_find == "4" && (
                  <>
                    <div className="col-span-12 " id="diameterInput">
                      <label htmlFor="tech_diameter" className="label">
                        {data?.payload?.tech_lang_keys["12"]}
                      </label>
                      <div className="relative w-full ">
                        <input
                          type="number"
                          name="tech_diameter"
                          step="any"
                          min="1"
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
                              { label: "millimeters (mm)", value: "mm" },
                              { label: "centimeters (cm)", value: "cm" },
                              { label: "meters (m)", value: "m" },
                              { label: "kilometers (km)", value: "km" },
                              { label: "inches (in)", value: "in" },
                              { label: "feets (ft)", value: "ft" },
                              { label: "yards (yd)", value: "yd" },
                              { label: "miles (mi)", value: "mi" },
                              { label: "nautical miles (nmi)", value: "nmi" },
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
                {(formData.tech_find == "2" || formData.tech_find == "5") && (
                  <>
                    <div className="col-span-12" id="areaInput">
                      <label htmlFor="tech_area" className="label">
                        {data?.payload?.tech_lang_keys["13"]}{" "}
                        {data?.payload?.tech_lang_keys["20"]} (A)
                      </label>
                      <div className="relative w-full ">
                        <input
                          type="number"
                          name="tech_area"
                          step="any"
                          min="1"
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
                              {
                                label: "square millimeters (mm²)",
                                value: "mm²",
                              },
                              {
                                label: "square centimeters (cm²)",
                                value: "cm²",
                              },
                              {
                                label: "square decimeters (dm²)",
                                value: "dm²",
                              },
                              { label: "square meters (m²)", value: "m²" },
                              {
                                label: "square kilometers (km²)",
                                value: "km²",
                              },
                              { label: "square inchs (in²)", value: "in²" },
                              { label: "square feets (ft²)", value: "ft²" },
                              { label: "square yards (yd²)", value: "yd²" },
                              { label: "square miles (mi²)", value: "mi²" },
                              { label: "are (a)", value: "a" },
                              { label: "dalton (da)", value: "da" },
                              { label: "hectare (ha)", value: "ha" },
                              { label: "(ac)", value: "ac" },
                              { label: "soccer fields (s_f)", value: "s_f" },
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
                  </>
                )}
                {(formData.tech_find == "6" || formData.tech_find == "3") && (
                  <>
                    <div className="col-span-12 " id="chrd_lenInput">
                      <label htmlFor="tech_chrd_len" className="label">
                        {data?.payload?.tech_lang_keys["14"]}{" "}
                        {data?.payload?.tech_lang_keys["22"]} (c)
                      </label>
                      <div className="relative w-full ">
                        <input
                          type="number"
                          name="tech_chrd_len"
                          step="any"
                          min="1"
                          className="mt-1 input"
                          value={formData.tech_chrd_len}
                          placeholder="00"
                          onChange={handleChange}
                        />
                        <label
                          className="absolute cursor-pointer text-sm underline right-6 top-4"
                          onClick={toggleDropdown4}
                        >
                          {formData.tech_chrd_len_unit} ▾
                        </label>
                        {dropdownVisible4 && (
                          <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                            {[
                              { label: "millimeters (mm)", value: "mm" },
                              { label: "centimeters (cm)", value: "cm" },
                              { label: "meters (m)", value: "m" },
                              { label: "kilometers (km)", value: "km" },
                              { label: "inches (in)", value: "in" },
                              { label: "feets (ft)", value: "ft" },
                              { label: "yards (yd)", value: "yd" },
                              { label: "miles (mi)", value: "mi" },
                              { label: "nautical miles (nmi)", value: "nmi" },
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
                  </>
                )}
                {(formData.tech_find == "1" || formData.tech_find == "7") && (
                  <>
                    <div className="col-span-12" id="seg_heightInput">
                      <label htmlFor="tech_seg_height" className="label">
                        {data?.payload?.tech_lang_keys["15"]} (h)
                      </label>
                      <div className="relative w-full ">
                        <input
                          type="number"
                          name="tech_seg_height"
                          step="any"
                          min="1"
                          className="mt-1 input"
                          value={formData.tech_seg_height}
                          placeholder="00"
                          onChange={handleChange}
                        />
                        <label
                          className="absolute cursor-pointer text-sm underline right-6 top-4"
                          onClick={toggleDropdown5}
                        >
                          {formData.tech_seg_height_unit} ▾
                        </label>
                        {dropdownVisible5 && (
                          <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                            {[
                              { label: "millimeters (mm)", value: "mm" },
                              { label: "centimeters (cm)", value: "cm" },
                              { label: "meters (m)", value: "m" },
                              { label: "kilometers (km)", value: "km" },
                              { label: "inches (in)", value: "in" },
                              { label: "feets (ft)", value: "ft" },
                              { label: "yards (yd)", value: "yd" },
                              { label: "miles (mi)", value: "mi" },
                              { label: "nautical miles (nmi)", value: "nmi" },
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
                  </>
                )}
              </div>
              <div className="lg:col-span-6 md:col-span-6 col-span-12 flex items-center">
                <div className="col-12 text-center justify-center flex ">
                  <img
                    src="/images/arc_length.png"
                    width="75%"
                    height="100%"
                    alt="arc length img"
                    loading="lazy"
                    decoding="async"
                  />
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

                  <div className="rounded-lg  flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="w-full">
                        <div className="w-full md:w-[80%] lg:w-[80%] overflow-auto mt-2">
                          <table className="w-full text-[16px]">
                            <tbody>
                              {formData?.tech_find === "0" ? (
                                <>
                                  <tr>
                                    <td className="py-2 border-b" width="60%">
                                      <strong>
                                        {data?.payload?.tech_lang_keys["16"]}
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {result?.tech_arc_len} m
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b" width="60%">
                                      <strong>
                                        {data?.payload?.tech_lang_keys["12"]}
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {result?.tech_diameter} m
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b" width="60%">
                                      <strong>
                                        {data?.payload?.tech_lang_keys["13"]}{" "}
                                        {data?.payload?.tech_lang_keys["17"]}
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {result?.tech_area} m²
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b" width="60%">
                                      <strong>
                                        {data?.payload?.tech_lang_keys["14"]}{" "}
                                        {data?.payload?.tech_lang_keys["18"]}
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {result?.tech_chrd_len} m
                                    </td>
                                  </tr>
                                </>
                              ) : formData?.tech_find === "1" ? (
                                <>
                                  <tr>
                                    <td className="py-2 border-b" width="60%">
                                      <strong>
                                        {data?.payload?.tech_lang_keys["16"]}
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {result?.tech_arc_len} m
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b" width="60%">
                                      <strong>
                                        {data?.payload?.tech_lang_keys["10"]}{" "}
                                        {data?.payload?.tech_lang_keys["19"]}
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {result?.tech_angle} rad /{" "}
                                      {Number(
                                        rad2deg(result?.tech_angle)
                                      ).toFixed(5)}{" "}
                                      deg
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b" width="60%">
                                      <strong>
                                        {data?.payload?.tech_lang_keys["12"]}
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {result?.tech_diameter} m
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b" width="60%">
                                      <strong>
                                        {data?.payload?.tech_lang_keys["13"]}{" "}
                                        {data?.payload?.tech_lang_keys["17"]}
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {result?.tech_area} m²
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b" width="60%">
                                      <strong>
                                        {data?.payload?.tech_lang_keys["14"]}{" "}
                                        {data?.payload?.tech_lang_keys["18"]}
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {result?.tech_chrd_len} m
                                    </td>
                                  </tr>
                                </>
                              ) : formData?.tech_find === "2" ? (
                                <>
                                  <tr>
                                    <td className="py-2 border-b" width="60%">
                                      <strong>
                                        {data?.payload?.tech_lang_keys["16"]}
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {result?.tech_arc_len} m
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b" width="60%">
                                      <strong>
                                        {data?.payload?.tech_lang_keys["19"]}
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {result?.tech_angle} rad /{" "}
                                      {Number(
                                        rad2deg(result?.tech_angle)
                                      ).toFixed(5)}{" "}
                                      deg
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b" width="60%">
                                      <strong>
                                        {data?.payload?.tech_lang_keys["12"]}
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {result?.tech_diameter} m
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b" width="60%">
                                      <strong>
                                        {data?.payload?.tech_lang_keys["13"]}{" "}
                                        {data?.payload?.tech_lang_keys["17"]}
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {result?.tech_area} m²
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b" width="60%">
                                      <strong>
                                        {data?.payload?.tech_lang_keys["14"]}{" "}
                                        {data?.payload?.tech_lang_keys["18"]}
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {result?.tech_chrd_len} m
                                    </td>
                                  </tr>
                                </>
                              ) : formData?.tech_find === "3" ? (
                                <>
                                  <tr>
                                    <td className="py-2 border-b" width="60%">
                                      <strong>
                                        {data?.payload?.tech_lang_keys["16"]}
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {result?.tech_arc_len} m
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b" width="60%">
                                      <strong>
                                        {data?.payload?.tech_lang_keys["19"]}
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {result?.tech_angle} rad /{" "}
                                      {Number(
                                        rad2deg(result?.tech_angle)
                                      ).toFixed(5)}{" "}
                                      deg
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b" width="60%">
                                      <strong>
                                        {data?.payload?.tech_lang_keys["12"]}
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {result?.tech_diameter} m
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b" width="60%">
                                      <strong>
                                        {data?.payload?.tech_lang_keys["17"]}
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {result?.tech_area} m²
                                    </td>
                                  </tr>
                                </>
                              ) : formData?.tech_find === "4" ? (
                                <>
                                  <tr>
                                    <td className="py-2 border-b" width="60%">
                                      <strong>
                                        {data?.payload?.tech_lang_keys["16"]}
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {result?.tech_arc_len} m
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b" width="60%">
                                      <strong>
                                        {data?.payload?.tech_lang_keys["11"]}
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {result?.tech_rad} m
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b" width="60%">
                                      <strong>
                                        {data?.payload?.tech_lang_keys["12"]}
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {result?.tech_diameter} m
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b" width="60%">
                                      <strong>
                                        {data?.payload?.tech_lang_keys["13"]}{" "}
                                        {data?.payload?.tech_lang_keys["17"]}
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {result?.tech_area} m²
                                    </td>
                                  </tr>
                                </>
                              ) : formData?.tech_find === "5" ? (
                                <>
                                  <tr>
                                    <td className="py-2 border-b" width="60%">
                                      <strong>
                                        {data?.payload?.tech_lang_keys["16"]}
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {result?.tech_arc_len} m
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b" width="60%">
                                      <strong>
                                        {data?.payload?.tech_lang_keys["11"]}
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {result?.tech_rad} m
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b" width="60%">
                                      <strong>
                                        {data?.payload?.tech_lang_keys["12"]}
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {result?.tech_diameter} m
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b" width="60%">
                                      <strong>
                                        {data?.payload?.tech_lang_keys["14"]}{" "}
                                        {data?.payload?.tech_lang_keys["18"]}
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {result?.tech_chrd_len} m
                                    </td>
                                  </tr>
                                </>
                              ) : formData?.tech_find === "6" ? (
                                <>
                                  <tr>
                                    <td className="py-2 border-b" width="60%">
                                      <strong>
                                        {data?.payload?.tech_lang_keys["16"]}
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {result?.tech_arc_len} m
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b" width="60%">
                                      <strong>
                                        {data?.payload?.tech_lang_keys["11"]}
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {result?.tech_rad} m
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b" width="60%">
                                      <strong>
                                        {data?.payload?.tech_lang_keys["12"]}
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {result?.tech_diameter} m
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b" width="60%">
                                      <strong>
                                        {data?.payload?.tech_lang_keys["13"]}{" "}
                                        {data?.payload?.tech_lang_keys["17"]}
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {result?.tech_area} m²
                                    </td>
                                  </tr>
                                </>
                              ) : (
                                <>
                                  <tr>
                                    <td className="py-2 border-b" width="60%">
                                      <strong>
                                        {data?.payload?.tech_lang_keys["16"]}
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {result?.tech_arc_len} m
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b" width="60%">
                                      <strong>
                                        {data?.payload?.tech_lang_keys["10"]}{" "}
                                        {data?.payload?.tech_lang_keys["19"]}
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {result?.tech_angle} rad /{" "}
                                      {Number(
                                        rad2deg(result?.tech_angle)
                                      ).toFixed(5)}{" "}
                                      deg
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b" width="60%">
                                      <strong>
                                        {data?.payload?.tech_lang_keys["11"]}
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {result?.tech_rad} m
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b" width="60%">
                                      <strong>
                                        {data?.payload?.tech_lang_keys["12"]}
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {result?.tech_diameter} m
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 border-b" width="60%">
                                      <strong>
                                        {data?.payload?.tech_lang_keys["13"]}{" "}
                                        {data?.payload?.tech_lang_keys["17"]}
                                      </strong>
                                    </td>
                                    <td className="py-2 border-b">
                                      {result?.tech_area} m²
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

export default ArcLengthCalculator;

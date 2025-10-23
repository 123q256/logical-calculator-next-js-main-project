"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import "katex/dist/katex.min.css";
import { BlockMath, InlineMath } from "react-katex";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useHypotenuseCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const HypotenuseCalculator = () => {
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
    tech_cal_from: "two_sides", // two_sides  angle_side area_side
    tech_cal: "hypo", // hypo area  side_a side_b
    tech_cal_with: "a_angle", // a_angle b_angle
    tech_cal_with1: "area_a",
    tech_area: "75",
    tech_area_unit: "cm²",
    tech_a: "75",
    tech_a_unit: "cm",
    tech_angle_a: "75",
    tech_angle_a_unit: "deg",
    tech_b: "75",
    tech_angle_b: "75",
    tech_b_unit: "deg",
    tech_angle_b_unit: "deg",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useHypotenuseCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_cal_from) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_cal_from: formData.tech_cal_from,
        tech_cal: formData.tech_cal,
        tech_cal_with: formData.tech_cal_with,
        tech_cal_with1: formData.tech_cal_with1,
        tech_area: formData.tech_area,
        tech_area_unit: formData.tech_area_unit,
        tech_a: formData.tech_a,
        tech_a_unit: formData.tech_a_unit,
        tech_angle_a: formData.tech_angle_a,
        tech_angle_a_unit: formData.tech_angle_a_unit,
        tech_b: formData.tech_b,
        tech_angle_b: formData.tech_angle_b,
        tech_b_unit: formData.tech_b_unit,
        tech_angle_b_unit: formData.tech_angle_b_unit,
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
      tech_cal_from: "two_sides", // two_sides  angle_side area_side
      tech_cal: "hypo", // hypo area  side_a side_b
      tech_cal_with: "a_angle", // a_angle b_angle
      tech_cal_with1: "area_a",
      tech_area: "75",
      tech_area_unit: "cm²",
      tech_a: "75",
      tech_a_unit: "cm",
      tech_angle_a: "75",
      tech_angle_a_unit: "deg",
      tech_b: "75",
      tech_angle_b: "75",
      tech_b_unit: "deg",
      tech_angle_b_unit: "deg",
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
    setFormData((prev) => ({ ...prev, tech_area_unit: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  //dropdown states
  const [dropdownVisible1, setDropdownVisible1] = useState(false);

  const setUnitHandler1 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_a_unit: unit }));
    setDropdownVisible1(false);
  };

  const toggleDropdown1 = () => {
    setDropdownVisible1(!dropdownVisible1);
  };

  //dropdown states
  const [dropdownVisible2, setDropdownVisible2] = useState(false);

  const setUnitHandler2 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_angle_a_unit: unit }));
    setDropdownVisible2(false);
  };

  const toggleDropdown2 = () => {
    setDropdownVisible2(!dropdownVisible2);
  };

  //dropdown states
  const [dropdownVisible3, setDropdownVisible3] = useState(false);

  const setUnitHandler3 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_b_unit: unit }));
    setDropdownVisible3(false);
  };

  const toggleDropdown3 = () => {
    setDropdownVisible3(!dropdownVisible3);
  };

  //dropdown states
  const [dropdownVisible4, setDropdownVisible4] = useState(false);

  const setUnitHandler4 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_angle_b_unit: unit }));
    setDropdownVisible4(false);
  };

  const toggleDropdown4 = () => {
    setDropdownVisible4(!dropdownVisible4);
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

          <div className="lg:w-[50%] md:w-[80%] w-full mx-auto ">
            <div className="grid grid-cols-12 mt-3 gap-2 md:gap-4 lg:gap-4">
              <div className="col-span-12">
                <label htmlFor="tech_cal_from" className="label">
                  {data?.payload?.tech_lang_keys["calculate"]}{" "}
                  {data?.payload?.tech_lang_keys["1"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_cal_from"
                    id="tech_cal_from"
                    value={formData.tech_cal_from}
                    onChange={handleChange}
                  >
                    <option value="two_sides">
                      {data?.payload?.tech_lang_keys["2"]} ∟
                    </option>
                    <option value="angle_side">
                      {data?.payload?.tech_lang_keys["3"]} ∡{" "}
                      {data?.payload?.tech_lang_keys["4"]}{" "}
                    </option>
                    <option value="area_side">
                      {data?.payload?.tech_lang_keys["5"]} ⊿{" "}
                      {data?.payload?.tech_lang_keys["4"]}
                    </option>
                  </select>
                </div>
              </div>
              {formData.tech_cal_from == "area_side" && (
                <>
                  <div className="col-span-12" id="calInput">
                    <label htmlFor="tech_cal" className="label">
                      {data?.payload?.tech_lang_keys["calculate"]}:
                    </label>
                    <div className="mt-2">
                      <select
                        className="input"
                        aria-label="select"
                        name="tech_cal"
                        id="tech_cal"
                        value={formData.tech_cal}
                        onChange={handleChange}
                      >
                        <option value="hypo">
                          {data?.payload?.tech_lang_keys["8"]}
                        </option>
                        <option value="area">
                          {data?.payload?.tech_lang_keys["5"]}
                        </option>
                        <option value="side_a">
                          {data?.payload?.tech_lang_keys["7"]} a
                        </option>
                        <option value="side_b">
                          {data?.payload?.tech_lang_keys["7"]} b
                        </option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              {formData.tech_cal_from == "angle_side" && (
                <>
                  <div
                    className="col-span-12 mb-1 flex  items-center justify-evenly"
                    id="cal_with"
                  >
                    <p className="font-s-14 text-blue">
                      <strong>
                        {data?.payload?.tech_lang_keys["calculate"]}{" "}
                        {data?.payload?.tech_lang_keys["6"]}:
                      </strong>
                    </p>
                    <p id="cal_with_a">
                      <label className="pe-2 cursor-pointer" htmlFor="a_angle">
                        <input
                          type="radio"
                          name="tech_cal_with"
                          value="a_angle"
                          id="a_angle"
                          className="mr-2 border cursor-pointer"
                          onChange={handleChange}
                          checked={formData.tech_cal_with === "a_angle"}
                        />
                        <span>a & {data?.payload?.tech_lang_keys["3"]} α</span>
                      </label>
                    </p>
                    <p id="cal_with_b">
                      <label className="pe-2 cursor-pointer" htmlFor="b_angle">
                        <input
                          type="radio"
                          name="tech_cal_with"
                          value="b_angle"
                          id="b_angle"
                          className="mr-2 border cursor-pointer"
                          onChange={handleChange}
                          checked={formData.tech_cal_with === "b_angle"}
                        />
                        <span>b & {data?.payload?.tech_lang_keys["3"]} β</span>
                      </label>
                    </p>
                  </div>
                </>
              )}
              {formData.tech_cal_from == "area_side" &&
                formData.tech_cal == "hypo" && (
                  <>
                    <div
                      className="col-span-12 mb-1 flex  items-center justify-evenly"
                      id="cal_with1"
                    >
                      <p className="font-s-14 text-blue">
                        <strong>
                          {data?.payload?.tech_lang_keys["calculate"]}{" "}
                          {data?.payload?.tech_lang_keys["6"]}:
                        </strong>
                      </p>
                      <p id="cal_with1_a">
                        <label className="pe-2" htmlFor="area_a">
                          <input
                            type="radio"
                            name="tech_cal_with1"
                            value="area_a"
                            id="area_a"
                            className="mr-2 border"
                            onChange={handleChange}
                            checked={formData.tech_cal_with1 === "area_a"}
                          />
                          <span>{data?.payload?.tech_lang_keys["5"]} & a</span>
                        </label>
                      </p>
                      <p id="cal_with1_b">
                        <label className="pe-2" htmlFor="area_b">
                          <input
                            type="radio"
                            name="tech_cal_with1"
                            value="area_b"
                            id="area_b"
                            className="mr-2 border"
                            onChange={handleChange}
                            checked={formData.tech_cal_with1 === "area_b"}
                          />
                          <span>{data?.payload?.tech_lang_keys["5"]} & b</span>
                        </label>
                      </p>
                    </div>
                  </>
                )}

              {((formData.tech_cal_from == "area_side" &&
                formData.tech_cal == "hypo") ||
                (formData.tech_cal_from == "area_side" &&
                  formData.tech_cal == "side_a") ||
                (formData.tech_cal_from == "area_side" &&
                  formData.tech_cal == "side_b")) && (
                <>
                  <div className="col-span-12" id="areaInput">
                    <label htmlFor="tech_area" className="label">
                      {data?.payload?.tech_lang_keys["5"]}
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
                        onClick={toggleDropdown}
                      >
                        {formData.tech_area_unit} ▾
                      </label>
                      {dropdownVisible && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "square millimeter (mm²)", value: "mm²" },
                            { label: "square centimeter (cm²)", value: "cm²" },
                            { label: "square decimeter (dm²)", value: "dm²" },
                            { label: "square metre (m²)", value: "m²" },
                            { label: "square kilometre (km²)", value: "km²" },
                            { label: "square inch (in²)", value: "in²" },
                            { label: "square feet (ft²)", value: "ft²" },
                            { label: "square yards (yd²)", value: "yd²" },
                            { label: "square miles (mi²)", value: "mi²" },
                            { label: "ares (a)", value: "a" },
                            { label: "dekameters (da)", value: "da" },
                            { label: "hectares (ha)", value: "ha" },
                            { label: "acres (ac)", value: "ac" },
                            { label: "soccer fields", value: "sf" },
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

              {(formData.tech_cal_from == "two_sides" ||
                (formData.tech_cal_with == "a_angle" &&
                  formData.tech_cal_from == "angle_side") ||
                (formData.tech_cal_from == "area_side" &&
                  formData.tech_cal == "hypo" &&
                  formData.tech_cal_with1 == "area_a") ||
                (formData.tech_cal_from == "area_side" &&
                  formData.tech_cal == "area") ||
                (formData.tech_cal_from == "area_side" &&
                  formData.tech_cal == "side_b")) && (
                <>
                  <div className="col-span-12 " id="aInput">
                    <label htmlFor="tech_a" className="label">
                      a
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_a"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_a}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown1}
                      >
                        {formData.tech_a_unit} ▾
                      </label>
                      {dropdownVisible1 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "milimeters (mm)", value: "mm" },
                            { label: "centimeters (cm)", value: "cm" },
                            { label: "meters (m)", value: "m" },
                            { label: "kilometers (km)", value: "km" },
                            { label: "decimetre (dm)", value: "dm" },
                            { label: "inches (in)", value: "in" },
                            { label: "yards (yd)", value: "yd" },
                            { label: "miles (mi)", value: "mi" },
                            { label: "nautical mile (nmi)", value: "nmi" },
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
              {formData.tech_cal_with == "a_angle" &&
                formData.tech_cal_from == "angle_side" && (
                  <>
                    <div className="col-span-12 " id="angleaInput">
                      <label htmlFor="tech_angle_a" className="label">
                        {data?.payload?.tech_lang_keys["3"]} α
                      </label>
                      <div className="relative w-full ">
                        <input
                          type="number"
                          name="tech_angle_a"
                          step="any"
                          className="mt-1 input"
                          value={formData.tech_angle_a}
                          placeholder="00"
                          onChange={handleChange}
                        />
                        <label
                          className="absolute cursor-pointer text-sm underline right-6 top-4"
                          onClick={toggleDropdown2}
                        >
                          {formData.tech_angle_a_unit} ▾
                        </label>
                        {dropdownVisible2 && (
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

              {(formData.tech_cal_from == "two_sides" ||
                (formData.tech_cal_with == "b_angle" &&
                  formData.tech_cal_from == "angle_side") ||
                (formData.tech_cal_from == "area_side" &&
                  formData.tech_cal == "hypo" &&
                  formData.tech_cal_with1 == "area_b") ||
                (formData.tech_cal_from == "area_side" &&
                  formData.tech_cal == "area") ||
                (formData.tech_cal_from == "area_side" &&
                  formData.tech_cal == "side_a")) && (
                <>
                  <div className="col-span-12 " id="bInput">
                    <label htmlFor="tech_b" className="label">
                      b
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_b"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_b}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown3}
                      >
                        {formData.tech_b_unit} ▾
                      </label>
                      {dropdownVisible3 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "milimeters (mm)", value: "mm" },
                            { label: "centimeters (cm)", value: "cm" },
                            { label: "meters (m)", value: "m" },
                            { label: "kilometers (km)", value: "km" },
                            { label: "decimetre (dm)", value: "dm" },
                            { label: "inches (in)", value: "in" },
                            { label: "yards (yd)", value: "yd" },
                            { label: "miles (mi)", value: "mi" },
                            { label: "nautical mile (nmi)", value: "nmi" },
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
              {formData.tech_cal_with == "b_angle" &&
                formData.tech_cal_from == "angle_side" && (
                  <>
                    <div className="col-span-12 " id="anglebInput">
                      <label htmlFor="tech_angle_b" className="label">
                        {data?.payload?.tech_lang_keys["3"]} β
                      </label>
                      <div className="relative w-full ">
                        <input
                          type="number"
                          name="tech_angle_b"
                          step="any"
                          className="mt-1 input"
                          value={formData.tech_angle_b}
                          placeholder="00"
                          onChange={handleChange}
                        />
                        <label
                          className="absolute cursor-pointer text-sm underline right-6 top-4"
                          onClick={toggleDropdown4}
                        >
                          {formData.tech_angle_b_unit} ▾
                        </label>
                        {dropdownVisible4 && (
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
              <div className="w-full mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg  space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg  flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="w-full">
                        <div className="w-full md:w-[60%] lg:w-[60%] overflow-auto mt-2">
                          <table className="w-full text-[16px]">
                            <tbody>
                              <tr>
                                <td className="py-2 border-b" width="60%">
                                  <strong>
                                    {result?.tech_area_cal
                                      ? data?.payload?.tech_lang_keys["5"]
                                      : result?.tech_side_a
                                      ? `${data?.payload?.tech_lang_keys["7"]} a`
                                      : result?.tech_side_b
                                      ? `${data?.payload?.tech_lang_keys["7"]} b`
                                      : data?.payload?.tech_lang_keys["8"]}
                                  </strong>
                                </td>
                                <td className="py-2 border-b">
                                  {result?.tech_area_cal
                                    ? `${result?.tech_area} cm²`
                                    : result?.tech_side_a
                                    ? `${result?.tech_a} cm`
                                    : result?.tech_side_b
                                    ? `${result?.tech_b} cm`
                                    : `${result?.tech_c} cm`}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>

                        <div className="w-full text-[16px] overflow-auto">
                          <p className="mt-2">
                            <strong>
                              {data?.payload?.tech_lang_keys["9"]}
                            </strong>
                          </p>
                          {result?.tech_two_sides ? (
                            <>
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys["10"]}
                              </p>
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys["8"]} (c) = √
                                <span className="b_t">(a² + b²)</span>
                              </p>
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys["11"]}
                              </p>
                              <p className="mt-2">
                                a = {result?.tech_a}, b = {result?.tech_b}, c =
                                ?
                              </p>
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys["12"]}
                              </p>
                              <p className="mt-2">
                                c = √
                                <span className="border-top-black">
                                  (a² + b²)
                                </span>
                              </p>
                              <p className="mt-2">
                                c = √
                                <span className="border-top-black">
                                  (({result?.tech_a})² + ({result?.tech_b})²)
                                </span>
                              </p>
                              <p className="mt-2">
                                c = √
                                <span className="border-top-black">
                                  ({result?.tech_s1} + {result?.tech_s2})
                                </span>
                              </p>
                              <p className="mt-2">
                                c = √
                                <span className="border-top-black">
                                  {result?.tech_s3}
                                </span>
                              </p>
                              <p className="mt-2">c = {result?.tech_c}</p>
                            </>
                          ) : result?.tech_a_angle ? (
                            <>
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys["10"]}
                              </p>
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys["8"]} (c) = a /
                                sin(α)
                              </p>
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys["11"]}
                              </p>
                              <p className="mt-2">
                                a = {result?.tech_a}, α = {result?.tech_angle_a}
                                , c = ?
                              </p>
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys["12"]}
                              </p>
                              <p className="mt-2">c = a / sin(α)</p>
                              <p className="mt-2">
                                c = {result?.tech_a} / sin(
                                {result?.tech_angle_a})
                              </p>
                              <p className="mt-2">
                                c = {result?.tech_a} / {result?.tech_s1}
                              </p>
                              <p className="mt-2">c = {result?.tech_c}</p>
                            </>
                          ) : result?.tech_b_angle ? (
                            <>
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys["10"]}
                              </p>
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys["8"]} (c) = b /
                                sin(β)
                              </p>
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys["11"]}
                              </p>
                              <p className="mt-2">
                                b = {result?.tech_b}, β = {result?.tech_angle_b}
                                , c = ?
                              </p>
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys["12"]}
                              </p>
                              <p className="mt-2">c = b / sin(β)</p>
                              <p className="mt-2">
                                c = {result?.tech_b} / sin(
                                {result?.tech_angle_b})
                              </p>
                              <p className="mt-2">
                                c = {result?.tech_b} / {result?.tech_s1}
                              </p>
                              <p className="mt-2">c = {result?.tech_c}</p>
                            </>
                          ) : result?.tech_hypo_a ? (
                            <>
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys["10"]}
                              </p>
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys["8"]} (c) = √
                                <span className="border-top-black">
                                  (a² + (area * 2 / a)²)
                                </span>
                              </p>
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys["11"]}
                              </p>
                              <p className="mt-2">
                                a = {result?.tech_a}, area = {result?.tech_area}
                                , c = ?
                              </p>
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys["12"]}
                              </p>
                              <p className="mt-2">
                                c = √
                                <span className="border-top-black">
                                  (a² + (area * 2 / a)²)
                                </span>
                              </p>
                              <p className="mt-2">
                                c = √
                                <span className="border-top-black">
                                  ({result?.tech_a}² + ({result?.tech_area} * 2
                                  / {result?.tech_a})²)
                                </span>
                              </p>
                              <p className="mt-2">
                                c = √
                                <span className="border-top-black">
                                  ({result?.tech_s1} + ({result?.tech_s2} /{" "}
                                  {result?.tech_a})²)
                                </span>
                              </p>
                              <p className="mt-2">
                                c = √
                                <span className="border-top-black">
                                  ({result?.tech_s1} + ({result?.tech_s3})²)
                                </span>
                              </p>
                              <p className="mt-2">
                                c = √
                                <span className="border-top-black">
                                  ({result?.tech_s1} + {result?.tech_s4})
                                </span>
                              </p>
                              <p className="mt-2">
                                c = √
                                <span className="border-top-black">
                                  {result?.tech_s5}
                                </span>
                              </p>
                              <p className="mt-2">c = {result?.tech_c}</p>
                            </>
                          ) : result?.tech_hypo_b ? (
                            <>
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys["10"]}
                              </p>
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys["8"]} (c) = √
                                <span className="border-top-black">
                                  ((area * 2 / b)² + b²)
                                </span>
                              </p>
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys["11"]}
                              </p>
                              <p className="mt-2">
                                b = {result?.tech_b}, area = {result?.tech_area}
                                , c = ?
                              </p>
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys["12"]}
                              </p>
                              <p className="mt-2">
                                c = √
                                <span className="border-top-black">
                                  ((area * 2 / b)² + b²)
                                </span>
                              </p>
                              <p className="mt-2">
                                c = √
                                <span className="border-top-black">
                                  (({result?.tech_area} * 2 / {result?.tech_b})²
                                  + {result?.tech_b}²)
                                </span>
                              </p>
                              <p className="mt-2">
                                c = √
                                <span className="border-top-black">
                                  (({result?.tech_s2} / {result?.tech_b})² +{" "}
                                  {result?.tech_s1})
                                </span>
                              </p>
                              <p className="mt-2">
                                c = √
                                <span className="border-top-black">
                                  (({result?.tech_s3})² + {result?.tech_s1})
                                </span>
                              </p>
                              <p className="mt-2">
                                c = √
                                <span className="border-top-black">
                                  ({result?.tech_s4} + {result?.tech_s1})
                                </span>
                              </p>
                              <p className="mt-2">
                                c = √
                                <span className="border-top-black">
                                  {result?.tech_s5}
                                </span>
                              </p>
                              <p className="mt-2">c = {result?.tech_c}</p>
                            </>
                          ) : result?.tech_area_cal ? (
                            <>
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys["10"]}
                              </p>
                              <p className="mt-2">area = (a * b) / 2</p>
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys["11"]}
                              </p>
                              <p className="mt-2">
                                a = {result?.tech_a}, b = {result?.tech_b}, area
                                = ?
                              </p>
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys["12"]}
                              </p>
                              <p className="mt-2">area = (a * b) / 2</p>
                              <p className="mt-2">
                                area = ({result?.tech_a} * {result?.tech_b}) / 2
                              </p>
                              <p className="mt-2">
                                area = {result?.tech_s1} / 2
                              </p>
                              <p className="mt-2">area = {result?.tech_area}</p>
                            </>
                          ) : result?.tech_side_a ? (
                            <>
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys["10"]}
                              </p>
                              <p className="mt-2">a = (area * 2) / b</p>
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys["11"]}
                              </p>
                              <p className="mt-2">
                                area = {result?.tech_area}, b = {result?.tech_b}
                                , a = ?
                              </p>
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys["12"]}
                              </p>
                              <p className="mt-2">a = (area * 2) / b</p>
                              <p className="mt-2">
                                a = ({result?.tech_area} * 2) / {result?.tech_b}
                              </p>
                              <p className="mt-2">
                                a = {result?.tech_s1} / {result?.tech_b}
                              </p>
                              <p className="mt-2">a = {result?.tech_a}</p>
                            </>
                          ) : (
                            <>
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys["10"]}
                              </p>
                              <p className="mt-2">b = (area * 2) / a</p>
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys["11"]}
                              </p>
                              <p className="mt-2">
                                area = {result?.tech_area}, a = {result?.tech_a}
                                , b = ?
                              </p>
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys["12"]}
                              </p>
                              <p className="mt-2">b = (area * 2) / a</p>
                              <p className="mt-2">
                                b = ({result?.tech_area} * 2) / {result?.tech_a}
                              </p>
                              <p className="mt-2">
                                b = {result?.tech_s1} / {result?.tech_a}
                              </p>
                              <p className="mt-2">b = {result?.tech_b}</p>
                            </>
                          )}
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

export default HypotenuseCalculator;

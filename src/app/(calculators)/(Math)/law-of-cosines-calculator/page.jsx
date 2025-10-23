"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useLawOfCosinesCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const LawOfCosinesCalculator = () => {
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
    tech_cal: "aa", // aa  ab ac sa sb  sc
    tech_side_a: "12",
    tech_side_a_unit: "m",
    tech_side_b: "12",
    tech_side_b_unit: "cm",
    tech_side_c: "4",
    tech_side_c_unit: "cm",
    tech_angle_a: "4",
    tech_angle_a_unit: "cm",
    tech_angle_b: "4",
    tech_angle_b_unit: "cm",
    tech_angle_c: "4",
    tech_angle_c_unit: "cm",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useLawOfCosinesCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_cal) {
      setFormError("Please fill in input.");
      return;
    }
    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_cal: formData.tech_cal,
        tech_side_a: formData.tech_side_a,
        tech_side_a_unit: formData.tech_side_a_unit,
        tech_side_b: formData.tech_side_b,
        tech_side_b_unit: formData.tech_side_b_unit,
        tech_side_c: formData.tech_side_c,
        tech_side_c_unit: formData.tech_side_c_unit,
        tech_angle_a: formData.tech_angle_a,
        tech_angle_a_unit: formData.tech_angle_a_unit,
        tech_angle_b: formData.tech_angle_b,
        tech_angle_b_unit: formData.tech_angle_b_unit,
        tech_angle_c: formData.tech_angle_c,
        tech_angle_c_unit: formData.tech_angle_c_unit,
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
      tech_cal: "aa", // aa  ab ac sa sb  sc
      tech_side_a: "12",
      tech_side_a_unit: "m",
      tech_side_b: "12",
      tech_side_b_unit: "cm",
      tech_side_c: "4",
      tech_side_c_unit: "cm",
      tech_angle_a: "4",
      tech_angle_a_unit: "cm",
      tech_angle_b: "4",
      tech_angle_b_unit: "cm",
      tech_angle_c: "4",
      tech_angle_c_unit: "cm",
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
    setFormData((prev) => ({ ...prev, tech_side_a_unit: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  //dropdown states
  const [dropdownVisible1, setDropdownVisible1] = useState(false);

  const setUnitHandler1 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_side_b_unit: unit }));
    setDropdownVisible1(false);
  };

  const toggleDropdown1 = () => {
    setDropdownVisible1(!dropdownVisible1);
  };

  //dropdown states
  const [dropdownVisible2, setDropdownVisible2] = useState(false);

  const setUnitHandler2 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_side_c_unit: unit }));
    setDropdownVisible2(false);
  };

  const toggleDropdown2 = () => {
    setDropdownVisible2(!dropdownVisible2);
  };

  //dropdown states
  const [dropdownVisible3, setDropdownVisible3] = useState(false);

  const setUnitHandler3 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_angle_a_unit: unit }));
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

  //dropdown states
  const [dropdownVisible5, setDropdownVisible5] = useState(false);

  const setUnitHandler5 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_angle_c_unit: unit }));
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

          <div className="lg:w-[60%] md:w-[60%] w-full mx-auto ">
            <div className="grid grid-cols-12 mt-3   gap-2 md:gap-4 lg:gap-4">
              <div className="col-span-6">
                <div className="col-12 mt-0 mt-lg-2">
                  <label htmlFor="tech_cal" className="label">
                    {data?.payload?.tech_lang_keys["1"]}:
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
                      <option value="aa">
                        {data?.payload?.tech_lang_keys["2"]} A
                      </option>
                      <option value="ab">
                        {data?.payload?.tech_lang_keys["2"]} B
                      </option>
                      <option value="ac">
                        {data?.payload?.tech_lang_keys["2"]} C
                      </option>
                      <option value="sa">
                        {data?.payload?.tech_lang_keys["3"]} a
                      </option>
                      <option value="sb">
                        {data?.payload?.tech_lang_keys["3"]} b
                      </option>
                      <option value="sc">
                        {data?.payload?.tech_lang_keys["3"]} c
                      </option>
                    </select>
                  </div>
                </div>
                <div className="col-12 mt-0 mt-lg-2" id="a">
                  <label htmlFor="tech_side_a" className="label">
                    {data?.payload?.tech_lang_keys["3"]} a:
                  </label>
                  <div className="relative w-full ">
                    <input
                      type="number"
                      name="tech_side_a"
                      step="any"
                      min="1"
                      className="mt-1 input"
                      value={formData.tech_side_a}
                      placeholder="00"
                      onChange={handleChange}
                    />
                    <label
                      className="absolute cursor-pointer text-sm underline right-6 top-3"
                      onClick={toggleDropdown}
                    >
                      {formData.tech_side_a_unit} ▾
                    </label>
                    {dropdownVisible && (
                      <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                        {[
                          { label: "milimeters (mm)", value: "mm" },
                          { label: "centimeters (cm)", value: "cm" },
                          { label: "meters (m)", value: "m" },
                          { label: "kilometers (km)", value: "km" },
                          { label: "decimetre (dm)", value: "dm" },
                          { label: "inches (in)", value: "in" },
                          { label: "feets (ft)", value: "ft" },
                          { label: "yards (yd)", value: "yd" },
                          { label: "miles (mi)", value: "mi" },
                          { label: "nautical mile (nmi)", value: "nmi" },
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
                <div className="col-12 mt-0 mt-lg-2 " id="b">
                  <label htmlFor="tech_side_b" className="label">
                    {data?.payload?.tech_lang_keys["3"]} b:
                  </label>
                  <div className="relative w-full ">
                    <input
                      type="number"
                      name="tech_side_b"
                      step="any"
                      min="1"
                      className="mt-1 input"
                      value={formData.tech_side_b}
                      placeholder="00"
                      onChange={handleChange}
                    />
                    <label
                      className="absolute cursor-pointer text-sm underline right-6 top-3"
                      onClick={toggleDropdown1}
                    >
                      {formData.tech_side_b_unit} ▾
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
                          { label: "feets (ft)", value: "ft" },
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
                <div className="col-12 mt-0 mt-lg-2 " id="c">
                  <label htmlFor="tech_side_c" className="label">
                    {data?.payload?.tech_lang_keys["3"]} c:
                  </label>
                  <div className="relative w-full ">
                    <input
                      type="number"
                      name="tech_side_c"
                      step="any"
                      min="1"
                      className="mt-1 input"
                      value={formData.tech_side_c}
                      placeholder="00"
                      onChange={handleChange}
                    />
                    <label
                      className="absolute cursor-pointer text-sm underline right-6 top-3"
                      onClick={toggleDropdown2}
                    >
                      {formData.tech_side_c_unit} ▾
                    </label>
                    {dropdownVisible2 && (
                      <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                        {[
                          { label: "milimeters (mm)", value: "mm" },
                          { label: "centimeters (cm)", value: "cm" },
                          { label: "meters (m)", value: "m" },
                          { label: "kilometers (km)", value: "km" },
                          { label: "decimetre (dm)", value: "dm" },
                          { label: "inches (in)", value: "in" },
                          { label: "feets (ft)", value: "ft" },
                          { label: "yards (yd)", value: "yd" },
                          { label: "miles (mi)", value: "mi" },
                          { label: "nautical mile (nmi)", value: "nmi" },
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
                {formData.tech_cal == "sa" && (
                  <>
                    <div className="col-12 mt-0 mt-lg-2 " id="A">
                      <label htmlFor="tech_angle_a" className="label">
                        {data?.payload?.tech_lang_keys["2"]} A (α):
                      </label>
                      <div className="relative w-full ">
                        <input
                          type="number"
                          name="tech_angle_a"
                          step="any"
                          min="1"
                          className="mt-1 input"
                          value={formData.tech_angle_a}
                          placeholder="00"
                          onChange={handleChange}
                        />
                        <label
                          className="absolute cursor-pointer text-sm underline right-6 top-3"
                          onClick={toggleDropdown3}
                        >
                          {formData.tech_angle_a_unit} ▾
                        </label>
                        {dropdownVisible3 && (
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
                {formData.tech_cal == "sb" && (
                  <>
                    <div className="col-12 mt-0 mt-lg-2 " id="B">
                      <label htmlFor="tech_angle_b" className="label">
                        {data?.payload?.tech_lang_keys["2"]} B (β):
                      </label>
                      <div className="relative w-full ">
                        <input
                          type="number"
                          name="tech_angle_b"
                          step="any"
                          min="1"
                          className="mt-1 input"
                          value={formData.tech_angle_b}
                          placeholder="00"
                          onChange={handleChange}
                        />
                        <label
                          className="absolute cursor-pointer text-sm underline right-6 top-3"
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
                {formData.tech_cal == "sc" && (
                  <>
                    <div className="col-12 mt-0 mt-lg-2 " id="C">
                      <label htmlFor="tech_angle_c" className="label">
                        {data?.payload?.tech_lang_keys["2"]} C (γ):
                      </label>
                      <div className="relative w-full ">
                        <input
                          type="number"
                          name="tech_angle_c"
                          step="any"
                          min="1"
                          className="mt-1 input"
                          value={formData.tech_angle_c}
                          placeholder="00"
                          onChange={handleChange}
                        />
                        <label
                          className="absolute cursor-pointer text-sm underline right-6 top-3"
                          onClick={toggleDropdown5}
                        >
                          {formData.tech_angle_c_unit} ▾
                        </label>
                        {dropdownVisible5 && (
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
              <div className="col-span-6  flex items-center">
                <div className="">
                  <div className="col-12 text-[20px] text-center flex items-center justify-center">
                    {formData.tech_cal === "aa" && (
                      <BlockMath
                        math={`A = \\cos^{-1} \\left( \\dfrac{b^2 + c^2 - a^2}{2bc} \\right)`}
                      />
                    )}

                    {formData.tech_cal === "ab" && (
                      <BlockMath
                        math={`B = \\cos^{-1} \\left( \\dfrac{a^2 + c^2 - b^2}{2ac} \\right)`}
                      />
                    )}

                    {formData.tech_cal === "ac" && (
                      <BlockMath
                        math={`C = \\cos^{-1} \\left( \\dfrac{a^2 + b^2 - c^2}{2ab} \\right)`}
                      />
                    )}

                    {formData.tech_cal === "sa" && (
                      <BlockMath math={`a = \\sqrt{b^2 + c^2 - 2bc \\cos A}`} />
                    )}

                    {formData.tech_cal === "sb" && (
                      <BlockMath math={`b = \\sqrt{a^2 + c^2 - 2ac \\cos B}`} />
                    )}

                    {formData.tech_cal === "sc" && (
                      <BlockMath math={`c = \\sqrt{a^2 + b^2 - 2ab \\cos C}`} />
                    )}
                  </div>
                  <div className="">
                    <img
                      src="/images/law_of_cosines.webp"
                      width="75%"
                      height="100%"
                      alt="Law of Cosines"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
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
                      <div className="w-full md:w-[60%] lg:w-[60%]  mt-2">
                        <table className="w-full text-[18px]">
                          <tbody>
                            <tr>
                              <td className="py-2 border-b" width="60%">
                                <strong>
                                  {formData?.tech_cal === "aa" &&
                                    `${data?.payload?.tech_lang_keys["2"]} A`}
                                  {formData?.tech_cal === "ab" &&
                                    `${data?.payload?.tech_lang_keys["2"]} B`}
                                  {formData?.tech_cal === "ac" &&
                                    `${data?.payload?.tech_lang_keys["2"]} C`}
                                  {formData?.tech_cal === "sa" &&
                                    `${data?.payload?.tech_lang_keys["3"]} a`}
                                  {formData?.tech_cal === "sb" &&
                                    `${data?.payload?.tech_lang_keys["3"]} b`}
                                  {formData?.tech_cal === "sc" &&
                                    `${data?.payload?.tech_lang_keys["3"]} c`}
                                </strong>
                              </td>
                              <td className="py-2 border-b">
                                {formData?.tech_cal === "aa" &&
                                  `${Number(result?.tech_angle_a).toFixed(5)}°`}
                                {formData?.tech_cal === "ab" &&
                                  `${Number(result?.tech_angle_b).toFixed(5)}°`}
                                {formData?.tech_cal === "ac" &&
                                  `${Number(result?.tech_angle_c).toFixed(5)}°`}
                                {formData?.tech_cal === "sa" &&
                                  `${Number(result?.tech_side_a).toFixed(
                                    5
                                  )} cm`}
                                {formData?.tech_cal === "sb" &&
                                  `${Number(result?.tech_side_b).toFixed(
                                    5
                                  )} cm`}
                                {formData?.tech_cal === "sc" &&
                                  `${Number(result?.tech_side_c).toFixed(
                                    5
                                  )} cm`}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <div className="col-span-12  text-[16px]">
                        <p className="mt-2">
                          <strong>{data?.payload?.tech_lang_keys["4"]}:</strong>
                        </p>
                        <div className="col-12 font-s-20 text-center flex flex-col items-center">
                          {formData?.tech_cal === "aa" && (
                            <>
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys["5"]}{" "}
                                {data?.payload?.tech_lang_keys["2"]} A
                              </p>
                              <BlockMath
                                math={`A = \\cos^{-1} \\left( \\dfrac{b^2 + c^2 - a^2}{2bc} \\right)`}
                              />
                              <BlockMath
                                math={`A = \\cos^{-1} \\left( \\dfrac{${result?.tech_side_b}^2 + ${result?.tech_side_c}^2 - ${result?.tech_side_a}^2}{2 \\times ${result?.tech_side_b} \\times ${result?.tech_side_c}} \\right)`}
                              />
                              <BlockMath
                                math={`A = ${result?.tech_angle_a}^\\circ`}
                              />
                            </>
                          )}

                          {formData?.tech_cal === "ab" && (
                            <>
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys["5"]}{" "}
                                {data?.payload?.tech_lang_keys["2"]} B
                              </p>
                              <BlockMath
                                math={`B = \\cos^{-1} \\left( \\dfrac{a^2 + c^2 - b^2}{2ac} \\right)`}
                              />
                              <BlockMath
                                math={`B = \\cos^{-1} \\left( \\dfrac{${result?.tech_side_a}^2 + ${result?.tech_side_c}^2 - ${result?.tech_side_b}^2}{2 \\times ${result?.tech_side_a} \\times ${result?.tech_side_c}} \\right)`}
                              />
                              <BlockMath
                                math={`B = ${result?.tech_angle_b}^\\circ`}
                              />
                            </>
                          )}

                          {formData?.tech_cal === "ac" && (
                            <>
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys["5"]}{" "}
                                {data?.payload?.tech_lang_keys["2"]} C
                              </p>
                              <BlockMath
                                math={`C = \\cos^{-1} \\left( \\dfrac{a^2 + b^2 - c^2}{2ab} \\right)`}
                              />
                              <BlockMath
                                math={`C = \\cos^{-1} \\left( \\dfrac{${result?.tech_side_a}^2 + ${result?.tech_side_b}^2 - ${result?.tech_side_c}^2}{2 \\times ${result?.tech_side_a} \\times ${result?.tech_side_b}} \\right)`}
                              />
                              <BlockMath
                                math={`C = ${result?.tech_angle_c}^\\circ`}
                              />
                            </>
                          )}

                          {formData?.tech_cal === "sa" && (
                            <>
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys["5"]}{" "}
                                {data?.payload?.tech_lang_keys["3"]} a
                              </p>
                              <BlockMath
                                math={`a = \\sqrt{b^2 + c^2 - 2bc \\cos A}`}
                              />
                              <BlockMath
                                math={`a = \\sqrt{${result?.tech_side_b}^2 + ${result?.tech_side_c}^2 - 2 \\times ${result?.tech_side_b} \\times ${result?.tech_side_c} \\cos(${result?.tech_angle_a}^\\circ)}`}
                              />
                              <BlockMath math={`a = ${result?.tech_side_a}`} />
                            </>
                          )}

                          {formData?.tech_cal === "sb" && (
                            <>
                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys["5"]}{" "}
                                {data?.payload?.tech_lang_keys["3"]} b
                              </p>
                              <BlockMath
                                math={`b = \\sqrt{a^2 + c^2 - 2ac \\cos B}`}
                              />
                              <BlockMath
                                math={`b = \\sqrt{${result?.tech_side_a}^2 + ${result?.tech_side_c}^2 - 2 \\times ${result?.tech_side_a} \\times ${result?.tech_side_c} \\cos(${result?.tech_angle_b}^\\circ)}`}
                              />
                              <BlockMath math={`b = ${result?.tech_side_b}`} />
                            </>
                          )}
                        </div>

                        <div className="mt-2">
                          <p className="mt-2">
                            {data?.payload?.tech_lang_keys["6"]}
                          </p>
                          <BlockMath
                            math={`a = ${result?.tech_side_a}\\ \\text{cm}`}
                          />
                          <BlockMath
                            math={`b = ${result?.tech_side_b}\\ \\text{cm}`}
                          />
                          <BlockMath
                            math={`c = ${result?.tech_side_c}\\ \\text{cm}`}
                          />

                          <p className="mt-2">
                            {data?.payload?.tech_lang_keys["7"]}
                          </p>
                          <BlockMath
                            math={`A = ${result?.tech_angle_a}^\\circ`}
                          />
                          <BlockMath
                            math={`B = ${result?.tech_angle_b}^\\circ`}
                          />
                          <BlockMath
                            math={`C = ${result?.tech_angle_c}^\\circ`}
                          />

                          <p className="mt-2">
                            {data?.payload?.tech_lang_keys["8"]}
                          </p>
                          <BlockMath
                            math={`P = ${result?.tech_P}\\ \\text{cm}`}
                          />
                          <BlockMath
                            math={`s = ${result?.tech_s}\\ \\text{cm}`}
                          />
                          <BlockMath
                            math={`K = ${result?.tech_K}\\ \\text{cm}^2`}
                          />
                          <BlockMath
                            math={`r = ${result?.tech_r}\\ \\text{cm}`}
                          />
                          <BlockMath
                            math={`R = ${result?.tech_R}\\ \\text{cm}`}
                          />

                          {/* <p className="mt-2">{data?.payload?.tech_lang_keys['9']}</p> */}
                        </div>
                      </div>
                      {/* <div className="col-span-12 mt-4 canvas">
                                <canvas id="triangle" width="600" height="350"></canvas>
                            </div> */}
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

export default LawOfCosinesCalculator;

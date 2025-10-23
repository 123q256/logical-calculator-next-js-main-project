"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useLawOfSinesCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const LawOfSinesCalculator = () => {
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
    tech_cal: "abb", // abb  acc aba bcc aca bcb bab cac  aab cbc  aac bbc
    tech_side_a: "12",
    tech_side_a_unit: "mm",
    tech_side_b: "12",
    tech_side_b_unit: "mm",
    tech_side_c: "12",
    tech_side_c_unit: "mm",
    tech_angle_a: "12",
    tech_angle_a_unit: "deg",
    tech_angle_b: "12",
    tech_angle_b_unit: "deg",
    tech_angle_c: "12",
    tech_angle_c_unit: "deg",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useLawOfSinesCalculatorMutation();

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
      tech_cal: "abb", // abb  acc aba bcc aca bcb bab cac  aab cbc  aac bbc
      tech_side_a: "12",
      tech_side_a_unit: "mm",
      tech_side_b: "12",
      tech_side_b_unit: "mm",
      tech_side_c: "12",
      tech_side_c_unit: "mm",
      tech_angle_a: "12",
      tech_angle_a_unit: "deg",
      tech_angle_b: "12",
      tech_angle_b_unit: "deg",
      tech_angle_c: "12",
      tech_angle_c_unit: "deg",
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

  //  chart js

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

          <div className="lg:w-[60%] md:w-[100%] w-full mx-auto ">
            <div className="grid grid-cols-12 mt-3 gap-2 md:gap-4 lg:gap-4">
              <div className="col-span-12 md:col-span-6">
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
                      <option value="abb">
                        {data?.payload?.tech_lang_keys["2"]} A{" "}
                        {data?.payload?.tech_lang_keys["3"]} a, b, B
                      </option>
                      <option value="acc">
                        {data?.payload?.tech_lang_keys["2"]} A{" "}
                        {data?.payload?.tech_lang_keys["3"]} a, c, C
                      </option>
                      <option value="aba">
                        {data?.payload?.tech_lang_keys["2"]} B{" "}
                        {data?.payload?.tech_lang_keys["3"]} a, b, A
                      </option>
                      <option value="bcc">
                        {data?.payload?.tech_lang_keys["2"]} B{" "}
                        {data?.payload?.tech_lang_keys["3"]} b, c, C
                      </option>
                      <option value="aca">
                        {data?.payload?.tech_lang_keys["2"]} C{" "}
                        {data?.payload?.tech_lang_keys["3"]} a, c, A
                      </option>
                      <option value="bcb">
                        {data?.payload?.tech_lang_keys["2"]} C{" "}
                        {data?.payload?.tech_lang_keys["3"]} b, c, B
                      </option>
                      <option value="bab">
                        {data?.payload?.tech_lang_keys["4"]} a{" "}
                        {data?.payload?.tech_lang_keys["3"]} b, A, B
                      </option>
                      <option value="cac">
                        {data?.payload?.tech_lang_keys["4"]} a{" "}
                        {data?.payload?.tech_lang_keys["3"]} c, A, C
                      </option>
                      <option value="aab">
                        {data?.payload?.tech_lang_keys["4"]} b{" "}
                        {data?.payload?.tech_lang_keys["3"]} a, A, B
                      </option>
                      <option value="cbc">
                        {data?.payload?.tech_lang_keys["4"]} b{" "}
                        {data?.payload?.tech_lang_keys["3"]} c, B, C
                      </option>
                      <option value="aac">
                        {data?.payload?.tech_lang_keys["4"]} c{" "}
                        {data?.payload?.tech_lang_keys["3"]} a, A, C
                      </option>
                      <option value="bbc">
                        {data?.payload?.tech_lang_keys["4"]} c{" "}
                        {data?.payload?.tech_lang_keys["3"]} b, B, C
                      </option>
                    </select>
                  </div>
                </div>
                {(formData.tech_cal == "abb" ||
                  formData.tech_cal == "acc" ||
                  formData.tech_cal == "aba" ||
                  formData.tech_cal == "aca" ||
                  formData.tech_cal == "aab" ||
                  formData.tech_cal == "aac") && (
                  <>
                    <div className="col-12 mt-0 mt-lg-2" id="a">
                      <label htmlFor="tech_side_a" className="label">
                        {data?.payload?.tech_lang_keys["4"]} a:
                      </label>
                      <div className="relative w-full ">
                        <input
                          type="number"
                          name="tech_side_a"
                          step="any"
                          className="mt-1 input"
                          value={formData.tech_side_a}
                          placeholder="00"
                          onChange={handleChange}
                        />
                        <label
                          className="absolute cursor-pointer text-sm underline right-6 top-4"
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
                  </>
                )}
                {(formData.tech_cal == "abb" ||
                  formData.tech_cal == "aba" ||
                  formData.tech_cal == "bcc" ||
                  formData.tech_cal == "bcb" ||
                  formData.tech_cal == "bab" ||
                  formData.tech_cal == "bbc") && (
                  <>
                    <div className="col-12 mt-0 mt-lg-2 " id="b">
                      <label htmlFor="tech_side_b" className="label">
                        {data?.payload?.tech_lang_keys["4"]} b:
                      </label>
                      <div className="relative w-full ">
                        <input
                          type="number"
                          name="tech_side_b"
                          step="any"
                          className="mt-1 input"
                          value={formData.tech_side_b}
                          placeholder="00"
                          onChange={handleChange}
                        />
                        <label
                          className="absolute cursor-pointer text-sm underline right-6 top-4"
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
                  </>
                )}
                {(formData.tech_cal == "acc" ||
                  formData.tech_cal == "bcc" ||
                  formData.tech_cal == "aca" ||
                  formData.tech_cal == "bcb" ||
                  formData.tech_cal == "cac" ||
                  formData.tech_cal == "cbc") && (
                  <>
                    <div className="col-12 mt-0 mt-lg-2 " id="c">
                      <label htmlFor="tech_side_c" className="label">
                        {data?.payload?.tech_lang_keys["4"]} c:
                      </label>
                      <div className="relative w-full ">
                        <input
                          type="number"
                          name="tech_side_c"
                          step="any"
                          className="mt-1 input"
                          value={formData.tech_side_c}
                          placeholder="00"
                          onChange={handleChange}
                        />
                        <label
                          className="absolute cursor-pointer text-sm underline right-6 top-4"
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
                  </>
                )}

                {(formData.tech_cal == "aba" ||
                  formData.tech_cal == "aca" ||
                  formData.tech_cal == "bab" ||
                  formData.tech_cal == "cac" ||
                  formData.tech_cal == "aab" ||
                  formData.tech_cal == "aac") && (
                  <>
                    <div className="col-12 mt-0 mt-lg-2" id="A">
                      <label htmlFor="tech_angle_a" className="label">
                        {data?.payload?.tech_lang_keys["2"]} A (α):
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

                {(formData.tech_cal == "abb" ||
                  formData.tech_cal == "bcb" ||
                  formData.tech_cal == "bab" ||
                  formData.tech_cal == "aab" ||
                  formData.tech_cal == "cbc" ||
                  formData.tech_cal == "bbc") && (
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
                {(formData.tech_cal == "acc" ||
                  formData.tech_cal == "bcc" ||
                  formData.tech_cal == "cac" ||
                  formData.tech_cal == "cbc" ||
                  formData.tech_cal == "aac" ||
                  formData.tech_cal == "bbc") && (
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
                          className="mt-1 input"
                          value={formData.tech_angle_c}
                          placeholder="00"
                          onChange={handleChange}
                        />
                        <label
                          className="absolute cursor-pointer text-sm underline right-6 top-4"
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
              <div className="col-span-12 md:col-span-6 my-auto">
                <div className="col-12 text-[20px] text-center overflow-auto">
                  {formData.tech_cal == "abb" && (
                    <BlockMath
                      math={`A = \\sin^{-1} \\left( \\dfrac{a \\sin B}{b} \\right)`}
                    />
                  )}
                  {formData.tech_cal == "acc" && (
                    <BlockMath
                      math={`A = \\sin^{-1} \\left( \\dfrac{a \\sin C}{c} \\right)`}
                    />
                  )}
                  {formData.tech_cal == "aba" && (
                    <BlockMath
                      math={`B = \\sin^{-1} \\left( \\dfrac{b \\sin A}{a} \\right)`}
                    />
                  )}
                  {formData.tech_cal == "bcc" && (
                    <BlockMath
                      math={`B = \\sin^{-1} \\left( \\dfrac{b \\sin C}{c} \\right)`}
                    />
                  )}
                  {formData.tech_cal == "aca" && (
                    <BlockMath
                      math={`C = \\sin^{-1} \\left( \\dfrac{c \\sin A}{a} \\right)`}
                    />
                  )}
                  {formData.tech_cal == "bcb" && (
                    <BlockMath
                      math={`C = \\sin^{-1} \\left( \\dfrac{c \\sin B}{b} \\right)`}
                    />
                  )}
                  {formData.tech_cal == "bab" && (
                    <BlockMath math={`a = \\dfrac{b \\sin A}{\\sin B}`} />
                  )}
                  {formData.tech_cal == "cac" && (
                    <BlockMath math={`a = \\dfrac{c \\sin A}{\\sin C}`} />
                  )}
                  {formData.tech_cal == "aab" && (
                    <BlockMath math={`b = \\dfrac{a \\sin B}{\\sin A}`} />
                  )}
                  {formData.tech_cal == "cbc" && (
                    <BlockMath math={`b = \\dfrac{c \\sin B}{\\sin C}`} />
                  )}
                  {formData.tech_cal == "aac" && (
                    <BlockMath math={`c = \\dfrac{a \\sin C}{\\sin A}`} />
                  )}
                  {formData.tech_cal == "bbc" && (
                    <BlockMath math={`c = \\dfrac{b \\sin C}{\\sin B}`} />
                  )}

                  <div className="col-12 text-center mt-5 flex items-center">
                    <img
                      src="/images/law_of_sine.webp"
                      width="100%"
                      height="100%"
                      alt="Law of Sines"
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
                {data?.payload?.tech_lang_keys["locale"] == "en"
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
                      <div className="w-full md:w-[80%] lg:w-[60%] overflow-auto mt-2">
                        <table className="w-full text-[16px]">
                          <tbody>
                            <tr>
                              <td className="py-2 border-b" width="60%">
                                <strong>
                                  {(formData?.tech_cal == "abb" ||
                                    formData?.tech_cal == "acc") &&
                                    `${data?.payload?.tech_lang_keys["2"]} A`}
                                  {(formData?.tech_cal == "aba" ||
                                    formData?.tech_cal == "bcc") &&
                                    `${data?.payload?.tech_lang_keys["2"]} B`}
                                  {(formData?.tech_cal == "aca" ||
                                    formData?.tech_cal == "bcb") &&
                                    `${data?.payload?.tech_lang_keys["2"]} C`}
                                  {(formData?.tech_cal == "bab" ||
                                    formData?.tech_cal == "cac") &&
                                    `${data?.payload?.tech_lang_keys["4"]} a`}
                                  {(formData?.tech_cal == "aab" ||
                                    formData?.tech_cal == "cbc") &&
                                    `${data?.payload?.tech_lang_keys["4"]} b`}
                                  {(formData?.tech_cal == "aac" ||
                                    formData?.tech_cal == "bbc") &&
                                    `${data?.payload?.tech_lang_keys["4"]} c`}
                                </strong>
                              </td>
                              <td className="py-2 border-b">
                                {(formData?.tech_cal == "abb" ||
                                  formData?.tech_cal == "acc") &&
                                  `${Number(result?.tech_angle_a).toFixed(5)}°`}
                                {(formData?.tech_cal == "aba" ||
                                  formData?.tech_cal == "bcc") &&
                                  `${Number(result?.tech_angle_b).toFixed(5)}°`}
                                {(formData?.tech_cal == "aca" ||
                                  formData?.tech_cal == "bcb") &&
                                  `${Number(result?.tech_angle_c).toFixed(5)}°`}
                                {(formData?.tech_cal == "bab" ||
                                  formData?.tech_cal == "cac") &&
                                  `${Number(result?.tech_side_a).toFixed(
                                    5
                                  )} cm`}
                                {(formData?.tech_cal == "aab" ||
                                  formData?.tech_cal == "cbc") &&
                                  `${Number(result?.tech_side_b).toFixed(
                                    5
                                  )} cm`}
                                {(formData?.tech_cal == "aac" ||
                                  formData?.tech_cal == "bbc") &&
                                  `${Number(result?.tech_side_c).toFixed(
                                    5
                                  )} cm`}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <div className="w-full text-[16px] overflow-auto">
                        <p className="mt-2">
                          <strong>
                            {data?.payload?.tech_lang_keys["10"]}:
                          </strong>
                        </p>

                        {formData?.tech_cal == "abb" ? (
                          <>
                            <p className="mt-2">
                              {data?.payload?.tech_lang_keys["5"]}{" "}
                              {data?.payload?.tech_lang_keys["2"]} A
                            </p>

                            <div className="mt-2">
                              <BlockMath
                                math={`A = \\sin^{-1} \\left( \\dfrac{a \\sin B}{b} \\right)`}
                              />
                            </div>

                            <div className="mt-2">
                              <BlockMath
                                math={`A = \\sin^{-1} \\left( \\dfrac{${result?.tech_side_a} \\cdot \\sin(${result?.tech_angle_b}^\\circ)}{${result?.tech_side_b}} \\right)`}
                              />
                            </div>

                            <div className="mt-2">
                              <BlockMath
                                math={`A = ${result?.tech_angle_a}^\\circ`}
                              />
                            </div>
                          </>
                        ) : formData?.tech_cal == "acc" ? (
                          <>
                            <p className="mt-2">
                              {data?.payload?.tech_lang_keys["5"]}{" "}
                              {data?.payload?.tech_lang_keys["2"]} A
                            </p>

                            <div className="mt-2">
                              <BlockMath
                                math={`A = \\sin^{-1} \\left( \\dfrac{a \\sin C}{c} \\right)`}
                              />
                            </div>

                            <div className="mt-2">
                              <BlockMath
                                math={`A = \\sin^{-1} \\left( \\dfrac{${result?.tech_side_a} \\cdot \\sin(${result?.tech_angle_c}^\\circ)}{${result?.tech_side_c}} \\right)`}
                              />
                            </div>

                            <div className="mt-2">
                              <BlockMath
                                math={`A = ${result?.tech_angle_a}^\\circ`}
                              />
                            </div>
                          </>
                        ) : formData?.tech_cal == "aba" ? (
                          <>
                            <p className="mt-2">
                              {data?.payload?.tech_lang_keys["5"]}{" "}
                              {data?.payload?.tech_lang_keys["2"]} B
                            </p>

                            <div className="mt-2">
                              <BlockMath
                                math={`B = \\sin^{-1} \\left( \\dfrac{b \\sin A}{a} \\right)`}
                              />
                            </div>

                            <div className="mt-2">
                              <BlockMath
                                math={`B = \\sin^{-1} \\left( \\dfrac{${result?.tech_side_b} \\cdot \\sin(${result?.tech_angle_a}^\\circ)}{${result?.tech_side_a}} \\right)`}
                              />
                            </div>

                            <div className="mt-2">
                              <BlockMath
                                math={`B = ${result?.tech_angle_b}^\\circ`}
                              />
                            </div>
                          </>
                        ) : formData?.tech_cal == "bcc" ? (
                          <>
                            <p className="mt-2">
                              {data?.payload?.tech_lang_keys["5"]}{" "}
                              {data?.payload?.tech_lang_keys["2"]} B
                            </p>

                            <div className="mt-2">
                              <BlockMath
                                math={`B = \\sin^{-1} \\left( \\dfrac{b \\sin C}{c} \\right)`}
                              />
                            </div>

                            <div className="mt-2">
                              <BlockMath
                                math={`B = \\sin^{-1} \\left( \\dfrac{${result?.tech_side_b} \\cdot \\sin(${result?.tech_angle_c}^\\circ)}{${result?.tech_side_c}} \\right)`}
                              />
                            </div>

                            <div className="mt-2">
                              <BlockMath
                                math={`B = ${result?.tech_angle_b}^\\circ`}
                              />
                            </div>
                          </>
                        ) : formData?.tech_cal == "aca" ? (
                          <>
                            <p className="mt-2">
                              {data?.payload?.tech_lang_keys["5"]}{" "}
                              {data?.payload?.tech_lang_keys["2"]} C
                            </p>

                            <div className="mt-2">
                              <BlockMath
                                math={`C = \\sin^{-1} \\left( \\dfrac{c \\sin A}{a} \\right)`}
                              />
                            </div>

                            <div className="mt-2">
                              <BlockMath
                                math={`C = \\sin^{-1} \\left( \\dfrac{${result?.tech_side_c} \\cdot \\sin(${result?.tech_angle_a}^\\circ)}{${result?.tech_side_a}} \\right)`}
                              />
                            </div>

                            <div className="mt-2">
                              <BlockMath
                                math={`C = ${result?.tech_angle_c}^\\circ`}
                              />
                            </div>
                          </>
                        ) : formData?.tech_cal == "bcb" ? (
                          <>
                            <p className="mt-2">
                              {data?.payload?.tech_lang_keys["5"]}{" "}
                              {data?.payload?.tech_lang_keys["2"]} C
                            </p>

                            <div className="mt-2">
                              <BlockMath
                                math={`C = \\sin^{-1} \\left( \\dfrac{c \\sin B}{b} \\right)`}
                              />
                            </div>

                            <div className="mt-2">
                              <BlockMath
                                math={`C = \\sin^{-1} \\left( \\dfrac{${result?.tech_side_c} \\cdot \\sin(${result?.tech_angle_b}^\\circ)}{${result?.tech_side_b}} \\right)`}
                              />
                            </div>

                            <div className="mt-2">
                              <BlockMath
                                math={`C = ${result?.tech_angle_c}^\\circ`}
                              />
                            </div>
                          </>
                        ) : formData?.tech_cal == "bab" ? (
                          <>
                            <p className="mt-2">
                              {data?.payload?.tech_lang_keys["5"]}{" "}
                              {data?.payload?.tech_lang_keys["4"]} a
                            </p>

                            <div className="mt-2">
                              <BlockMath
                                math={`a = \\dfrac{b \\sin A}{\\sin B}`}
                              />
                            </div>

                            <div className="mt-2">
                              <BlockMath
                                math={`a = \\dfrac{${result?.tech_side_b} \\cdot \\sin(${result?.tech_angle_a}^\\circ)}{\\sin(${result?.tech_angle_b}^\\circ)}`}
                              />
                            </div>

                            <div className="mt-2">
                              <BlockMath math={`a = ${result?.tech_side_a}`} />
                            </div>
                          </>
                        ) : formData?.tech_cal == "cac" ? (
                          <>
                            <p className="mt-2">
                              {data?.payload?.tech_lang_keys["5"]}{" "}
                              {data?.payload?.tech_lang_keys["4"]} a
                            </p>

                            <div className="mt-2">
                              <BlockMath
                                math={`a = \\dfrac{c \\sin A}{\\sin C}`}
                              />
                            </div>

                            <div className="mt-2">
                              <BlockMath
                                math={`a = \\dfrac{${result?.tech_side_c} \\cdot \\sin(${result?.tech_angle_a}^\\circ)}{\\sin(${result?.tech_angle_c}^\\circ)}`}
                              />
                            </div>

                            <div className="mt-2">
                              <BlockMath math={`a = ${result?.tech_side_a}`} />
                            </div>
                          </>
                        ) : formData?.tech_cal == "aab" ? (
                          <>
                            <p className="mt-2">
                              {data?.payload?.tech_lang_keys["5"]}{" "}
                              {data?.payload?.tech_lang_keys["4"]} b
                            </p>

                            <div className="mt-2">
                              <BlockMath
                                math={`b = \\dfrac{a \\sin B}{\\sin A}`}
                              />
                            </div>

                            <div className="mt-2">
                              <BlockMath
                                math={`b = \\dfrac{${result?.tech_side_a} \\cdot \\sin(${result?.tech_angle_b}^\\circ)}{\\sin(${result?.tech_angle_a}^\\circ)}`}
                              />
                            </div>

                            <div className="mt-2">
                              <BlockMath math={`b = ${result?.tech_side_b}`} />
                            </div>
                          </>
                        ) : formData?.tech_cal == "cbc" ? (
                          <>
                            <p className="mt-2">
                              {data?.payload?.tech_lang_keys["5"]}{" "}
                              {data?.payload?.tech_lang_keys["4"]} b
                            </p>

                            <div className="mt-2">
                              <BlockMath
                                math={`b = \\dfrac{c \\sin B}{\\sin C}`}
                              />
                            </div>

                            <div className="mt-2">
                              <BlockMath
                                math={`b = \\dfrac{${result?.tech_side_c} \\cdot \\sin(${result?.tech_angle_b}^\\circ)}{\\sin(${result?.tech_angle_c}^\\circ)}`}
                              />
                            </div>

                            <div className="mt-2">
                              <BlockMath math={`b = ${result?.tech_side_b}`} />
                            </div>
                          </>
                        ) : formData?.tech_cal == "aac" ? (
                          <>
                            <p className="mt-2">
                              {data?.payload?.tech_lang_keys["5"]}{" "}
                              {data?.payload?.tech_lang_keys["4"]} c
                            </p>

                            <div className="mt-2">
                              <BlockMath
                                math={`c = \\dfrac{a \\sin C}{\\sin A}`}
                              />
                            </div>

                            <div className="mt-2">
                              <BlockMath
                                math={`c = \\dfrac{${result?.tech_side_a} \\cdot \\sin(${result?.tech_angle_c}^\\circ)}{\\sin(${result?.tech_angle_a}^\\circ)}`}
                              />
                            </div>

                            <div className="mt-2">
                              <BlockMath math={`c = ${result?.tech_side_c}`} />
                            </div>
                          </>
                        ) : formData?.tech_cal == "bbc" ? (
                          <>
                            <p className="mt-2">
                              {data?.payload?.tech_lang_keys["5"]}{" "}
                              {data?.payload?.tech_lang_keys["4"]} c
                            </p>

                            <div className="mt-2">
                              <BlockMath
                                math={`c = \\dfrac{b \\sin C}{\\sin B}`}
                              />
                            </div>

                            <div className="mt-2">
                              <BlockMath
                                math={`c = \\dfrac{${result?.tech_side_b} \\cdot \\sin(${result?.tech_angle_c}^\\circ)}{\\sin(${result?.tech_angle_b}^\\circ)}`}
                              />
                            </div>

                            <div className="mt-2">
                              <BlockMath math={`c = ${result?.tech_side_c}`} />
                            </div>
                          </>
                        ) : null}

                        <p className="mt-2">
                          {data?.payload?.tech_lang_keys["6"]}
                        </p>
                        <div className="mt-2">
                          a ={" "}
                          <InlineMath
                            math={`${result?.tech_side_a} \\text{ cm}`}
                          />
                        </div>

                        <div className="mt-2">
                          b ={" "}
                          <InlineMath
                            math={`${result?.tech_side_b} \\text{ cm}`}
                          />
                        </div>

                        <div className="mt-2">
                          c ={" "}
                          <InlineMath
                            math={`${result?.tech_side_c} \\text{ cm}`}
                          />
                        </div>

                        <p className="mt-2">
                          {data?.payload?.tech_lang_keys["7"]}
                        </p>

                        <div className="mt-2">
                          A ={" "}
                          <InlineMath math={`${result?.tech_angle_a}^\\circ`} />
                        </div>

                        <div className="mt-2">
                          B ={" "}
                          <InlineMath math={`${result?.tech_angle_b}^\\circ`} />
                        </div>

                        <div className="mt-2">
                          C ={" "}
                          <InlineMath math={`${result?.tech_angle_c}^\\circ`} />
                        </div>

                        <p className="mt-2">
                          {data?.payload?.tech_lang_keys["8"]}
                        </p>

                        <div className="mt-2">
                          P ={" "}
                          <InlineMath math={`${result?.tech_P} \\text{ cm}`} />
                        </div>

                        <div className="mt-2">
                          s ={" "}
                          <InlineMath math={`${result?.tech_s} \\text{ cm}`} />
                        </div>

                        <div className="mt-2">
                          K ={" "}
                          <InlineMath
                            math={`${result?.tech_K} \\text{ cm}^2`}
                          />
                        </div>

                        <div className="mt-2">
                          r ={" "}
                          <InlineMath math={`${result?.tech_r} \\text{ cm}`} />
                        </div>

                        <div className="mt-2">
                          R ={" "}
                          <InlineMath math={`${result?.tech_R} \\text{ cm}`} />
                        </div>

                        {/* <p className="mt-2">{data?.payload?.tech_lang_keys['9']}</p> */}
                      </div>
                      {/* <div className="col-12 mt-4 canvas">
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

export default LawOfSinesCalculator;

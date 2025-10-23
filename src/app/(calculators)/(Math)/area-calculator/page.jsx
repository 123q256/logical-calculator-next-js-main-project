"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useAreaCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const AreaCalculator = () => {
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
    tech_shapes: "square", // square rectangle  triangle  parallelogram  rhombus  kite circle semicircle sector ellipse trapezoid
    tech_radius: "4",
    tech_radius_unit: "m",
    tech_bara_radius: "4",
    tech_bara_radius_unit: "m",
    tech_number_of_sides: "13",
    tech_find_triangle: "4",
    tech_find_triangle_two: "1",
    tech_find_triangle_three: "1",
    tech_find_triangle_four: "1",
    tech_angle_alpha: "4",
    tech_angle_alpha_unit: "deg",
    tech_angle_beta: "4",
    tech_angle_beta_unit: "deg",
    tech_angle_theta: "4",
    tech_angle_theta_unit: "deg",
    tech_angle_gamma: "4",
    tech_angle_gamma_unit: "deg",
    tech_e: "4",
    tech_e_unit: "m",
    tech_area: "4",
    tech_area_unit: "m",
    tech_box: "4",
    tech_box_unit: "m",
    tech_f: "4",
    tech_f_unit: "m",
    tech_height: "4",
    tech_height_unit: "m",
    tech_c: "4",
    tech_c_unit: "m",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useAreaCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_shapes) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_shapes: formData.tech_shapes,
        tech_radius: formData.tech_radius,
        tech_radius_unit: formData.tech_radius_unit,
        tech_bara_radius: formData.tech_bara_radius,
        tech_bara_radius_unit: formData.tech_bara_radius_unit,
        tech_number_of_sides: formData.tech_number_of_sides,
        tech_find_triangle: formData.tech_find_triangle,
        tech_find_triangle_two: formData.tech_find_triangle_two,
        tech_find_triangle_three: formData.tech_find_triangle_three,
        tech_find_triangle_four: formData.tech_find_triangle_four,
        tech_angle_alpha: formData.tech_angle_alpha,
        tech_angle_alpha_unit: formData.tech_angle_alpha_unit,
        tech_angle_beta: formData.tech_angle_beta,
        tech_angle_beta_unit: formData.tech_angle_beta_unit,
        tech_angle_theta: formData.tech_angle_theta,
        tech_angle_theta_unit: formData.tech_angle_theta_unit,
        tech_angle_gamma: formData.tech_angle_gamma,
        tech_angle_gamma_unit: formData.tech_angle_gamma_unit,
        tech_e: formData.tech_e,
        tech_e_unit: formData.tech_e_unit,
        tech_area: formData.tech_area,
        tech_area_unit: formData.tech_area_unit,
        tech_box: formData.tech_box,
        tech_box_unit: formData.tech_box_unit,
        tech_f: formData.tech_f,
        tech_f_unit: formData.tech_f_unit,
        tech_height: formData.tech_height,
        tech_height_unit: formData.tech_height_unit,
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
      tech_shapes: "square", // square rectangle  triangle  parallelogram  rhombus  kite circle semicircle sector ellipse trapezoid
      tech_radius: "4",
      tech_radius_unit: "m",
      tech_bara_radius: "4",
      tech_bara_radius_unit: "m",
      tech_number_of_sides: "13",
      tech_find_triangle: "4",
      tech_find_triangle_two: "1",
      tech_find_triangle_three: "1",
      tech_find_triangle_four: "1",
      tech_angle_alpha: "4",
      tech_angle_alpha_unit: "deg",
      tech_angle_beta: "4",
      tech_angle_beta_unit: "deg",
      tech_angle_theta: "4",
      tech_angle_theta_unit: "deg",
      tech_angle_gamma: "4",
      tech_angle_gamma_unit: "deg",
      tech_e: "4",
      tech_e_unit: "m",
      tech_area: "4",
      tech_area_unit: "m",
      tech_box: "4",
      tech_box_unit: "m",
      tech_f: "4",
      tech_f_unit: "m",
      tech_height: "4",
      tech_height_unit: "m",
      tech_c: "4",
      tech_c_unit: "m",
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
    setFormData((prev) => ({ ...prev, tech_radius_unit: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  //dropdown states
  const [dropdownVisible1, setDropdownVisible1] = useState(false);

  const setUnitHandler1 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_bara_radius_unit: unit }));
    setDropdownVisible1(false);
  };

  const toggleDropdown1 = () => {
    setDropdownVisible1(!dropdownVisible1);
  };

  //dropdown states
  const [dropdownVisible2, setDropdownVisible2] = useState(false);

  const setUnitHandler2 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_angle_alpha_unit: unit }));
    setDropdownVisible2(false);
  };

  const toggleDropdown2 = () => {
    setDropdownVisible2(!dropdownVisible2);
  };

  //dropdown states
  const [dropdownVisible3, setDropdownVisible3] = useState(false);

  const setUnitHandler3 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_angle_beta_unit: unit }));
    setDropdownVisible3(false);
  };

  const toggleDropdown3 = () => {
    setDropdownVisible3(!dropdownVisible3);
  };

  //dropdown states
  const [dropdownVisible4, setDropdownVisible4] = useState(false);

  const setUnitHandler4 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_angle_theta_unit: unit }));
    setDropdownVisible4(false);
  };

  const toggleDropdown4 = () => {
    setDropdownVisible4(!dropdownVisible4);
  };

  //dropdown states
  const [dropdownVisible5, setDropdownVisible5] = useState(false);

  const setUnitHandler5 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_angle_gamma_unit: unit }));
    setDropdownVisible5(false);
  };

  const toggleDropdown5 = () => {
    setDropdownVisible5(!dropdownVisible5);
  };

  //dropdown states
  const [dropdownVisible6, setDropdownVisible6] = useState(false);

  const setUnitHandler6 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_e_unit: unit }));
    setDropdownVisible6(false);
  };

  const toggleDropdown6 = () => {
    setDropdownVisible6(!dropdownVisible6);
  };
  //dropdown states
  const [dropdownVisible7, setDropdownVisible7] = useState(false);

  const setUnitHandler7 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_area_unit: unit }));
    setDropdownVisible7(false);
  };

  const toggleDropdown7 = () => {
    setDropdownVisible7(!dropdownVisible7);
  };
  //dropdown states
  const [dropdownVisible8, setDropdownVisible8] = useState(false);

  const setUnitHandler8 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_box_unit: unit }));
    setDropdownVisible8(false);
  };

  const toggleDropdown8 = () => {
    setDropdownVisible8(!dropdownVisible8);
  };
  //dropdown states
  const [dropdownVisible9, setDropdownVisible9] = useState(false);

  const setUnitHandler9 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_f_unit: unit }));
    setDropdownVisible9(false);
  };

  const toggleDropdown9 = () => {
    setDropdownVisible9(!dropdownVisible9);
  };
  //dropdown states
  const [dropdownVisible10, setDropdownVisible10] = useState(false);

  const setUnitHandler10 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_height_unit: unit }));
    setDropdownVisible10(false);
  };

  const toggleDropdown10 = () => {
    setDropdownVisible10(!dropdownVisible10);
  };
  //dropdown states
  const [dropdownVisible11, setDropdownVisible11] = useState(false);

  const setUnitHandler11 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_c_unit: unit }));
    setDropdownVisible11(false);
  };

  const toggleDropdown11 = () => {
    setDropdownVisible11(!dropdownVisible11);
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
            <div className="grid grid-cols-12 mt-3 gap-2 md:gap-4 lg:gap-4">
              <div className="col-span-6">
                <div className="col-12">
                  <label htmlFor="tech_shapes" className="label">
                    {data?.payload?.tech_lang_keys["1"]}:
                  </label>
                  <div className="mt-2">
                    <select
                      className="input"
                      aria-label="select"
                      name="tech_shapes"
                      id="tech_shapes"
                      value={formData.tech_shapes}
                      onChange={handleChange}
                    >
                      <option value="square">
                        {data?.payload?.tech_lang_keys["2"]}
                      </option>
                      <option value="rectangle">
                        {data?.payload?.tech_lang_keys["3"]}
                      </option>
                      <option value="triangle">
                        {data?.payload?.tech_lang_keys["4"]}
                      </option>
                      <option value="circle">
                        {data?.payload?.tech_lang_keys["5"]}
                      </option>
                      <option value="semicircle">
                        {data?.payload?.tech_lang_keys["6"]}
                      </option>
                      <option value="sector">
                        {data?.payload?.tech_lang_keys["7"]}
                      </option>
                      <option value="ellipse">
                        {data?.payload?.tech_lang_keys["8"]}
                      </option>
                      <option value="trapezoid">
                        {data?.payload?.tech_lang_keys["9"]}
                      </option>
                      <option value="parallelogram">
                        {data?.payload?.tech_lang_keys["10"]}
                      </option>
                      <option value="rhombus">
                        {data?.payload?.tech_lang_keys["11"]}
                      </option>
                      <option value="kite">
                        {data?.payload?.tech_lang_keys["12"]}
                      </option>
                      <option value="regular pentagon">
                        {data?.payload?.tech_lang_keys["13"]}
                      </option>
                      <option value="regular hexagon">
                        {data?.payload?.tech_lang_keys["14"]}
                      </option>
                      <option value="regular octagon">
                        {data?.payload?.tech_lang_keys["15"]}
                      </option>
                      <option value="annulus (ring)">
                        {data?.payload?.tech_lang_keys["16"]}
                      </option>
                      <option value="irregular quadrilateral">
                        {data?.payload?.tech_lang_keys["17"]}
                      </option>
                      <option value="regular polygon">
                        {data?.payload?.tech_lang_keys["18"]}
                      </option>
                    </select>
                  </div>
                </div>
                {(formData.tech_shapes == "circle" ||
                  formData.tech_shapes == "semicircle" ||
                  formData.tech_shapes == "sector" ||
                  formData.tech_shapes == "annulus (ring)") && (
                  <>
                    <div className="col-12 radius">
                      <label htmlFor="tech_radius" className="label">
                        r
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
                          {formData.tech_radius_unit} ▾
                        </label>
                        {dropdownVisible && (
                          <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                            {[
                              { label: "mm", value: "mm" },
                              { label: "cm", value: "cm" },
                              { label: "m", value: "m" },
                              { label: "km", value: "km" },
                              { label: "in", value: "in" },
                              { label: "ft", value: "ft" },
                              { label: "yd", value: "yd" },
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
                  </>
                )}
                {formData.tech_shapes == "annulus (ring)" && (
                  <>
                    <div className="col-12 bara_radius">
                      <label htmlFor="tech_bara_radius" className="label">
                        R:
                      </label>
                      <div className="relative w-full ">
                        <input
                          type="number"
                          name="tech_bara_radius"
                          step="any"
                          className="mt-1 input"
                          value={formData.tech_bara_radius}
                          placeholder="00"
                          onChange={handleChange}
                        />
                        <label
                          className="absolute cursor-pointer text-sm underline right-6 top-4"
                          onClick={toggleDropdown1}
                        >
                          {formData.tech_bara_radius_unit} ▾
                        </label>
                        {dropdownVisible1 && (
                          <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                            {[
                              { label: "mm", value: "mm" },
                              { label: "cm", value: "cm" },
                              { label: "m", value: "m" },
                              { label: "km", value: "km" },
                              { label: "in", value: "in" },
                              { label: "ft", value: "ft" },
                              { label: "yd", value: "yd" },
                              { label: "mi", value: "mi" },
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
                {formData.tech_shapes == "regular polygon" && (
                  <>
                    <div className="col-12 no_of_sides">
                      <label htmlFor="tech_number_of_sides" className="label">
                        {data?.payload?.tech_lang_keys["19"]}:
                      </label>
                      <div className=" relative">
                        <input
                          type="number"
                          step="any"
                          name="tech_number_of_sides"
                          id="tech_number_of_sides"
                          className="input my-2"
                          aria-label="input"
                          placeholder="00"
                          value={formData.tech_number_of_sides}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </>
                )}
                {formData.tech_shapes == "triangle" && (
                  <>
                    <div className="col-12 test1">
                      <label htmlFor="tech_find_triangle" className="label">
                        {data?.payload?.tech_lang_keys["20"]}:
                      </label>
                      <div className="mt-2">
                        <select
                          className="input"
                          aria-label="select"
                          name="tech_find_triangle"
                          id="tech_find_triangle"
                          value={formData.tech_find_triangle}
                          onChange={handleChange}
                        >
                          <option value="1">
                            {data?.payload?.tech_lang_keys["21"]}{" "}
                          </option>
                          <option value="2">
                            {data?.payload?.tech_lang_keys["22"]} (SSS){" "}
                          </option>
                          <option value="3">
                            {data?.payload?.tech_lang_keys["23"]} (SAS){" "}
                          </option>
                          <option value="4">
                            {data?.payload?.tech_lang_keys["24"]} (ASA)
                          </option>
                        </select>
                      </div>
                    </div>
                  </>
                )}
                {formData.tech_shapes == "parallelogram" && (
                  <>
                    <div className="col-12 test2">
                      <label htmlFor="tech_find_triangle_two" className="label">
                        {data?.payload?.tech_lang_keys["20"]}:
                      </label>
                      <div className="mt-2">
                        <select
                          className="input"
                          aria-label="select"
                          name="tech_find_triangle_two"
                          id="tech_find_triangle_two"
                          value={formData.tech_find_triangle_two}
                          onChange={handleChange}
                        >
                          <option value="1">
                            {data?.payload?.tech_lang_keys["21"]}{" "}
                          </option>
                          <option value="2">
                            {data?.payload?.tech_lang_keys["25"]}{" "}
                          </option>
                          <option value="3">
                            {data?.payload?.tech_lang_keys["26"]}{" "}
                          </option>
                        </select>
                      </div>
                    </div>
                  </>
                )}

                {formData.tech_shapes == "rhombus" && (
                  <>
                    <div className="col-12 test3">
                      <label
                        htmlFor="tech_find_triangle_three"
                        className="label"
                      >
                        {data?.payload?.tech_lang_keys["20"]}:
                      </label>
                      <div className="mt-2">
                        <select
                          className="input"
                          aria-label="select"
                          name="tech_find_triangle_three"
                          id="tech_find_triangle_three"
                          value={formData.tech_find_triangle_three}
                          onChange={handleChange}
                        >
                          <option value="1">
                            {data?.payload?.tech_lang_keys["21"]}{" "}
                          </option>
                          <option value="2">
                            {data?.payload?.tech_lang_keys["27"]}{" "}
                          </option>
                          <option value="3">
                            {data?.payload?.tech_lang_keys["28"]}{" "}
                          </option>
                        </select>
                      </div>
                    </div>
                  </>
                )}
                {formData.tech_shapes == "kite" && (
                  <>
                    <div className="col-12 test4">
                      <label
                        htmlFor="tech_find_triangle_four"
                        className="label"
                      >
                        {data?.payload?.tech_lang_keys["20"]}:
                      </label>
                      <div className="mt-2">
                        <select
                          className="input"
                          aria-label="select"
                          name="tech_find_triangle_four"
                          id="tech_find_triangle_four"
                          value={formData.tech_find_triangle_four}
                          onChange={handleChange}
                        >
                          <option value="1">
                            {data?.payload?.tech_lang_keys["27"]}{" "}
                          </option>
                          <option value="2">
                            {data?.payload?.tech_lang_keys["29"]}{" "}
                          </option>
                        </select>
                      </div>
                    </div>
                  </>
                )}

                {(formData.tech_shapes == "sector" ||
                  formData.tech_shapes == "irregular quadrilateral" ||
                  (formData.tech_shapes == "parallelogram" &&
                    formData.tech_find_triangle_two == "2") ||
                  (formData.tech_shapes == "rhombus" &&
                    formData.tech_find_triangle_three == "3") ||
                  (formData.tech_shapes == "kite" &&
                    formData.tech_find_triangle_four == "2")) && (
                  <>
                    <div className="col-12 angle_alpha">
                      <label htmlFor="tech_angle_alpha" className="label">
                        {data?.payload?.tech_lang_keys["30"]} α:
                      </label>
                      <div className="relative w-full ">
                        <input
                          type="number"
                          name="tech_angle_alpha"
                          step="any"
                          className="mt-1 input"
                          value={formData.tech_angle_alpha}
                          placeholder="00"
                          onChange={handleChange}
                        />
                        <label
                          className="absolute cursor-pointer text-sm underline right-6 top-4"
                          onClick={toggleDropdown2}
                        >
                          {formData.tech_angle_alpha_unit} ▾
                        </label>
                        {dropdownVisible2 && (
                          <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                            {[
                              { label: "deg", value: "deg" },
                              { label: "rad", value: "rad" },
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
                {formData.tech_shapes == "triangle" &&
                  formData.tech_find_triangle == "4" && (
                    <>
                      <div className="col-12 angle_beta">
                        <label htmlFor="tech_angle_beta" className="label">
                          {data?.payload?.tech_lang_keys["30"]} β:
                        </label>
                        <div className="relative w-full ">
                          <input
                            type="number"
                            name="tech_angle_beta"
                            step="any"
                            className="mt-1 input"
                            value={formData.tech_angle_beta}
                            placeholder="00"
                            onChange={handleChange}
                          />
                          <label
                            className="absolute cursor-pointer text-sm underline right-6 top-4"
                            onClick={toggleDropdown3}
                          >
                            {formData.tech_angle_beta_unit} ▾
                          </label>
                          {dropdownVisible3 && (
                            <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                              {[
                                { label: "deg", value: "deg" },
                                { label: "rad", value: "rad" },
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
                {formData.tech_shapes == "parallelogram" &&
                  formData.tech_find_triangle_two == "3" && (
                    <>
                      <div className="col-12 angle_theta">
                        <label htmlFor="tech_angle_theta" className="label">
                          {data?.payload?.tech_lang_keys["30"]} θ:
                        </label>
                        <div className="relative w-full ">
                          <input
                            type="number"
                            name="tech_angle_theta"
                            step="any"
                            className="mt-1 input"
                            value={formData.tech_angle_theta}
                            placeholder="00"
                            onChange={handleChange}
                          />
                          <label
                            className="absolute cursor-pointer text-sm underline right-6 top-4"
                            onClick={toggleDropdown4}
                          >
                            {formData.tech_angle_theta_unit} ▾
                          </label>
                          {dropdownVisible4 && (
                            <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                              {[
                                { label: "deg", value: "deg" },
                                { label: "rad", value: "rad" },
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
                {((formData.tech_shapes == "triangle" &&
                  formData.tech_find_triangle == "3") ||
                  (formData.tech_shapes == "triangle" &&
                    formData.tech_find_triangle == "4")) && (
                  <>
                    <div className="col-12 angle_gamma">
                      <label htmlFor="tech_angle_gamma" className="label">
                        {data?.payload?.tech_lang_keys["30"]} γ:
                      </label>
                      <div className="relative w-full ">
                        <input
                          type="number"
                          name="tech_angle_gamma"
                          step="any"
                          className="mt-1 input"
                          value={formData.tech_angle_gamma}
                          placeholder="00"
                          onChange={handleChange}
                        />
                        <label
                          className="absolute cursor-pointer text-sm underline right-6 top-4"
                          onClick={toggleDropdown5}
                        >
                          {formData.tech_angle_gamma_unit} ▾
                        </label>
                        {dropdownVisible5 && (
                          <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                            {[
                              { label: "deg", value: "deg" },
                              { label: "rad", value: "rad" },
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
                {(formData.tech_shapes == "irregular quadrilateral" ||
                  (formData.tech_shapes == "parallelogram" &&
                    formData.tech_find_triangle_two == "3") ||
                  (formData.tech_shapes == "rhombus" &&
                    formData.tech_find_triangle_three == "2") ||
                  (formData.tech_shapes == "kite" &&
                    formData.tech_find_triangle_four == "1")) && (
                  <>
                    <div className="col-12 e">
                      <label htmlFor="tech_e" className="label">
                        e:
                      </label>
                      <div className="relative w-full ">
                        <input
                          type="number"
                          name="tech_e"
                          step="any"
                          className="mt-1 input"
                          value={formData.tech_e}
                          placeholder="00"
                          onChange={handleChange}
                        />
                        <label
                          className="absolute cursor-pointer text-sm underline right-6 top-4"
                          onClick={toggleDropdown6}
                        >
                          {formData.tech_e_unit} ▾
                        </label>
                        {dropdownVisible6 && (
                          <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                            {[
                              { label: "mm", value: "mm" },
                              { label: "cm", value: "cm" },
                              { label: "m", value: "m" },
                              { label: "km", value: "km" },
                              { label: "in", value: "in" },
                              { label: "ft", value: "ft" },
                              { label: "yd", value: "yd" },
                              { label: "mi", value: "mi" },
                            ].map((unit, index) => (
                              <p
                                key={index}
                                className="p-2 hover:bg-gray-100 cursor-pointer"
                                onClick={() => setUnitHandler6(unit.value)}
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
                {(formData.tech_shapes == "square" ||
                  formData.tech_shapes == "rectangle" ||
                  (formData.tech_shapes == "triangle" &&
                    formData.tech_find_triangle == "2") ||
                  (formData.tech_shapes == "triangle" &&
                    formData.tech_find_triangle == "3") ||
                  (formData.tech_shapes == "triangle" &&
                    formData.tech_find_triangle == "4") ||
                  formData.tech_shapes == "ellipse" ||
                  formData.tech_shapes == "trapezoid" ||
                  formData.tech_shapes == "regular pentagon" ||
                  formData.tech_shapes == "regular hexagon" ||
                  formData.tech_shapes == "regular octagon" ||
                  formData.tech_shapes == "regular polygon" ||
                  (formData.tech_shapes == "parallelogram" &&
                    formData.tech_find_triangle_two == "2") ||
                  (formData.tech_shapes == "rhombus" &&
                    formData.tech_find_triangle_three == "1") ||
                  (formData.tech_shapes == "rhombus" &&
                    formData.tech_find_triangle_three == "3") ||
                  (formData.tech_shapes == "kite" &&
                    formData.tech_find_triangle_four == "2")) && (
                  <>
                    <div className="col-12 area">
                      <label htmlFor="tech_area" className="label">
                        a:
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
                          onClick={toggleDropdown7}
                        >
                          {formData.tech_area_unit} ▾
                        </label>
                        {dropdownVisible7 && (
                          <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                            {[
                              { label: "mm", value: "mm" },
                              { label: "cm", value: "cm" },
                              { label: "m", value: "m" },
                              { label: "km", value: "km" },
                              { label: "in", value: "in" },
                              { label: "ft", value: "ft" },
                              { label: "yd", value: "yd" },
                              { label: "mi", value: "mi" },
                            ].map((unit, index) => (
                              <p
                                key={index}
                                className="p-2 hover:bg-gray-100 cursor-pointer"
                                onClick={() => setUnitHandler7(unit.value)}
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
                {(formData.tech_shapes == "rectangle" ||
                  (formData.tech_shapes == "triangle" &&
                    formData.tech_find_triangle == "1") ||
                  (formData.tech_shapes == "triangle" &&
                    formData.tech_find_triangle == "2") ||
                  (formData.tech_shapes == "triangle" &&
                    formData.tech_find_triangle == "3") ||
                  formData.tech_shapes == "ellipse" ||
                  formData.tech_shapes == "trapezoid" ||
                  (formData.tech_shapes == "parallelogram" &&
                    formData.tech_find_triangle_two == "1") ||
                  (formData.tech_shapes == "parallelogram" &&
                    formData.tech_find_triangle_two == "2") ||
                  (formData.tech_shapes == "kite" &&
                    formData.tech_find_triangle_four == "2")) && (
                  <>
                    <div className="col-12 boxes">
                      <label htmlFor="tech_box" className="label">
                        b:
                      </label>
                      <div className="relative w-full ">
                        <input
                          type="number"
                          name="tech_box"
                          step="any"
                          className="mt-1 input"
                          value={formData.tech_box}
                          placeholder="00"
                          onChange={handleChange}
                        />
                        <label
                          className="absolute cursor-pointer text-sm underline right-6 top-4"
                          onClick={toggleDropdown8}
                        >
                          {formData.tech_box_unit} ▾
                        </label>
                        {dropdownVisible8 && (
                          <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                            {[
                              { label: "mm", value: "mm" },
                              { label: "cm", value: "cm" },
                              { label: "m", value: "m" },
                              { label: "km", value: "km" },
                              { label: "in", value: "in" },
                              { label: "ft", value: "ft" },
                              { label: "yd", value: "yd" },
                              { label: "mi", value: "mi" },
                            ].map((unit, index) => (
                              <p
                                key={index}
                                className="p-2 hover:bg-gray-100 cursor-pointer"
                                onClick={() => setUnitHandler8(unit.value)}
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
                {(formData.tech_shapes == "irregular quadrilateral" ||
                  (formData.tech_shapes == "parallelogram" &&
                    formData.tech_find_triangle_two == "3") ||
                  (formData.tech_shapes == "rhombus" &&
                    formData.tech_find_triangle_three == "2") ||
                  (formData.tech_shapes == "kite" &&
                    formData.tech_find_triangle_four == "1")) && (
                  <>
                    <div className="col-12 f">
                      <label htmlFor="tech_f" className="label">
                        f:
                      </label>
                      <div className="relative w-full ">
                        <input
                          type="number"
                          name="tech_f"
                          step="any"
                          className="mt-1 input"
                          value={formData.tech_f}
                          placeholder="00"
                          onChange={handleChange}
                        />
                        <label
                          className="absolute cursor-pointer text-sm underline right-6 top-4"
                          onClick={toggleDropdown9}
                        >
                          {formData.tech_f_unit} ▾
                        </label>
                        {dropdownVisible9 && (
                          <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                            {[
                              { label: "mm", value: "mm" },
                              { label: "cm", value: "cm" },
                              { label: "m", value: "m" },
                              { label: "km", value: "km" },
                              { label: "in", value: "in" },
                              { label: "ft", value: "ft" },
                              { label: "yd", value: "yd" },
                              { label: "mi", value: "mi" },
                            ].map((unit, index) => (
                              <p
                                key={index}
                                className="p-2 hover:bg-gray-100 cursor-pointer"
                                onClick={() => setUnitHandler9(unit.value)}
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
                {((formData.tech_shapes == "triangle" &&
                  formData.tech_find_triangle == "1") ||
                  formData.tech_shapes == "trapezoid" ||
                  (formData.tech_shapes == "parallelogram" &&
                    formData.tech_find_triangle_two == "1") ||
                  (formData.tech_shapes == "rhombus" &&
                    formData.tech_find_triangle_three == "1")) && (
                  <>
                    <div className="col-12 height">
                      <label htmlFor="tech_height" className="label">
                        h:
                      </label>
                      <div className="relative w-full ">
                        <input
                          type="number"
                          name="tech_height"
                          step="any"
                          className="mt-1 input"
                          value={formData.tech_height}
                          placeholder="00"
                          onChange={handleChange}
                        />
                        <label
                          className="absolute cursor-pointer text-sm underline right-6 top-4"
                          onClick={toggleDropdown10}
                        >
                          {formData.tech_height_unit} ▾
                        </label>
                        {dropdownVisible10 && (
                          <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                            {[
                              { label: "mm", value: "mm" },
                              { label: "cm", value: "cm" },
                              { label: "m", value: "m" },
                              { label: "km", value: "km" },
                              { label: "in", value: "in" },
                              { label: "ft", value: "ft" },
                              { label: "yd", value: "yd" },
                              { label: "mi", value: "mi" },
                            ].map((unit, index) => (
                              <p
                                key={index}
                                className="p-2 hover:bg-gray-100 cursor-pointer"
                                onClick={() => setUnitHandler10(unit.value)}
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
                {formData.tech_shapes == "triangle" &&
                  formData.tech_find_triangle == "2" && (
                    <>
                      <div className="col-12 c">
                        <label htmlFor="tech_c" className="label">
                          c:
                        </label>
                        <div className="relative w-full ">
                          <input
                            type="number"
                            name="tech_c"
                            step="any"
                            className="mt-1 input"
                            value={formData.tech_c}
                            placeholder="00"
                            onChange={handleChange}
                          />
                          <label
                            className="absolute cursor-pointer text-sm underline right-6 top-4"
                            onClick={toggleDropdown11}
                          >
                            {formData.tech_c_unit} ▾
                          </label>
                          {dropdownVisible11 && (
                            <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                              {[
                                { label: "mm", value: "mm" },
                                { label: "cm", value: "cm" },
                                { label: "m", value: "m" },
                                { label: "km", value: "km" },
                                { label: "in", value: "in" },
                                { label: "ft", value: "ft" },
                                { label: "yd", value: "yd" },
                                { label: "mi", value: "mi" },
                              ].map((unit, index) => (
                                <p
                                  key={index}
                                  className="p-2 hover:bg-gray-100 cursor-pointer"
                                  onClick={() => setUnitHandler11(unit.value)}
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
              <div className="col-span-6 flex items-center justify-center">
                {formData.tech_shapes == "square" && (
                  <>
                    {" "}
                    <img
                      src="/images/sav1.svg"
                      alt="Flow Rate Calculator"
                      width="130"
                      height="130"
                      className="change_img"
                    />{" "}
                  </>
                )}
                {formData.tech_shapes == "rectangle" && (
                  <>
                    {" "}
                    <img
                      src="/images/sav2.svg"
                      alt="Flow Rate Calculator"
                      width="130"
                      height="130"
                      className="change_img"
                    />{" "}
                  </>
                )}

                {formData.tech_shapes == "triangle" && (
                  <>
                    {formData.tech_find_triangle == "1" && (
                      <>
                        <img
                          src="/images/sav12.svg"
                          alt="Flow Rate Calculator"
                          width="130"
                          height="130"
                          className="change_img"
                        />
                      </>
                    )}
                    {formData.tech_find_triangle == "2" && (
                      <>
                        <img
                          src="/images/sav4.svg"
                          alt="Flow Rate Calculator"
                          width="130"
                          height="130"
                          className="change_img"
                        />
                      </>
                    )}
                    {formData.tech_find_triangle == "3" && (
                      <>
                        <img
                          src="/images/sav5.svg"
                          alt="Flow Rate Calculator"
                          width="130"
                          height="130"
                          className="change_img"
                        />
                      </>
                    )}
                    {formData.tech_find_triangle == "4" && (
                      <>
                        <img
                          src="/images/sav6.svg"
                          alt="Flow Rate Calculator"
                          width="130"
                          height="130"
                          className="change_img"
                        />
                      </>
                    )}
                  </>
                )}

                {formData.tech_shapes == "circle" && (
                  <>
                    {" "}
                    <img
                      src="/images/sav7.svg"
                      alt="Flow Rate Calculator"
                      width="130"
                      height="130"
                      className="change_img"
                    />{" "}
                  </>
                )}
                {formData.tech_shapes == "semicircle" && (
                  <>
                    {" "}
                    <img
                      src="/images/sav8.svg"
                      alt="Flow Rate Calculator"
                      width="130"
                      height="130"
                      className="change_img"
                    />{" "}
                  </>
                )}
                {formData.tech_shapes == "sector" && (
                  <>
                    {" "}
                    <img
                      src="/images/sav9.svg"
                      alt="Flow Rate Calculator"
                      width="130"
                      height="130"
                      className="change_img"
                    />{" "}
                  </>
                )}
                {formData.tech_shapes == "ellipse" && (
                  <>
                    {" "}
                    <img
                      src="/images/sav10.svg"
                      alt="Flow Rate Calculator"
                      width="130"
                      height="130"
                      className="change_img"
                    />{" "}
                  </>
                )}
                {formData.tech_shapes == "trapezoid" && (
                  <>
                    {" "}
                    <img
                      src="/images/sav11.svg"
                      alt="Flow Rate Calculator"
                      width="130"
                      height="130"
                      className="change_img"
                    />{" "}
                  </>
                )}

                {formData.tech_shapes == "parallelogram" && (
                  <>
                    {formData.tech_find_triangle_two == "1" && (
                      <>
                        <img
                          src="/images/sav12.svg"
                          alt="Flow Rate Calculator"
                          width="130"
                          height="130"
                          className="change_img"
                        />
                      </>
                    )}
                    {formData.tech_find_triangle_two == "2" && (
                      <>
                        <img
                          src="/images/sav13.svg"
                          alt="Flow Rate Calculator"
                          width="130"
                          height="130"
                          className="change_img"
                        />
                      </>
                    )}
                    {formData.tech_find_triangle_two == "3" && (
                      <>
                        <img
                          src="/images/sav14.svg"
                          alt="Flow Rate Calculator"
                          width="130"
                          height="130"
                          className="change_img"
                        />
                      </>
                    )}
                  </>
                )}
                {formData.tech_shapes == "rhombus" && (
                  <>
                    {formData.tech_find_triangle_three == "1" && (
                      <>
                        <img
                          src="/images/sav16.svg"
                          alt="Flow Rate Calculator"
                          width="130"
                          height="130"
                          className="change_img"
                        />
                      </>
                    )}
                    {formData.tech_find_triangle_three == "2" && (
                      <>
                        <img
                          src="/images/sav17.svg"
                          alt="Flow Rate Calculator"
                          width="130"
                          height="130"
                          className="change_img"
                        />
                      </>
                    )}

                    {formData.tech_find_triangle_three == "3" && (
                      <>
                        <img
                          src="/images/sav15.svg"
                          alt="Flow Rate Calculator"
                          width="130"
                          height="130"
                          className="change_img"
                        />
                      </>
                    )}
                  </>
                )}
                {formData.tech_shapes == "kite" && (
                  <>
                    {formData.tech_find_triangle_four == "1" && (
                      <>
                        <img
                          src="/images/sav18.svg"
                          alt="Flow Rate Calculator"
                          width="130"
                          height="130"
                          className="change_img"
                        />
                      </>
                    )}
                    {formData.tech_find_triangle_four == "2" && (
                      <>
                        <img
                          src="/images/sav19.svg"
                          alt="Flow Rate Calculator"
                          width="130"
                          height="130"
                          className="change_img"
                        />
                      </>
                    )}
                  </>
                )}

                {formData.tech_shapes == "regular pentagon" && (
                  <>
                    {" "}
                    <img
                      src="/images/sav20.svg"
                      alt="Flow Rate Calculator"
                      width="130"
                      height="130"
                      className="change_img"
                    />{" "}
                  </>
                )}
                {formData.tech_shapes == "regular hexagon" && (
                  <>
                    {" "}
                    <img
                      src="/images/sav21.svg"
                      alt="Flow Rate Calculator"
                      width="130"
                      height="130"
                      className="change_img"
                    />{" "}
                  </>
                )}
                {formData.tech_shapes == "regular octagon" && (
                  <>
                    {" "}
                    <img
                      src="/images/sav22.svg"
                      alt="Flow Rate Calculator"
                      width="130"
                      height="130"
                      className="change_img"
                    />{" "}
                  </>
                )}
                {formData.tech_shapes == "annulus (ring)" && (
                  <>
                    {" "}
                    <img
                      src="/images/sav23.svg"
                      alt="Flow Rate Calculator"
                      width="130"
                      height="130"
                      className="change_img"
                    />{" "}
                  </>
                )}
                {formData.tech_shapes == "irregular quadrilateral" && (
                  <>
                    {" "}
                    <img
                      src="/images/sav24.svg"
                      alt="Flow Rate Calculator"
                      width="130"
                      height="130"
                      className="change_img"
                    />{" "}
                  </>
                )}
                {formData.tech_shapes == "regular polygon" && (
                  <>
                    {" "}
                    <img
                      src="/images/sav25.svg"
                      alt="Flow Rate Calculator"
                      width="130"
                      height="130"
                      className="change_img"
                    />{" "}
                  </>
                )}
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
                      <div className="w-full my-2 text-center overflow-auto">
                        {result?.tech_method == "1" && (
                          <>
                            <div className="text-center">
                              <p className="text-[20px]">
                                <strong>
                                  {data?.payload?.tech_lang_keys["2"]}{" "}
                                  {data?.payload?.tech_lang_keys["32"]}
                                </strong>
                              </p>
                              <p className="md:text-[32px] bg-[#2845F5] text-white px-3 py-2 rounded-lg inline-block my-2">
                                <strong className="text-white">
                                  {Number(result?.tech_answer).toFixed(2)}
                                  <span className="text-[20px]">
                                    {" "}
                                    (cm<sup>2</sup>)
                                  </span>
                                </strong>
                              </p>
                            </div>

                            <p className="mt-2 text-start">
                              <strong>
                                {data?.payload?.tech_lang_keys["36"]} :
                              </strong>
                            </p>
                            <div className="mt-2 text-start">
                              <BlockMath
                                math={`${data?.payload?.tech_lang_keys["2"]}\\ ${data?.payload?.tech_lang_keys["32"]} = a^2`}
                              />
                            </div>

                            <p className="mt-2 text-start">
                              <strong>
                                {data?.payload?.tech_lang_keys["34"]} :
                              </strong>
                            </p>
                            <div className="mt-2 text-start">
                              <BlockMath math={`a = ${result?.tech_area}`} />
                            </div>

                            <p className="mt-2 text-start">
                              <strong>
                                {data?.payload?.tech_lang_keys["37"]} :
                              </strong>
                            </p>
                            <div className="mt-2 text-start">
                              <BlockMath
                                math={`${data?.payload?.tech_lang_keys["2"]}\\ ${data?.payload?.tech_lang_keys["32"]} = (${result?.tech_area})^2`}
                              />
                            </div>

                            <div className="mt-2 text-start">
                              <BlockMath
                                math={`${
                                  data?.payload?.tech_lang_keys["2"]
                                }\\ ${
                                  data?.payload?.tech_lang_keys["32"]
                                } = ${Number(result?.tech_answer).toFixed(2)}`}
                              />
                              <span className="text-black">
                                {" "}
                                (cm<sup>2</sup>)
                              </span>
                            </div>
                          </>
                        )}
                        {result?.tech_method == "2" && (
                          <>
                            <div className="text-center">
                              <p className="text-[20px]">
                                <strong>
                                  {data?.payload?.tech_lang_keys["3"]}{" "}
                                  {data?.payload?.tech_lang_keys["32"]}
                                </strong>
                              </p>
                              <p className="md:text-[32px] bg-[#2845F5] text-white px-3 py-2 rounded-lg inline-block my-2">
                                <strong className="text-white">
                                  {Number(result?.tech_answer).toFixed(2)}
                                  <span className="text-[20px]">
                                    {" "}
                                    (cm<sup>2</sup>)
                                  </span>
                                </strong>
                              </p>
                            </div>

                            <p className="mt-2 text-start">
                              <strong>
                                {data?.payload?.tech_lang_keys["36"]} :
                              </strong>
                            </p>
                            <div className="mt-2 text-start">
                              <BlockMath
                                math={`${data?.payload?.tech_lang_keys["3"]}\\ ${data?.payload?.tech_lang_keys["32"]} = a \\times b`}
                              />
                            </div>

                            <p className="mt-2 text-start">
                              <strong>Input :</strong>
                            </p>
                            <div className="mt-2 text-start">
                              <BlockMath
                                math={`a = ${result?.tech_area},\\ b = ${result?.tech_box}`}
                              />
                            </div>

                            <p className="mt-2 text-start">
                              <strong>
                                {data?.payload?.tech_lang_keys["37"]} :
                              </strong>
                            </p>
                            <div className="mt-2 text-start">
                              <BlockMath
                                math={`${data?.payload?.tech_lang_keys["3"]}\\ ${data?.payload?.tech_lang_keys["32"]} = ${result?.tech_area} \\times ${result?.tech_box}`}
                              />
                            </div>

                            <div className="mt-2 text-start">
                              <BlockMath
                                math={`${
                                  data?.payload?.tech_lang_keys["3"]
                                }\\ ${
                                  data?.payload?.tech_lang_keys["32"]
                                } = ${Number(result?.tech_answer).toFixed(2)}`}
                              />
                              <span className="text-black">
                                {" "}
                                (cm<sup>2</sup>)
                              </span>
                            </div>
                          </>
                        )}
                        {result?.tech_method == "31" && (
                          <>
                            <div className="text-center">
                              <p className="text-[20px]">
                                <strong>
                                  {data?.payload?.tech_lang_keys["4"]}{" "}
                                  {data?.payload?.tech_lang_keys["32"]}
                                </strong>
                              </p>
                              <p className="md:text-[32px] bg-[#2845F5] text-white px-3 py-2 rounded-lg inline-block my-2">
                                <strong className="text-white">
                                  {Number(result?.tech_answer).toFixed(2)}
                                  <span className="text-[20px]">
                                    {" "}
                                    (cm<sup>2</sup>)
                                  </span>
                                </strong>
                              </p>
                            </div>

                            <p className="mt-2 text-start">
                              <strong>
                                {data?.payload?.tech_lang_keys["36"]} :
                              </strong>
                            </p>
                            <div className="mt-2 text-start">
                              <BlockMath
                                math={`${data?.payload?.tech_lang_keys["4"]}\\ ${data?.payload?.tech_lang_keys["32"]} = \\dfrac{b \\cdot h}{2}`}
                              />
                            </div>

                            <p className="mt-2 text-start">
                              <strong>
                                {data?.payload?.tech_lang_keys["35"]} :
                              </strong>
                            </p>
                            <div className="mt-2 text-start">
                              <BlockMath
                                math={`b = ${result?.tech_box},\\ h = ${result?.tech_height}`}
                              />
                            </div>

                            <p className="mt-2 text-start">
                              <strong>
                                {data?.payload?.tech_lang_keys["37"]} :
                              </strong>
                            </p>
                            <div className="mt-2 text-start">
                              <BlockMath
                                math={`${data?.payload?.tech_lang_keys["4"]}\\ ${data?.payload?.tech_lang_keys["32"]} = \\dfrac{${result?.tech_box} \\cdot ${result?.tech_height}}{2}`}
                              />
                            </div>

                            <div className="mt-2 text-start">
                              <BlockMath
                                math={`${
                                  data?.payload?.tech_lang_keys["4"]
                                }\\ ${
                                  data?.payload?.tech_lang_keys["32"]
                                } = ${Number(result?.tech_answer).toFixed(2)}`}
                              />
                              <span className="text-black">
                                {" "}
                                (cm<sup>2</sup>)
                              </span>
                            </div>
                          </>
                        )}
                        {result?.tech_method == "15" && (
                          <>
                            <div className="text-center">
                              <p className="text-[20px]">
                                <strong>
                                  {data?.payload?.tech_lang_keys["10"]}{" "}
                                  {data?.payload?.tech_lang_keys["32"]}
                                </strong>
                              </p>
                              <p className="md:text-[32px] bg-[#2845F5] text-white px-3 py-2 rounded-lg inline-block my-2">
                                <strong className="text-white">
                                  {Number(result?.tech_answer).toFixed(2)}
                                  <span className="text-[20px]">
                                    {" "}
                                    (cm<sup>2</sup>)
                                  </span>
                                </strong>
                              </p>
                            </div>

                            <p className="mt-2 text-start">
                              <strong>
                                {data?.payload?.tech_lang_keys["36"]} :
                              </strong>
                            </p>
                            <div className="mt-2 text-start">
                              <BlockMath
                                math={`${data?.payload?.tech_lang_keys["10"]}\\ ${data?.payload?.tech_lang_keys["32"]} = b \\cdot h`}
                              />
                            </div>

                            <p className="mt-2 text-start">
                              <strong>
                                {data?.payload?.tech_lang_keys["35"]} :
                              </strong>
                            </p>
                            <div className="mt-2 text-start">
                              <BlockMath
                                math={`b = ${result?.tech_box},\\ h = ${result?.tech_height}`}
                              />
                            </div>

                            <p className="mt-2 text-start">
                              <strong>
                                {data?.payload?.tech_lang_keys["37"]} :
                              </strong>
                            </p>
                            <div className="mt-2 text-start">
                              <BlockMath
                                math={`${data?.payload?.tech_lang_keys["10"]}\\ ${data?.payload?.tech_lang_keys["32"]} = ${result?.tech_box} \\cdot ${result?.tech_height}`}
                              />
                            </div>

                            <div className="mt-2 text-start">
                              <BlockMath
                                math={`${
                                  data?.payload?.tech_lang_keys["10"]
                                }\\ ${
                                  data?.payload?.tech_lang_keys["32"]
                                } = ${Number(result?.tech_answer).toFixed(2)}`}
                              />
                              <span className="text-black">
                                {" "}
                                (cm<sup>2</sup>)
                              </span>
                            </div>
                          </>
                        )}
                        {result?.tech_method == "16" && (
                          <>
                            <div className="text-center">
                              <p className="text-[20px]">
                                <strong>
                                  {data?.payload?.tech_lang_keys["10"]}{" "}
                                  {data?.payload?.tech_lang_keys["32"]}
                                </strong>
                              </p>
                              <p className="md:text-[32px] bg-[#2845F5] text-white px-3 py-2 rounded-lg inline-block my-2">
                                <strong className="text-white">
                                  {Number(result?.tech_answer).toFixed(2)}
                                  <span className="text-[20px]">
                                    {" "}
                                    (cm<sup>2</sup>)
                                  </span>
                                </strong>
                              </p>
                            </div>

                            <p className="mt-2 text-start">
                              <strong>
                                {data?.payload?.tech_lang_keys["36"]} :
                              </strong>
                            </p>
                            <div className="mt-2 text-start">
                              <BlockMath
                                math={`${data?.payload?.tech_lang_keys["10"]}\\ ${data?.payload?.tech_lang_keys["32"]} = a \\cdot b \\cdot \\sin(\\alpha)`}
                              />
                            </div>

                            <p className="mt-2 text-start">
                              <strong>
                                {data?.payload?.tech_lang_keys["35"]} :
                              </strong>
                            </p>
                            <div className="mt-2 text-start">
                              <BlockMath
                                math={`a = ${result?.tech_area},\\ b = ${result?.tech_box},\\ \\alpha = ${result?.tech_alpha}^\\circ`}
                              />
                            </div>

                            <p className="mt-2 text-start">
                              <strong>
                                {data?.payload?.tech_lang_keys["37"]} :
                              </strong>
                            </p>
                            <div className="mt-2 text-start">
                              <BlockMath
                                math={`${data?.payload?.tech_lang_keys["10"]}\\ ${data?.payload?.tech_lang_keys["32"]} = ${result?.tech_area} \\cdot ${result?.tech_box} \\cdot \\sin(${result?.tech_alpha}^\\circ)`}
                              />
                            </div>

                            <div className="mt-2 text-start">
                              <BlockMath
                                math={`${
                                  data?.payload?.tech_lang_keys["10"]
                                }\\ ${
                                  data?.payload?.tech_lang_keys["32"]
                                } = ${Number(result?.tech_answer).toFixed(2)}`}
                              />
                              <span className="text-black">
                                {" "}
                                (cm<sup>2</sup>)
                              </span>
                            </div>
                          </>
                        )}
                        {result?.tech_method == "17" && (
                          <>
                            <div className="text-center">
                              <p className="text-[20px]">
                                <strong>
                                  {data?.payload?.tech_lang_keys["10"]}{" "}
                                  {data?.payload?.tech_lang_keys["32"]}
                                </strong>
                              </p>
                              <p className="md:text-[32px] bg-[#2845F5] text-white px-3 py-2 rounded-lg inline-block my-2">
                                <strong className="text-white">
                                  {Number(result?.tech_answer).toFixed(2)}
                                  <span className="text-[20px]">
                                    {" "}
                                    (cm<sup>2</sup>)
                                  </span>
                                </strong>
                              </p>
                            </div>

                            <p className="mt-2 text-start">
                              <strong>
                                {data?.payload?.tech_lang_keys["36"]} :
                              </strong>
                            </p>
                            <div className="mt-2 text-start">
                              <BlockMath
                                math={`${data?.payload?.tech_lang_keys["10"]}\\ ${data?.payload?.tech_lang_keys["32"]} = e \\cdot f \\cdot \\sin(\\theta)`}
                              />
                            </div>

                            <p className="mt-2 text-start">
                              <strong>Input :</strong>
                            </p>
                            <div className="mt-2 text-start">
                              <BlockMath
                                math={`e = ${result?.tech_e},\\ f = ${result?.tech_f},\\ \\theta = ${result?.tech_theta_value}^\\circ`}
                              />
                            </div>

                            <p className="mt-2 text-start">
                              <strong>
                                {data?.payload?.tech_lang_keys["37"]} :
                              </strong>
                            </p>
                            <div className="mt-2 text-start">
                              <BlockMath
                                math={`${data?.payload?.tech_lang_keys["10"]}\\ ${data?.payload?.tech_lang_keys["32"]} = ${result?.tech_e} \\cdot ${result?.tech_f} \\cdot \\sin(${result?.tech_theta_value}^\\circ)`}
                              />
                            </div>

                            <div className="mt-2 text-start">
                              <BlockMath
                                math={`${
                                  data?.payload?.tech_lang_keys["10"]
                                }\\ ${
                                  data?.payload?.tech_lang_keys["32"]
                                } = ${Number(result?.tech_answer).toFixed(2)}`}
                              />
                              <span className="text-black">
                                {" "}
                                (cm<sup>2</sup>)
                              </span>
                            </div>
                          </>
                        )}
                        {result?.tech_method == "21" && (
                          <>
                            <div className="text-center">
                              <p className="text-[20px]">
                                <strong>
                                  {data?.payload?.tech_lang_keys["11"]}{" "}
                                  {data?.payload?.tech_lang_keys["32"]}
                                </strong>
                              </p>
                              <p className="md:text-[32px] bg-[#2845F5] text-white px-3 py-2 rounded-lg inline-block my-2">
                                <strong className="text-white">
                                  {Number(result?.tech_answer).toFixed(2)}
                                  <span className="text-[20px]">
                                    {" "}
                                    (cm<sup>2</sup>)
                                  </span>
                                </strong>
                              </p>
                            </div>

                            <p className="mt-2 text-start">
                              <strong>
                                {data?.payload?.tech_lang_keys["36"]} :
                              </strong>
                            </p>
                            <div className="mt-2 text-start">
                              <BlockMath
                                math={`${data?.payload?.tech_lang_keys["11"]}\\ ${data?.payload?.tech_lang_keys["32"]} = a \\cdot h`}
                              />
                            </div>

                            <p className="mt-2 text-start">
                              <strong>Input :</strong>
                            </p>
                            <div className="mt-2 text-start">
                              <BlockMath
                                math={`a = ${result?.tech_area},\\ h = ${result?.tech_height}`}
                              />
                            </div>

                            <p className="mt-2 text-start">
                              <strong>
                                {data?.payload?.tech_lang_keys["37"]} :
                              </strong>
                            </p>
                            <div className="mt-2 text-start">
                              <BlockMath
                                math={`${data?.payload?.tech_lang_keys["11"]}\\ ${data?.payload?.tech_lang_keys["32"]} = ${result?.tech_area} \\cdot ${result?.tech_height}`}
                              />
                            </div>

                            <div className="mt-2 text-start">
                              <BlockMath
                                math={`${
                                  data?.payload?.tech_lang_keys["11"]
                                }\\ ${
                                  data?.payload?.tech_lang_keys["32"]
                                } = ${Number(result?.tech_answer).toFixed(2)}`}
                              />
                              <span className="text-black">
                                {" "}
                                (cm<sup>2</sup>)
                              </span>
                            </div>
                          </>
                        )}
                        {result?.tech_method == "22" && (
                          <>
                            <div className="text-center">
                              <p className="text-[20px]">
                                <strong>
                                  {data?.payload?.tech_lang_keys["11"]}{" "}
                                  {data?.payload?.tech_lang_keys["32"]}
                                </strong>
                              </p>
                              <p className="md:text-[32px] bg-[#2845F5] text-white px-3 py-2 rounded-lg inline-block my-2">
                                <strong className="text-white">
                                  {Number(result?.tech_answer).toFixed(2)}
                                  <span className="text-[20px]">
                                    {" "}
                                    (cm<sup>2</sup>)
                                  </span>
                                </strong>
                              </p>
                            </div>

                            <p className="mt-2 text-start">
                              <strong>
                                {data?.payload?.tech_lang_keys["36"]} :
                              </strong>
                            </p>
                            <div className="mt-2 text-start">
                              <BlockMath
                                math={`${data?.payload?.tech_lang_keys["11"]}\\ ${data?.payload?.tech_lang_keys["32"]} = \\dfrac{e \\cdot f}{2}`}
                              />
                            </div>

                            <p className="mt-2 text-start">
                              <strong>Input :</strong>
                            </p>
                            <div className="mt-2 text-start">
                              <BlockMath
                                math={`e = ${result?.tech_e},\\ f = ${result?.tech_f}`}
                              />
                            </div>

                            <p className="mt-2 text-start">
                              <strong>
                                {data?.payload?.tech_lang_keys["37"]} :
                              </strong>
                            </p>
                            <div className="mt-2 text-start">
                              <BlockMath
                                math={`${data?.payload?.tech_lang_keys["11"]}\\ ${data?.payload?.tech_lang_keys["32"]} = \\dfrac{${result?.tech_e} \\cdot ${result?.tech_f}}{2}`}
                              />
                            </div>

                            <div className="mt-2 text-start">
                              <BlockMath
                                math={`${
                                  data?.payload?.tech_lang_keys["11"]
                                }\\ ${
                                  data?.payload?.tech_lang_keys["32"]
                                } = ${Number(result?.tech_answer).toFixed(2)}`}
                              />
                              <span className="text-black">
                                {" "}
                                (cm<sup>2</sup>)
                              </span>
                            </div>
                          </>
                        )}
                        {result?.tech_method == "25" && (
                          <>
                            <div className="text-center">
                              <p className="text-[20px]">
                                <strong>
                                  {data?.payload?.tech_lang_keys["12"]}{" "}
                                  {data?.payload?.tech_lang_keys["32"]}
                                </strong>
                              </p>
                              <p className="md:text-[32px] bg-[#2845F5] text-white px-3 py-2 rounded-lg inline-block my-2">
                                <strong className="text-white">
                                  {Number(result?.tech_answer).toFixed(2)}
                                  <span className="text-[20px]">
                                    {" "}
                                    (cm<sup>2</sup>)
                                  </span>
                                </strong>
                              </p>
                            </div>

                            <p className="mt-2 text-start">
                              <strong>
                                {data?.payload?.tech_lang_keys["36"]} :
                              </strong>
                            </p>
                            <div className="mt-2 text-start">
                              <BlockMath
                                math={`${data?.payload?.tech_lang_keys["12"]}\\ ${data?.payload?.tech_lang_keys["32"]} = \\dfrac{e \\cdot f}{2}`}
                              />
                            </div>

                            <p className="mt-2 text-start">
                              <strong>Input :</strong>
                            </p>
                            <div className="mt-2 text-start">
                              <BlockMath
                                math={`e = ${result?.tech_e},\\ f = ${result?.tech_f}`}
                              />
                            </div>

                            <p className="mt-2 text-start">
                              <strong>
                                {data?.payload?.tech_lang_keys["37"]} :
                              </strong>
                            </p>
                            <div className="mt-2 text-start">
                              <BlockMath
                                math={`${data?.payload?.tech_lang_keys["12"]}\\ ${data?.payload?.tech_lang_keys["32"]} = \\dfrac{${result?.tech_e} \\cdot ${result?.tech_f}}{2}`}
                              />
                            </div>

                            <div className="mt-2 text-start">
                              <BlockMath
                                math={`${
                                  data?.payload?.tech_lang_keys["12"]
                                }\\ ${
                                  data?.payload?.tech_lang_keys["32"]
                                } = ${Number(result?.tech_answer).toFixed(2)}`}
                              />
                              <span className="text-black">
                                {" "}
                                (cm<sup>2</sup>)
                              </span>
                            </div>
                          </>
                        )}
                        {result?.tech_method == "23" && (
                          <>
                            <div className="text-center">
                              <p className="text-[20px]">
                                <strong>
                                  {data?.payload?.tech_lang_keys["11"]}{" "}
                                  {data?.payload?.tech_lang_keys["32"]}
                                </strong>
                              </p>
                              <p className="md:text-[32px] bg-[#2845F5] text-white px-3 py-2 rounded-lg inline-block my-2">
                                <strong className="text-white">
                                  {Number(result?.tech_answer).toFixed(2)}
                                  <span className="text-[20px]">
                                    {" "}
                                    (cm<sup>2</sup>)
                                  </span>
                                </strong>
                              </p>
                            </div>

                            <p className="mt-2 text-start">
                              <strong>
                                {data?.payload?.tech_lang_keys["36"]} :
                              </strong>
                            </p>
                            <div className="mt-2 text-start">
                              <BlockMath
                                math={`${data?.payload?.tech_lang_keys["11"]}\\ ${data?.payload?.tech_lang_keys["32"]} = a^2 \\cdot \\sin(\\alpha)`}
                              />
                            </div>

                            <p className="mt-2 text-start">
                              <strong>Input :</strong>
                            </p>
                            <div className="mt-2 text-start">
                              <BlockMath
                                math={`a = ${result?.tech_area},\\ \\alpha = ${result?.tech_alpha_value}^\\circ`}
                              />
                            </div>

                            <p className="mt-2 text-start">
                              <strong>
                                {data?.payload?.tech_lang_keys["37"]} :
                              </strong>
                            </p>
                            <div className="mt-2 text-start">
                              <BlockMath
                                math={`${data?.payload?.tech_lang_keys["11"]}\\ ${data?.payload?.tech_lang_keys["32"]} = ${result?.tech_area}^2 \\cdot \\sin(${result?.tech_alpha_value}^\\circ)`}
                              />
                            </div>

                            <div className="mt-2 text-start">
                              <BlockMath
                                math={`${
                                  data?.payload?.tech_lang_keys["11"]
                                }\\ ${
                                  data?.payload?.tech_lang_keys["32"]
                                } = ${Number(result?.tech_answer).toFixed(2)}`}
                              />
                              <span className="text-black">
                                {" "}
                                (cm<sup>2</sup>)
                              </span>
                            </div>
                          </>
                        )}
                        {result?.tech_method == "24" && (
                          <>
                            <div className="text-center">
                              <p className="text-[20px]">
                                <strong>
                                  {data?.payload?.tech_lang_keys["12"]}{" "}
                                  {data?.payload?.tech_lang_keys["32"]}
                                </strong>
                              </p>
                              <p className="md:text-[32px] bg-[#2845F5] text-white px-3 py-2 rounded-lg inline-block my-2">
                                <strong className="text-white">
                                  {Number(result?.tech_answer).toFixed(2)}
                                  <span className="text-[20px]">
                                    {" "}
                                    (cm<sup>2</sup>)
                                  </span>
                                </strong>
                              </p>
                            </div>

                            <p className="mt-2 text-start">
                              <strong>
                                {data?.payload?.tech_lang_keys["36"]} :
                              </strong>
                            </p>
                            <div className="mt-2 text-start">
                              <BlockMath
                                math={`${data?.payload?.tech_lang_keys["12"]}\\ ${data?.payload?.tech_lang_keys["32"]} = a \\cdot b \\cdot \\sin(\\alpha)`}
                              />
                            </div>

                            <p className="mt-2 text-start">
                              <strong>Input :</strong>
                            </p>
                            <div className="mt-2 text-start">
                              <BlockMath
                                math={`a = ${result?.tech_area},\\ b = ${result?.tech_box},\\ \\alpha = ${result?.tech_alpha}^\\circ`}
                              />
                            </div>

                            <p className="mt-2 text-start">
                              <strong>
                                {data?.payload?.tech_lang_keys["37"]} :
                              </strong>
                            </p>
                            <div className="mt-2 text-start">
                              <BlockMath
                                math={`${data?.payload?.tech_lang_keys["12"]}\\ ${data?.payload?.tech_lang_keys["32"]} = ${result?.tech_area} \\cdot ${result?.tech_box} \\cdot \\sin(${result?.tech_alpha}^\\circ)`}
                              />
                            </div>

                            <div className="mt-2 text-start">
                              <BlockMath
                                math={`${
                                  data?.payload?.tech_lang_keys["12"]
                                }\\ ${
                                  data?.payload?.tech_lang_keys["32"]
                                } = ${Number(result?.tech_answer).toFixed(2)}`}
                              />
                              <span className="text-black">
                                {" "}
                                (cm<sup>2</sup>)
                              </span>
                            </div>
                          </>
                        )}
                        {result?.tech_method == "32" && (
                          <>
                            <div className="text-center">
                              <p className="text-[20px]">
                                <strong>
                                  {data?.payload?.tech_lang_keys["4"]}{" "}
                                  {data?.payload?.tech_lang_keys["32"]}
                                </strong>
                              </p>
                              <p className="md:text-[32px] bg-[#2845F5] text-white px-3 py-2 rounded-lg inline-block my-2">
                                <strong className="text-white">
                                  {Number(result?.tech_answer).toFixed(2)}
                                  <span className="text-[20px]">
                                    {" "}
                                    (cm<sup>2</sup>)
                                  </span>
                                </strong>
                              </p>
                            </div>

                            <p className="mt-2 text-start">
                              <strong>
                                {data?.payload?.tech_lang_keys["36"]} :
                              </strong>
                            </p>

                            <div className="mt-2 text-start">
                              <BlockMath
                                math={`${data?.payload?.tech_lang_keys["4"]}\\ ${data?.payload?.tech_lang_keys["32"]} = \\frac{1}{2} \\sqrt{(a+b+c)(-a+b+c)(a-b+c)(a+b-c)}`}
                              />
                            </div>

                            <p className="mt-2 text-start">
                              <strong>Input :</strong>
                            </p>

                            <div className="mt-2 text-start">
                              <BlockMath
                                math={`a = ${result?.tech_area},\\ b = ${result?.tech_box},\\ c = ${result?.tech_c}`}
                              />
                            </div>

                            <p className="mt-2 text-start">
                              <strong>
                                {data?.payload?.tech_lang_keys["37"]} :
                              </strong>
                            </p>

                            <div className="mt-2 text-start">
                              <BlockMath
                                math={`${data?.payload?.tech_lang_keys["4"]}\\ ${data?.payload?.tech_lang_keys["32"]} = \\frac{1}{2} \\sqrt{(${result?.tech_area} + ${result?.tech_box} + ${result?.tech_c}) \\cdot (-${result?.tech_area} + ${result?.tech_box} + ${result?.tech_c}) \\cdot (${result?.tech_area} - ${result?.tech_box} + ${result?.tech_c}) \\cdot (${result?.tech_area} + ${result?.tech_box} - ${result?.tech_c})}`}
                              />
                            </div>

                            <div className="mt-2 text-start">
                              <BlockMath
                                math={`${
                                  data?.payload?.tech_lang_keys["4"]
                                }\\ ${
                                  data?.payload?.tech_lang_keys["32"]
                                } = ${Number(result?.tech_answer).toFixed(2)}`}
                              />
                              <span className="text-black">
                                {" "}
                                (cm<sup>2</sup>)
                              </span>
                            </div>
                          </>
                        )}
                        {result?.tech_method == "33" && (
                          <>
                            <div className="text-center">
                              <p className="text-[20px]">
                                <strong>
                                  {data?.payload?.tech_lang_keys["4"]}{" "}
                                  {data?.payload?.tech_lang_keys["32"]}
                                </strong>
                              </p>
                              <p className="md:text-[32px] bg-[#2845F5] text-white px-3 py-2 rounded-lg inline-block my-2">
                                <strong className="text-white">
                                  {Number(result?.tech_answer).toFixed(2)}
                                  <span className="text-[20px]">
                                    {" "}
                                    (cm<sup>2</sup>)
                                  </span>
                                </strong>
                              </p>
                            </div>

                            <p className="mt-2 text-start">
                              <strong>
                                {data?.payload?.tech_lang_keys["36"]} :
                              </strong>
                            </p>
                            <div className="mt-2 text-start">
                              <BlockMath
                                math={`${data?.payload?.tech_lang_keys["4"]}\\ ${data?.payload?.tech_lang_keys["32"]} = \\frac{1}{2} a b \\sin(\\gamma)`}
                              />
                            </div>

                            <p className="mt-2 text-start">
                              <strong>Input :</strong>
                            </p>
                            <div className="mt-2 text-start">
                              <BlockMath
                                math={`a = ${result?.tech_area},\\ b = ${result?.tech_box},\\ \\gamma = ${result?.tech_gamma}^\\circ`}
                              />
                            </div>

                            <p className="mt-2 text-start">
                              <strong>
                                {data?.payload?.tech_lang_keys["37"]} :
                              </strong>
                            </p>
                            <div className="mt-2 text-start">
                              <BlockMath
                                math={`${data?.payload?.tech_lang_keys["4"]}\\ ${data?.payload?.tech_lang_keys["32"]} = \\frac{1}{2} \\times ${result?.tech_area} \\times ${result?.tech_box} \\times \\sin(${result?.tech_gamma}^\\circ)`}
                              />
                            </div>

                            <div className="mt-2 text-start">
                              <BlockMath
                                math={`${
                                  data?.payload?.tech_lang_keys["4"]
                                }\\ ${
                                  data?.payload?.tech_lang_keys["32"]
                                } = ${Number(result?.tech_answer).toFixed(2)}`}
                              />
                              <span className="text-black">
                                {" "}
                                (cm<sup>2</sup>)
                              </span>
                            </div>
                          </>
                        )}
                        {result?.tech_method == "34" && (
                          <>
                            <div className="text-center">
                              <p className="text-[20px]">
                                <strong>
                                  {data?.payload?.tech_lang_keys["4"]}{" "}
                                  {data?.payload?.tech_lang_keys["32"]}
                                </strong>
                              </p>
                              <p className="md:text-[32px] bg-[#2845F5] text-white px-3 py-2 rounded-lg inline-block my-2">
                                <strong className="text-white">
                                  {Number(result?.tech_answer).toFixed(2)}
                                  <span className="text-[20px]">
                                    {" "}
                                    (cm<sup>2</sup>)
                                  </span>
                                </strong>
                              </p>
                            </div>

                            <p className="mt-2 text-start">
                              <strong>
                                {data?.payload?.tech_lang_keys["36"]} :
                              </strong>
                            </p>

                            <div className="mt-2 text-start">
                              <BlockMath
                                math={`${data?.payload?.tech_lang_keys["4"]}\\ ${data?.payload?.tech_lang_keys["32"]} = \\frac{a^2 \\sin(\\beta) \\sin(\\gamma)}{2 \\sin(\\beta + \\gamma)}`}
                              />
                            </div>

                            <p className="mt-2 text-start">
                              <strong>Input :</strong>
                            </p>

                            <div className="mt-2 text-start">
                              <BlockMath
                                math={`a = ${result?.tech_area},\\ \\beta = ${result?.tech_beta}^\\circ,\\ \\gamma = ${result?.tech_gamma}^\\circ`}
                              />
                            </div>

                            <p className="mt-2 text-start">
                              <strong>
                                {data?.payload?.tech_lang_keys["37"]} :
                              </strong>
                            </p>

                            <div className="mt-2 text-start">
                              <BlockMath
                                math={`${data?.payload?.tech_lang_keys["4"]}\\ ${data?.payload?.tech_lang_keys["32"]} = \\frac{${result?.tech_area}^2 \\sin(${result?.tech_beta}^\\circ) \\sin(${result?.tech_gamma}^\\circ)}{2 \\sin(${result?.tech_beta}^\\circ + ${result?.tech_gamma}^\\circ)}`}
                              />
                            </div>

                            <div className="mt-2 text-start">
                              <BlockMath
                                math={`${
                                  data?.payload?.tech_lang_keys["4"]
                                }\\ ${
                                  data?.payload?.tech_lang_keys["32"]
                                } = ${Number(result?.tech_answer).toFixed(2)}`}
                              />
                              <span className="text-black">
                                {" "}
                                (cm<sup>2</sup>)
                              </span>
                            </div>
                          </>
                        )}
                        {result?.tech_method == "4" && (
                          <>
                            <div className="text-center">
                              <p className="text-[20px]">
                                <strong>
                                  {data?.payload?.tech_lang_keys["5"]}{" "}
                                  {data?.payload?.tech_lang_keys["32"]}
                                </strong>
                              </p>
                              <p className="md:text-[32px] bg-[#2845F5] text-white px-3 py-2 rounded-lg inline-block my-2">
                                <strong className="text-white">
                                  {Number(result?.tech_answer).toFixed(2)}
                                  <span className="text-[20px]">
                                    {" "}
                                    (cm<sup>2</sup>)
                                  </span>
                                </strong>
                              </p>
                            </div>

                            <p className="mt-2 text-start">
                              <strong>
                                {data?.payload?.tech_lang_keys["36"]} :
                              </strong>
                            </p>
                            <div className="mt-2 text-start">
                              <BlockMath
                                math={`${data?.payload?.tech_lang_keys["5"]}\\ ${data?.payload?.tech_lang_keys["32"]} = \\pi r^2`}
                              />
                            </div>

                            <p className="mt-2 text-start">
                              <strong>Input :</strong>
                            </p>
                            <div className="mt-2 text-start">
                              <BlockMath math={`r = ${result?.tech_radius}`} />
                            </div>

                            <p className="mt-2 text-start">
                              <strong>
                                {data?.payload?.tech_lang_keys["37"]} :
                              </strong>
                            </p>
                            <div className="mt-2 text-start">
                              <BlockMath
                                math={`${data?.payload?.tech_lang_keys["5"]}\\ ${data?.payload?.tech_lang_keys["32"]} = 3.14159265358 \\times ${result?.tech_radius}^2`}
                              />
                            </div>

                            <div className="mt-2 text-start">
                              <BlockMath
                                math={`${
                                  data?.payload?.tech_lang_keys["5"]
                                }\\ ${
                                  data?.payload?.tech_lang_keys["32"]
                                } = ${Number(result?.tech_answer).toFixed(2)}`}
                              />
                              <span className="text-black">
                                {" "}
                                (cm<sup>2</sup>)
                              </span>
                            </div>
                          </>
                        )}
                        {result?.tech_method == "5" && (
                          <>
                            <div className="text-center">
                              <p className="text-[20px]">
                                <strong>
                                  {data?.payload?.tech_lang_keys["6"]}{" "}
                                  {data?.payload?.tech_lang_keys["32"]}
                                </strong>
                              </p>
                              <p className="md:text-[32px] bg-[#2845F5] text-white px-3 py-2 rounded-lg inline-block my-2">
                                <strong className="text-white">
                                  {Number(result?.tech_answer).toFixed(2)}
                                  <span className="text-[20px]">
                                    {" "}
                                    (cm<sup>2</sup>)
                                  </span>
                                </strong>
                              </p>
                            </div>

                            <p className="mt-2 text-start">
                              <strong>
                                {data?.payload?.tech_lang_keys["36"]} :
                              </strong>
                            </p>

                            <div className="mt-2 text-start">
                              <BlockMath
                                math={`${data?.payload?.tech_lang_keys["6"]}\\ ${data?.payload?.tech_lang_keys["32"]} = \\frac{\\pi r^2}{2}`}
                              />
                            </div>

                            <p className="mt-2 text-start">
                              <strong>Input :</strong>
                            </p>

                            <div className="mt-2 text-start">
                              <BlockMath math={`r = ${result?.tech_radius}`} />
                            </div>

                            <p className="mt-2 text-start">
                              <strong>
                                {data?.payload?.tech_lang_keys["37"]} :
                              </strong>
                            </p>

                            <div className="mt-2 text-start">
                              <BlockMath
                                math={`${data?.payload?.tech_lang_keys["6"]}\\ ${data?.payload?.tech_lang_keys["32"]} = \\frac{3.14159265358 \\times ${result?.tech_radius}^2}{2}`}
                              />
                            </div>

                            <div className="mt-2 text-start">
                              <BlockMath
                                math={`${
                                  data?.payload?.tech_lang_keys["6"]
                                }\\ ${
                                  data?.payload?.tech_lang_keys["32"]
                                } = ${Number(result?.tech_answer).toFixed(2)}`}
                              />
                              <span className="text-black">
                                {" "}
                                (cm<sup>2</sup>)
                              </span>
                            </div>
                          </>
                        )}
                        {result?.tech_method == "6" && (
                          <>
                            <div className="text-center">
                              <p className="text-[20px]">
                                <strong>
                                  {data?.payload?.tech_lang_keys["6"]}{" "}
                                  {data?.payload?.tech_lang_keys["7"]}{" "}
                                  {data?.payload?.tech_lang_keys["32"]}
                                </strong>
                              </p>
                              <p className="md:text-[32px] bg-[#2845F5] text-white px-3 py-2 rounded-lg inline-block my-2">
                                <strong className="text-white">
                                  {Number(result?.tech_answer).toFixed(2)}
                                  <span className="text-[20px]">
                                    {" "}
                                    (cm<sup>2</sup>)
                                  </span>
                                </strong>
                              </p>
                            </div>

                            <p className="mt-2 text-start">
                              <strong>
                                {data?.payload?.tech_lang_keys["36"]} :
                              </strong>
                            </p>
                            <div className="mt-2 text-start">
                              <BlockMath
                                math={`${data?.payload?.tech_lang_keys["6"]}\\ ${data?.payload?.tech_lang_keys["7"]}\\ ${data?.payload?.tech_lang_keys["32"]} = \\frac{r^2 \\times \\alpha}{2}`}
                              />
                            </div>

                            <p className="mt-2 text-start">
                              <strong>Input :</strong>
                            </p>
                            <div className="mt-2 text-start">
                              <BlockMath
                                math={`r = ${result?.tech_radius}, \\quad \\alpha = ${result?.tech_angle_value}`}
                              />
                            </div>

                            <p className="mt-2 text-start">
                              <strong>
                                {data?.payload?.tech_lang_keys["37"]} :
                              </strong>
                            </p>
                            <div className="mt-2 text-start">
                              <BlockMath
                                math={`${data?.payload?.tech_lang_keys["6"]}\\ ${data?.payload?.tech_lang_keys["7"]}\\ ${data?.payload?.tech_lang_keys["32"]} = \\frac{${result?.tech_radius}^2 \\times ${result?.tech_angle_value}}{2}`}
                              />
                            </div>

                            <div className="mt-2 text-start">
                              <BlockMath
                                math={`${
                                  data?.payload?.tech_lang_keys["6"]
                                }\\ ${data?.payload?.tech_lang_keys["7"]}\\ ${
                                  data?.payload?.tech_lang_keys["32"]
                                } = ${Number(result?.tech_answer).toFixed(2)}`}
                              />
                              <span className="text-black">
                                {" "}
                                (cm<sup>2</sup>)
                              </span>
                            </div>
                          </>
                        )}
                        {result?.tech_method == "7" && (
                          <>
                            <div className="text-center">
                              <p className="text-[20px]">
                                <strong>
                                  {data?.payload?.tech_lang_keys["8"]}{" "}
                                  {data?.payload?.tech_lang_keys["32"]}
                                </strong>
                              </p>
                              <p className="md:text-[32px] bg-[#2845F5] text-white px-3 py-2 rounded-lg inline-block my-2">
                                <strong className="text-white">
                                  {Number(result?.tech_answer).toFixed(2)}
                                  <span className="text-[20px]">
                                    {" "}
                                    (cm<sup>2</sup>)
                                  </span>
                                </strong>
                              </p>
                            </div>

                            <p className="mt-2 text-start">
                              <strong>
                                {data?.payload?.tech_lang_keys["36"]} :
                              </strong>
                            </p>
                            <div className="mt-2 text-start">
                              <BlockMath
                                math={`${data?.payload?.tech_lang_keys["8"]}\\ ${data?.payload?.tech_lang_keys["32"]} = \\pi a b`}
                              />
                            </div>

                            <p className="mt-2 text-start">
                              <strong>Input :</strong>
                            </p>
                            <div className="mt-2 text-start">
                              <BlockMath
                                math={`a = ${result?.tech_area}, \\quad b = ${result?.tech_box}`}
                              />
                            </div>

                            <p className="mt-2 text-start">
                              <strong>
                                {data?.payload?.tech_lang_keys["37"]} :
                              </strong>
                            </p>
                            <div className="mt-2 text-start">
                              <BlockMath
                                math={`${data?.payload?.tech_lang_keys["8"]}\\ ${data?.payload?.tech_lang_keys["32"]} = 3.14159265358 \\times ${result?.tech_area} \\times ${result?.tech_box}`}
                              />
                            </div>

                            <div className="mt-2 text-start">
                              <BlockMath
                                math={`${
                                  data?.payload?.tech_lang_keys["8"]
                                }\\ ${
                                  data?.payload?.tech_lang_keys["32"]
                                } = ${Number(result?.tech_answer).toFixed(2)}`}
                              />
                              <span className="text-black">
                                {" "}
                                (cm<sup>2</sup>)
                              </span>
                            </div>
                          </>
                        )}
                        {result?.tech_method == "8" && (
                          <>
                            <div className="text-center">
                              <p className="text-[20px]">
                                <strong>
                                  {data?.payload?.tech_lang_keys["9"]}{" "}
                                  {data?.payload?.tech_lang_keys["32"]}
                                </strong>
                              </p>
                              <p className="md:text-[32px] bg-[#2845F5] text-white px-3 py-2 rounded-lg inline-block my-2">
                                <strong className="text-white">
                                  {Number(result?.tech_answer).toFixed(2)}
                                  <span className="text-[20px]">
                                    {" "}
                                    (cm<sup>2</sup>)
                                  </span>
                                </strong>
                              </p>
                            </div>

                            <p className="mt-2 text-start">
                              <strong>
                                {data?.payload?.tech_lang_keys["36"]} :
                              </strong>
                            </p>
                            <div className="mt-2 text-start">
                              <BlockMath
                                math={`${data?.payload?.tech_lang_keys["9"]}\\ ${data?.payload?.tech_lang_keys["32"]} = \\frac{(a + b) \\times h}{2}`}
                              />
                            </div>

                            <p className="mt-2 text-start">
                              <strong>Input :</strong>
                            </p>
                            <div className="mt-2 text-start">
                              <BlockMath
                                math={`a = ${result?.tech_area},\\quad b = ${result?.tech_box},\\quad h = ${result?.tech_height}`}
                              />
                            </div>

                            <p className="mt-2 text-start">
                              <strong>
                                {data?.payload?.tech_lang_keys["37"]} :
                              </strong>
                            </p>
                            <div className="mt-2 text-start">
                              <BlockMath
                                math={`${data?.payload?.tech_lang_keys["9"]}\\ ${data?.payload?.tech_lang_keys["32"]} = \\frac{(${result?.tech_area} + ${result?.tech_box}) \\times ${result?.tech_height}}{2}`}
                              />
                            </div>

                            <div className="mt-2 text-start">
                              <BlockMath
                                math={`${
                                  data?.payload?.tech_lang_keys["9"]
                                }\\ ${
                                  data?.payload?.tech_lang_keys["32"]
                                } = ${Number(result?.tech_answer).toFixed(2)}`}
                              />
                              <span className="text-black">
                                {" "}
                                (cm<sup>2</sup>)
                              </span>
                            </div>
                          </>
                        )}
                        {result?.tech_method == "9" && (
                          <>
                            <div className="text-center">
                              <p className="text-[20px]">
                                <strong>
                                  {data?.payload?.tech_lang_keys["13"]}{" "}
                                  {data?.payload?.tech_lang_keys["32"]}
                                </strong>
                              </p>
                              <p className="md:text-[32px] bg-[#2845F5] text-white px-3 py-2 rounded-lg inline-block my-2">
                                <strong className="text-white">
                                  {Number(result?.tech_answer).toFixed(2)}
                                  <span className="text-[20px]">
                                    {" "}
                                    (cm<sup>2</sup>)
                                  </span>
                                </strong>
                              </p>
                            </div>

                            <p className="mt-2 text-start">
                              <strong>
                                {data?.payload?.tech_lang_keys["36"]} :
                              </strong>
                            </p>
                            <div className="mt-2 text-start">
                              <BlockMath
                                math={`${data?.payload?.tech_lang_keys["13"]}\\ ${data?.payload?.tech_lang_keys["32"]} = \\frac{a^2 \\sqrt{25 + 10 \\sqrt{5}}}{4}`}
                              />
                            </div>

                            <p className="mt-2 text-start">
                              <strong>Input :</strong>
                            </p>
                            <div className="mt-2 text-start">
                              <BlockMath math={`a = ${result?.tech_area}`} />
                            </div>

                            <p className="mt-2 text-start">
                              <strong>
                                {data?.payload?.tech_lang_keys["37"]} :
                              </strong>
                            </p>
                            <div className="mt-2 text-start">
                              <BlockMath
                                math={`${data?.payload?.tech_lang_keys["13"]}\\ ${data?.payload?.tech_lang_keys["32"]} = \\frac{${result?.tech_area}^2 \\sqrt{25 + 10 \\sqrt{5}}}{4}`}
                              />
                            </div>

                            <div className="mt-2 text-start">
                              <BlockMath
                                math={`${
                                  data?.payload?.tech_lang_keys["13"]
                                }\\ ${
                                  data?.payload?.tech_lang_keys["32"]
                                } = ${Number(result?.tech_answer).toFixed(2)}`}
                              />
                              <span className="text-black">
                                {" "}
                                (cm<sup>2</sup>)
                              </span>
                            </div>
                          </>
                        )}
                        {result?.tech_method == "10" && (
                          <>
                            <div className="text-center">
                              <p className="text-[20px]">
                                <strong>
                                  {data?.payload?.tech_lang_keys["14"]}{" "}
                                  {data?.payload?.tech_lang_keys["32"]}
                                </strong>
                              </p>
                              <p className="md:text-[32px] bg-[#2845F5] text-white px-3 py-2 rounded-lg inline-block my-2">
                                <strong className="text-white">
                                  {Number(result?.tech_answer).toFixed(2)}
                                  <span className="text-[20px]">
                                    {" "}
                                    (cm<sup>2</sup>)
                                  </span>
                                </strong>
                              </p>
                            </div>

                            <p className="mt-2 text-start">
                              <strong>
                                {data?.payload?.tech_lang_keys["36"]} :
                              </strong>
                            </p>
                            <div className="mt-2 text-start">
                              <BlockMath
                                math={`${data?.payload?.tech_lang_keys["14"]}\\ ${data?.payload?.tech_lang_keys["32"]} = \\frac{3}{2} \\sqrt{3} a^2`}
                              />
                            </div>

                            <p className="mt-2 text-start">
                              <strong>Input :</strong>
                            </p>
                            <div className="mt-2 text-start">
                              <BlockMath math={`a = ${result?.tech_area}`} />
                            </div>

                            <p className="mt-2 text-start">
                              <strong>
                                {data?.payload?.tech_lang_keys["37"]} :
                              </strong>
                            </p>
                            <div className="mt-2 text-start">
                              <BlockMath
                                math={`${data?.payload?.tech_lang_keys["14"]}\\ ${data?.payload?.tech_lang_keys["32"]} = \\frac{3}{2} \\sqrt{3} ${result?.tech_area}^2`}
                              />
                            </div>

                            <div className="mt-2 text-start">
                              <BlockMath
                                math={`${
                                  data?.payload?.tech_lang_keys["14"]
                                }\\ ${
                                  data?.payload?.tech_lang_keys["32"]
                                } = ${Number(result?.tech_answer).toFixed(2)}`}
                              />
                              <span className="text-black">
                                {" "}
                                (cm<sup>2</sup>)
                              </span>
                            </div>
                          </>
                        )}
                        {result?.tech_method == "11" && (
                          <>
                            <div className="text-center">
                              <p className="text-[20px]">
                                <strong>
                                  {data?.payload?.tech_lang_keys["15"]}{" "}
                                  {data?.payload?.tech_lang_keys["32"]}
                                </strong>
                              </p>
                              <p className="md:text-[32px] bg-[#2845F5] text-white px-3 py-2 rounded-lg inline-block my-2">
                                <strong className="text-white">
                                  {Number(result?.tech_answer).toFixed(2)}
                                  <span className="text-[20px]">
                                    {" "}
                                    (cm<sup>2</sup>)
                                  </span>
                                </strong>
                              </p>

                              <p className="mt-2 text-start">
                                <strong>
                                  {data?.payload?.tech_lang_keys["36"]} :
                                </strong>
                              </p>
                              <div className="mt-2 text-start">
                                <BlockMath
                                  math={`${data?.payload?.tech_lang_keys["15"]}\\ ${data?.payload?.tech_lang_keys["32"]} = 2 \\times (1 + \\sqrt{2}) a^2`}
                                />
                              </div>

                              <p className="mt-2 text-start">
                                <strong>Input :</strong>
                              </p>
                              <div className="mt-2 text-start">
                                <BlockMath math={`a = ${result?.tech_area}`} />
                              </div>

                              <p className="mt-2 text-start">
                                <strong>
                                  {data?.payload?.tech_lang_keys["37"]} :
                                </strong>
                              </p>
                              <div className="mt-2 text-start">
                                <BlockMath
                                  math={`${data?.payload?.tech_lang_keys["15"]}\\ ${data?.payload?.tech_lang_keys["32"]} = 2 \\times (1 + \\sqrt{2}) ${result?.tech_area}^2`}
                                />
                              </div>

                              <div className="mt-2 text-start">
                                <BlockMath
                                  math={`${
                                    data?.payload?.tech_lang_keys["15"]
                                  }\\ ${
                                    data?.payload?.tech_lang_keys["32"]
                                  } = ${Number(result?.tech_answer).toFixed(
                                    2
                                  )}`}
                                />
                                <span className="text-black">
                                  {" "}
                                  (cm<sup>2</sup>)
                                </span>
                              </div>
                            </div>
                          </>
                        )}
                        {result?.tech_method == "12" && (
                          <>
                            <div className="text-center">
                              <p className="text-[20px]">
                                <strong>
                                  {data?.payload?.tech_lang_keys["16"]}{" "}
                                  {data?.payload?.tech_lang_keys["32"]}
                                </strong>
                              </p>
                              <p className="md:text-[32px] bg-[#2845F5] text-white px-3 py-2 rounded-lg inline-block my-2">
                                <strong className="text-white">
                                  {Number(result?.tech_answer).toFixed(2)}
                                  <span className="text-[20px]">
                                    {" "}
                                    (cm<sup>2</sup>)
                                  </span>
                                </strong>
                              </p>

                              <p className="mt-2 text-start">
                                <strong>
                                  {data?.payload?.tech_lang_keys["36"]} :
                                </strong>
                              </p>
                              <div className="mt-2 text-start">
                                <BlockMath
                                  math={`${data?.payload?.tech_lang_keys["16"]}\\ ${data?.payload?.tech_lang_keys["32"]} = \\pi (R^2 - r^2)`}
                                />
                              </div>

                              <p className="mt-2 text-start">
                                <strong>Input :</strong>
                              </p>
                              <div className="mt-2 text-start">
                                <BlockMath
                                  math={`r = ${result?.tech_radius}, \\quad R = ${result?.tech_bara_radius}`}
                                />
                              </div>

                              <p className="mt-2 text-start">
                                <strong>
                                  {data?.payload?.tech_lang_keys["37"]} :
                                </strong>
                              </p>
                              <div className="mt-2 text-start">
                                <BlockMath
                                  math={`${data?.payload?.tech_lang_keys["16"]}\\ ${data?.payload?.tech_lang_keys["32"]} = 3.14159265358 \\times ( ${result?.tech_bara_radius}^2 - ${result?.tech_radius}^2 )`}
                                />
                              </div>

                              <div className="mt-2 text-start">
                                <BlockMath
                                  math={`${
                                    data?.payload?.tech_lang_keys["16"]
                                  }\\ ${
                                    data?.payload?.tech_lang_keys["32"]
                                  } = ${Number(result?.tech_answer).toFixed(
                                    2
                                  )}`}
                                />
                                <span className="text-black">
                                  {" "}
                                  (cm<sup>2</sup>)
                                </span>
                              </div>
                            </div>
                          </>
                        )}
                        {result?.tech_method == "13" && (
                          <>
                            <div className="text-center">
                              <p className="text-[20px]">
                                <strong>
                                  {data?.payload?.tech_lang_keys["17"]}{" "}
                                  {data?.payload?.tech_lang_keys["32"]}
                                </strong>
                              </p>
                              <p className="md:text-[32px] bg-[#2845F5] text-white px-3 py-2 rounded-lg inline-block my-2">
                                <strong className="text-white">
                                  {Number(result?.tech_answer).toFixed(2)}
                                  <span className="text-[20px]">
                                    {" "}
                                    (cm<sup>2</sup>)
                                  </span>
                                </strong>
                              </p>

                              <p className="mt-2 text-start">
                                <strong>
                                  {data?.payload?.tech_lang_keys["36"]} :
                                </strong>
                              </p>
                              <div className="mt-2 text-start">
                                <BlockMath
                                  math={`${data?.payload?.tech_lang_keys["17"]}\\ ${data?.payload?.tech_lang_keys["32"]} = e \\times f \\times \\sin(\\alpha)`}
                                />
                              </div>

                              <p className="mt-2 text-start">
                                <strong>Input :</strong>
                              </p>
                              <p className="mt-2 text-start">
                                e = {result?.tech_e}, f = {result?.tech_f}, α ={" "}
                                {result?.tech_angle_value}
                              </p>

                              <p className="mt-2 text-start">
                                <strong>
                                  {data?.payload?.tech_lang_keys["37"]} :
                                </strong>
                              </p>
                              <div className="mt-2 text-start">
                                <BlockMath
                                  math={`${data?.payload?.tech_lang_keys["17"]}\\ ${data?.payload?.tech_lang_keys["32"]} = ${result?.tech_e} \\times ${result?.tech_f} \\times \\sin(${result?.tech_angle_value})`}
                                />
                              </div>

                              <div className="mt-2 text-start">
                                <BlockMath
                                  math={`${
                                    data?.payload?.tech_lang_keys["17"]
                                  }\\ ${
                                    data?.payload?.tech_lang_keys["32"]
                                  } = ${Number(result?.tech_answer).toFixed(
                                    2
                                  )}`}
                                />
                                <span className="black-text">
                                  {" "}
                                  (cm<sup>2</sup>)
                                </span>
                              </div>
                            </div>
                          </>
                        )}
                        {result?.tech_method == "14" && (
                          <>
                            <div className="text-center">
                              <p className="text-[20px]">
                                <strong>
                                  {data?.payload?.tech_lang_keys["18"]}{" "}
                                  {data?.payload?.tech_lang_keys["32"]}
                                </strong>
                              </p>
                              <p className="md:text-[32px] bg-[#2845F5] text-white px-3 py-2 rounded-lg inline-block my-2">
                                <strong className="text-white">
                                  {Number(result?.tech_answer).toFixed(2)}
                                  <span className="text-[20px]">
                                    {" "}
                                    (cm<sup>2</sup>)
                                  </span>
                                </strong>
                              </p>

                              <p className="mt-2 text-start">
                                <strong>
                                  {data?.payload?.tech_lang_keys["36"]} :
                                </strong>
                              </p>
                              <div className="mt-2 text-start">
                                <BlockMath
                                  math={`${data?.payload?.tech_lang_keys["18"]}\\ ${data?.payload?.tech_lang_keys["32"]} = a^2 \\times \\frac{\\cot\\left(\\frac{\\pi}{n}\\right)}{4}`}
                                />
                              </div>

                              <p className="mt-2 text-start">
                                <strong>Input :</strong>
                              </p>
                              <p className="mt-2 text-start">
                                a = {result?.tech_area}, Number of sides (n) ={" "}
                                {result?.tech_number_of_sides}
                              </p>

                              <p className="mt-2 text-start">
                                <strong>
                                  {data?.payload?.tech_lang_keys["37"]} :
                                </strong>
                              </p>
                              <div className="mt-2 text-start">
                                <BlockMath
                                  math={`${data?.payload?.tech_lang_keys["18"]}\\ ${data?.payload?.tech_lang_keys["32"]} = ${result?.tech_area}^2 \\times \\frac{\\cot\\left(\\frac{\\pi}{${result?.tech_number_of_sides}}\\right)}{4}`}
                                />
                              </div>

                              <div className="mt-2 text-start">
                                <BlockMath
                                  math={`${
                                    data?.payload?.tech_lang_keys["18"]
                                  }\\ ${
                                    data?.payload?.tech_lang_keys["32"]
                                  } = ${Number(result?.tech_answer).toFixed(
                                    2
                                  )}`}
                                />
                                <span className="black-text">
                                  {" "}
                                  (cm<sup>2</sup>)
                                </span>
                              </div>
                            </div>
                          </>
                        )}
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

export default AreaCalculator;

"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useVolumeOfTriangularPyramidMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const VolumeOfTriangularPyramidCalculator = () => {
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
    tech_selection: "1",
    tech_triangle_type: "1",
    tech_base_height: "12",
    tech_base_height_unit: "m",
    tech_pyramid_base_area: "12",
    tech_pyramid_base_area_unit: "m",
    tech_base: "12",
    tech_base_unit: "m",
    tech_sidea: "12",
    tech_sidea_length_unit: "m",
    tech_sideb: "12",
    tech_sideb_length_unit: "m",
    tech_sidec: "12",
    tech_sidec_length_unit: "m",
    tech_angle_beta: "12",
    tech_angle_beta_unit: "rad",
    tech_angle_gamma: "1",
    tech_angle_gamma_unit: "rad",
    tech_pyramid_height: "1",
    tech_pyramid_height_unit: "m",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useVolumeOfTriangularPyramidMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_selection) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_selection: formData.tech_selection,
        tech_triangle_type: formData.tech_triangle_type,
        tech_base_height: formData.tech_base_height,
        tech_base_height_unit: formData.tech_base_height_unit,
        tech_pyramid_base_area: formData.tech_pyramid_base_area,
        tech_pyramid_base_area_unit: formData.tech_pyramid_base_area_unit,
        tech_base: formData.tech_base,
        tech_base_unit: formData.tech_base_unit,
        tech_sidea: formData.tech_sidea,
        tech_sidea_length_unit: formData.tech_sidea_length_unit,
        tech_sideb: formData.tech_sideb,
        tech_sideb_length_unit: formData.tech_sideb_length_unit,
        tech_sidec: formData.tech_sidec,
        tech_sidec_length_unit: formData.tech_sidec_length_unit,
        tech_angle_beta: formData.tech_angle_beta,
        tech_angle_beta_unit: formData.tech_angle_beta_unit,
        tech_angle_gamma: formData.tech_angle_gamma,
        tech_angle_gamma_unit: formData.tech_angle_gamma_unit,
        tech_pyramid_height: formData.tech_pyramid_height,
        tech_pyramid_height_unit: formData.tech_pyramid_height_unit,
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
      tech_selection: "1",
      tech_triangle_type: "1",
      tech_base_height: "12",
      tech_base_height_unit: "m",
      tech_pyramid_base_area: "12",
      tech_pyramid_base_area_unit: "m",
      tech_base: "12",
      tech_base_unit: "m",
      tech_sidea: "12",
      tech_sidea_length_unit: "m",
      tech_sideb: "12",
      tech_sideb_length_unit: "m",
      tech_sidec: "12",
      tech_sidec_length_unit: "m",
      tech_angle_beta: "12",
      tech_angle_beta_unit: "rad",
      tech_angle_gamma: "1",
      tech_angle_gamma_unit: "rad",
      tech_pyramid_height: "1",
      tech_pyramid_height_unit: "m",
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
    setFormData((prev) => ({ ...prev, tech_base_height_unit: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  //dropdown states
  const [dropdownVisible1, setDropdownVisible1] = useState(false);

  const setUnitHandler1 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_pyramid_base_area_unit: unit }));
    setDropdownVisible1(false);
  };

  const toggleDropdown1 = () => {
    setDropdownVisible1(!dropdownVisible1);
  };

  //dropdown states
  const [dropdownVisible2, setDropdownVisible2] = useState(false);

  const setUnitHandler2 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_base_unit: unit }));
    setDropdownVisible2(false);
  };

  const toggleDropdown2 = () => {
    setDropdownVisible2(!dropdownVisible2);
  };

  //dropdown states
  const [dropdownVisible3, setDropdownVisible3] = useState(false);

  const setUnitHandler3 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_sidea_length_unit: unit }));
    setDropdownVisible3(false);
  };

  const toggleDropdown3 = () => {
    setDropdownVisible3(!dropdownVisible3);
  };

  //dropdown states
  const [dropdownVisible4, setDropdownVisible4] = useState(false);

  const setUnitHandler4 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_sideb_length_unit: unit }));
    setDropdownVisible4(false);
  };

  const toggleDropdown4 = () => {
    setDropdownVisible4(!dropdownVisible4);
  };

  //dropdown states
  const [dropdownVisible5, setDropdownVisible5] = useState(false);

  const setUnitHandler5 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_sidec_length_unit: unit }));
    setDropdownVisible5(false);
  };

  const toggleDropdown5 = () => {
    setDropdownVisible5(!dropdownVisible5);
  };

  //dropdown states
  const [dropdownVisible6, setDropdownVisible6] = useState(false);

  const setUnitHandler6 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_angle_beta_unit: unit }));
    setDropdownVisible6(false);
  };

  const toggleDropdown6 = () => {
    setDropdownVisible6(!dropdownVisible6);
  };
  //dropdown states
  const [dropdownVisible7, setDropdownVisible7] = useState(false);

  const setUnitHandler7 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_angle_gamma_unit: unit }));
    setDropdownVisible7(false);
  };

  const toggleDropdown7 = () => {
    setDropdownVisible7(!dropdownVisible7);
  };
  //dropdown states
  const [dropdownVisible8, setDropdownVisible8] = useState(false);

  const setUnitHandler8 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_pyramid_height_unit: unit }));
    setDropdownVisible8(false);
  };

  const toggleDropdown8 = () => {
    setDropdownVisible8(!dropdownVisible8);
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
              <div className="md:col-span-6 col-span-12">
                <div className="col-span-12">
                  <label htmlFor="tech_selection" className="label">
                    {data?.payload?.tech_lang_keys["1"]}:
                  </label>
                  <div className="mt-2">
                    <select
                      className="input"
                      aria-label="select"
                      name="tech_selection"
                      id="tech_selection"
                      value={formData.tech_selection}
                      onChange={handleChange}
                    >
                      <option value="1">
                        {data?.payload?.tech_lang_keys["2"]}{" "}
                      </option>
                      <option value="2">
                        {data?.payload?.tech_lang_keys["3"]}{" "}
                      </option>
                    </select>
                  </div>
                </div>

                {formData.tech_selection == "1" && (
                  <>
                    <div className="col-span-12 tri">
                      <label htmlFor="tech_triangle_type" className="label">
                        {data?.payload?.tech_lang_keys["4"]}:
                      </label>
                      <div className="mt-2">
                        <select
                          className="input"
                          aria-label="select"
                          name="tech_triangle_type"
                          id="tech_triangle_type"
                          value={formData.tech_triangle_type}
                          onChange={handleChange}
                        >
                          <option value="1">
                            {data?.payload?.tech_lang_keys["5"]}{" "}
                          </option>
                          <option value="2">
                            {data?.payload?.tech_lang_keys["6"]} (SSS){" "}
                          </option>
                          <option value="3">
                            {data?.payload?.tech_lang_keys["7"]} (SAS){" "}
                          </option>
                          <option value="4">
                            {data?.payload?.tech_lang_keys["8"]} (ASA)
                          </option>
                        </select>
                      </div>
                    </div>
                  </>
                )}

                {formData.tech_selection == "1" &&
                  formData.tech_triangle_type == "1" && (
                    <>
                      <div className="col-span-12 base_height">
                        <label htmlFor="tech_base_height" className="label">
                          {data?.payload?.tech_lang_keys["9"]} (h)
                        </label>
                        <div className="relative w-full ">
                          <input
                            type="number"
                            name="tech_base_height"
                            step="any"
                            className="mt-1 input"
                            value={formData.tech_base_height}
                            placeholder="00"
                            onChange={handleChange}
                          />
                          <label
                            className="absolute cursor-pointer text-sm underline right-6 top-4"
                            onClick={toggleDropdown}
                          >
                            {formData.tech_base_height_unit} ▾
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
                {formData.tech_selection == "2" && (
                  <>
                    <div className="col-span-12 pyramid_base_area">
                      <label htmlFor="tech_pyramid_base_area" className="label">
                        {data?.payload?.tech_lang_keys["10"]} (A):
                      </label>
                      <div className="relative w-full ">
                        <input
                          type="number"
                          name="tech_pyramid_base_area"
                          step="any"
                          className="mt-1 input"
                          value={formData.tech_pyramid_base_area}
                          placeholder="00"
                          onChange={handleChange}
                        />
                        <label
                          className="absolute cursor-pointer text-sm underline right-6 top-4"
                          onClick={toggleDropdown1}
                        >
                          {formData.tech_pyramid_base_area_unit} ▾
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

                {formData.tech_selection == "1" &&
                  formData.tech_triangle_type == "1" && (
                    <>
                      <div className="col-span-12 base">
                        <label htmlFor="tech_base" className="label">
                          {data?.payload?.tech_lang_keys["11"]} (b):
                        </label>
                        <div className="relative w-full ">
                          <input
                            type="number"
                            name="tech_base"
                            step="any"
                            className="mt-1 input"
                            value={formData.tech_base}
                            placeholder="00"
                            onChange={handleChange}
                          />
                          <label
                            className="absolute cursor-pointer text-sm underline right-6 top-4"
                            onClick={toggleDropdown2}
                          >
                            {formData.tech_base_unit} ▾
                          </label>
                          {dropdownVisible2 && (
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
                {((formData.tech_selection == "1" &&
                  formData.tech_triangle_type == "2") ||
                  (formData.tech_selection == "1" &&
                    formData.tech_triangle_type == "3") ||
                  (formData.tech_selection == "1" &&
                    formData.tech_triangle_type == "4")) && (
                  <>
                    <div className="col-span-12 sidea">
                      <label htmlFor="tech_sidea" className="label">
                        {data?.payload?.tech_lang_keys["12"]} a:
                      </label>
                      <div className="relative w-full ">
                        <input
                          type="number"
                          name="tech_sidea"
                          step="any"
                          className="mt-1 input"
                          value={formData.tech_sidea}
                          placeholder="00"
                          onChange={handleChange}
                        />
                        <label
                          className="absolute cursor-pointer text-sm underline right-6 top-4"
                          onClick={toggleDropdown3}
                        >
                          {formData.tech_sidea_length_unit} ▾
                        </label>
                        {dropdownVisible3 && (
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

                {((formData.tech_selection == "1" &&
                  formData.tech_triangle_type == "2") ||
                  (formData.tech_selection == "1" &&
                    formData.tech_triangle_type == "3")) && (
                  <>
                    <div className="col-span-12 sideb">
                      <label htmlFor="tech_sideb" className="label">
                        {data?.payload?.tech_lang_keys["12"]} b:
                      </label>
                      <div className="relative w-full ">
                        <input
                          type="number"
                          name="tech_sideb"
                          step="any"
                          className="mt-1 input"
                          value={formData.tech_sideb}
                          placeholder="00"
                          onChange={handleChange}
                        />
                        <label
                          className="absolute cursor-pointer text-sm underline right-6 top-4"
                          onClick={toggleDropdown4}
                        >
                          {formData.tech_sideb_length_unit} ▾
                        </label>
                        {dropdownVisible4 && (
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
                {formData.tech_selection == "1" &&
                  formData.tech_triangle_type == "2" && (
                    <>
                      <div className="col-span-12 sidec">
                        <label htmlFor="tech_sidec" className="label">
                          {data?.payload?.tech_lang_keys["12"]} c:
                        </label>
                        <div className="relative w-full ">
                          <input
                            type="number"
                            name="tech_sidec"
                            step="any"
                            className="mt-1 input"
                            value={formData.tech_sidec}
                            placeholder="00"
                            onChange={handleChange}
                          />
                          <label
                            className="absolute cursor-pointer text-sm underline right-6 top-4"
                            onClick={toggleDropdown5}
                          >
                            {formData.tech_sidec_length_unit} ▾
                          </label>
                          {dropdownVisible5 && (
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
                {formData.tech_selection == "1" &&
                  formData.tech_triangle_type == "4" && (
                    <>
                      <div className="col-span-12 angle_beta">
                        <label htmlFor="tech_angle_beta" className="label">
                          {data?.payload?.tech_lang_keys["13"]} β:
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
                            onClick={toggleDropdown6}
                          >
                            {formData.tech_angle_beta_unit} ▾
                          </label>
                          {dropdownVisible6 && (
                            <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                              {[
                                { label: "deg", value: "deg" },
                                { label: "rad", value: "rad" },
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
                {((formData.tech_selection == "1" &&
                  formData.tech_triangle_type == "3") ||
                  (formData.tech_selection == "1" &&
                    formData.tech_triangle_type == "4")) && (
                  <>
                    <div className="col-span-12 angle_gamma">
                      <label htmlFor="tech_angle_gamma" className="label">
                        {data?.payload?.tech_lang_keys["13"]} γ:
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
                          onClick={toggleDropdown7}
                        >
                          {formData.tech_angle_gamma_unit} ▾
                        </label>
                        {dropdownVisible7 && (
                          <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                            {[
                              { label: "deg", value: "deg" },
                              { label: "rad", value: "rad" },
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
                {(formData.tech_selection == "2" ||
                  (formData.tech_selection == "1" &&
                    formData.tech_triangle_type == "1") ||
                  (formData.tech_selection == "1" &&
                    formData.tech_triangle_type == "2") ||
                  (formData.tech_selection == "1" &&
                    formData.tech_triangle_type == "3") ||
                  (formData.tech_selection == "1" &&
                    formData.tech_triangle_type == "4")) && (
                  <>
                    <div className="col-span-12 pyramid_height">
                      <label htmlFor="tech_pyramid_height" className="label">
                        {data?.payload?.tech_lang_keys["14"]} (H):
                      </label>
                      <div className="relative w-full ">
                        <input
                          type="number"
                          name="tech_pyramid_height"
                          step="any"
                          className="mt-1 input"
                          value={formData.tech_pyramid_height}
                          placeholder="00"
                          onChange={handleChange}
                        />
                        <label
                          className="absolute cursor-pointer text-sm underline right-6 top-4"
                          onClick={toggleDropdown8}
                        >
                          {formData.tech_pyramid_height_unit} ▾
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
              </div>
              <div className="md:col-span-6 col-span-12 flex items-center ps-lg-3 justify-center">
                md:
                {formData.tech_selection == "1" && (
                  <>
                    {formData.tech_triangle_type == "1" && (
                      <>
                        <img
                          src="/images/picture1.png"
                          alt="Flow Rate Calculator"
                          width="130"
                          height="130"
                          className="change_img"
                        />
                      </>
                    )}
                    {formData.tech_triangle_type == "2" && (
                      <>
                        <img
                          src="/images/picture2.png"
                          alt="Flow Rate Calculator"
                          width="130"
                          height="130"
                          className="change_img"
                        />
                      </>
                    )}
                    {formData.tech_triangle_type == "3" && (
                      <>
                        <img
                          src="/images/picture3.png"
                          alt="Flow Rate Calculator"
                          width="130"
                          height="130"
                          className="change_img"
                        />
                      </>
                    )}
                    {formData.tech_triangle_type == "4" && (
                      <>
                        <img
                          src="/images/picture4.png"
                          alt="Flow Rate Calculator"
                          width="130"
                          height="130"
                          className="change_img"
                        />
                      </>
                    )}
                  </>
                )}
                {formData.tech_selection == "2" && (
                  <>
                    <img
                      src="/images/picture5.png"
                      alt="Flow Rate Calculator"
                      width="130"
                      height="130"
                      className="change_img"
                    />
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
                      <div className="w-full my-2">
                        <div className="w-full overflow-auto ">
                          <table className="w-full text-[16px]">
                            <tbody>
                              {result?.tech_pba && (
                                <>
                                  <tr>
                                    <td className="border-b py-2">
                                      <strong>
                                        {data?.payload?.tech_lang_keys["10"]} :
                                      </strong>
                                    </td>
                                    <td className="border-b py-2">
                                      {Number(result?.tech_pba).toFixed(3)}
                                      <span className="text-[14px]">
                                        {" "}
                                        (cm<sup>2</sup>)
                                      </span>
                                    </td>
                                  </tr>
                                </>
                              )}
                              <tr>
                                <td width="45%" className="border-b py-2">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["15"]} :
                                  </strong>
                                </td>
                                <td className="border-b py-2">
                                  <strong>
                                    {Number(result?.tech_volume).toFixed(3)}
                                    <span className="font_size22 text-[14px]">
                                      {" "}
                                      (cm<sup>3</sup>)
                                    </span>{" "}
                                  </strong>
                                </td>
                              </tr>
                              <tr>
                                <td className="pt-2" colSpan="2">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["16"]}
                                  </strong>
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  {data?.payload?.tech_lang_keys["15"]} :
                                </td>
                                <td className="border-b py-2">
                                  {result?.tech_volume * 1000}{" "}
                                  <span className="text-[14px]">
                                    cubic millimeters (mm<sup>3</sup>)
                                  </span>
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  {data?.payload?.tech_lang_keys["15"]} :
                                </td>
                                <td className="border-b py-2">
                                  {result?.tech_volume * 0.001}{" "}
                                  <span className="text-[14px]">
                                    {" "}
                                    cubic decimeters (dm<sup>3</sup>)
                                  </span>
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  {data?.payload?.tech_lang_keys["15"]} :
                                </td>
                                <td className="border-b py-2">
                                  {result?.tech_volume * 0.000001}{" "}
                                  <span className="text-[14px]">
                                    cubic meters (m<sup>3</sup>)
                                  </span>
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  {data?.payload?.tech_lang_keys["15"]} :
                                </td>
                                <td className="border-b py-2">
                                  {result?.tech_volume * 0.000000000000001}{" "}
                                  <span className="text-[14px]">
                                    cubic kilometers (km<sup>3</sup>)
                                  </span>
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  {data?.payload?.tech_lang_keys["15"]} :
                                </td>
                                <td className="border-b py-2">
                                  {result?.tech_volume * 0.061024}{" "}
                                  <span className="text-[14px]">
                                    cubic inches (in<sup>3</sup>)
                                  </span>
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  {data?.payload?.tech_lang_keys["15"]} :
                                </td>
                                <td className="border-b py-2">
                                  {result?.tech_volume * 0.000035315}{" "}
                                  <span className="text-[14px]">
                                    cubic feet (ft<sup>3</sup>)
                                  </span>
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  {data?.payload?.tech_lang_keys["15"]} :
                                </td>
                                <td className="border-b py-2">
                                  {result?.tech_volume * 0.00000130795}{" "}
                                  <span className="text-[14px]">
                                    cubic yards (yd<sup>3</sup>)
                                  </span>
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  {data?.payload?.tech_lang_keys["15"]} :
                                </td>
                                <td className="border-b py-2">
                                  {result?.tech_volume / 4168000000000000}{" "}
                                  <span className="text-[14px]">
                                    cubic miles (mi<sup>3</sup>)
                                  </span>
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

export default VolumeOfTriangularPyramidCalculator;

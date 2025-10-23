"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useAquariumCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const AquariumCalculator = () => {
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
    tech_shape: "1",
    tech_length: "12",
    tech_length_unit: "ft",
    tech_width: "1350",
    tech_width_unit: "in",
    tech_height: "12",
    tech_height_unit: "cm",
    tech_front_pane: "16",
    tech_front_pane_unit: "m",
    tech_end_pane: "16",
    tech_end_pane_unit: "cm",
    tech_radius: "16",
    tech_radius_unit: "in",
    tech_radius_one: "16",
    tech_radius_one_unit: "in",
    tech_radius_two: "16",
    tech_radius_two_unit: "cm",
    tech_long_side: "16",
    tech_long_side_unit: "m",
    tech_short_side: "16",
    tech_short_side_unit: "m",
    tech_len_one: "16",
    tech_len_one_unit: "m",
    tech_len_two: "16",
    tech_len_two_unit: "cm",
    tech_wid_one: "16",
    tech_wid_one_unit: "cm",
    tech_wid_two: "16",
    tech_wid_two_unit: "cm",
    tech_fill_depth: "6",
    tech_fill_depth_unit: "cm",
    tech_full_width: "16",
    tech_full_width_unit: "cm",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useAquariumCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_shape) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_shape: formData.tech_shape,
        tech_length: formData.tech_length,
        tech_length_unit: formData.tech_length_unit,
        tech_width: formData.tech_width,
        tech_width_unit: formData.tech_width_unit,
        tech_height: formData.tech_height,
        tech_height_unit: formData.tech_height_unit,
        tech_front_pane: formData.tech_front_pane,
        tech_front_pane_unit: formData.tech_front_pane_unit,
        tech_end_pane: formData.tech_end_pane,
        tech_end_pane_unit: formData.tech_end_pane_unit,
        tech_radius: formData.tech_radius,
        tech_radius_unit: formData.tech_radius_unit,
        tech_radius_one: formData.tech_radius_one,
        tech_radius_one_unit: formData.tech_radius_one_unit,
        tech_radius_two: formData.tech_radius_two,
        tech_radius_two_unit: formData.tech_radius_two_unit,
        tech_long_side: formData.tech_long_side,
        tech_long_side_unit: formData.tech_long_side_unit,
        tech_short_side: formData.tech_short_side,
        tech_short_side_unit: formData.tech_short_side_unit,
        tech_len_one: formData.tech_len_one,
        tech_len_one_unit: formData.tech_len_one_unit,
        tech_len_two: formData.tech_len_two,
        tech_len_two_unit: formData.tech_len_two_unit,
        tech_wid_one: formData.tech_wid_one,
        tech_wid_one_unit: formData.tech_wid_one_unit,
        tech_wid_two: formData.tech_wid_two,
        tech_wid_two_unit: formData.tech_wid_two_unit,
        tech_fill_depth: formData.tech_fill_depth,
        tech_fill_depth_unit: formData.tech_fill_depth_unit,
        tech_full_width: formData.tech_full_width,
        tech_full_width_unit: formData.tech_full_width_unit,
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
      tech_shape: "1",
      tech_length: "12",
      tech_length_unit: "ft",
      tech_width: "1350",
      tech_width_unit: "in",
      tech_height: "12",
      tech_height_unit: "cm",
      tech_front_pane: "16",
      tech_front_pane_unit: "m",
      tech_end_pane: "16",
      tech_end_pane_unit: "cm",
      tech_radius: "16",
      tech_radius_unit: "in",
      tech_radius_one: "16",
      tech_radius_one_unit: "in",
      tech_radius_two: "16",
      tech_radius_two_unit: "cm",
      tech_long_side: "16",
      tech_long_side_unit: "m",
      tech_short_side: "16",
      tech_short_side_unit: "m",
      tech_len_one: "16",
      tech_len_one_unit: "m",
      tech_len_two: "16",
      tech_len_two_unit: "cm",
      tech_wid_one: "16",
      tech_wid_one_unit: "cm",
      tech_wid_two: "16",
      tech_wid_two_unit: "cm",
      tech_fill_depth: "6",
      tech_fill_depth_unit: "cm",
      tech_full_width: "16",
      tech_full_width_unit: "cm",
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
    setFormData((prev) => ({ ...prev, tech_length_unit: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  //dropdown states
  const [dropdownVisible1, setDropdownVisible1] = useState(false);

  const setUnitHandler1 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_width_unit: unit }));
    setDropdownVisible1(false);
  };

  const toggleDropdown1 = () => {
    setDropdownVisible1(!dropdownVisible1);
  };

  //dropdown states
  const [dropdownVisible2, setDropdownVisible2] = useState(false);

  const setUnitHandler2 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_height_unit: unit }));
    setDropdownVisible2(false);
  };

  const toggleDropdown2 = () => {
    setDropdownVisible2(!dropdownVisible2);
  };

  //dropdown states
  const [dropdownVisible3, setDropdownVisible3] = useState(false);

  const setUnitHandler3 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_front_pane_unit: unit }));
    setDropdownVisible3(false);
  };

  const toggleDropdown3 = () => {
    setDropdownVisible3(!dropdownVisible3);
  };

  //dropdown states
  const [dropdownVisible4, setDropdownVisible4] = useState(false);

  const setUnitHandler4 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_end_pane_unit: unit }));
    setDropdownVisible4(false);
  };

  const toggleDropdown4 = () => {
    setDropdownVisible4(!dropdownVisible4);
  };

  //dropdown states
  const [dropdownVisible5, setDropdownVisible5] = useState(false);

  const setUnitHandler5 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_radius_unit: unit }));
    setDropdownVisible5(false);
  };

  const toggleDropdown5 = () => {
    setDropdownVisible5(!dropdownVisible5);
  };

  //dropdown states
  const [dropdownVisible6, setDropdownVisible6] = useState(false);

  const setUnitHandler6 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_radius_one_unit: unit }));
    setDropdownVisible6(false);
  };

  const toggleDropdown6 = () => {
    setDropdownVisible6(!dropdownVisible6);
  };

  //dropdown states
  const [dropdownVisible7, setDropdownVisible7] = useState(false);

  const setUnitHandler7 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_radius_two_unit: unit }));
    setDropdownVisible7(false);
  };

  const toggleDropdown7 = () => {
    setDropdownVisible7(!dropdownVisible7);
  };

  //dropdown states
  const [dropdownVisible8, setDropdownVisible8] = useState(false);

  const setUnitHandler8 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_long_side_unit: unit }));
    setDropdownVisible8(false);
  };

  const toggleDropdown8 = () => {
    setDropdownVisible8(!dropdownVisible8);
  };

  //dropdown states
  const [dropdownVisible9, setDropdownVisible9] = useState(false);

  const setUnitHandler9 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_short_side_unit: unit }));
    setDropdownVisible9(false);
  };

  const toggleDropdown9 = () => {
    setDropdownVisible9(!dropdownVisible9);
  };

  //dropdown states
  const [dropdownVisible10, setDropdownVisible10] = useState(false);

  const setUnitHandler10 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_len_one_unit: unit }));
    setDropdownVisible10(false);
  };

  const toggleDropdown10 = () => {
    setDropdownVisible10(!dropdownVisible10);
  };

  //dropdown states
  const [dropdownVisible11, setDropdownVisible11] = useState(false);

  const setUnitHandler11 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_len_two_unit: unit }));
    setDropdownVisible11(false);
  };

  const toggleDropdown11 = () => {
    setDropdownVisible11(!dropdownVisible11);
  };

  //dropdown states
  const [dropdownVisible12, setDropdownVisible12] = useState(false);

  const setUnitHandler12 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_wid_one_unit: unit }));
    setDropdownVisible12(false);
  };

  const toggleDropdown12 = () => {
    setDropdownVisible12(!dropdownVisible12);
  };

  //dropdown states
  const [dropdownVisible13, setDropdownVisible13] = useState(false);

  const setUnitHandler13 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_wid_two_unit: unit }));
    setDropdownVisible13(false);
  };

  const toggleDropdown13 = () => {
    setDropdownVisible13(!dropdownVisible13);
  };

  //dropdown states
  const [dropdownVisible14, setDropdownVisible14] = useState(false);

  const setUnitHandler14 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_fill_depth_unit: unit }));
    setDropdownVisible14(false);
  };

  const toggleDropdown14 = () => {
    setDropdownVisible14(!dropdownVisible14);
  };

  //dropdown states
  const [dropdownVisible15, setDropdownVisible15] = useState(false);

  const setUnitHandler15 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_full_width_unit: unit }));
    setDropdownVisible15(false);
  };

  const toggleDropdown15 = () => {
    setDropdownVisible15(!dropdownVisible15);
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
            <div className="grid grid-cols-12 mt-3  gap-4">
              <div className="lg:col-span-6 md:col-span-6 col-span-12">
                <div className="col-12 mt-0 mt-lg-2">
                  <label htmlFor="tech_shape" className="label">
                    {data?.payload?.tech_lang_keys["1"]}:
                  </label>
                  <div className="mt-2">
                    <select
                      className="input"
                      aria-label="select"
                      name="tech_shape"
                      id="tech_shape"
                      value={formData.tech_shape}
                      onChange={handleChange}
                    >
                      <option value="1">
                        {data?.payload?.tech_lang_keys["2"]}
                      </option>
                      <option value="2">
                        {data?.payload?.tech_lang_keys["3"]}{" "}
                      </option>
                      <option value="3">
                        {data?.payload?.tech_lang_keys["4"]}{" "}
                      </option>
                      <option value="4">
                        {data?.payload?.tech_lang_keys["5"]}{" "}
                      </option>
                      <option value="5">
                        {data?.payload?.tech_lang_keys["6"]}{" "}
                      </option>
                      <option value="6">
                        {data?.payload?.tech_lang_keys["7"]}{" "}
                      </option>
                      <option value="7">
                        {data?.payload?.tech_lang_keys["8"]}{" "}
                      </option>
                      <option value="8">
                        {data?.payload?.tech_lang_keys["9"]}{" "}
                      </option>
                      <option value="9">
                        {data?.payload?.tech_lang_keys["10"]}{" "}
                      </option>
                      <option value="10">
                        {data?.payload?.tech_lang_keys["11"]}{" "}
                      </option>
                      <option value="11">
                        {data?.payload?.tech_lang_keys["12"]}{" "}
                      </option>
                      <option value="12">
                        {data?.payload?.tech_lang_keys["13"]}{" "}
                      </option>
                      <option value="13">
                        {data?.payload?.tech_lang_keys["34"]}{" "}
                      </option>
                    </select>
                  </div>
                </div>

                {(formData.tech_shape == "1" ||
                  formData.tech_shape == "2" ||
                  formData.tech_shape == "3" ||
                  formData.tech_shape == "4" ||
                  formData.tech_shape == "5" ||
                  formData.tech_shape == "13") && (
                  <>
                    <div className="col-12 mt-1 mt-lg-2 length">
                      <label htmlFor="tech_length" className="label">
                        {data?.payload?.tech_lang_keys["14"]}
                      </label>
                      <div className="relative w-full ">
                        <input
                          type="number"
                          name="tech_length"
                          step="any"
                          className="mt-1 input"
                          value={formData.tech_length}
                          placeholder="00"
                          onChange={handleChange}
                        />
                        <label
                          className="absolute cursor-pointer text-sm underline right-6 top-4"
                          onClick={toggleDropdown}
                        >
                          {formData.tech_length_unit} ▾
                        </label>
                        {dropdownVisible && (
                          <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                            {[
                              { label: "cm", value: "cm" },
                              { label: "m", value: "m" },
                              { label: "in", value: "in" },
                              { label: "ft", value: "ft" },
                              { label: "yd", value: "yd" },
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
                {(formData.tech_shape == "1" ||
                  formData.tech_shape == "3" ||
                  formData.tech_shape == "4" ||
                  formData.tech_shape == "5" ||
                  formData.tech_shape == "13") && (
                  <>
                    <div className="col-12 mt-1 mt-lg-2 width">
                      <label htmlFor="tech_width" className="label">
                        {data?.payload?.tech_lang_keys["15"]}
                      </label>
                      <div className="relative w-full ">
                        <input
                          type="number"
                          name="tech_width"
                          step="any"
                          className="mt-1 input"
                          value={formData.tech_width}
                          placeholder="00"
                          onChange={handleChange}
                        />
                        <label
                          className="absolute cursor-pointer text-sm underline right-6 top-4"
                          onClick={toggleDropdown1}
                        >
                          {formData.tech_width_unit} ▾
                        </label>
                        {dropdownVisible1 && (
                          <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                            {[
                              { label: "cm", value: "cm" },
                              { label: "m", value: "m" },
                              { label: "in", value: "in" },
                              { label: "ft", value: "ft" },
                              { label: "yd", value: "yd" },
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
                {(formData.tech_shape == "1" ||
                  formData.tech_shape == "3" ||
                  formData.tech_shape == "4" ||
                  formData.tech_shape == "5" ||
                  formData.tech_shape == "6" ||
                  formData.tech_shape == "7" ||
                  formData.tech_shape == "8" ||
                  formData.tech_shape == "9" ||
                  formData.tech_shape == "10" ||
                  formData.tech_shape == "11" ||
                  formData.tech_shape == "12" ||
                  formData.tech_shape == "13") && (
                  <>
                    <div className="col-12 mt-1 mt-lg-2 height ">
                      <label htmlFor="tech_height" className="label">
                        {data?.payload?.tech_lang_keys["16"]}
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
                          onClick={toggleDropdown2}
                        >
                          {formData.tech_height_unit} ▾
                        </label>
                        {dropdownVisible2 && (
                          <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                            {[
                              { label: "cm", value: "cm" },
                              { label: "m", value: "m" },
                              { label: "in", value: "in" },
                              { label: "ft", value: "ft" },
                              { label: "yd", value: "yd" },
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

                {(formData.tech_shape == "3" ||
                  formData.tech_shape == "4" ||
                  formData.tech_shape == "5") && (
                  <>
                    <div className="col-12 mt-1 mt-lg-2 front_pane">
                      <label htmlFor="tech_front_pane" className="label">
                        {data?.payload?.tech_lang_keys["17"]}
                      </label>
                      <div className="relative w-full ">
                        <input
                          type="number"
                          name="tech_front_pane"
                          step="any"
                          className="mt-1 input"
                          value={formData.tech_front_pane}
                          placeholder="00"
                          onChange={handleChange}
                        />
                        <label
                          className="absolute cursor-pointer text-sm underline right-6 top-4"
                          onClick={toggleDropdown3}
                        >
                          {formData.tech_front_pane_unit} ▾
                        </label>
                        {dropdownVisible3 && (
                          <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                            {[
                              { label: "cm", value: "cm" },
                              { label: "m", value: "m" },
                              { label: "in", value: "in" },
                              { label: "ft", value: "ft" },
                              { label: "yd", value: "yd" },
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
                {(formData.tech_shape == "4" ||
                  formData.tech_shape == "5" ||
                  formData.tech_shape == "6" ||
                  formData.tech_shape == "7" ||
                  formData.tech_shape == "8") && (
                  <>
                    <div className="col-12 mt-1 mt-lg-2 end_pane">
                      <label htmlFor="tech_end_pane" className="label">
                        {data?.payload?.tech_lang_keys["18"]}
                      </label>
                      <div className="relative w-full ">
                        <input
                          type="number"
                          name="tech_end_pane"
                          step="any"
                          className="mt-1 input"
                          value={formData.tech_end_pane}
                          placeholder="00"
                          onChange={handleChange}
                        />
                        <label
                          className="absolute cursor-pointer text-sm underline right-6 top-4"
                          onClick={toggleDropdown4}
                        >
                          {formData.tech_end_pane_unit} ▾
                        </label>
                        {dropdownVisible4 && (
                          <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                            {[
                              { label: "cm", value: "cm" },
                              { label: "m", value: "m" },
                              { label: "in", value: "in" },
                              { label: "ft", value: "ft" },
                              { label: "yd", value: "yd" },
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
                {(formData.tech_shape == "6" ||
                  formData.tech_shape == "7" ||
                  formData.tech_shape == "8") && (
                  <>
                    <div className="col-12 mt-1 mt-lg-2 radius">
                      <label htmlFor="tech_radius" className="label">
                        {data?.payload?.tech_lang_keys["19"]}
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
                          onClick={toggleDropdown5}
                        >
                          {formData.tech_radius_unit} ▾
                        </label>
                        {dropdownVisible5 && (
                          <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                            {[
                              { label: "cm", value: "cm" },
                              { label: "m", value: "m" },
                              { label: "in", value: "in" },
                              { label: "ft", value: "ft" },
                              { label: "yd", value: "yd" },
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
                {(formData.tech_shape == "9" || formData.tech_shape == "9") && (
                  <>
                    <div className="col-12 mt-1 mt-lg-2 radius_one">
                      <label htmlFor="tech_radius_one" className="label">
                        {data?.payload?.tech_lang_keys["20"]}
                      </label>
                      <div className="relative w-full ">
                        <input
                          type="number"
                          name="tech_radius_one"
                          step="any"
                          className="mt-1 input"
                          value={formData.tech_radius_one}
                          placeholder="00"
                          onChange={handleChange}
                        />
                        <label
                          className="absolute cursor-pointer text-sm underline right-6 top-4"
                          onClick={toggleDropdown6}
                        >
                          {formData.tech_radius_one_unit} ▾
                        </label>
                        {dropdownVisible6 && (
                          <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                            {[
                              { label: "cm", value: "cm" },
                              { label: "m", value: "m" },
                              { label: "in", value: "in" },
                              { label: "ft", value: "ft" },
                              { label: "yd", value: "yd" },
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
                {(formData.tech_shape == "9" || formData.tech_shape == "9") && (
                  <>
                    <div className="col-12 mt-1 mt-lg-2 radius_two ">
                      <label htmlFor="tech_radius_two" className="label">
                        {data?.payload?.tech_lang_keys["21"]}
                      </label>
                      <div className="relative w-full ">
                        <input
                          type="number"
                          name="tech_radius_two"
                          step="any"
                          className="mt-1 input"
                          value={formData.tech_radius_two}
                          placeholder="00"
                          onChange={handleChange}
                        />
                        <label
                          className="absolute cursor-pointer text-sm underline right-6 top-4"
                          onClick={toggleDropdown7}
                        >
                          {formData.tech_radius_two_unit} ▾
                        </label>
                        {dropdownVisible7 && (
                          <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                            {[
                              { label: "cm", value: "cm" },
                              { label: "m", value: "m" },
                              { label: "in", value: "in" },
                              { label: "ft", value: "ft" },
                              { label: "yd", value: "yd" },
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
                {(formData.tech_shape == "10" ||
                  formData.tech_shape == "10") && (
                  <>
                    <div className="col-12 mt-1 mt-lg-2 long_side">
                      <label htmlFor="tech_long_side" className="label">
                        {data?.payload?.tech_lang_keys["22"]}
                      </label>
                      <div className="relative w-full ">
                        <input
                          type="number"
                          name="tech_long_side"
                          step="any"
                          className="mt-1 input"
                          value={formData.tech_long_side}
                          placeholder="00"
                          onChange={handleChange}
                        />
                        <label
                          className="absolute cursor-pointer text-sm underline right-6 top-4"
                          onClick={toggleDropdown8}
                        >
                          {formData.tech_long_side_unit} ▾
                        </label>
                        {dropdownVisible8 && (
                          <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                            {[
                              { label: "cm", value: "cm" },
                              { label: "m", value: "m" },
                              { label: "in", value: "in" },
                              { label: "ft", value: "ft" },
                              { label: "yd", value: "yd" },
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
                {(formData.tech_shape == "10" ||
                  formData.tech_shape == "10") && (
                  <>
                    <div className="col-12 mt-1 mt-lg-2 short_side ">
                      <label htmlFor="tech_short_side" className="label">
                        {data?.payload?.tech_lang_keys["23"]}
                      </label>
                      <div className="relative w-full ">
                        <input
                          type="number"
                          name="tech_short_side"
                          step="any"
                          className="mt-1 input"
                          value={formData.tech_short_side}
                          placeholder="00"
                          onChange={handleChange}
                        />
                        <label
                          className="absolute cursor-pointer text-sm underline right-6 top-4"
                          onClick={toggleDropdown9}
                        >
                          {formData.tech_short_side_unit} ▾
                        </label>
                        {dropdownVisible9 && (
                          <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                            {[
                              { label: "cm", value: "cm" },
                              { label: "m", value: "m" },
                              { label: "in", value: "in" },
                              { label: "ft", value: "ft" },
                              { label: "yd", value: "yd" },
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
                {(formData.tech_shape == "11" ||
                  formData.tech_shape == "12") && (
                  <>
                    <div className="col-12 mt-1 mt-lg-2 len_one">
                      <label htmlFor="tech_len_one" className="label">
                        {data?.payload?.tech_lang_keys["24"]}
                      </label>
                      <div className="relative w-full ">
                        <input
                          type="number"
                          name="tech_len_one"
                          step="any"
                          className="mt-1 input"
                          value={formData.tech_len_one}
                          placeholder="00"
                          onChange={handleChange}
                        />
                        <label
                          className="absolute cursor-pointer text-sm underline right-6 top-4"
                          onClick={toggleDropdown10}
                        >
                          {formData.tech_len_one_unit} ▾
                        </label>
                        {dropdownVisible10 && (
                          <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                            {[
                              { label: "cm", value: "cm" },
                              { label: "m", value: "m" },
                              { label: "in", value: "in" },
                              { label: "ft", value: "ft" },
                              { label: "yd", value: "yd" },
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
                {(formData.tech_shape == "11" ||
                  formData.tech_shape == "12") && (
                  <>
                    <div className="col-12 mt-1 mt-lg-2 len_two">
                      <label htmlFor="tech_len_two" className="label">
                        {data?.payload?.tech_lang_keys["25"]}
                      </label>
                      <div className="relative w-full ">
                        <input
                          type="number"
                          name="tech_len_two"
                          step="any"
                          className="mt-1 input"
                          value={formData.tech_len_two}
                          placeholder="00"
                          onChange={handleChange}
                        />
                        <label
                          className="absolute cursor-pointer text-sm underline right-6 top-4"
                          onClick={toggleDropdown11}
                        >
                          {formData.tech_len_two_unit} ▾
                        </label>
                        {dropdownVisible11 && (
                          <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                            {[
                              { label: "cm", value: "cm" },
                              { label: "m", value: "m" },
                              { label: "in", value: "in" },
                              { label: "ft", value: "ft" },
                              { label: "yd", value: "yd" },
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
                {formData.tech_shape == "11" && (
                  <>
                    <div className="col-12 mt-1 mt-lg-2 wid_one">
                      <label htmlFor="tech_wid_one" className="label">
                        {data?.payload?.tech_lang_keys["26"]}
                      </label>
                      <div className="relative w-full ">
                        <input
                          type="number"
                          name="tech_wid_one"
                          step="any"
                          className="mt-1 input"
                          value={formData.tech_wid_one}
                          placeholder="00"
                          onChange={handleChange}
                        />
                        <label
                          className="absolute cursor-pointer text-sm underline right-6 top-4"
                          onClick={toggleDropdown12}
                        >
                          {formData.tech_wid_one_unit} ▾
                        </label>
                        {dropdownVisible12 && (
                          <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                            {[
                              { label: "cm", value: "cm" },
                              { label: "m", value: "m" },
                              { label: "in", value: "in" },
                              { label: "ft", value: "ft" },
                              { label: "yd", value: "yd" },
                            ].map((unit, index) => (
                              <p
                                key={index}
                                className="p-2 hover:bg-gray-100 cursor-pointer"
                                onClick={() => setUnitHandler12(unit.value)}
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
                {formData.tech_shape == "11" && (
                  <>
                    <div className="col-12 mt-1 mt-lg-2 wid_two">
                      <label htmlFor="tech_wid_two" className="label">
                        {data?.payload?.tech_lang_keys["27"]}
                      </label>
                      <div className="relative w-full ">
                        <input
                          type="number"
                          name="tech_wid_two"
                          step="any"
                          className="mt-1 input"
                          value={formData.tech_wid_two}
                          placeholder="00"
                          onChange={handleChange}
                        />
                        <label
                          className="absolute cursor-pointer text-sm underline right-6 top-4"
                          onClick={toggleDropdown13}
                        >
                          {formData.tech_wid_two_unit} ▾
                        </label>
                        {dropdownVisible13 && (
                          <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                            {[
                              { label: "cm", value: "cm" },
                              { label: "m", value: "m" },
                              { label: "in", value: "in" },
                              { label: "ft", value: "ft" },
                              { label: "yd", value: "yd" },
                            ].map((unit, index) => (
                              <p
                                key={index}
                                className="p-2 hover:bg-gray-100 cursor-pointer"
                                onClick={() => setUnitHandler13(unit.value)}
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
                {formData.tech_shape != "13" && (
                  <>
                    <div className="col-12 mt-1 mt-lg-2 fill_depth">
                      <label htmlFor="tech_fill_depth" className="label">
                        {data?.payload?.tech_lang_keys["28"]} ({" "}
                        {data?.payload?.tech_lang_keys["29"]})
                      </label>
                      <div className="relative w-full ">
                        <input
                          type="number"
                          name="tech_fill_depth"
                          step="any"
                          className="mt-1 input"
                          value={formData.tech_fill_depth}
                          placeholder="00"
                          onChange={handleChange}
                        />
                        <label
                          className="absolute cursor-pointer text-sm underline right-6 top-4"
                          onClick={toggleDropdown14}
                        >
                          {formData.tech_fill_depth_unit} ▾
                        </label>
                        {dropdownVisible14 && (
                          <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                            {[
                              { label: "cm", value: "cm" },
                              { label: "m", value: "m" },
                              { label: "in", value: "in" },
                              { label: "ft", value: "ft" },
                              { label: "yd", value: "yd" },
                            ].map((unit, index) => (
                              <p
                                key={index}
                                className="p-2 hover:bg-gray-100 cursor-pointer"
                                onClick={() => setUnitHandler14(unit.value)}
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
                {formData.tech_shape == "13" && (
                  <>
                    <div className="col-12 mt-1 mt-lg-2 full_width">
                      <label htmlFor="tech_full_width" className="label">
                        {data?.payload?.tech_lang_keys["36"]} :
                      </label>
                      <div className="relative w-full ">
                        <input
                          type="number"
                          name="tech_full_width"
                          step="any"
                          className="mt-1 input"
                          value={formData.tech_full_width}
                          placeholder="00"
                          onChange={handleChange}
                        />
                        <label
                          className="absolute cursor-pointer text-sm underline right-6 top-4"
                          onClick={toggleDropdown15}
                        >
                          {formData.tech_full_width_unit} ▾
                        </label>
                        {dropdownVisible15 && (
                          <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                            {[
                              { label: "cm", value: "cm" },
                              { label: "m", value: "m" },
                              { label: "in", value: "in" },
                              { label: "ft", value: "ft" },
                              { label: "yd", value: "yd" },
                            ].map((unit, index) => (
                              <p
                                key={index}
                                className="p-2 hover:bg-gray-100 cursor-pointer"
                                onClick={() => setUnitHandler15(unit.value)}
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
              <div className="lg:col-span-6 md:col-span-6 col-span-12 pt-5">
                {formData.tech_shape == 1 && (
                  <>
                    <img
                      src="/images/pict12.png"
                      alt="ShapeImage"
                      className="max-width my-lg-2 change_img"
                      width="320px"
                      height="250px"
                    />
                  </>
                )}
                {formData.tech_shape == 2 && (
                  <>
                    <img
                      src="/images/pict11.png"
                      alt="ShapeImage"
                      className="max-width my-lg-2 change_img"
                      width="320px"
                      height="250px"
                    />
                  </>
                )}
                {formData.tech_shape == 3 && (
                  <>
                    <img
                      src="/images/pict10.png"
                      alt="ShapeImage"
                      className="max-width my-lg-2 change_img"
                      width="320px"
                      height="250px"
                    />
                  </>
                )}
                {formData.tech_shape == 4 && (
                  <>
                    <img
                      src="/images/pict9.png"
                      alt="ShapeImage"
                      className="max-width my-lg-2 change_img"
                      width="320px"
                      height="250px"
                    />
                  </>
                )}
                {formData.tech_shape == 5 && (
                  <>
                    <img
                      src="/images/pict8.png"
                      alt="ShapeImage"
                      className="max-width my-lg-2 change_img"
                      width="320px"
                      height="250px"
                    />
                  </>
                )}
                {formData.tech_shape == 6 && (
                  <>
                    <img
                      src="/images/pict7.png"
                      alt="ShapeImage"
                      className="max-width my-lg-2 change_img"
                      width="320px"
                      height="250px"
                    />
                  </>
                )}
                {formData.tech_shape == 7 && (
                  <>
                    <img
                      src="/images/pict6.png"
                      alt="ShapeImage"
                      className="max-width my-lg-2 change_img"
                      width="320px"
                      height="250px"
                    />
                  </>
                )}
                {formData.tech_shape == 8 && (
                  <>
                    <img
                      src="/images/pict5.png"
                      alt="ShapeImage"
                      className="max-width my-lg-2 change_img"
                      width="320px"
                      height="250px"
                    />
                  </>
                )}
                {formData.tech_shape == 9 && (
                  <>
                    <img
                      src="/images/pict4.png"
                      alt="ShapeImage"
                      className="max-width my-lg-2 change_img"
                      width="320px"
                      height="250px"
                    />
                  </>
                )}
                {formData.tech_shape == 10 && (
                  <>
                    <img
                      src="/images/pict3.png"
                      alt="ShapeImage"
                      className="max-width my-lg-2 change_img"
                      width="320px"
                      height="250px"
                    />
                  </>
                )}
                {formData.tech_shape == 11 && (
                  <>
                    <img
                      src="/images/pict2.png"
                      alt="ShapeImage"
                      className="max-width my-lg-2 change_img"
                      width="320px"
                      height="250px"
                    />
                  </>
                )}
                {formData.tech_shape == 12 && (
                  <>
                    <img
                      src="/images/pict1.png"
                      alt="ShapeImage"
                      className="max-width my-lg-2 change_img"
                      width="320px"
                      height="250px"
                    />
                  </>
                )}
                {formData.tech_shape == 13 && (
                  <>
                    <img
                      src="/images/pi1.webp"
                      alt="ShapeImage"
                      className="max-width my-lg-2 change_img"
                      width="320px"
                      height="250px"
                    />
                  </>
                )}
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
              <div className="w-full mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg  flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="w-full">
                        <div className="w-full md:w-[60%] lg:w-[60%] overflow-auto lg:text-[18px] md:text-[18px] text-[16px]">
                          <table className="w-full">
                            <tbody>
                              <tr>
                                <td width="50%" className="border-b py-2">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["30"]} :
                                  </strong>
                                </td>
                                <td className="border-b py-2">
                                  {Number(
                                    result?.tech_volume * 0.000264172
                                  ).toFixed(2)}{" "}
                                  (U.S Gallons)
                                </td>
                              </tr>
                            </tbody>
                          </table>
                          <p className="mt-2">
                            {data?.payload?.tech_lang_keys["31"]}
                          </p>
                          <table className="w-full">
                            <tbody>
                              <tr>
                                <td width="50%" className="border-b py-2">
                                  {data?.payload?.tech_lang_keys["32"]} :
                                </td>
                                <td className="border-b py-2">
                                  {Number(result?.tech_volume).toFixed(3)}{" "}
                                  <span className="black-text font_unit2">
                                    (cm)<sup>3</sup>
                                  </span>
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  {data?.payload?.tech_lang_keys["32"]} :
                                </td>
                                <td className="border-b py-2">
                                  {Number(result?.tech_volume * 0.001).toFixed(
                                    3
                                  )}{" "}
                                  <span className="black-text font_unit2">
                                    (dm)<sup>3</sup>
                                  </span>
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  {data?.payload?.tech_lang_keys["32"]} :
                                </td>
                                <td className="border-b py-2">
                                  {Number(
                                    result?.tech_volume * 0.000001
                                  ).toFixed(3)}{" "}
                                  <span className="black-text font_unit2">
                                    (m)<sup>3</sup>
                                  </span>
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  {data?.payload?.tech_lang_keys["32"]} :
                                </td>
                                <td className="border-b py-2">
                                  {Number(
                                    result?.tech_volume * 0.0610237
                                  ).toFixed(3)}{" "}
                                  <span className="black-text font_unit2">
                                    (cu in)
                                  </span>
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  {data?.payload?.tech_lang_keys["32"]} :
                                </td>
                                <td className="border-b py-2">
                                  {Number(
                                    result?.tech_volume * 0.000035315
                                  ).toFixed(3)}{" "}
                                  <span className="black-text font_unit2">
                                    (cu ft)
                                  </span>
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  {data?.payload?.tech_lang_keys["32"]} :
                                </td>
                                <td className="border-b py-2">
                                  {Number(
                                    result?.tech_volume * 0.000001308
                                  ).toFixed(3)}{" "}
                                  <span className="black-text font_unit2">
                                    (cu yd)
                                  </span>
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  {data?.payload?.tech_lang_keys["32"]} :
                                </td>
                                <td className="border-b py-2">
                                  {Number(result?.tech_volume * 0.001).toFixed(
                                    3
                                  )}{" "}
                                  <span className="black-text font_unit2">
                                    (liters)
                                  </span>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                          {result?.tech_filled_volume && (
                            <>
                              <table className="w-full">
                                <tbody>
                                  <tr>
                                    <td width="50%" className="border-b py-2">
                                      <strong>
                                        {data?.payload?.tech_lang_keys["33"]} :
                                      </strong>
                                    </td>
                                    <td className="border-b py-2">
                                      {Number(
                                        result?.tech_filled_volume * 0.000264172
                                      ).toFixed(2)}{" "}
                                      (U.S Gallons)
                                    </td>
                                  </tr>
                                </tbody>
                              </table>

                              <p className="mt-2">
                                {data?.payload?.tech_lang_keys["31"]}
                              </p>

                              <table className="w-full">
                                <tbody>
                                  <tr>
                                    <td width="50%" className="border-b py-2">
                                      {data?.payload?.tech_lang_keys["33"]} :
                                    </td>
                                    <td className="border-b py-2">
                                      {Number(
                                        result?.tech_filled_volume
                                      ).toFixed(3)}{" "}
                                      <span className="black-text font_unit2">
                                        (cm)<sup>3</sup>
                                      </span>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">
                                      {data?.payload?.tech_lang_keys["33"]} :
                                    </td>
                                    <td className="border-b py-2">
                                      {Number(
                                        result?.tech_filled_volume * 0.001
                                      ).toFixed(3)}{" "}
                                      <span className="black-text font_unit2">
                                        (dm)<sup>3</sup>
                                      </span>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">
                                      {data?.payload?.tech_lang_keys["33"]} :
                                    </td>
                                    <td className="border-b py-2">
                                      {Number(
                                        result?.tech_filled_volume * 0.000001
                                      ).toFixed(3)}{" "}
                                      <span className="black-text font_unit2">
                                        (m)<sup>3</sup>
                                      </span>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">
                                      {data?.payload?.tech_lang_keys["33"]} :
                                    </td>
                                    <td className="border-b py-2">
                                      {Number(
                                        result?.tech_filled_volume * 0.0610237
                                      ).toFixed(3)}{" "}
                                      <span className="black-text font_unit2">
                                        (cu in)
                                      </span>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">
                                      {data?.payload?.tech_lang_keys["33"]} :
                                    </td>
                                    <td className="border-b py-2">
                                      {Number(
                                        result?.tech_filled_volume * 0.000035315
                                      ).toFixed(3)}{" "}
                                      <span className="black-text font_unit2">
                                        (cu ft)
                                      </span>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">
                                      {data?.payload?.tech_lang_keys["33"]} :
                                    </td>
                                    <td className="border-b py-2">
                                      {Number(
                                        result?.tech_filled_volume * 0.000001308
                                      ).toFixed(3)}{" "}
                                      <span className="black-text font_unit2">
                                        (cu yd)
                                      </span>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2">
                                      {data?.payload?.tech_lang_keys["33"]} :
                                    </td>
                                    <td className="border-b py-2">
                                      {Number(
                                        result?.tech_filled_volume * 0.001
                                      ).toFixed(3)}{" "}
                                      <span className="black-text font_unit2">
                                        (liters)
                                      </span>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
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

export default AquariumCalculator;

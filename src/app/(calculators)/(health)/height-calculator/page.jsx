"use client";

import React, { useEffect, useState, useMemo } from "react";
import { usePathname } from "next/navigation";
const sonImg = "/images/son.svg";
const daughterImg = "/images/daughter.svg";
const fatherImg = "/images/father.svg";
const motherImg = "/images/mother.svg";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useHeightCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const HeightCalculator = () => {
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
    tech_test_unit: "lbs",
    tech_c_heigh_ft: "2",
    tech_c_height_in: "1",
    tech_c_unit_h: "ft/in",
    tech_calculator_select: "calculator1",
    tech_calculator_n: "calculator1",
    tech_age: "4.5",
    tech_gender: "0",
    tech_c_height_ft: "3",
    tech_c_height_cm: "180",
    tech_c_unit_h_cm: "cm",
    tech_child_unit: "ft/in",
    tech_c_weight_lbs: "38",
    tech_c_unit_w: "lbs",
    tech_c_weight_kg: "17.2",
    tech_c_unit_w_kg: "kg",
    tech_mother_1_unit: "ft/in",
    tech_m_height_ft: "5",
    tech_m_height_in: "9",
    tech_m_unit_h_m: "ft/in",
    tech_m_height_cm: "166",
    tech_m_unit_h_cm: "cm",
    tech_father_1_unit: "ft/in",
    tech_f_height_ft: "5",
    tech_f_height_in: "9",
    tech_f_unit_h: "ft/in",
    tech_f_height_cm: "180",
    tech_f_unit_h_cm: "cm",
    tech_m_unit_h: "ft/in",
    tech_height_cm: "175",
    tech_mother_entry_unit: "ft/in",
    tech_father_entry_unit: "ft/in",
    tech_submit: "calculate",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useHeightCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "tech_calculator_select") {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
        tech_calculator_n: value, // 👈 Also update hidden input value
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }

    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_calculator_select || !formData.tech_calculator_n) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_calculator_select: formData.tech_calculator_select,
        tech_calculator_n: formData.tech_calculator_n,
        tech_age: formData.tech_age,
        tech_gender: formData.tech_gender,
        tech_c_height_ft: formData.tech_c_height_ft,
        tech_c_height_in: formData.tech_c_height_in,
        tech_c_unit_h: formData.tech_c_unit_h,
        tech_c_height_cm: formData.tech_c_height_cm,
        tech_c_unit_h_cm: formData.tech_c_unit_h_cm,
        tech_child_unit: formData.tech_child_unit,
        tech_c_weight_lbs: formData.tech_c_weight_lbs,
        tech_c_unit_w: formData.tech_c_unit_w,
        tech_c_weight_kg: formData.tech_c_weight_kg,
        tech_c_unit_w_kg: formData.tech_c_unit_w_kg,
        tech_mother_1_unit: formData.tech_mother_1_unit,
        tech_m_height_ft: formData.tech_m_height_ft,
        tech_m_height_in: formData.tech_m_height_in,
        tech_m_unit_h_m: formData.tech_m_unit_h_m,
        tech_m_height_cm: formData.tech_m_height_cm,
        tech_m_unit_h_cm: formData.tech_m_unit_h_cm,
        tech_father_1_unit: formData.tech_father_1_unit,
        tech_f_height_ft: formData.tech_f_height_ft,
        tech_f_height_in: formData.tech_f_height_in,
        tech_f_unit_h: formData.tech_f_unit_h,
        tech_f_height_cm: formData.tech_f_height_cm,
        tech_f_unit_h_cm: formData.tech_f_unit_h_cm,
        tech_m_unit_h: formData.tech_m_unit_h,
        tech_height_cm: formData.tech_height_cm,
        tech_mother_entry_unit: formData.tech_mother_entry_unit,
        tech_father_entry_unit: formData.tech_father_entry_unit,
        tech_submit: formData.tech_submit,
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
      tech_test_unit: "lbs",
      tech_c_heigh_ft: "2",
      tech_c_height_in: "1",
      tech_c_unit_h: "ft/in",
      tech_calculator_select: "calculator1",
      tech_calculator_n: "calculator1",
      tech_age: "4.5",
      tech_gender: "0",
      tech_c_height_ft: "3",
      tech_c_height_cm: "180",
      tech_c_unit_h_cm: "cm",
      tech_child_unit: "ft/in",
      tech_c_weight_lbs: "38",
      tech_c_unit_w: "lbs",
      tech_c_weight_kg: "17.2",
      tech_c_unit_w_kg: "kg",
      tech_mother_1_unit: "ft/in",
      tech_m_height_ft: "5",
      tech_m_height_in: "9",
      tech_m_unit_h_m: "ft/in",
      tech_m_height_cm: "166",
      tech_m_unit_h_cm: "cm",
      tech_father_1_unit: "ft/in",
      tech_f_height_ft: "5",
      tech_f_height_in: "9",
      tech_f_unit_h: "ft/in",
      tech_f_height_cm: "180",
      tech_f_unit_h_cm: "cm",
      tech_m_unit_h: "ft/in",
      tech_height_cm: "175",
      tech_mother_entry_unit: "ft/in",
      tech_father_entry_unit: "ft/in",
      tech_submit: "calculate",
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

  // result

  const [childHeight, setChildHeight] = useState(0);
  const [chartData, setChartData] = useState([]);

  const isMobile =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  const step = isMobile ? 30 : 15;

  useEffect(() => {
    if (!result?.tech_final_ans) return;

    let child_h = 0;
    const finalAns = result?.tech_final_ans;

    const ftInMatch = finalAns.match(/(\d+)ft\s*(\d+)in/);
    const cmMatch = finalAns.match(/(\d+)\s*cm/);

    if (ftInMatch) {
      const feet = parseInt(ftInMatch[1]);
      const inches = parseInt(ftInMatch[2]);
      child_h = feet * 30.48 + inches * 2.54;
    } else if (cmMatch) {
      child_h = parseInt(cmMatch[1]);
    }

    setChildHeight(child_h);

    const maxHeight = Math.max(
      child_h,
      result?.tech_father_h ?? 0,
      result?.tech_mother_h ?? 0
    );

    const start = Math.max(0, maxHeight - 150);
    const end = maxHeight + 150;

    const range = [];
    for (let i = end; i >= start; i -= step) {
      const cmRounded = Math.round(i);
      const feet = Math.floor(cmRounded / 30.48);
      const inches = Math.round((cmRounded / 30.48 - feet) * 12 * 10) / 10;
      range.push({
        cm: cmRounded,
        ft: feet,
        inch: inches,
        isHighlight: Math.round(i) === Math.round(maxHeight),
      });
    }

    setChartData(range);
  }, [result, result]);

  //dropdown states

  //dropdown states 1
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const setUnitHandler = (unit) => {
    setFormData((prev) => ({
      ...prev,

      tech_c_unit_h: "ft/in",
      tech_child_unit: unit,
    }));
    setDropdownVisible(false);
  };
  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  //dropdown states 2
  const [dropdownVisible1, setDropdownVisible1] = useState(false);

  const setUnitHandler1 = (unit) => {
    setFormData((prev) => ({
      ...prev,
      tech_c_unit_h_cm: "cm",
      tech_child_unit: unit, // hidden input update hoga
    }));
    setDropdownVisible1(false);
  };
  const toggleDropdown1 = () => {
    setDropdownVisible1(!dropdownVisible1);
  };

  //dropdown states 3
  const [dropdownVisible2, setDropdownVisible2] = useState(false);

  const setUnitHandler2 = (unit) => {
    setFormData((prev) => ({
      ...prev,
      tech_c_unit_w: "kg",
      tech_test_unit: unit, // hidden input update hoga
    }));
    setDropdownVisible2(false);
  };
  const toggleDropdown2 = () => {
    setDropdownVisible2(!dropdownVisible2);
  };

  //dropdown states 4
  const [dropdownVisible3, setDropdownVisible3] = useState(false);

  const setUnitHandler3 = (unit) => {
    setFormData((prev) => ({
      ...prev,
      tech_c_unit_w_kg: "lbs",
      tech_test_unit: unit, // hidden input update hoga
    }));
    setDropdownVisible3(false);
  };
  const toggleDropdown3 = () => {
    setDropdownVisible3(!dropdownVisible3);
  };

  //dropdown states 5
  const [dropdownVisible4, setDropdownVisible4] = useState(false);
  const setUnitHandler4 = (unit) => {
    setFormData((prev) => ({
      ...prev,

      tech_c_unit_h: "ft/in",
      tech_mother_1_unit: unit,
    }));
    setDropdownVisible4(false);
  };
  const toggleDropdown4 = () => {
    setDropdownVisible4(!dropdownVisible4);
  };

  //dropdown states 2
  const [dropdownVisible5, setDropdownVisible5] = useState(false);

  const setUnitHandler5 = (unit) => {
    setFormData((prev) => ({
      ...prev,
      tech_m_unit_h_cm: "cm",
      tech_mother_1_unit: unit, // hidden input update hoga
    }));
    setDropdownVisible5(false);
  };
  const toggleDropdown5 = () => {
    setDropdownVisible5(!dropdownVisible5);
  };

  //dropdown states 5
  const [dropdownVisible6, setDropdownVisible6] = useState(false);
  const setUnitHandler6 = (unit) => {
    setFormData((prev) => ({
      ...prev,

      tech_f_unit_h: "ft/in",
      tech_father_1_unit: unit,
    }));
    setDropdownVisible6(false);
  };
  const toggleDropdown6 = () => {
    setDropdownVisible6(!dropdownVisible6);
  };

  //dropdown states 2
  const [dropdownVisible7, setDropdownVisible7] = useState(false);

  const setUnitHandler7 = (unit) => {
    setFormData((prev) => ({
      ...prev,
      tech_f_unit_h: "cm",
      tech_father_1_unit: unit, // hidden input update hoga
    }));
    setDropdownVisible7(false);
  };
  const toggleDropdown7 = () => {
    setDropdownVisible7(!dropdownVisible7);
  };

  const girlsHeight = result?.tech_girls_height;
  const boysHeight = result?.tech_boys_height;
  const motherHeight = result?.tech_mother_height;
  const fatherHeight = result?.tech_father_height;

  const maxHeightCM = Math.max(
    girlsHeight,
    boysHeight,
    motherHeight,
    fatherHeight
  );
  const range = 150;
  const steps = isMobile ? 30 : 15;
  const start = Math.max(0, maxHeightCM - range);
  const end = maxHeightCM + range;

  // Generate chart data
  const chartDatas = useMemo(() => {
    const lines = [];
    let skip = 0;

    for (let i = end; i >= start; i -= steps) {
      if (skip < 2) {
        skip++;
        continue;
      }

      const cmRounded = Math.round(i);
      const feet = Math.floor(cmRounded / 30.48);
      const inches = +((cmRounded / 30.48 - feet) * 12).toFixed(1);

      lines.push({
        cm: cmRounded,
        ft_in: `${feet}' ${inches}''`,
        highlight: Math.round(maxHeightCM) === cmRounded,
      });
    }

    return lines;
  }, [start, end, step, maxHeightCM]);

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

          <div className="lg:w-[70%] md:w-[100%] w-full mx-auto ">
            <div className="grid grid-cols-12   gap-2 md:gap-4 lg:gap-4">
              <div className="col-span-12  px-2">
                <div className=" velocitytab relative">
                  <label htmlFor="tech_calculator_select" className="label">
                    Select Method
                  </label>
                  <div className="mt-2">
                    <select
                      className="input"
                      aria-label="select"
                      name="tech_calculator_select"
                      id="tech_calculator_select"
                      value={formData.tech_calculator_select}
                      onChange={handleChange}
                    >
                      <option value="calculator1">
                        {" "}
                        The Khamis-Roche Height Predictor
                      </option>
                      <option value="calculator2">
                        {data?.payload?.tech_lang_keys["3"]}{" "}
                      </option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:w-[70%] md:w-[100%] w-full mx-auto ">
            <div className="grid grid-cols-12   gap-2 md:gap-4 lg:gap-4">
              <input
                type="hidden"
                step="any"
                name="tech_calculator_n"
                id="tech_calculator_n"
                className="input my-2"
                aria-label="input"
                placeholder="00"
                value={formData.tech_calculator_n}
                onChange={handleChange}
              />
              {formData.tech_calculator_select == "calculator1" && (
                <>
                  <div className="col-span-6 calculators calculator1 ">
                    <label htmlFor="tech_age" className="label">
                      {data?.payload?.tech_lang_keys["9"]}:
                    </label>
                    <div className="mt-2">
                      <select
                        className="input"
                        aria-label="select"
                        name="tech_age"
                        id="tech_age"
                        value={formData.tech_age}
                        onChange={handleChange}
                      >
                        {[
                          "4",
                          "4.5",
                          "5",
                          "5.5",
                          "6",
                          "6.5",
                          "7",
                          "7.5",
                          "8",
                          "8.5",
                          "9",
                          "9.5",
                          "10",
                          "10.5",
                          "11",
                          "11.5",
                          "12",
                          "12.5",
                          "13",
                          "13.5",
                          "14",
                          "14.5",
                          "15",
                          "15.5",
                          "16",
                          "16.5",
                          "17",
                          "17.5",
                        ].map((value, index) => (
                          <option key={index} value={value}>
                            {value}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="col-span-6 px-2">
                    <label htmlFor="tech_gender" className="label">
                      {data?.payload?.tech_lang_keys["6"]}:
                    </label>
                    <div className="mt-2">
                      <select
                        className="input"
                        aria-label="select"
                        name="tech_gender"
                        id="tech_gender"
                        value={formData.tech_gender}
                        onChange={handleChange}
                      >
                        <option value="0">
                          {data?.payload?.tech_lang_keys["7"]}
                        </option>
                        <option value="1">
                          {data?.payload?.tech_lang_keys["8"]}{" "}
                        </option>
                      </select>
                    </div>
                  </div>

                  {/* Child's Height */}
                  <input
                    type="hidden"
                    step="any"
                    name="tech_child_unit"
                    id="tech_child_unit"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_child_unit}
                    onChange={handleChange}
                  />
                  {/* 1 */}
                  {formData.tech_child_unit == "ft/in" && (
                    <>
                      <div className="md:col-span-6 col-span-12 ft_in_child">
                        <div className="grid grid-cols-12 gap-3">
                          <div className="col-span-6 ft_in_child">
                            <label htmlFor="tech_c_heigh_ft" className="label">
                              {data?.payload?.tech_lang_keys["10"]}
                            </label>
                            <input
                              type="number"
                              step="any"
                              name="tech_c_heigh_ft"
                              id="tech_c_heigh_ft"
                              className="input my-2"
                              aria-label="input"
                              value={formData.tech_c_heigh_ft}
                              onChange={handleChange}
                            />
                          </div>
                          <div className="col-span-6 ft_in_child">
                            <label htmlFor="tech_c_height_in" className="label">
                              &nbsp;
                            </label>
                            <div className="relative w-full ">
                              <input
                                type="number"
                                name="tech_c_height_in"
                                step="any"
                                className="mt-1 input"
                                value={formData.tech_c_height_in}
                                placeholder="00"
                                onChange={handleChange}
                              />
                              <label
                                className="absolute cursor-pointer text-sm underline right-6 top-4"
                                onClick={toggleDropdown}
                              >
                                {formData.tech_c_unit_h} ▾
                              </label>
                              {dropdownVisible && (
                                <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                                  {[
                                    { label: "cm", value: "cm" },
                                    { label: "ft/in", value: "ft/in" },
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
                        </div>
                      </div>
                    </>
                  )}
                  {formData.tech_child_unit == "cm" && (
                    <>
                      <div className="md:col-span-6 col-span-12 h_cm_child  height-cm">
                        <label htmlFor="tech_c_height_cm" className="label">
                          {data?.payload?.tech_lang_keys["10"]} (cm):
                        </label>
                        <div className="relative w-full ">
                          <input
                            type="number"
                            name="tech_c_height_cm"
                            step="any"
                            className="mt-1 input"
                            value={formData.tech_c_height_cm}
                            placeholder="00"
                            onChange={handleChange}
                          />
                          <label
                            className="absolute cursor-pointer text-sm underline right-6 top-4"
                            onClick={toggleDropdown1}
                          >
                            {formData.tech_c_unit_h_cm} ▾
                          </label>
                          {dropdownVisible1 && (
                            <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                              {[
                                { label: "cm", value: "cm" },
                                { label: "ft/in", value: "ft/in" },
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
                  {/* Child's Height (cm): */}

                  <input
                    type="hidden"
                    step="any"
                    name="tech_test_unit"
                    id="tech_test_unit"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_test_unit}
                    onChange={handleChange}
                  />
                  {formData.tech_test_unit == "lbs" && (
                    <>
                      <div className="md:col-span-6 col-span-12 h_cm_child  height-cm">
                        <label htmlFor="tech_c_weight_lbs" className="label">
                          {data?.payload?.tech_lang_keys["11"]}:
                        </label>
                        <div className="relative w-full ">
                          <input
                            type="number"
                            name="tech_c_weight_lbs"
                            step="any"
                            className="mt-1 input"
                            value={formData.tech_c_weight_lbs}
                            placeholder="00"
                            onChange={handleChange}
                          />
                          <label
                            className="absolute cursor-pointer text-sm underline right-6 top-4"
                            onClick={toggleDropdown2}
                          >
                            {formData.tech_c_unit_w} ▾
                          </label>
                          {dropdownVisible2 && (
                            <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                              {[
                                { label: "kg", value: "kg" },
                                { label: "lbs", value: "lbs" },
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
                  {formData.tech_test_unit == "kg" && (
                    <>
                      <div className="md:col-span-6 col-span-12 h_cm_child  height-cm">
                        <label htmlFor="tech_c_weight_kg" className="label">
                          {data?.payload?.tech_lang_keys["11"]} (kg):
                        </label>
                        <div className="relative w-full ">
                          <input
                            type="number"
                            name="tech_c_weight_kg"
                            step="any"
                            className="mt-1 input"
                            value={formData.tech_c_weight_kg}
                            placeholder="00"
                            onChange={handleChange}
                          />
                          <label
                            className="absolute cursor-pointer text-sm underline right-6 top-4"
                            onClick={toggleDropdown3}
                          >
                            {formData.tech_c_unit_w_kg} ▾
                          </label>
                          {dropdownVisible3 && (
                            <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                              {[
                                { label: "kg", value: "kg" },
                                { label: "lbs", value: "lbs" },
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
                </>
              )}

              {(formData.tech_calculator_select == "calculator1" ||
                formData.tech_calculator_select == "calculator2") && (
                <>
                  {/* Mother's Height: */}
                  <input
                    type="hidden"
                    step="any"
                    name="tech_mother_1_unit"
                    id="tech_mother_1_unit"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_mother_1_unit}
                    onChange={handleChange}
                  />
                  {/* 2 */}
                  {formData.tech_mother_1_unit == "ft/in" && (
                    <>
                      <div className="md:col-span-6 col-span-12 ft_in_child">
                        <div className="grid grid-cols-12 gap-3">
                          <div className="col-span-6 ft_in_child">
                            <label htmlFor="tech_m_height_ft" className="label">
                              {data?.payload?.tech_lang_keys["4"]}
                            </label>
                            <input
                              type="number"
                              step="any"
                              name="tech_m_height_ft"
                              id="tech_m_height_ft"
                              className="input my-2"
                              aria-label="input"
                              value={formData.tech_m_height_ft}
                              onChange={handleChange}
                            />
                          </div>
                          <div className="col-span-6 ft_in_child">
                            <label htmlFor="tech_m_height_in" className="label">
                              &nbsp;
                            </label>
                            <div className="relative w-full ">
                              <input
                                type="number"
                                name="tech_m_height_in"
                                step="any"
                                className="mt-1 input"
                                value={formData.tech_m_height_in}
                                placeholder="00"
                                onChange={handleChange}
                              />
                              <label
                                className="absolute cursor-pointer text-sm underline right-6 top-4"
                                onClick={toggleDropdown4}
                              >
                                {formData.tech_c_unit_h} ▾
                              </label>
                              {dropdownVisible4 && (
                                <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                                  {[
                                    { label: "cm", value: "cm" },
                                    { label: "ft/in", value: "ft/in" },
                                  ].map((unit, index) => (
                                    <p
                                      key={index}
                                      className="p-2 hover:bg-gray-100 cursor-pointer"
                                      onClick={() =>
                                        setUnitHandler4(unit.value)
                                      }
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
                    </>
                  )}
                  {formData.tech_mother_1_unit == "cm" && (
                    <>
                      <div className="md:col-span-6 col-span-12 h_cm_child  height-cm">
                        <label htmlFor="tech_m_height_cm" className="label">
                          {data?.payload?.tech_lang_keys["4"]} (cm):
                        </label>
                        <div className="relative w-full ">
                          <input
                            type="number"
                            name="tech_m_height_cm"
                            step="any"
                            className="mt-1 input"
                            value={formData.tech_m_height_cm}
                            placeholder="00"
                            onChange={handleChange}
                          />
                          <label
                            className="absolute cursor-pointer text-sm underline right-6 top-4"
                            onClick={toggleDropdown5}
                          >
                            {formData.tech_m_unit_h_cm} ▾
                          </label>
                          {dropdownVisible5 && (
                            <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                              {[
                                { label: "cm", value: "cm" },
                                { label: "ft/in", value: "ft/in" },
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
                  {/* Mother's Height: (cm): */}

                  {/* Father's Height: */}
                  <input
                    type="hidden"
                    step="any"
                    name="tech_father_1_unit"
                    id="tech_father_1_unit"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_father_1_unit}
                    onChange={handleChange}
                  />
                  {/* 2 */}
                  {formData.tech_father_1_unit == "ft/in" && (
                    <>
                      <div className="md:col-span-6 col-span-12 ft_in_child">
                        <div className="grid grid-cols-12 gap-3">
                          <div className="col-span-6 ft_in_child">
                            <label htmlFor="tech_f_height_ft" className="label">
                              {data?.payload?.tech_lang_keys["5"]}
                            </label>
                            <input
                              type="number"
                              step="any"
                              name="tech_f_height_ft"
                              id="tech_f_height_ft"
                              className="input my-2"
                              aria-label="input"
                              value={formData.tech_f_height_ft}
                              onChange={handleChange}
                            />
                          </div>
                          <div className="col-span-6 ft_in_child">
                            <label htmlFor="tech_f_height_in" className="label">
                              &nbsp;
                            </label>
                            <div className="relative w-full ">
                              <input
                                type="number"
                                name="tech_f_height_in"
                                step="any"
                                className="mt-1 input"
                                value={formData.tech_f_height_in}
                                placeholder="00"
                                onChange={handleChange}
                              />
                              <label
                                className="absolute cursor-pointer text-sm underline right-6 top-4"
                                onClick={toggleDropdown6}
                              >
                                {formData.tech_f_unit_h} ▾
                              </label>
                              {dropdownVisible6 && (
                                <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                                  {[
                                    { label: "cm", value: "cm" },
                                    { label: "ft/in", value: "ft/in" },
                                  ].map((unit, index) => (
                                    <p
                                      key={index}
                                      className="p-2 hover:bg-gray-100 cursor-pointer"
                                      onClick={() =>
                                        setUnitHandler6(unit.value)
                                      }
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
                    </>
                  )}
                  {formData.tech_father_1_unit == "cm" && (
                    <>
                      <div className="md:col-span-6 col-span-12 h_cm_child  height-cm">
                        <label htmlFor="tech_f_height_cm" className="label">
                          {data?.payload?.tech_lang_keys["5"]} (cm):
                        </label>
                        <div className="relative w-full ">
                          <input
                            type="number"
                            name="tech_f_height_cm"
                            step="any"
                            className="mt-1 input"
                            value={formData.tech_f_height_cm}
                            placeholder="00"
                            onChange={handleChange}
                          />
                          <label
                            className="absolute cursor-pointer text-sm underline right-6 top-4"
                            onClick={toggleDropdown7}
                          >
                            {formData.tech_f_unit_h_cm} ▾
                          </label>
                          {dropdownVisible7 && (
                            <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                              {[
                                { label: "cm", value: "cm" },
                                { label: "ft/in", value: "ft/in" },
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
                  {/* Father's Height:: (cm): */}
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
              <div className="w-full result mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="container">
                    {result?.tech_final_ans ? (
                      <>
                        <div className="bg-sky bordered rounded-lg p-3 m-5 md:text-[25px]  text-center">
                          <span className="">Estimated Height:</span>
                          <strong className={`text-[#ff4500c4]  ms-2`}>
                            {result?.tech_final_ans}
                          </strong>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="w-full mt-5">
                          <div className="flex flex-wrap gap-4">
                            <div className="flex-1 min-w-[280px] bg-sky bordered rounded-lg p-4 flex items-center">
                              <strong className="me-2">
                                {" "}
                                {data?.payload?.tech_lang_keys["14"]} =
                              </strong>
                              <strong className="text-orange-600 text-2xl ml-2">
                                {" "}
                                {result?.tech_final_ans_boy}
                              </strong>
                            </div>
                            <div className="flex-1 min-w-[280px] bg-sky bordered rounded-lg p-4 flex items-center">
                              <strong className="me-2">
                                {" "}
                                {data?.payload?.tech_lang_keys["13"]} =
                              </strong>
                              <strong className="text-orange-600 text-2xl ml-2">
                                {" "}
                                {result?.tech_final_ans_girl}
                              </strong>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                    {result?.tech_final_ans ? (
                      <>
                        <div className="mt-4 relative">
                          <div className="mt-4 relative">
                            <strong className="text-lg text-blue">
                              Height comparison chart:
                            </strong>
                            <div
                              className="overflow-auto mt-3 relative"
                              style={{ minHeight: "200px" }}
                            >
                              <div className="min-w-[300px]">
                                <div className="flex justify-between font-bold border-b pb-2">
                                  <span>cm</span>
                                  <span>ft/in</span>
                                </div>

                                {chartData.map(
                                  (item, index) =>
                                    index > 1 && (
                                      <div
                                        key={index}
                                        className={`flex justify-between py-1 chart-line ${
                                          item.isHighlight
                                            ? "bg-yellow-200 font-bold"
                                            : ""
                                        }`}
                                      >
                                        <span>{item.cm}</span>
                                        <span>
                                          {item.ft}' {item.inch}''
                                        </span>
                                      </div>
                                    )
                                )}

                                <div className="absolute bottom-0 left-0 right-0 flex space-x-5 md:space-x-10 justify-center items-end h-32">
                                  {result?.tech_gender == "0" ? (
                                    <>
                                      <div className="flex flex-col items-center">
                                        <p className="mb-1 font-semibold bg-sky-200 px-5 py-1 rounded">
                                          Boy
                                        </p>
                                        <img
                                          src="/images/height/son.svg"
                                          alt="Son"
                                          className="w-16"
                                        />
                                      </div>
                                      <div className="flex flex-col items-center">
                                        <p className="mb-1 font-semibold bg-sky-200 px-5 py-1 rounded">
                                          Father
                                        </p>
                                        <img
                                          src="/images/height/father.svg"
                                          alt="Father"
                                          className="w-16"
                                        />
                                      </div>
                                      <div className="flex flex-col items-center">
                                        <p className="mb-1 font-semibold bg-sky-200 px-5 py-1 rounded">
                                          Mother
                                        </p>
                                        <img
                                          src="/images/height/mother.svg"
                                          alt="Mother"
                                          className="w-16"
                                        />
                                      </div>
                                    </>
                                  ) : (
                                    <>
                                      <div className="flex flex-col items-center">
                                        <p className="mb-1 font-semibold bg-pink-200 px-5 py-1 rounded">
                                          Girl
                                        </p>
                                        <img
                                          src="/images/height/daughter.svg"
                                          alt="Daughter"
                                          className="w-16"
                                        />
                                      </div>
                                      <div className="flex flex-col items-center">
                                        <p className="mb-1 font-semibold bg-sky-200 px-5 py-1 rounded">
                                          Father
                                        </p>
                                        <img
                                          src="/images/height/father.svg"
                                          alt="Father"
                                          className="w-16"
                                        />
                                      </div>
                                      <div className="flex flex-col items-center">
                                        <p className="mb-1 font-semibold bg-sky-200 px-5 py-1 rounded">
                                          Mother
                                        </p>
                                        <img
                                          src="/images/height/mother.svg"
                                          alt="Mother"
                                          className="w-16"
                                        />
                                      </div>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="w-full mt-4">
                        <strong className="text-blue-600 text-lg">
                          Height Comparison Chart:
                        </strong>

                        <div className="overflow-x-auto mt-2 scroll-wrapper">
                          <div className="chart-container-2 relative">
                            {/* Header */}
                            <div className="flex justify-between font-semibold px-4 py-2 bg-gray-100 border-b">
                              <strong className="cm">cm</strong>
                              <strong className="ft-in">ft/in</strong>
                            </div>

                            {/* Chart lines */}
                            {chartDatas.map((item, index) => (
                              <div
                                key={index}
                                className={`flex justify-between px-4 py-1 text-sm ${
                                  item.highlight
                                    ? "bg-yellow-100 font-bold"
                                    : ""
                                }`}
                              >
                                <span className="cm">{item.cm}</span>
                                <span className="ft-in">{item.ft_in}</span>
                              </div>
                            ))}

                            {/* Loader */}

                            {/* Static Images */}
                            <div className="absolute bottom-0 left-0 right-0 flex space-x-1 md:space-x-10 justify-center items-end h-32">
                              <div className="flex flex-col items-center">
                                <p className="mb-1 font-semibold bg-pink-200 px-5 py-1 rounded">
                                  Girl
                                </p>
                                <img
                                  src="/images/height/daughter.svg"
                                  alt="Daughter"
                                  className="w-[50px] md:w-20"
                                />
                              </div>
                              <div className="flex flex-col items-center">
                                <p className="mb-1 font-semibold bg-sky-200 px-5 py-1 rounded">
                                  Boy
                                </p>
                                <img
                                  src="/images/height/son.svg"
                                  alt="Son"
                                  className="w-[50px] md:w-20"
                                />
                              </div>
                              <div className="flex flex-col items-center">
                                <p className="mb-1 font-semibold bg-sky-200 px-5 py-1 rounded">
                                  Father
                                </p>
                                <img
                                  src="/images/height/father.svg"
                                  alt="Father"
                                  className="w-[50px] md:w-20"
                                />
                              </div>
                              <div className="flex flex-col items-center">
                                <p className="mb-1 font-semibold bg-sky-200 px-5 py-1 rounded">
                                  Mother
                                </p>
                                <img
                                  src="/images/height/mother.svg"
                                  alt="Mother"
                                  className="w-[50px] md:w-20"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
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

export default HeightCalculator;

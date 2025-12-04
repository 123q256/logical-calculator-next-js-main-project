"use client";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { toast } from "react-toastify";
import Calculator from "../../Calculator";

// Katex imports
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";
import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";
import { useCalorimetryCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Button from "../../../../components/Calculator/Button";
import ResetButton from "../../../../components/Calculator/ResetButton";

const CalorimetryCalculator = () => {
  const pathname = usePathname();
  const parts = pathname.split("/").filter(Boolean);
  let url = parts.length === 1 ? parts[0] : parts[0] + "/" + parts[1];

  // Fetch calculator details
  const [getSingleCalculatorDetails, { data, isLoading: detailsLoading }] =
    useGetSingleCalculatorDetailsMutation();
  const [
    calorimetryCalculator,
    { isLoading: calculateLoading, isError, error: calculateError },
  ] = useCalorimetryCalculatorMutation();

  useEffect(() => {
    getSingleCalculatorDetails({ tech_calculator_link: url });
  }, [url]);

  // Form state with all fields
  const [formData, setFormData] = useState({
    tech_state_change: "a chemical reaction in a cofee cup calorimeter",
    tech_obj_units: "2",
    tech_state: "No",
    tech_formula: "Heat Energy",
    tech_formula_2obj: "m1",
    tech_formula_3obj: "m1",
    tech_type: "temp_change",
    tech_two_time: "m1_two",
    tech_three_time: "m1",
    tech_mass: "10",
    tech_m_units: "g",
    tech_heat_capacity: "25",
    tech_s_heat_units: "J/(g.K)",
    tech_temp_change: "20",
    tech_t_c_units: "K",
    tech_energy: "20",
    tech_units: "J",
    tech_in_temp: "20",
    tech_i_t_units: "K",
    tech_s_fin_temp: "30",
    tech_S_f_t_units: "K",
    tech_subtance_mass: "",
    tech_s_m_units: "g",
    tech_molar_mass: "",
    tech_mass_1: "10",
    tech_m_units1: "g",
    tech_mass_2: "20",
    tech_m_units2: "g",
    tech_heat_capacity_1: "25",
    tech_s_heat_units1: "J/(g.K)",
    tech_heat_capacity_2: "50",
    tech_s_heat_units2: "J/(g.K)",
    tech_in_temp_1: "20",
    tech_i_t_units1: "K",
    tech_in_temp_2: "20",
    tech_i_t_units2: "K",
    tech_fin_temp_1: "30",
    tech_f_t_units1: "K",
    tech_fin_temp_2: "30",
    tech_f_t_units2: "K",
    tech_fin_temp: "50",
    tech_f_t_units: "K",
    tech_t_fusion: "40",
    tech_t_units: "K",
    tech_h_fusion: "30",
    tech_h_fusion_unit: "J/(g.K)",
    tech_mass_1_3: "10",
    tech_m_units1_3: "g",
    tech_mass_2_3: "10",
    tech_m_units2_3: "g",
    tech_mass_3_3: "40",
    tech_m_units3_3: "g",
    tech_heat_capacity_1_3: "25",
    tech_s_heat_units1_3: "J/(g.K)",
    tech_heat_capacity_2_3: "50",
    tech_s_heat_units2_3: "J/(g.K)",
    tech_heat_capacity_3_3: "70",
    tech_s_heat_units3_3: "J/(g.K)",
    tech_in_temp_1_3: "60",
    tech_i_t_units1_3: "K",
    tech_in_temp_2_3: "40",
    tech_i_t_units2_3: "K",
    tech_in_temp_3_3: "20",
    tech_i_t_units3_3: "K",
    tech_fin_temp_1_3: "80",
    tech_f_t_units1_3: "K",
    tech_fin_temp_2_3: "10",
    tech_f_t_units2_3: "K",
    tech_fin_temp_3_3: "25",
    tech_f_t_units3_3: "K",
    tech_fin_temp_3: "50",
    tech_f_t_units_3: "K",
    tech_t_fusion_3: "30",
    tech_t_units_3: "K",
    tech_h_fusion_3: "30",
    tech_h_units3: "J/(g.K)",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");
  const [visibility, setVisibility] = useState({
    single_object: true,
    fimg3: false,
    state: false,
    obj_1: false,
    obj_3: false,
    two_time: false,
    f_temp_two: false,
    t_fusion: false,
    h_fusion: false,
    mass: true,
    s_h_c: true,
    temp_change: true,
    i_temp: false,
    f_temp: false,
    en: false,
    s_m: false,
    m_m: false,
    by: true,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setResult(null);

    // Handle conditional visibility
    if (name === "tech_state_change") {
      if (value === "heat exchange between several objects") {
        setVisibility((prev) => ({
          ...prev,
          single_object: false,
          fimg3: true,
          state: true,
          obj_1: true,
        }));
      } else {
        setVisibility((prev) => ({
          ...prev,
          fimg3: false,
          state: false,
          obj_1: false,
          obj_3: false,
          single_object: true,
        }));
      }
    } else if (name === "tech_obj_units") {
      setVisibility((prev) => ({
        ...prev,
        obj_1: value === "2",
        obj_3: value === "3",
      }));
    } else if (name === "tech_state") {
      if (value === "No") {
        setVisibility((prev) => ({
          ...prev,
          two_time: false,
          f_temp_two: false,
          t_fusion: false,
          h_fusion: false,
        }));
      } else {
        setVisibility((prev) => ({
          ...prev,
          two_time: true,
          f_temp_two: true,
          t_fusion: true,
          h_fusion: true,
        }));
      }
    } else if (name === "tech_formula") {
      handleFormulaChange(value);
    } else if (name === "tech_type") {
      setVisibility((prev) => ({
        ...prev,
        temp_change: value === "temp_change",
        i_temp: value === "i_f_temp",
        f_temp: value === "i_f_temp",
      }));
    }
  };

  const handleFormulaChange = (formula) => {
    const updates = { by: true };

    switch (formula) {
      case "Heat Energy":
        Object.assign(updates, {
          s_h_c: true,
          mass: true,
          temp_change: true,
          en: false,
          s_m: false,
          m_m: false,
        });
        break;
      case "Specific Heat":
        Object.assign(updates, {
          en: true,
          mass: true,
          temp_change: true,
          s_h_c: false,
          s_m: false,
          m_m: false,
        });
        break;
      case "Mass":
        Object.assign(updates, {
          en: true,
          s_h_c: true,
          temp_change: true,
          mass: false,
          s_m: false,
          m_m: false,
        });
        break;
      case "Enthalpy_change":
        Object.assign(updates, {
          s_m: true,
          m_m: true,
          en: true,
          mass: false,
          temp_change: false,
          s_h_c: false,
          i_temp: false,
          f_temp: false,
          by: false,
        });
        break;
      case "Initial_Temperature":
        Object.assign(updates, {
          mass: true,
          en: true,
          s_h_c: true,
          f_temp: true,
          temp_change: false,
          i_temp: false,
          by: false,
        });
        break;
      case "Final_Temperature":
        Object.assign(updates, {
          mass: true,
          en: true,
          s_h_c: true,
          i_temp: true,
          temp_change: false,
          f_temp: false,
          by: false,
        });
        break;
      case "Time_of_isolation":
        Object.assign(updates, {
          en: true,
          mass: true,
          s_h_c: true,
          temp_change: true,
        });
        break;
    }

    setVisibility((prev) => ({ ...prev, ...updates }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    // Basic validation
    if (visibility.mass && !formData.tech_mass) {
      setFormError("Please fill in all required fields");
      return;
    }

    try {
      const response = await calorimetryCalculator(formData).unwrap();
      setResult(response);
      toast.success("Calculated Successfully");
    } catch (err) {
      setFormError(err.data.error);
      toast.error(err.data.error);
    }
  };

  const handleReset = () => {
    setFormData({
      tech_state_change: "a chemical reaction in a cofee cup calorimeter",
      tech_obj_units: "2",
      tech_state: "No",
      tech_formula: "Heat Energy",
      tech_formula_2obj: "m1",
      tech_formula_3obj: "m1",
      tech_type: "temp_change",
      tech_two_time: "m1_two",
      tech_three_time: "m1",
      tech_mass: "10",
      tech_m_units: "g",
      tech_heat_capacity: "25",
      tech_s_heat_units: "J/(g.K)",
      tech_temp_change: "20",
      tech_t_c_units: "K",
      tech_energy: "20",
      tech_units: "J",
      tech_in_temp: "20",
      tech_i_t_units: "K",
      tech_s_fin_temp: "30",
      tech_S_f_t_units: "K",
      tech_subtance_mass: "",
      tech_s_m_units: "g",
      tech_molar_mass: "",
      tech_mass_1: "10",
      tech_m_units1: "g",
      tech_mass_2: "20",
      tech_m_units2: "g",
      tech_heat_capacity_1: "25",
      tech_s_heat_units1: "J/(g.K)",
      tech_heat_capacity_2: "50",
      tech_s_heat_units2: "J/(g.K)",
      tech_in_temp_1: "20",
      tech_i_t_units1: "K",
      tech_in_temp_2: "20",
      tech_i_t_units2: "K",
      tech_fin_temp_1: "30",
      tech_f_t_units1: "K",
      tech_fin_temp_2: "30",
      tech_f_t_units2: "K",
      tech_fin_temp: "50",
      tech_f_t_units: "K",
      tech_t_fusion: "40",
      tech_t_units: "K",
      tech_h_fusion: "30",
      tech_h_fusion_unit: "J/(g.K)",
      tech_mass_1_3: "10",
      tech_m_units1_3: "g",
      tech_mass_2_3: "10",
      tech_m_units2_3: "g",
      tech_mass_3_3: "40",
      tech_m_units3_3: "g",
      tech_heat_capacity_1_3: "25",
      tech_s_heat_units1_3: "J/(g.K)",
      tech_heat_capacity_2_3: "50",
      tech_s_heat_units2_3: "J/(g.K)",
      tech_heat_capacity_3_3: "70",
      tech_s_heat_units3_3: "J/(g.K)",
      tech_in_temp_1_3: "60",
      tech_i_t_units1_3: "K",
      tech_in_temp_2_3: "40",
      tech_i_t_units2_3: "K",
      tech_in_temp_3_3: "20",
      tech_i_t_units3_3: "K",
      tech_fin_temp_1_3: "80",
      tech_f_t_units1_3: "K",
      tech_fin_temp_2_3: "10",
      tech_f_t_units2_3: "K",
      tech_fin_temp_3_3: "25",
      tech_f_t_units3_3: "K",
      tech_fin_temp_3: "50",
      tech_f_t_units_3: "K",
      tech_t_fusion_3: "30",
      tech_t_units_3: "K",
      tech_h_fusion_3: "30",
      tech_h_units3: "J/(g.K)",
    });
    setResult(null);
    setFormError("");
    setVisibility({
      single_object: true,
      fimg3: false,
      state: false,
      obj_1: false,
      obj_3: false,
      two_time: false,
      f_temp_two: false,
      t_fusion: false,
      h_fusion: false,
      mass: true,
      s_h_c: true,
      temp_change: true,
      i_temp: false,
      f_temp: false,
      en: false,
      s_m: false,
      m_m: false,
      by: true,
    });
  };

  // Render input field helper
  const renderInput = (
    name,
    label,
    type = "number",
    cols = 3,
    placeholder = ""
  ) => (
    <div className={`col-span-${cols}`}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        type={type}
        name={name}
        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
        placeholder={placeholder}
        value={formData[name] || ""}
        onChange={handleChange}
      />
    </div>
  );

  // Render select field helper
  const renderSelect = (name, label, options, cols = 3) => (
    <div className={`col-span-${cols}`}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <select
        name={name}
        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
        value={formData[name] || ""}
        onChange={handleChange}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <Calculator
      isLoading={detailsLoading}
      data={data}
      links={[
        { name: "Home", path: "/" },
        {
          name: data?.payload?.tech_cal_cat,
          path: "/" + data?.payload?.tech_cal_cat,
        },
        {
          name: data?.payload?.tech_calculator_title,
          path: pathname,
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
          <div className="lg:w-[80%] md:w-[80%] w-full mx-auto ">
            <div className="grid grid-cols-12 gap-4">
              {/* State Change Selection */}
              <div className="col-span-12">
                <label className="block text-sm font-medium text-gray-700">
                  Select Calculation Type:
                </label>
                <select
                  name="tech_state_change"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  value={formData.tech_state_change}
                  onChange={handleChange}
                >
                  <option value="a chemical reaction in a cofee cup calorimeter">
                    Chemical reaction in coffee cup calorimeter
                  </option>
                  <option value="heat exchange between several objects">
                    Heat exchange between several objects
                  </option>
                </select>
              </div>

              {/* Number of Objects */}
              {visibility.fimg3 && (
                <div className="col-span-12">
                  <label className="block text-sm font-medium text-gray-700">
                    Number of Objects:
                  </label>
                  <select
                    name="tech_obj_units"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    value={formData.tech_obj_units}
                    onChange={handleChange}
                  >
                    <option value="2">2 Objects</option>
                    <option value="3">3 Objects</option>
                  </select>
                </div>
              )}

              {/* State Change */}
              {visibility.state && (
                <div className="col-span-12">
                  <label className="block text-sm font-medium text-gray-700">
                    Object State Change:
                  </label>
                  <select
                    name="tech_state"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    value={formData.tech_state}
                    onChange={handleChange}
                  >
                    <option value="No">No</option>
                    <option value="Yes,two times">Yes, two times</option>
                  </select>
                </div>
              )}

              {/* Single Object Calculations */}
              {visibility.single_object && (
                <div className="col-span-12  space-y-6 p-4 ">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Single Object Calculation
                  </h3>

                  {/* Formula Selection */}
                  <div className="col-span-12">
                    <label className="block text-sm font-medium text-gray-700">
                      Calculate:
                    </label>
                    <select
                      name="tech_formula"
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      value={formData.tech_formula}
                      onChange={handleChange}
                    >
                      <option value="Heat Energy">Heat Energy</option>
                      <option value="Specific Heat">Specific Heat</option>
                      <option value="Mass">Mass</option>
                      <option value="Initial_Temperature">
                        Initial Temperature
                      </option>
                      <option value="Final_Temperature">
                        Final Temperature
                      </option>
                      <option value="Time_of_isolation">
                        Time of Isolation
                      </option>
                      <option value="Enthalpy_change">Enthalpy Change</option>
                    </select>
                  </div>

                  {/* Temperature Type Selection */}
                  {visibility.by && (
                    <div className="col-span-12">
                      <span className="block text-sm font-medium text-gray-700">
                        By:
                      </span>
                      <div className="flex flex-wrap gap-4">
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="radio"
                            name="tech_type"
                            value="temp_change"
                            checked={formData.tech_type === "temp_change"}
                            onChange={handleChange}
                            className="mr-2 h-4 w-4 text-blue-600"
                          />
                          <span className="text-sm">
                            Temperature Change (ΔT)
                          </span>
                        </label>
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="radio"
                            name="tech_type"
                            value="i_f_temp"
                            checked={formData.tech_type === "i_f_temp"}
                            onChange={handleChange}
                            className="mr-2 h-4 w-4 text-blue-600"
                          />
                          <span className="text-sm">
                            Initial & Final Temperature
                          </span>
                        </label>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-12 gap-4">
                    {/* Mass Input */}
                    {visibility.mass && (
                      <>
                        {renderInput(
                          "tech_mass",
                          "Mass (m)",
                          "number",
                          9,
                          "10"
                        )}
                        {renderSelect(
                          "tech_m_units",
                          "Unit",
                          [
                            { value: "g", label: "g" },
                            { value: "kg", label: "kg" },
                            { value: "lb", label: "lb" },
                          ],
                          3
                        )}
                      </>
                    )}

                    {/* Specific Heat Capacity */}
                    {visibility.s_h_c && (
                      <>
                        {renderInput(
                          "tech_heat_capacity",
                          "Specific Heat Capacity (c)",
                          "number",
                          9,
                          "25"
                        )}
                        {renderSelect(
                          "tech_s_heat_units",
                          "Unit",
                          [
                            { value: "J/(g.K)", label: "J/(g.K)" },
                            { value: "J/(kg.K)", label: "J/(kg.K)" },
                          ],
                          3
                        )}
                      </>
                    )}

                    {/* Temperature Change */}
                    {visibility.temp_change && (
                      <>
                        {renderInput(
                          "tech_temp_change",
                          "Temperature Change (ΔT)",
                          "number",
                          9,
                          "20"
                        )}
                        {renderSelect(
                          "tech_t_c_units",
                          "Unit",
                          [
                            { value: "K", label: "K" },
                            { value: "°C", label: "°C" },
                            { value: "°F", label: "°F" },
                          ],
                          3
                        )}
                      </>
                    )}

                    {/* Energy Input */}
                    {visibility.en && (
                      <>
                        {renderInput(
                          "tech_energy",
                          "Heat Energy (ΔQ)",
                          "number",
                          6,
                          "20"
                        )}
                        {renderSelect(
                          "tech_units",
                          "Unit",
                          [
                            { value: "J", label: "J" },
                            { value: "kJ", label: "kJ" },
                            { value: "cal", label: "cal" },
                          ],
                          6
                        )}
                      </>
                    )}

                    {/* Substance Mass for Enthalpy */}
                    {visibility.s_m && (
                      <>
                        {renderInput(
                          "tech_subtance_mass",
                          "Substance Mass",
                          "number",
                          6,
                          "15"
                        )}
                        {renderSelect(
                          "tech_s_m_units",
                          "Unit",
                          [
                            { value: "g", label: "g" },
                            { value: "kg", label: "kg" },
                          ],
                          6
                        )}
                      </>
                    )}

                    {/* Molar Mass for Enthalpy */}
                    {visibility.m_m && (
                      <>
                        {renderInput(
                          "tech_molar_mass",
                          "Molar Mass",
                          "number",
                          6,
                          "20"
                        )}
                        <div className="col-span-6"></div>
                      </>
                    )}

                    {/* Initial Temperature */}
                    {visibility.i_temp && (
                      <>
                        {renderInput(
                          "tech_in_temp",
                          "Initial Temperature",
                          "number",
                          6,
                          "20"
                        )}
                        {renderSelect(
                          "tech_i_t_units",
                          "Unit",
                          [
                            { value: "K", label: "K" },
                            { value: "°C", label: "°C" },
                          ],
                          6
                        )}
                      </>
                    )}

                    {/* Final Temperature */}
                    {visibility.f_temp && (
                      <>
                        {renderInput(
                          "tech_s_fin_temp",
                          "Final Temperature",
                          "number",
                          6,
                          "30"
                        )}
                        {renderSelect(
                          "tech_S_f_t_units",
                          "Unit",
                          [
                            { value: "K", label: "K" },
                            { value: "°C", label: "°C" },
                          ],
                          6
                        )}
                      </>
                    )}
                  </div>
                </div>
              )}
              {/* Multi-object calculations would go here */}
            </div>

            <div className="mb-6 mt-10 text-center space-x-2">
              <Button type="submit" isLoading={calculateLoading}>
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
        </div>

        {/* Results Section */}
        <div className="lg:w-[100%] w-full mx-auto">
          <div className="col-span-12">
            {calculateLoading && (
              <div className="result_calculator rounded-lg p-6">
                <div className="animate-pulse space-y-4">
                  <div className="h-6 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                </div>
              </div>
            )}

            {result && !calculateLoading && (
              <div className="w-full result mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg  space-y-6">
                <ResultActions lang={data?.payload?.tech_lang_keys} />

                <div className="rounded-lg flex items-center justify-center">
                  <div className="w-full bg-light-blue result p-3 rounded-lg mt-3">
                    <div className="flex justify-center">
                      <div className="w-full lg:w-auto text-center text-lg">
                        {/* Extract values for calculations */}
                        {(() => {
                          const formula = formData.tech_formula?.trim();
                          const formula_2obj =
                            formData.tech_formula_2obj?.trim();
                          const formula_3obj =
                            formData.tech_formula_3obj?.trim();
                          const two_time = formData.tech_two_time?.trim();
                          const three_time = formData.tech_three_time?.trim();

                          // Helper function for calculations
                          const calculateValue = (value) =>
                            parseFloat(value || 0);

                          // Calculations for different formulas
                          const m2c2 =
                            calculateValue(formData.tech_mass_2) *
                            calculateValue(formData.tech_heat_capacity_2);
                          const tf2ti2 =
                            calculateValue(formData.tech_fin_temp_2) -
                            calculateValue(formData.tech_in_temp_2);
                          const tf1ti1 =
                            calculateValue(formData.tech_fin_temp_1) -
                            calculateValue(formData.tech_in_temp_1);

                          return (
                            <div className="w-full space-y-4">
                              {/* Single Object Formulas */}
                              {result?.tech_formula && (
                                <>
                                  <p>
                                    <strong>
                                      {result.tech_formula?.replace(/_/g, " ")}
                                    </strong>
                                  </p>

                                  {/* Heat Energy */}
                                  {formula === "Heat Energy" && (
                                    <>
                                      <p>
                                        <strong className="text-green-700 text-3xl">
                                          {parseFloat(
                                            result?.tech_energy || 0
                                          ).toFixed(3)}{" "}
                                          {formData.tech_units || "J"}
                                        </strong>
                                      </p>

                                      <p>
                                        <strong className="text-lg">
                                          {data?.payload?.tech_lang_keys[35] ||
                                            "Solution"}
                                          :
                                        </strong>
                                      </p>

                                      <div className="space-y-2">
                                        <BlockMath math="{\Delta Q} = m c \Delta T" />
                                        <BlockMath
                                          math={`{\\Delta Q} = (${
                                            formData.tech_mass || 0
                                          })(${
                                            formData.tech_heat_capacity || 0
                                          })(${
                                            formData.tech_temp_change || 0
                                          })`}
                                        />
                                        <BlockMath
                                          math={`{\\Delta Q} = (${(
                                            calculateValue(formData.tech_mass) *
                                            calculateValue(
                                              formData.tech_heat_capacity
                                            )
                                          ).toFixed(3)})(${
                                            formData.tech_temp_change || 0
                                          })`}
                                        />
                                        <BlockMath
                                          math={`{\\Delta Q} = ${(
                                            calculateValue(formData.tech_mass) *
                                            calculateValue(
                                              formData.tech_heat_capacity
                                            ) *
                                            calculateValue(
                                              formData.tech_temp_change
                                            )
                                          ).toFixed(3)} \\text{ ${
                                            formData.tech_units || "J"
                                          }}`}
                                        />
                                      </div>
                                    </>
                                  )}

                                  {/* Specific Heat */}
                                  {formula === "Specific Heat" && (
                                    <>
                                      <p>
                                        <strong className="text-green-700 text-3xl">
                                          {parseFloat(
                                            result?.tech_heat_capacity || 0
                                          ).toFixed(3)}{" "}
                                          {formData.tech_s_heat_units ||
                                            "J/(kg·K)"}
                                        </strong>
                                      </p>

                                      <p>
                                        <strong className="text-lg">
                                          {data?.payload?.tech_lang_keys[35] ||
                                            "Solution"}
                                          :
                                        </strong>
                                      </p>

                                      <div className="space-y-2">
                                        <BlockMath math="C = \dfrac{\Delta Q}{m \Delta T}" />
                                        <BlockMath
                                          math={`C = \\dfrac{(${
                                            formData.tech_energy || 0
                                          })}{(${formData.tech_mass || 0})(${
                                            formData.tech_temp_change || 0
                                          })}`}
                                        />
                                        <BlockMath
                                          math={`C = \\dfrac{(${
                                            formData.tech_energy || 0
                                          })}{${(
                                            calculateValue(formData.tech_mass) *
                                            calculateValue(
                                              formData.tech_temp_change
                                            )
                                          ).toFixed(3)}}`}
                                        />
                                        <BlockMath
                                          math={`C = ${(
                                            calculateValue(
                                              formData.tech_energy
                                            ) /
                                            (calculateValue(
                                              formData.tech_mass
                                            ) *
                                              calculateValue(
                                                formData.tech_temp_change
                                              ) || 1)
                                          ).toFixed(3)} \\text{ ${
                                            formData.tech_s_heat_units ||
                                            "J/(kg·K)"
                                          }}`}
                                        />
                                      </div>
                                    </>
                                  )}

                                  {/* Mass */}
                                  {formula === "Mass" && (
                                    <>
                                      <p>
                                        <strong className="text-green-700 text-3xl">
                                          {parseFloat(
                                            result?.tech_mass || 0
                                          ).toFixed(3)}{" "}
                                          {formData.tech_m_units || "kg"}
                                        </strong>
                                      </p>

                                      <p>
                                        <strong className="text-lg">
                                          {data?.payload?.tech_lang_keys[35] ||
                                            "Solution"}
                                          :
                                        </strong>
                                      </p>

                                      <div className="space-y-2">
                                        <BlockMath math="m = \dfrac{Q}{c \Delta T}" />
                                        <BlockMath
                                          math={`m = \\dfrac{(${
                                            formData.tech_energy || 0
                                          })}{(${
                                            formData.tech_heat_capacity || 0
                                          })(${
                                            formData.tech_temp_change || 0
                                          })}`}
                                        />
                                        <BlockMath
                                          math={`m = \\dfrac{(${
                                            formData.tech_energy || 0
                                          })}{${(
                                            calculateValue(
                                              formData.tech_heat_capacity
                                            ) *
                                            calculateValue(
                                              formData.tech_temp_change
                                            )
                                          ).toFixed(3)}}`}
                                        />
                                        <BlockMath
                                          math={`m = ${(
                                            calculateValue(
                                              formData.tech_energy
                                            ) /
                                            (calculateValue(
                                              formData.tech_heat_capacity
                                            ) *
                                              calculateValue(
                                                formData.tech_temp_change
                                              ) || 1)
                                          ).toFixed(3)} \\text{ ${
                                            formData.tech_m_units || "kg"
                                          }}`}
                                        />
                                      </div>
                                    </>
                                  )}

                                  {/* Enthalpy Change */}
                                  {formula === "Enthalpy_change" && (
                                    <>
                                      <p>
                                        <strong className="text-green-700 text-3xl">
                                          {parseFloat(
                                            result?.tech_enthalpy_change || 0
                                          ).toFixed(3)}{" "}
                                          Kj/mol
                                        </strong>
                                      </p>

                                      <p>
                                        <strong className="text-lg">
                                          {data?.payload?.tech_lang_keys[35] ||
                                            "Solution"}
                                          :
                                        </strong>
                                      </p>

                                      <div className="space-y-2">
                                        <BlockMath math="{\Delta H} = \dfrac{M \Delta Q}{mol}" />
                                        <BlockMath
                                          math={`{\\Delta H} = \\dfrac{(${
                                            formData.tech_molar_mass || 0
                                          })(${formData.tech_energy || 0})}{(${
                                            formData.tech_subtance_mass || 0
                                          })}`}
                                        />
                                        <BlockMath
                                          math={`{\\Delta H} = \\dfrac{${(
                                            calculateValue(
                                              formData.tech_molar_mass
                                            ) *
                                            calculateValue(formData.tech_energy)
                                          ).toFixed(3)}}{${
                                            formData.tech_subtance_mass || 0
                                          }}`}
                                        />
                                        <BlockMath
                                          math={`{\\Delta H} = ${calculateValue(
                                            result?.tech_enthalpy_change
                                          ).toFixed(3)} \\text{ Kj/mol}`}
                                        />
                                      </div>
                                    </>
                                  )}

                                  {/* Initial Temperature */}
                                  {formula === "Initial_Temperature" && (
                                    <>
                                      <p>
                                        <strong className="text-green-700 text-3xl">
                                          {parseFloat(
                                            result?.tech_in_temp || 0
                                          ).toFixed(3)}{" "}
                                          {formData.tech_i_t_units || "K"}
                                        </strong>
                                      </p>

                                      <p>
                                        <strong className="text-lg">
                                          {data?.payload?.tech_lang_keys[35] ||
                                            "Solution"}
                                          :
                                        </strong>
                                      </p>

                                      <div className="space-y-2">
                                        <BlockMath math="T_i = \dfrac{\Delta Q}{mc} - T_f" />
                                        <BlockMath
                                          math={`T_i = \\dfrac{(${
                                            formData.tech_energy || 0
                                          })}{(${formData.tech_mass || 0})(${
                                            formData.tech_heat_capacity || 0
                                          })} - (${
                                            formData.tech_s_fin_temp || 0
                                          })`}
                                        />
                                        <BlockMath
                                          math={`T_i = \\dfrac{(${
                                            formData.tech_energy || 0
                                          })}{${(
                                            calculateValue(formData.tech_mass) *
                                            calculateValue(
                                              formData.tech_heat_capacity
                                            )
                                          ).toFixed(3)}} - (${
                                            formData.tech_s_fin_temp || 0
                                          })`}
                                        />
                                        <BlockMath
                                          math={`T_i = ${calculateValue(
                                            result?.tech_in_temp
                                          ).toFixed(3)} \\text{ ${
                                            formData.tech_i_t_units || "K"
                                          }}`}
                                        />
                                      </div>
                                    </>
                                  )}

                                  {/* Final Temperature */}
                                  {formula === "Final_Temperature" && (
                                    <>
                                      <p>
                                        <strong className="text-green-700 text-3xl">
                                          {parseFloat(
                                            result?.tech_fin_temp || 0
                                          ).toFixed(3)}{" "}
                                          {formData.tech_f_t_units || "K"}
                                        </strong>
                                      </p>

                                      <p>
                                        <strong className="text-lg">
                                          {data?.payload?.tech_lang_keys[35] ||
                                            "Solution"}
                                          :
                                        </strong>
                                      </p>

                                      <div className="space-y-2">
                                        <BlockMath math="T_f = \dfrac{\Delta Q}{mc} + T_i" />
                                        <BlockMath
                                          math={`T_f = \\dfrac{(${
                                            formData.tech_energy || 0
                                          })}{(${formData.tech_mass || 0})(${
                                            formData.tech_heat_capacity || 0
                                          })} + (${
                                            formData.tech_in_temp || 0
                                          })`}
                                        />
                                        <BlockMath
                                          math={`T_f = \\dfrac{(${
                                            formData.tech_energy || 0
                                          })}{${(
                                            calculateValue(formData.tech_mass) *
                                            calculateValue(
                                              formData.tech_heat_capacity
                                            )
                                          ).toFixed(3)}} + (${
                                            formData.tech_in_temp || 0
                                          })`}
                                        />
                                        <BlockMath
                                          math={`T_f = ${calculateValue(
                                            result?.tech_fin_temp
                                          ).toFixed(3)} \\text{ ${
                                            formData.tech_f_t_units || "K"
                                          }}`}
                                        />
                                      </div>
                                    </>
                                  )}

                                  {/* Time of Isolation */}
                                  {formula === "Time_of_isolation" && (
                                    <>
                                      <p>
                                        <strong className="text-green-700 text-3xl">
                                          {parseFloat(
                                            result?.tech_time_of_is || 0
                                          ).toFixed(3)}{" "}
                                          Seconds
                                        </strong>
                                      </p>

                                      <p>
                                        <strong className="text-lg">
                                          {data?.payload?.tech_lang_keys[35] ||
                                            "Solution"}
                                          :
                                        </strong>
                                      </p>

                                      <div className="space-y-2">
                                        <BlockMath math="t = \dfrac{m c \Delta T}{\Delta Q}" />
                                        <BlockMath
                                          math={`t = \\dfrac{(${
                                            formData.tech_mass || 0
                                          })(${
                                            formData.tech_heat_capacity || 0
                                          })(${
                                            formData.tech_temp_change || 0
                                          })}{(${formData.tech_energy || 0})}`}
                                        />
                                        <BlockMath
                                          math={`t = \\dfrac{${(
                                            calculateValue(formData.tech_mass) *
                                            calculateValue(
                                              formData.tech_heat_capacity
                                            ) *
                                            calculateValue(
                                              formData.tech_temp_change
                                            )
                                          ).toFixed(3)}}{${
                                            formData.tech_energy || 0
                                          }}`}
                                        />
                                        <BlockMath
                                          math={`t = ${calculateValue(
                                            result?.tech_time_of_is
                                          ).toFixed(3)} \\text{ Seconds}`}
                                        />
                                        <BlockMath
                                          math={`t = ${(
                                            calculateValue(
                                              result?.tech_time_of_is
                                            ) / 60
                                          ).toFixed(3)} \\text{ Minutes}`}
                                        />
                                        <BlockMath
                                          math={`t = ${(
                                            calculateValue(
                                              result?.tech_time_of_is
                                            ) / 3600
                                          ).toFixed(3)} \\text{ Hours}`}
                                        />
                                      </div>
                                    </>
                                  )}
                                </>
                              )}

                              {/* 2-object Calculations */}
                              {result?.tech_formula_2obj && (
                                <>
                                  {formula_2obj === "m1" && (
                                    <>
                                      <p>
                                        <strong>
                                          {data?.payload?.tech_lang_keys[34] ||
                                            "Mass of Object 1"}{" "}
                                          \((m_1)\)
                                        </strong>
                                      </p>
                                      <p>
                                        <strong className="text-green-700 text-3xl">
                                          {calculateValue(
                                            result?.tech_mass_1
                                          ).toFixed(3)}{" "}
                                          g
                                        </strong>
                                      </p>

                                      <p>
                                        <strong className="text-lg">
                                          {data?.payload?.tech_lang_keys[35] ||
                                            "Solution"}
                                          :
                                        </strong>
                                      </p>

                                      <div className="space-y-2">
                                        <BlockMath math="m_1 = \dfrac{m_2 c_2 (T_{f2} - T_{i2})}{c_1 (T_{f1} - T_{i1})}" />
                                        <BlockMath
                                          math={`m_1 = \\dfrac{(${
                                            formData.tech_mass_2 || 0
                                          })(${
                                            formData.tech_heat_capacity_2 || 0
                                          })(${
                                            formData.tech_fin_temp_2 || 0
                                          } - ${
                                            formData.tech_in_temp_2 || 0
                                          })}{(${
                                            formData.tech_heat_capacity_1 || 0
                                          })(${
                                            formData.tech_fin_temp_1 || 0
                                          } - ${
                                            formData.tech_in_temp_1 || 0
                                          })}`}
                                        />
                                        <BlockMath
                                          math={`m_1 = \\dfrac{${m2c2.toFixed(
                                            3
                                          )}(${tf2ti2.toFixed(3)})}{(${
                                            formData.tech_heat_capacity_1 || 0
                                          })(${tf1ti1.toFixed(3)})}`}
                                        />
                                        <BlockMath
                                          math={`m_1 = ${calculateValue(
                                            result?.tech_mass_1
                                          ).toFixed(3)} \\text{ g}`}
                                        />
                                      </div>
                                    </>
                                  )}

                                  {formula_2obj === "c1" && (
                                    <>
                                      <p>
                                        <strong>
                                          {data?.payload?.tech_lang_keys[37] ||
                                            "Specific Heat of Object 1"}{" "}
                                          \((c_1)\)
                                        </strong>
                                      </p>
                                      <p>
                                        <strong className="text-green-700 text-3xl">
                                          {calculateValue(
                                            result?.tech_heat_capacity_1
                                          ).toFixed(3)}{" "}
                                          J/(g.K)
                                        </strong>
                                      </p>

                                      <p>
                                        <strong className="text-lg">
                                          {data?.payload?.tech_lang_keys[35] ||
                                            "Solution"}
                                          :
                                        </strong>
                                      </p>

                                      <div className="space-y-2">
                                        <BlockMath math="c_1 = \dfrac{-m_2 c_2 (T_{f2} - T_{i2})}{m_1 (T_{f1} - T_{i1})}" />
                                        <BlockMath
                                          math={`c_1 = \\dfrac{(-${
                                            formData.tech_mass_2 || 0
                                          })(${
                                            formData.tech_heat_capacity_2 || 0
                                          })(${
                                            formData.tech_fin_temp_2 || 0
                                          } - ${
                                            formData.tech_in_temp_2 || 0
                                          })}{(${formData.tech_mass_1 || 0})(${
                                            formData.tech_fin_temp_1 || 0
                                          } - ${
                                            formData.tech_in_temp_1 || 0
                                          })}`}
                                        />
                                        <BlockMath
                                          math={`c_1 = \\dfrac{${(-m2c2).toFixed(
                                            3
                                          )}(${tf2ti2.toFixed(3)})}{(${
                                            formData.tech_mass_1 || 0
                                          })(${tf1ti1.toFixed(3)})}`}
                                        />
                                        <BlockMath
                                          math={`c_1 = ${calculateValue(
                                            result?.tech_heat_capacity_1
                                          ).toFixed(3)} \\text{ J/(g.K)}`}
                                        />
                                      </div>
                                    </>
                                  )}

                                  {/* Add more formula_2obj cases similarly */}
                                  {formula_2obj === "Ti(1)" && (
                                    <>
                                      <p>
                                        <strong>
                                          {data?.payload?.tech_lang_keys[38] ||
                                            "Initial Temperature 1"}{" "}
                                          \((T_{i1})\)
                                        </strong>
                                      </p>
                                      <p>
                                        <strong className="text-green-700 text-3xl">
                                          {calculateValue(
                                            result?.tech_in_temp_1
                                          ).toFixed(3)}{" "}
                                          K
                                        </strong>
                                      </p>

                                      <p>
                                        <strong className="text-lg">
                                          {data?.payload?.tech_lang_keys[35] ||
                                            "Solution"}
                                          :
                                        </strong>
                                      </p>

                                      <div className="space-y-2">
                                        <BlockMath math="T_{i1} = \dfrac{m_2 c_2 (T_{f2} - T_{i2}) + T_{f1}}{m_1 c_1}" />
                                        <BlockMath
                                          math={`T_{i1} = \\dfrac{(${
                                            formData.tech_mass_2 || 0
                                          })(${
                                            formData.tech_heat_capacity_2 || 0
                                          })(${
                                            formData.tech_fin_temp_2 || 0
                                          } - ${
                                            formData.tech_in_temp_2 || 0
                                          }) + (${
                                            formData.tech_fin_temp_1 || 0
                                          })}{(${formData.tech_mass_1 || 0})(${
                                            formData.tech_heat_capacity_1 || 0
                                          })}`}
                                        />
                                        <BlockMath
                                          math={`T_{i1} = \\dfrac{${(
                                            m2c2 * tf2ti2 +
                                            calculateValue(
                                              formData.tech_fin_temp_1
                                            )
                                          ).toFixed(3)}}{${(
                                            calculateValue(
                                              formData.tech_mass_1
                                            ) *
                                            calculateValue(
                                              formData.tech_heat_capacity_1
                                            )
                                          ).toFixed(3)}}`}
                                        />
                                        <BlockMath
                                          math={`T_{i1} = ${calculateValue(
                                            result?.tech_in_temp_1
                                          ).toFixed(3)} \\text{ K}`}
                                        />
                                      </div>
                                    </>
                                  )}

                                  {formula_2obj === "Tf(1)" && (
                                    <>
                                      <p>
                                        <strong>
                                          {data?.payload?.tech_lang_keys[39] ||
                                            "Final Temperature 1"}{" "}
                                          \((T_{f1})\)
                                        </strong>
                                      </p>
                                      <p>
                                        <strong className="text-green-700 text-3xl">
                                          {calculateValue(
                                            result?.tech_fin_temp_1
                                          ).toFixed(3)}{" "}
                                          K
                                        </strong>
                                      </p>

                                      <p>
                                        <strong className="text-lg">
                                          {data?.payload?.tech_lang_keys[35] ||
                                            "Solution"}
                                          :
                                        </strong>
                                      </p>

                                      <div className="space-y-2">
                                        <BlockMath math="T_{f1} = \dfrac{-m_2 c_2 (T_{f2} - T_{i2}) + T_{i1}}{m_1 c_1}" />
                                        <BlockMath
                                          math={`T_{f1} = \\dfrac{(-${
                                            formData.tech_mass_2 || 0
                                          })(${
                                            formData.tech_heat_capacity_2 || 0
                                          })(${
                                            formData.tech_fin_temp_2 || 0
                                          } - ${
                                            formData.tech_in_temp_2 || 0
                                          }) + (${
                                            formData.tech_in_temp_1 || 0
                                          })}{(${formData.tech_mass_1 || 0})(${
                                            formData.tech_heat_capacity_1 || 0
                                          })}`}
                                        />
                                        <BlockMath
                                          math={`T_{f1} = \\dfrac{${(
                                            -m2c2 * tf2ti2 +
                                            calculateValue(
                                              formData.tech_in_temp_1
                                            )
                                          ).toFixed(3)}}{${(
                                            calculateValue(
                                              formData.tech_mass_1
                                            ) *
                                            calculateValue(
                                              formData.tech_heat_capacity_1
                                            )
                                          ).toFixed(3)}}`}
                                        />
                                        <BlockMath
                                          math={`T_{f1} = ${calculateValue(
                                            result?.tech_fin_temp_1
                                          ).toFixed(3)} \\text{ K}`}
                                        />
                                      </div>
                                    </>
                                  )}
                                </>
                              )}

                              {/* 3-object Calculations */}
                              {result?.tech_formula_3obj && (
                                <>
                                  {formula_3obj === "m1" && (
                                    <>
                                      <p>
                                        <strong>
                                          {data?.payload?.tech_lang_keys[34] ||
                                            "Mass of Object 1"}{" "}
                                          \((m_1)\)
                                        </strong>
                                      </p>
                                      <p>
                                        <strong className="text-green-700 text-3xl">
                                          {calculateValue(
                                            result?.tech_mass_1
                                          ).toFixed(3)}{" "}
                                          g
                                        </strong>
                                      </p>

                                      <p>
                                        <strong className="text-lg">
                                          {data?.payload?.tech_lang_keys[35] ||
                                            "Solution"}
                                          :
                                        </strong>
                                      </p>

                                      <div className="space-y-2">
                                        <BlockMath math="m_1 = \dfrac{m_2 c_2 (T_{f2} - T_{i2}) - m_3 c_3 (T_{f3} - T_{i3})}{c_1 (T_{f1} - T_{i1})}" />
                                        {/* Add actual calculations with formData values */}
                                      </div>
                                    </>
                                  )}

                                  {/* Add other 3-object cases similarly */}
                                </>
                              )}

                              {/* Two-time Calculations */}
                              {result?.tech_two_time && (
                                <>
                                  {two_time === "m1_two" && (
                                    <>
                                      <p>
                                        <strong>
                                          {data?.payload?.tech_lang_keys[34] ||
                                            "Mass of Object 1"}{" "}
                                          \((m_1)\)
                                        </strong>
                                      </p>
                                      <p>
                                        <strong className="text-green-700 text-3xl">
                                          {calculateValue(
                                            result?.tech_mass_1
                                          ).toFixed(3)}{" "}
                                          g
                                        </strong>
                                      </p>

                                      <p>
                                        <strong className="text-lg">
                                          Solutions:
                                        </strong>
                                      </p>

                                      <div className="space-y-2">
                                        <BlockMath math="m_1 = \dfrac{m_2 c_2 (T_{f2} - T_{i2})}{c_1 (T_{fusion} - T_{i1}) + \Delta H_{fusion} + c_2 (T_f - T_{fusion})}" />
                                        {/* Add actual calculations with formData values */}
                                      </div>
                                    </>
                                  )}
                                </>
                              )}

                              {/* Three-time Calculations */}
                              {result?.tech_three_time && (
                                <>
                                  {three_time === "m1" && (
                                    <>
                                      <p>
                                        <strong>
                                          {data?.payload?.tech_lang_keys[34] ||
                                            "Mass of Object 1"}{" "}
                                          \((m_1)\)
                                        </strong>
                                      </p>
                                      <p>
                                        <strong className="text-green-700 text-3xl">
                                          {calculateValue(
                                            result?.tech_mass_1
                                          ).toFixed(3)}{" "}
                                          g
                                        </strong>
                                      </p>

                                      <p>
                                        <strong className="text-lg">
                                          {data?.payload?.tech_lang_keys[35] ||
                                            "Solution"}
                                          :
                                        </strong>
                                      </p>

                                      <div className="space-y-2">
                                        <BlockMath math="m_1 = \dfrac{m_2 c_2 (T_f - T_{i2}) - m_3 c_3 (T_f - T_{i3})}{c_1 (T_{fusion} - T_{i1}) + \Delta H_{fusion} + c_2 (T_f - T_{fusion})}" />
                                        {/* Add actual calculations with formData values */}
                                      </div>
                                    </>
                                  )}
                                </>
                              )}
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </form>

      {result && (
        <CalculatorFeedback calName={data?.payload?.tech_calculator_title} />
      )}
    </Calculator>
  );
};

export default CalorimetryCalculator;

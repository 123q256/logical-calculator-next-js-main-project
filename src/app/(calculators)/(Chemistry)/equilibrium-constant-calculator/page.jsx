"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useEquilibriumConstantCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const EquilibriumConstantCalculator = () => {
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
      await getSingleCalculatorDetails({ tech_calculator_link: url });
    } catch (err) {
      console.error("Error fetching calculator details:", err);
    }
  };

  useEffect(() => {
    handleFetchDetails();
  }, [url]);

  const [formData, setFormData] = useState({
    tech_selection: "1", // 1 for Kc, 2 for Kp
    tech_concentration_one: "8",
    tech_concentration_one_unit: "fM",
    tech_a: "3",
    tech_concentration_two: "4",
    tech_concentration_two_unit: "mM",
    tech_b: "5",
    tech_concentration_three: "4",
    tech_concentration_three_unit: "aM",
    tech_c: "7",
    tech_concentration_four: "8",
    tech_concentration_four_unit: "yM",
    tech_d: "9",
    tech_chemical_equation: "4NO2 + O2 = 2N2O5",
    tech_total_pressure: "1.00794",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateActivationCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useEquilibriumConstantCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    // Validation
    if (!formData.tech_chemical_equation.trim()) {
      setFormError("Please enter a chemical equation");
      return;
    }

    try {
      const response = await calculateActivationCalculator(formData).unwrap();
      if (response?.payload) {
        setResult(response.payload);
      } else {
        setFormError("Invalid response from server");
      }
    } catch (err) {
      console.error("Calculation error:", err);
      setFormError(
        err?.data?.message || "An error occurred during calculation"
      );
      toast.error("Calculation failed. Please try again.");
    }
  };

  // Calculate equilibrium constant locally (fallback if API fails)
  const calculateEquilibriumConstant = () => {
    try {
      const concA = parseFloat(formData.tech_concentration_one) || 0;
      const concB = parseFloat(formData.tech_concentration_two) || 0;
      const concC = parseFloat(formData.tech_concentration_three) || 0;
      const concD = parseFloat(formData.tech_concentration_four) || 0;

      const coeffA = parseFloat(formData.tech_a) || 1;
      const coeffB = parseFloat(formData.tech_b) || 1;
      const coeffC = parseFloat(formData.tech_c) || 1;
      const coeffD = parseFloat(formData.tech_d) || 1;

      // Calculate: K = [C]^c * [D]^d / ([A]^a * [B]^b)
      const numerator = Math.pow(concC, coeffC) * Math.pow(concD, coeffD);
      const denominator = Math.pow(concA, coeffA) * Math.pow(concB, coeffB);

      if (denominator === 0) {
        return "Cannot calculate (division by zero)";
      }

      const result = numerator / denominator;
      return result.toExponential(4); // Scientific notation with 4 decimal places
    } catch (error) {
      return "Calculation error";
    }
  };

  // Handle form reset
  const handleReset = () => {
    setFormData({
      tech_selection: "1",
      tech_concentration_one: "8",
      tech_concentration_one_unit: "fM",
      tech_a: "3",
      tech_concentration_two: "4",
      tech_concentration_two_unit: "mM",
      tech_b: "5",
      tech_concentration_three: "4",
      tech_concentration_three_unit: "aM",
      tech_c: "7",
      tech_concentration_four: "8",
      tech_concentration_four_unit: "yM",
      tech_d: "9",
      tech_chemical_equation: "4NO2 + O2 = 2N2O5",
      tech_total_pressure: "1.00794",
    });
    setResult(null);
    setFormError("");
  };

  // Concentration units options
  const concentrationUnits = [
    { value: "M", label: "M (Molar)" },
    { value: "mM", label: "mM (Millimolar)" },
    { value: "μM", label: "μM (Micromolar)" },
    { value: "nM", label: "nM (Nanomolar)" },
    { value: "pM", label: "pM (Picomolar)" },
    { value: "fM", label: "fM (Femtomolar)" },
    { value: "aM", label: "aM (Attomolar)" },
    { value: "zM", label: "zM (Zeptomolar)" },
    { value: "yM", label: "yM (Yoctomolar)" },
  ];

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
          path: pathname,
        },
      ]}
    >
      <form className="row" onSubmit={handleSubmit}>
        <div className="w-full mx-auto p-4 lg:p-8 md:p-8 input_form rounded-lg  space-y-6 mb-3">
          {formError && (
            <p className="text-red-500 text-lg font-semibold w-full">
              {formError}
            </p>
          )}

          {/* Calculation Type Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {data?.payload?.tech_lang_keys?.calculation_type ||
                "Calculation Type"}
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="tech_selection"
                  value="1"
                  checked={formData.tech_selection === "1"}
                  onChange={handleChange}
                  className="mr-2"
                />
                Kc (Concentration)
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="tech_selection"
                  value="2"
                  checked={formData.tech_selection === "2"}
                  onChange={handleChange}
                  className="mr-2"
                />
                Kp (Pressure)
              </label>
            </div>
          </div>

          {/* Chemical Equation */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {data?.payload?.tech_lang_keys?.chemical_equation ||
                "Chemical Equation"}
            </label>
            <input
              type="text"
              name="tech_chemical_equation"
              value={formData.tech_chemical_equation}
              onChange={handleChange}
              className="input"
              placeholder="e.g., aA + bB ⇌ cC + dD"
            />
          </div>

          {/* Reactant A */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {formData.tech_selection === "1"
                  ? "Concentration [A]"
                  : "Partial Pressure A"}
              </label>
              <input
                type="number"
                name="tech_concentration_one"
                value={formData.tech_concentration_one}
                onChange={handleChange}
                step="any"
                className="input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Unit
              </label>
              <select
                name="tech_concentration_one_unit"
                value={formData.tech_concentration_one_unit}
                onChange={handleChange}
                className="input"
              >
                {concentrationUnits.map((unit) => (
                  <option key={unit.value} value={unit.value}>
                    {unit.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stoichiometric Coefficient (a)
              </label>
              <input
                type="number"
                name="tech_a"
                value={formData.tech_a}
                onChange={handleChange}
                step="any"
                className="input"
              />
            </div>
          </div>

          {/* Reactant B */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {formData.tech_selection === "1"
                  ? "Concentration [B]"
                  : "Partial Pressure B"}
              </label>
              <input
                type="number"
                name="tech_concentration_two"
                value={formData.tech_concentration_two}
                onChange={handleChange}
                step="any"
                className="input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Unit
              </label>
              <select
                name="tech_concentration_two_unit"
                value={formData.tech_concentration_two_unit}
                onChange={handleChange}
                className="input"
              >
                {concentrationUnits.map((unit) => (
                  <option key={unit.value} value={unit.value}>
                    {unit.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stoichiometric Coefficient (b)
              </label>
              <input
                type="number"
                name="tech_b"
                value={formData.tech_b}
                onChange={handleChange}
                step="any"
                className="input"
              />
            </div>
          </div>

          {/* Product C */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {formData.tech_selection === "1"
                  ? "Concentration [C]"
                  : "Partial Pressure C"}
              </label>
              <input
                type="number"
                name="tech_concentration_three"
                value={formData.tech_concentration_three}
                onChange={handleChange}
                step="any"
                className="input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Unit
              </label>
              <select
                name="tech_concentration_three_unit"
                value={formData.tech_concentration_three_unit}
                onChange={handleChange}
                className="input"
              >
                {concentrationUnits.map((unit) => (
                  <option key={unit.value} value={unit.value}>
                    {unit.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stoichiometric Coefficient (c)
              </label>
              <input
                type="number"
                name="tech_c"
                value={formData.tech_c}
                onChange={handleChange}
                step="any"
                className="input"
              />
            </div>
          </div>

          {/* Product D */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {formData.tech_selection === "1"
                  ? "Concentration [D]"
                  : "Partial Pressure D"}
              </label>
              <input
                type="number"
                name="tech_concentration_four"
                value={formData.tech_concentration_four}
                onChange={handleChange}
                step="any"
                className="input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Unit
              </label>
              <select
                name="tech_concentration_four_unit"
                value={formData.tech_concentration_four_unit}
                onChange={handleChange}
                className="input"
              >
                {concentrationUnits.map((unit) => (
                  <option key={unit.value} value={unit.value}>
                    {unit.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stoichiometric Coefficient (d)
              </label>
              <input
                type="number"
                name="tech_d"
                value={formData.tech_d}
                onChange={handleChange}
                step="any"
                className="input"
              />
            </div>
          </div>

          {/* Total Pressure (for Kp calculations) */}
          {formData.tech_selection === "2" && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Total Pressure (atm)
              </label>
              <input
                type="number"
                name="tech_total_pressure"
                value={formData.tech_total_pressure}
                onChange={handleChange}
                step="any"
                className="input"
              />
            </div>
          )}

          <div className="mb-6 mt-10 text-center space-x-2">
            <Button type="submit" isLoading={roundToTheNearestLoading}>
              {data?.payload?.tech_lang_keys?.calculate || "Calculate"}
            </Button>
            {result && (
              <ResetButton type="button" onClick={handleReset}>
                {data?.payload?.tech_lang_keys?.locale === "en"
                  ? "RESET"
                  : data?.payload?.tech_lang_keys?.reset || "RESET"}
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
            <div className="w-full mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg space-y-6 result">
              <div>
                <ResultActions lang={data?.payload?.tech_lang_keys} />

                {/* Display Calculated Results */}
                <div className="mt-6 space-y-4">
                  {/* Main Result */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
                    <div className="text-center">
                      <h4 className="text-lg font-medium text-gray-700 mb-3">
                        Equilibrium Constant
                      </h4>
                      <div className="text-3xl font-bold text-blue-600 mb-2">
                        {formData.tech_selection === "1" ? "Kc" : "Kp"} ={" "}
                        {result?.equilibrium_constant ||
                          calculateEquilibriumConstant()}
                      </div>
                      <p className="text-sm text-gray-600">
                        {formData.tech_selection === "1"
                          ? "Concentration-based equilibrium constant"
                          : "Pressure-based equilibrium constant"}
                      </p>
                    </div>
                  </div>

                  {/* Input Summary */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-lg font-medium text-gray-700 mb-3">
                      Input Summary
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p>
                          <strong>Chemical Equation:</strong>{" "}
                          {formData.tech_chemical_equation}
                        </p>
                        <p>
                          <strong>Calculation Type:</strong>{" "}
                          {formData.tech_selection === "1"
                            ? "Kc (Concentration)"
                            : "Kp (Pressure)"}
                        </p>
                      </div>
                      <div>
                        <p>
                          <strong>Reactant A:</strong>{" "}
                          {formData.tech_concentration_one}{" "}
                          {formData.tech_concentration_one_unit} (coefficient:{" "}
                          {formData.tech_a})
                        </p>
                        <p>
                          <strong>Reactant B:</strong>{" "}
                          {formData.tech_concentration_two}{" "}
                          {formData.tech_concentration_two_unit} (coefficient:{" "}
                          {formData.tech_b})
                        </p>
                        <p>
                          <strong>Product C:</strong>{" "}
                          {formData.tech_concentration_three}{" "}
                          {formData.tech_concentration_three_unit} (coefficient:{" "}
                          {formData.tech_c})
                        </p>
                        <p>
                          <strong>Product D:</strong>{" "}
                          {formData.tech_concentration_four}{" "}
                          {formData.tech_concentration_four_unit} (coefficient:{" "}
                          {formData.tech_d})
                        </p>
                        {formData.tech_selection === "2" && (
                          <p>
                            <strong>Total Pressure:</strong>{" "}
                            {formData.tech_total_pressure} atm
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Calculation Formula */}
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <h4 className="text-lg font-medium text-gray-700 mb-3">
                      Formula Used
                    </h4>
                    <div className="text-center bg-white p-4 rounded-lg bordered">
                      <p className="text-lg font-mono">
                        {formData.tech_selection === "1"
                          ? `Kc = [C]^${formData.tech_c} × [D]^${formData.tech_d} / ([A]^${formData.tech_a} × [B]^${formData.tech_b})`
                          : `Kp = (PC)^${formData.tech_c} × (PD)^${formData.tech_d} / ((PA)^${formData.tech_a} × (PB)^${formData.tech_b})`}
                      </p>
                    </div>
                  </div>

                  {/* Step by Step Calculation */}
                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <h4 className="text-lg font-medium text-gray-700 mb-3">
                      Step-by-Step Calculation
                    </h4>
                    <div className="space-y-2 text-sm bg-white p-4 rounded-lg bordered">
                      <p>
                        <strong>Step 1:</strong> Substitute values into the
                        formula
                      </p>
                      <p className="font-mono ml-4">
                        {formData.tech_selection === "1"
                          ? `Kc = (${formData.tech_concentration_three})^${formData.tech_c} × (${formData.tech_concentration_four})^${formData.tech_d} / ((${formData.tech_concentration_one})^${formData.tech_a} × (${formData.tech_concentration_two})^${formData.tech_b})`
                          : `Kp = (${formData.tech_concentration_three})^${formData.tech_c} × (${formData.tech_concentration_four})^${formData.tech_d} / ((${formData.tech_concentration_one})^${formData.tech_a} × (${formData.tech_concentration_two})^${formData.tech_b})`}
                      </p>

                      <p>
                        <strong>Step 2:</strong> Calculate powers
                      </p>
                      <p className="font-mono ml-4">
                        {formData.tech_selection === "1"
                          ? `Kc = ${Math.pow(
                              parseFloat(formData.tech_concentration_three),
                              parseFloat(formData.tech_c)
                            ).toFixed(6)} × ${Math.pow(
                              parseFloat(formData.tech_concentration_four),
                              parseFloat(formData.tech_d)
                            ).toFixed(6)} / (${Math.pow(
                              parseFloat(formData.tech_concentration_one),
                              parseFloat(formData.tech_a)
                            ).toFixed(6)} × ${Math.pow(
                              parseFloat(formData.tech_concentration_two),
                              parseFloat(formData.tech_b)
                            ).toFixed(6)})`
                          : `Kp = ${Math.pow(
                              parseFloat(formData.tech_concentration_three),
                              parseFloat(formData.tech_c)
                            ).toFixed(6)} × ${Math.pow(
                              parseFloat(formData.tech_concentration_four),
                              parseFloat(formData.tech_d)
                            ).toFixed(6)} / (${Math.pow(
                              parseFloat(formData.tech_concentration_one),
                              parseFloat(formData.tech_a)
                            ).toFixed(6)} × ${Math.pow(
                              parseFloat(formData.tech_concentration_two),
                              parseFloat(formData.tech_b)
                            ).toFixed(6)})`}
                      </p>

                      <p>
                        <strong>Step 3:</strong> Final Result
                      </p>
                      <p className="font-mono ml-4 text-blue-600 font-bold">
                        {formData.tech_selection === "1" ? "Kc" : "Kp"} ={" "}
                        {result?.equilibrium_constant ||
                          calculateEquilibriumConstant()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        )}
      </form>

      {result && (
        <CalculatorFeedback calName={data?.payload?.tech_calculator_title} />
      )}
    </Calculator>
  );
};

export default EquilibriumConstantCalculator;

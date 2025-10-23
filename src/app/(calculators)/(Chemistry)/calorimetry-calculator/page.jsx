"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

import {
  useGetSingleCalculatorDetailsMutation,
  useMidpointCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

const CalorimetryCalculator = () => {
  // Form states
  const [mass, setMass] = useState("");
  const [massUnit, setMassUnit] = useState("kg");
  const [specificHeat, setSpecificHeat] = useState("");
  const [specificHeatUnit, setSpecificHeatUnit] = useState("J/(g·K)");
  const [deltaTemp, setDeltaTemp] = useState("");
  const [tempUnit, setTempUnit] = useState("K");
  const [heatEnergy, setHeatEnergy] = useState("");
  const [initialTemp, setInitialTemp] = useState("");
  const [finalTemp, setFinalTemp] = useState("");
  const [reactionType, setReactionType] = useState("coffee-cup");
  const [calculationType, setCalculationType] = useState("heat-energy");
  const [temperatureMode, setTemperatureMode] = useState("change"); // 'change' or 'initial-final'

  // Result and UI states
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState("");

  // data get

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
  const [getSingleCalculatorDetails, { data, error }] =
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
  // data get
  // Unit conversion functions
  const convertMassToKg = (value, unit) => {
    const conversions = {
      g: 0.001,
      pg: 1e-15,
      ng: 1e-12,
      µg: 1e-9,
      mg: 1e-6,
      dag: 0.01,
      kg: 1,
      t: 1000,
      gr: 0.0000648,
      dr: 0.00177,
      oz: 0.0283495,
      lb: 0.453592,
      stone: 6.35029,
      "US ton": 907.185,
      "Long ton": 1016.05,
      u: 1.66054e-27,
    };
    return parseFloat(value) * conversions[unit];
  };

  const convertTempToK = (value, unit) => {
    const temp = parseFloat(value);
    switch (unit) {
      case "K":
        return temp;
      case "°C":
        return temp + 273.15;
      case "°F":
        return ((temp - 32) * 5) / 9 + 273.15;
      default:
        return temp;
    }
  };

  const convertSpecificHeat = (value, unit) => {
    const conversions = {
      "J/(g·K)": 1000, // Convert to J/(kg·K)
      "J/(kg·K)": 1,
      "cal/(kg·K)": 4184,
      "cal/(g·K)": 4184,
      "kcal/(kg·K)": 4184,
      "J/(kg·°C)": 1,
      "J/(g·°C)": 1000,
      "cal/(kg·°C)": 4184,
      "cal/(g·°C)": 4184000,
    };
    return parseFloat(value) * (conversions[unit] || 1);
  };

  // Validation functions
  const validateInputs = () => {
    setFormError("");

    const massKg = mass ? convertMassToKg(mass, massUnit) : null;
    const specHeat = specificHeat
      ? convertSpecificHeat(specificHeat, specificHeatUnit)
      : null;

    let tempChange;
    if (temperatureMode === "change") {
      tempChange = parseFloat(deltaTemp);
    } else {
      if (!initialTemp || !finalTemp) {
        setFormError("Please fill in both initial and final temperatures.");
        return false;
      }
      const initTempK = convertTempToK(initialTemp, tempUnit);
      const finalTempK = convertTempToK(finalTemp, tempUnit);
      tempChange = finalTempK - initTempK;
    }

    switch (calculationType) {
      case "heat-energy":
        if (
          !mass ||
          !specificHeat ||
          (temperatureMode === "change" && !deltaTemp) ||
          (temperatureMode === "initial-final" && (!initialTemp || !finalTemp))
        ) {
          setFormError(
            "Please fill in mass, specific heat, and temperature information to calculate heat energy."
          );
          return false;
        }
        if (massKg <= 0 || specHeat <= 0) {
          setFormError("Mass and specific heat must be positive values.");
          return false;
        }
        break;
      case "specific-heat":
        if (
          !heatEnergy ||
          !mass ||
          (temperatureMode === "change" && !deltaTemp) ||
          (temperatureMode === "initial-final" && (!initialTemp || !finalTemp))
        ) {
          setFormError(
            "Please fill in heat energy, mass, and temperature information to calculate specific heat."
          );
          return false;
        }
        if (parseFloat(heatEnergy) <= 0 || massKg <= 0 || tempChange === 0) {
          setFormError(
            "Heat energy and mass must be positive, and temperature change cannot be zero."
          );
          return false;
        }
        break;
      case "mass":
        if (
          !heatEnergy ||
          !specificHeat ||
          (temperatureMode === "change" && !deltaTemp) ||
          (temperatureMode === "initial-final" && (!initialTemp || !finalTemp))
        ) {
          setFormError(
            "Please fill in heat energy, specific heat, and temperature information to calculate mass."
          );
          return false;
        }
        if (parseFloat(heatEnergy) <= 0 || specHeat <= 0 || tempChange === 0) {
          setFormError(
            "Heat energy and specific heat must be positive, and temperature change cannot be zero."
          );
          return false;
        }
        break;
      case "initial-temperature":
      case "final-temperature":
      case "enthalpy-change":
        if (!mass || !specificHeat || !heatEnergy) {
          setFormError(
            "Please fill in the required fields for this calculation."
          );
          return false;
        }
        break;
      default:
        return false;
    }
    return true;
  };

  // Calculation functions
  const performCalculation = () => {
    const massKg = mass ? convertMassToKg(mass, massUnit) : null;
    const specHeat = specificHeat
      ? convertSpecificHeat(specificHeat, specificHeatUnit)
      : null;
    const heatEnergyJ = parseFloat(heatEnergy);

    let tempChange;
    if (temperatureMode === "change") {
      tempChange = parseFloat(deltaTemp);
    } else if (initialTemp && finalTemp) {
      const initTempK = convertTempToK(initialTemp, tempUnit);
      const finalTempK = convertTempToK(finalTemp, tempUnit);
      tempChange = finalTempK - initTempK;
    }

    switch (calculationType) {
      case "heat-energy":
        return {
          type: "Heat Energy",
          value: massKg * specHeat * tempChange,
          unit: "J",
          formula: "Q = m × c × ΔT",
          inputs: {
            mass: `${mass} ${massUnit}`,
            specificHeat: `${specificHeat} ${specificHeatUnit}`,
            tempChange:
              temperatureMode === "change"
                ? `${deltaTemp} ${tempUnit}`
                : `${tempChange.toFixed(2)} K`,
          },
        };
      case "mass":
        return {
          type: "Mass",
          value: heatEnergyJ / (specHeat * tempChange),
          unit: "kg",
          formula: "m = Q / (c × ΔT)",
          inputs: {
            heatEnergy: `${heatEnergy} J`,
            specificHeat: `${specificHeat} ${specificHeatUnit}`,
            tempChange:
              temperatureMode === "change"
                ? `${deltaTemp} ${tempUnit}`
                : `${tempChange.toFixed(2)} K`,
          },
        };
      case "specific-heat":
        return {
          type: "Specific Heat Capacity",
          value: heatEnergyJ / (massKg * tempChange),
          unit: "J/(kg·K)",
          formula: "c = Q / (m × ΔT)",
          inputs: {
            heatEnergy: `${heatEnergy} J`,
            mass: `${mass} ${massUnit}`,
            tempChange:
              temperatureMode === "change"
                ? `${deltaTemp} ${tempUnit}`
                : `${tempChange.toFixed(2)} K`,
          },
        };
      case "initial-temperature":
        const finalTempK = convertTempToK(finalTemp, tempUnit);
        const calculatedInitial =
          finalTempK - heatEnergyJ / (massKg * specHeat);
        return {
          type: "Initial Temperature",
          value: calculatedInitial,
          unit: "K",
          formula: "T₁ = T₂ - (Q / (m × c))",
          inputs: {
            finalTemp: `${finalTemp} ${tempUnit}`,
            heatEnergy: `${heatEnergy} J`,
            mass: `${mass} ${massUnit}`,
            specificHeat: `${specificHeat} ${specificHeatUnit}`,
          },
        };
      case "final-temperature":
        const initialTempK = convertTempToK(initialTemp, tempUnit);
        const calculatedFinal =
          initialTempK + heatEnergyJ / (massKg * specHeat);
        return {
          type: "Final Temperature",
          value: calculatedFinal,
          unit: "K",
          formula: "T₂ = T₁ + (Q / (m × c))",
          inputs: {
            initialTemp: `${initialTemp} ${tempUnit}`,
            heatEnergy: `${heatEnergy} J`,
            mass: `${mass} ${massUnit}`,
            specificHeat: `${specificHeat} ${specificHeatUnit}`,
          },
        };
      case "enthalpy-change":
        return {
          type: "Enthalpy Change",
          value: massKg * specHeat * tempChange,
          unit: "J",
          formula: "ΔH = m × c × ΔT",
          inputs: {
            mass: `${mass} ${massUnit}`,
            specificHeat: `${specificHeat} ${specificHeatUnit}`,
            tempChange:
              temperatureMode === "change"
                ? `${deltaTemp} ${tempUnit}`
                : `${tempChange.toFixed(2)} K`,
          },
        };
      default:
        return null;
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateInputs()) {
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const resultData = performCalculation();
      setResult(resultData);
      setIsLoading(false);
    }, 1000);
  };

  // Reset form
  const handleReset = () => {
    setMass("");
    setSpecificHeat("");
    setDeltaTemp("");
    setHeatEnergy("");
    setInitialTemp("");
    setFinalTemp("");
    setResult(null);
    setFormError("");
  };

  // majax
  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.5/MathJax.js?config=TeX-AMS_HTML";
    script.async = true;
    script.type = "text/javascript";
    script.onload = () => {
      window.MathJax &&
        window.MathJax.Hub.Queue(["Typeset", window.MathJax.Hub]);
    };
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [result]);
  // majax

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
      <div className="w-full mx-auto p-4 lg:p-8 md:p-8 input_form rounded-lg  space-y-6 mb-3">
        {formError && (
          <p className="text-red-500 text-lg font-semibold w-full">
            {formError}
          </p>
        )}
        <div className="from-blue-50 to-indigo-100 ">
          {/* Calculator Form */}
          <div className="rounded-lg p-2 ">
            <div className="grid grid-cols-12 gap-6">
              {/* Reaction Type */}
              <div className="col-span-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reaction Type:
                </label>
                <select
                  value={reactionType}
                  onChange={(e) => setReactionType(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="coffee-cup">
                    A chemical reaction in a coffee cup calorimeter
                  </option>
                  <option value="heat-exchange">
                    Heat exchange between several objects
                  </option>
                </select>
              </div>

              {/* Find Dropdown */}
              <div className="col-span-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Find:
                </label>
                <select
                  value={calculationType}
                  onChange={(e) => {
                    setCalculationType(e.target.value);
                    setFormError("");
                  }}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="heat-energy">Heat Energy</option>
                  <option value="specific-heat">Specific Heat</option>
                  <option value="mass">Mass</option>
                  <option value="initial-temperature">
                    Initial Temperature
                  </option>
                  <option value="final-temperature">Final Temperature</option>
                  <option value="enthalpy-change">Enthalpy Change</option>
                </select>
              </div>

              {/* Temperature Mode Selection */}
              <div className="col-span-12">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  By:
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="change"
                      checked={temperatureMode === "change"}
                      onChange={(e) => setTemperatureMode(e.target.value)}
                      className="mr-2"
                    />
                    Change of Temperature (ΔT)
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="initial-final"
                      checked={temperatureMode === "initial-final"}
                      onChange={(e) => setTemperatureMode(e.target.value)}
                      className="mr-2"
                    />
                    Initial & Final Temperature
                  </label>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              {/* Mass Input */}
              {calculationType !== "mass" && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Mass (m):
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      step="any"
                      value={mass}
                      onChange={(e) => setMass(e.target.value)}
                      className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter mass"
                    />
                    <select
                      style={{ width: "90px" }}
                      value={massUnit}
                      onChange={(e) => setMassUnit(e.target.value)}
                      className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    >
                      <option value="g">g</option>
                      <option value="pg">pg</option>
                      <option value="ng">ng</option>
                      <option value="µg">µg</option>
                      <option value="mg">mg</option>
                      <option value="dag">dag</option>
                      <option value="kg">kg</option>
                      <option value="t">t</option>
                      <option value="gr">gr</option>
                      <option value="dr">dr</option>
                      <option value="oz">oz</option>
                      <option value="lb">lb</option>
                      <option value="stone">stone</option>
                      <option value="US ton">US ton</option>
                      <option value="Long ton">Long ton</option>
                      <option value="u">u</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Specific Heat Input */}
              {calculationType !== "specific-heat" && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Specific heat capacity (c):
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      step="any"
                      value={specificHeat}
                      onChange={(e) => setSpecificHeat(e.target.value)}
                      className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter specific heat"
                    />
                    <select
                      style={{ width: "90px" }}
                      value={specificHeatUnit}
                      onChange={(e) => setSpecificHeatUnit(e.target.value)}
                      className=" p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs"
                    >
                      <option value="J/(g·K)">J/(g·K)</option>
                      <option value="J/(kg·K)">J/(kg·K)</option>
                      <option value="J/(kg·°C)">J/(kg·°C)</option>
                      <option value="cal/(kg·K)">cal/(kg·K)</option>
                      <option value="cal/g·K">cal/g·K</option>
                      <option value="kcal/(kg·K)">kcal/(kg·K)</option>
                      <option value="J/(g·°C)">J/(g·°C)</option>
                      <option value="cal/(kg·°C)">cal/(kg·°C)</option>
                      <option value="cal/(g·°C)">cal/(g·°C)</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Temperature Change Input */}
              {temperatureMode === "change" && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Change of Temperature (ΔT):
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      step="any"
                      value={deltaTemp}
                      onChange={(e) => setDeltaTemp(e.target.value)}
                      className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter temperature change"
                    />
                    <select
                      style={{ width: "90px" }}
                      value={tempUnit}
                      onChange={(e) => setTempUnit(e.target.value)}
                      className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="K">K</option>
                      <option value="°C">°C</option>
                      <option value="°F">°F</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Initial Temperature Input */}
              {temperatureMode === "initial-final" &&
                calculationType !== "initial-temperature" && (
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Initial Temperature:
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="number"
                        step="any"
                        value={initialTemp}
                        onChange={(e) => setInitialTemp(e.target.value)}
                        className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter initial temperature"
                      />
                      <select
                        value={tempUnit}
                        onChange={(e) => setTempUnit(e.target.value)}
                        className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="K">K</option>
                        <option value="°C">°C</option>
                        <option value="°F">°F</option>
                      </select>
                    </div>
                  </div>
                )}

              {/* Final Temperature Input */}
              {temperatureMode === "initial-final" &&
                calculationType !== "final-temperature" && (
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Final Temperature:
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="number"
                        step="any"
                        value={finalTemp}
                        onChange={(e) => setFinalTemp(e.target.value)}
                        className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter final temperature"
                      />
                      <select
                        value={tempUnit}
                        onChange={(e) => setTempUnit(e.target.value)}
                        className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="K">K</option>
                        <option value="°C">°C</option>
                        <option value="°F">°F</option>
                      </select>
                    </div>
                  </div>
                )}

              {/* Heat Energy Input */}
              {calculationType !== "heat-energy" &&
                calculationType !== "enthalpy-change" && (
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Heat Energy (Q):
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="number"
                        step="any"
                        value={heatEnergy}
                        onChange={(e) => setHeatEnergy(e.target.value)}
                        className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter heat energy"
                      />
                      {/* <span className="flex items-center px-3 text-gray-500 font-medium">
                        J
                      </span> */}
                    </div>
                  </div>
                )}
            </div>

            {/* Calculate Button */}

            <div className="mb-6 mt-10 text-center space-x-2">
              <Button type="submit" onClick={handleSubmit}>
                {data?.payload?.tech_lang_keys["calculate"]}
              </Button>

              {/* Reset button sirf tab show karo jab results available hon */}
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
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          </div>
        </div>
      )}
      {/* Results */}
      {result && !isLoading && (
        <>
          <div className="w-full result mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg space-y-6 result">
            <div>
              <ResultActions lang={data?.payload?.tech_lang_keys} />
              {/* Overall Comparison */}
              <div className=" rounded-lg    mb-6 mt-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <h3 className="text-lg font-semibold text-blue-800 mb-2">
                    {result.type}
                  </h3>
                  <p className="text-3xl font-bold text-blue-600">
                    {result.value.toFixed(4)}{" "}
                    <span className="text-lg font-medium">{result.unit}</span>
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-3">
                      Formula Used
                    </h4>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                      <code className="text-lg font-mono text-gray-700">
                        {result.formula}
                      </code>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-3">
                      Input Values
                    </h4>
                    <div className="space-y-2">
                      {Object.entries(result.inputs).map(([key, value]) => (
                        <div
                          key={key}
                          className="flex justify-between items-center bg-gray-50 px-3 py-2 rounded"
                        >
                          <span className="font-medium text-gray-600 capitalize">
                            {key.replace(/([A-Z])/g, " $1").trim()}:
                          </span>
                          <span className="font-semibold text-gray-800">
                            {value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Reset Button */}
              </div>
            </div>
          </div>
        </>
      )}

      <CalculatorFeedback calName={data?.payload?.tech_calculator_title} />
    </Calculator>
  );
};

export default CalorimetryCalculator;

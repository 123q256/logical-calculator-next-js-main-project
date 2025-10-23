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

const ChemicalEquationBalancer = () => {
  const [equation, setEquation] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
  const [getSingleCalculatorDetails, { data, isLoading }] =
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

  const [formError, setFormError] = useState("");

  // RTK mutation hook   // data get
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useMidpointCalculatorMutation();
  // data get

  // Atomic masses for common elements
  const atomicMasses = {
    H: 1.008,
    He: 4.003,
    Li: 6.941,
    Be: 9.012,
    B: 10.811,
    C: 12.011,
    N: 14.007,
    O: 15.999,
    F: 18.998,
    Ne: 20.18,
    Na: 22.99,
    Mg: 24.305,
    Al: 26.982,
    Si: 28.086,
    P: 30.974,
    S: 32.065,
    Cl: 35.453,
    Ar: 39.948,
    K: 39.098,
    Ca: 40.078,
    Sc: 44.956,
    Ti: 47.867,
    V: 50.942,
    Cr: 51.996,
    Mn: 54.938,
    Fe: 55.845,
    Co: 58.933,
    Ni: 58.693,
    Cu: 63.546,
    Zn: 65.38,
    Ga: 69.723,
    Ge: 72.64,
    As: 74.922,
    Se: 78.96,
    Br: 79.904,
    Kr: 83.798,
    Rb: 85.468,
    Sr: 87.62,
    Y: 88.906,
    Zr: 91.224,
    Nb: 92.906,
    Mo: 95.96,
    Tc: 98,
    Ru: 101.07,
    Rh: 102.906,
    Pd: 106.42,
    Ag: 107.868,
    Cd: 112.411,
    In: 114.818,
    Sn: 118.71,
    Sb: 121.76,
    Te: 127.6,
    I: 126.905,
    Xe: 131.293,
    Cs: 132.905,
    Ba: 137.327,
  };

  // Function to parse chemical formula and extract elements
  const parseFormula = (formula) => {
    const elements = {};
    const regex = /([A-Z][a-z]?)(\d*)/g;
    let match;

    while ((match = regex.exec(formula)) !== null) {
      const element = match[1];
      const count = parseInt(match[2]) || 1;
      elements[element] = (elements[element] || 0) + count;
    }

    return elements;
  };

  // Function to calculate molar mass
  const calculateMolarMass = (formula) => {
    const elements = parseFormula(formula);
    let molarMass = 0;

    for (const [element, count] of Object.entries(elements)) {
      if (atomicMasses[element]) {
        molarMass += atomicMasses[element] * count;
      }
    }

    return parseFloat(molarMass.toFixed(3));
  };

  // Function to balance chemical equation using matrix method
  const balanceEquation = (equation) => {
    try {
      // Clean and split the equation
      const cleanEquation = equation.replace(/\s+/g, "").toUpperCase();
      const [reactants, products] = cleanEquation.split("->").map((side) =>
        side
          .split("+")
          .map((compound) => compound.trim())
          .filter((c) => c)
      );

      if (
        !reactants ||
        !products ||
        reactants.length === 0 ||
        products.length === 0
      ) {
        throw new Error(
          "Invalid equation format. Use -> to separate reactants and products"
        );
      }

      // Get all unique elements
      const allCompounds = [...reactants, ...products];
      const elements = new Set();

      allCompounds.forEach((compound) => {
        const parsed = parseFormula(compound);
        Object.keys(parsed).forEach((element) => elements.add(element));
      });

      const elementList = Array.from(elements);

      // Create coefficient matrix
      const matrix = [];
      elementList.forEach((element) => {
        const row = [];

        // Reactants (positive)
        reactants.forEach((compound) => {
          const parsed = parseFormula(compound);
          row.push(parsed[element] || 0);
        });

        // Products (negative)
        products.forEach((compound) => {
          const parsed = parseFormula(compound);
          row.push(-(parsed[element] || 0));
        });

        matrix.push(row);
      });

      // Simple balancing for common equations
      const totalCompounds = reactants.length + products.length;
      let coefficients = new Array(totalCompounds).fill(1);

      // Try simple integer combinations
      for (let multiplier = 1; multiplier <= 10; multiplier++) {
        for (let i = 0; i < totalCompounds; i++) {
          coefficients[i] = multiplier;

          // Check if this balances the equation
          let balanced = true;
          for (let j = 0; j < matrix.length; j++) {
            let sum = 0;
            for (let k = 0; k < totalCompounds; k++) {
              sum += matrix[j][k] * coefficients[k];
            }
            if (sum !== 0) {
              balanced = false;
              break;
            }
          }

          if (balanced) {
            return {
              reactants: reactants.map((r, idx) => ({
                formula: r,
                coefficient: coefficients[idx],
              })),
              products: products.map((p, idx) => ({
                formula: p,
                coefficient: coefficients[reactants.length + idx],
              })),
            };
          }
        }
      }

      // Try combinations for simple cases
      if (reactants.length === 2 && products.length === 1) {
        // A + B -> C type
        for (let a = 1; a <= 5; a++) {
          for (let b = 1; b <= 5; b++) {
            for (let c = 1; c <= 5; c++) {
              coefficients = [a, b, c];
              let balanced = true;

              for (let j = 0; j < matrix.length; j++) {
                let sum =
                  matrix[j][0] * a + matrix[j][1] * b + matrix[j][2] * c;
                if (sum !== 0) {
                  balanced = false;
                  break;
                }
              }

              if (balanced) {
                return {
                  reactants: reactants.map((r, idx) => ({
                    formula: r,
                    coefficient: coefficients[idx],
                  })),
                  products: products.map((p, idx) => ({
                    formula: p,
                    coefficient: coefficients[reactants.length + idx],
                  })),
                };
              }
            }
          }
        }
      }

      // Default return with coefficients of 1
      return {
        reactants: reactants.map((r) => ({ formula: r, coefficient: 1 })),
        products: products.map((p) => ({ formula: p, coefficient: 1 })),
      };
    } catch (err) {
      throw new Error(err.message || "Error balancing equation");
    }
  };

  const handleSubmit = () => {
    if (!equation.trim()) {
      setError("Please enter a chemical equation");
      return;
    }

    if (!equation.includes("->") && !equation.includes("=")) {
      setError("Please use -> or = to separate reactants and products");
      return;
    }

    setLoading(true);
    setError("");

    setTimeout(() => {
      try {
        // Replace = with -> for consistency
        const normalizedEquation = equation.replace("=", "->");
        const balanced = balanceEquation(normalizedEquation);

        setResult({
          original: equation,
          balanced: balanced,
          success: true,
          detailedData: generateDetailedData(balanced),
        });
      } catch (err) {
        setError(err.message);
        setResult(null);
      } finally {
        setLoading(false);
      }
    }, 800);
  };

  const handleReset = () => {
    setEquation("");
    setResult(null);
    setError("");
  };

  const formatBalancedEquation = (balanced) => {
    const reactantsStr = balanced.reactants
      .map((r) => `${r.coefficient > 1 ? r.coefficient : ""}${r.formula}`)
      .join(" + ");

    const productsStr = balanced.products
      .map((p) => `${p.coefficient > 1 ? p.coefficient : ""}${p.formula}`)
      .join(" + ");

    return `${reactantsStr} → ${productsStr}`;
  };

  const generateDetailedData = (balanced) => {
    const reactantsData = balanced.reactants.map((r) => ({
      ...r,
      molarMass: calculateMolarMass(r.formula),
      type: "reactant",
    }));

    const productsData = balanced.products.map((p) => ({
      ...p,
      molarMass: calculateMolarMass(p.formula),
      type: "product",
    }));

    return {
      reactants: reactantsData,
      products: productsData,
    };
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert("Copied to clipboard!");
    });
  };

  const examples = [
    "H2 + O2 -> H2O",
    "CH4 + O2 -> CO2 + H2O",
    "Fe + O2 -> Fe2O3",
    "C2H6 + O2 -> CO2 + H2O",
    "Al + HCl -> AlCl3 + H2",
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
          path: pathname, // This will use the current path dynamically
        },
      ]}
    >
      <div className="w-full mx-auto p-4 lg:p-8 md:p-8 input_form rounded-lg  space-y-6 mb-3">
        {error && (
          <p className="text-red-500 text-lg font-semibold w-full">{error}</p>
        )}
        <div className="lg:w-[70%] md:w-[80%] w-full mx-auto ">
          <div className="grid grid-cols-12 mt-3   gap-2 md:gap-4 lg:gap-4">
            <div className="col-span-12">
              <div className=" from-blue-50 via-white to-purple-50 p-4">
                <div className=" mx-auto">
                  {/* Main Calculator */}
                  <div className="mb-6">
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Enter Chemical Equation
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={equation}
                            onChange={(e) => setEquation(e.target.value)}
                            placeholder="e.g., H2 + O2 -> H2O"
                            className="input"
                            onKeyPress={(e) =>
                              e.key === "Enter" && handleSubmit()
                            }
                          />
                        </div>
                        <p className="text-sm text-gray-500 mt-2">
                          Use '-&gt;' or '=' to separate reactants and products.
                          Use '+' to separate multiple compounds.
                        </p>
                      </div>

                      <div className="text-center space-x-4">
                        <Button
                          onClick={handleSubmit}
                          disabled={loading}
                          className="bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
                        >
                          {loading ? "Calculating..." : "Calculate"}
                        </Button>

                        {result && (
                          <ResetButton
                            onClick={handleReset}
                            className="bg-gray-600 text-white px-8 py-3 rounded-md hover:bg-gray-700 transition-colors"
                          >
                            Reset
                          </ResetButton>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className=" w-full mx-auto ">
          <div className="grid grid-cols-12 mt-3   gap-2 md:gap-4 lg:gap-4">
            <div className="col-span-12">
              {/* Examples */}
              <div className="bg-white p-3">
                <h3 className="text-lg font-bold text-gray-800 mb-4">
                  Example Equations
                </h3>
                <div className="grid grid-cols-12 gap-1">
                  {examples.map((example, idx) => (
                    <button
                      key={idx}
                      onClick={() => setEquation(example)}
                      className="col-span-12 cursor-pointer md:col-span-6 text-left p-3 hover:bg-blue-50 rounded-xl transition-colors font-mono text-sm border border-gray-200 hover:border-blue-300"
                    >
                      {example}
                    </button>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-xl">
                  <h4 className="font-semibold text-blue-800 mb-2">
                    How to use:
                  </h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>
                      • Enter chemical formulas using proper notation (e.g.,
                      H2O, CO2)
                    </li>
                    <li>• Use + to separate multiple reactants or products</li>
                    <li>
                      • Use '-&gt;' or = to separate reactants from products
                    </li>
                    <li>• Click examples above to try common equations</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="w-full mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg  space-y-6 result">
          <div className="animate-pulse">
            <div className=" w-full h-[30px] bg-gray-300 animate-pulse rounded-[10px] mb-4"></div>
            <div className="w-[75%] h-[20px] bg-gray-300 animate-pulse rounded-[10px] mb-3"></div>
            <div className="w-[50%] h-[20px] bg-gray-300 animate-pulse rounded-[10px] mb-3"></div>
            <div className="w-[25%] h-[20px] bg-gray-300 animate-pulse rounded-[10px]"></div>
          </div>
        </div>
      )}

      {/* Result */}
      {result && !loading && (
        <div className="w-full mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg  space-y-6 result">
          <div>
            <ResultActions lang={data?.payload?.tech_lang_keys} />

            <div className=" rounded-2xl  mt-2 mb-6">
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-xl bordered">
                  <h3 className="text-sm font-medium text-gray-600 mb-2">
                    Original:
                  </h3>
                  <p className="text-lg font-mono text-gray-800">
                    {result.original}
                  </p>
                </div>
                <div className="p-4 bg-green-50 rounded-xl bordered">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-green-700">
                      Balanced:
                    </h3>
                    <button
                      onClick={() =>
                        copyToClipboard(formatBalancedEquation(result.balanced))
                      }
                      className="text-xs bg-green-200 hover:bg-green-300 px-2 py-1 rounded transition-colors"
                    >
                      Copy
                    </button>
                  </div>
                  <p className="text-xl font-mono text-green-800 font-semibold">
                    {formatBalancedEquation(result.balanced)}
                  </p>
                </div>

                {/* Detailed Analysis Table */}
                {result.detailedData && (
                  <div className="mt-6 overflow-x-auto">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4">
                      {" "}
                      Detailed Analysis
                    </h4>

                    {/* Reactants Table */}
                    <div className="mb-6">
                      <h5 className="text-md font-semibold text-blue-800 mb-3">
                        Reactants
                      </h5>
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse border border-blue-200 rounded-lg">
                          <thead>
                            <tr className="bg-blue-100">
                              <th className="border border-blue-200 px-3 py-2 text-left">
                                Compound
                              </th>
                              <th className="border border-blue-200 px-3 py-2 text-center">
                                Coefficient
                              </th>
                              <th className="border border-blue-200 px-3 py-2 text-center">
                                Molar Mass (g/mol)
                              </th>
                              <th className="border border-blue-200 px-3 py-2 text-center">
                                Formula Weight
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {result.detailedData.reactants.map(
                              (reactant, idx) => (
                                <tr key={idx} className="hover:bg-blue-50">
                                  <td className="border border-blue-200 px-3 py-2 font-mono">
                                    {reactant.formula}
                                  </td>
                                  <td className="border border-blue-200 px-3 py-2 text-center font-semibold">
                                    {reactant.coefficient}
                                  </td>
                                  <td className="border border-blue-200 px-3 py-2 text-center">
                                    {reactant.molarMass}
                                  </td>
                                  <td className="border border-blue-200 px-3 py-2 text-center">
                                    {(
                                      reactant.coefficient * reactant.molarMass
                                    ).toFixed(3)}
                                  </td>
                                </tr>
                              )
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Products Table */}
                    <div>
                      <h5 className="text-md font-semibold text-green-800 mb-3">
                        Products
                      </h5>
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse border border-green-200 rounded-lg">
                          <thead>
                            <tr className="bg-green-100">
                              <th className="border border-green-200 px-3 py-2 text-left">
                                Compound
                              </th>
                              <th className="border border-green-200 px-3 py-2 text-center">
                                Coefficient
                              </th>
                              <th className="border border-green-200 px-3 py-2 text-center">
                                Molar Mass (g/mol)
                              </th>
                              <th className="border border-green-200 px-3 py-2 text-center">
                                Formula Weight
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {result.detailedData.products.map(
                              (product, idx) => (
                                <tr key={idx} className="hover:bg-green-50">
                                  <td className="border border-green-200 px-3 py-2 font-mono">
                                    {product.formula}
                                  </td>
                                  <td className="border border-green-200 px-3 py-2 text-center font-semibold">
                                    {product.coefficient}
                                  </td>
                                  <td className="border border-green-200 px-3 py-2 text-center">
                                    {product.molarMass}
                                  </td>
                                  <td className="border border-green-200 px-3 py-2 text-center">
                                    {(
                                      product.coefficient * product.molarMass
                                    ).toFixed(3)}
                                  </td>
                                </tr>
                              )
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid md:grid-cols-2 gap-4 mt-6">
                  <div className="p-4 border border-blue-200 rounded-xl bordered">
                    <h4 className="font-semibold text-blue-800 mb-2">
                      Reactants
                    </h4>
                    {result.balanced.reactants.map((reactant, idx) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span>{reactant.formula}</span>
                        <span className="font-mono">
                          Coefficient: {reactant.coefficient}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 border border-green-200 rounded-xl bordered">
                    <h4 className="font-semibold text-green-800 mb-2">
                      Products
                    </h4>
                    {result.balanced.products.map((product, idx) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span>{product.formula}</span>
                        <span className="font-mono">
                          Coefficient: {product.coefficient}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <CalculatorFeedback calName={data?.payload?.tech_calculator_title} />
    </Calculator>
  );
};

export default ChemicalEquationBalancer;

"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const RedoxReactionCalculator = () => {
  const [equation, setEquation] = useState(
    "Cr2O7^2- + H^+ + e^- = Cr^3+ + H2O"
  );
  const [result, setResult] = useState(null);
  const [showResult, setShowResult] = useState(false);

  const periodicElements = [
    // Row 1
    [
      ["H", "bg-green-300"],
      ["", ""],
      ["", ""],
      ["", ""],
      ["", ""],
      ["", ""],
      ["", ""],
      ["", ""],
      ["", ""],
      ["", ""],
      ["", ""],
      ["", ""],
      ["", ""],
      ["", ""],
      ["", ""],
      ["", ""],
      ["", ""],
      ["He", "bg-pink-300"],
    ],
    // Row 2
    [
      ["Li", "bg-yellow-300"],
      ["Be", "bg-orange-200"],
      ["", ""],
      ["", ""],
      ["", ""],
      ["", ""],
      ["", ""],
      ["", ""],
      ["", ""],
      ["", ""],
      ["", ""],
      ["", ""],
      ["B", "bg-green-200"],
      ["C", "bg-green-300"],
      ["N", "bg-green-300"],
      ["O", "bg-green-300"],
      ["F", "bg-cyan-300"],
      ["Ne", "bg-pink-300"],
    ],
    // Row 3
    [
      ["Na", "bg-yellow-300"],
      ["Mg", "bg-orange-200"],
      ["", ""],
      ["", ""],
      ["", ""],
      ["", ""],
      ["", ""],
      ["", ""],
      ["", ""],
      ["", ""],
      ["", ""],
      ["", ""],
      ["Al", "bg-gray-300"],
      ["Si", "bg-green-200"],
      ["P", "bg-green-300"],
      ["S", "bg-green-300"],
      ["Cl", "bg-cyan-300"],
      ["Ar", "bg-pink-300"],
    ],
    // Row 4
    [
      ["K", "bg-yellow-300"],
      ["Ca", "bg-orange-200"],
      ["Sc", "bg-orange-300"],
      ["Ti", "bg-orange-300"],
      ["V", "bg-orange-300"],
      ["Cr", "bg-orange-300"],
      ["Mn", "bg-orange-300"],
      ["Fe", "bg-orange-300"],
      ["Co", "bg-orange-300"],
      ["Ni", "bg-orange-300"],
      ["Cu", "bg-orange-300"],
      ["Zn", "bg-orange-300"],
      ["Ga", "bg-gray-300"],
      ["Ge", "bg-green-200"],
      ["As", "bg-green-200"],
      ["Se", "bg-green-300"],
      ["Br", "bg-cyan-300"],
      ["Kr", "bg-pink-300"],
    ],
    // Row 5
    [
      ["Rb", "bg-yellow-300"],
      ["Sr", "bg-orange-200"],
      ["Y", "bg-orange-300"],
      ["Zr", "bg-orange-300"],
      ["Nb", "bg-orange-300"],
      ["Mo", "bg-orange-300"],
      ["Tc", "bg-orange-300"],
      ["Ru", "bg-orange-300"],
      ["Rh", "bg-orange-300"],
      ["Pd", "bg-orange-300"],
      ["Ag", "bg-orange-300"],
      ["Cd", "bg-orange-300"],
      ["In", "bg-gray-300"],
      ["Sn", "bg-gray-300"],
      ["Sb", "bg-green-200"],
      ["Te", "bg-green-200"],
      ["I", "bg-cyan-300"],
      ["Xe", "bg-pink-300"],
    ],
    // Row 6
    [
      ["Cs", "bg-yellow-300"],
      ["Ba", "bg-orange-200"],
      ["La", "bg-pink-200"],
      ["Hf", "bg-orange-300"],
      ["Ta", "bg-orange-300"],
      ["W", "bg-orange-300"],
      ["Re", "bg-orange-300"],
      ["Os", "bg-orange-300"],
      ["Ir", "bg-orange-300"],
      ["Pt", "bg-orange-300"],
      ["Au", "bg-orange-300"],
      ["Hg", "bg-orange-300"],
      ["Tl", "bg-gray-300"],
      ["Pb", "bg-gray-300"],
      ["Bi", "bg-gray-300"],
      ["Po", "bg-green-200"],
      ["At", "bg-cyan-300"],
      ["Rn", "bg-pink-300"],
    ],
    // Row 7
    [
      ["Fr", "bg-yellow-300"],
      ["Ra", "bg-orange-200"],
      ["Ac", "bg-purple-300"],
      ["Rf", "bg-orange-300"],
      ["Db", "bg-orange-300"],
      ["Sg", "bg-orange-300"],
      ["Bh", "bg-orange-300"],
      ["Hs", "bg-orange-300"],
      ["Mt", "bg-orange-300"],
      ["Ds", "bg-orange-300"],
      ["Rg", "bg-orange-300"],
      ["Cn", "bg-orange-300"],
      ["Nh", "bg-gray-400"],
      ["Fl", "bg-gray-400"],
      ["Mc", "bg-gray-400"],
      ["Lv", "bg-gray-400"],
      ["Ts", "bg-gray-400"],
      ["Og", "bg-gray-400"],
    ],
  ];

  const lanthanides = [
    ["Ce", "bg-pink-200"],
    ["Pr", "bg-pink-200"],
    ["Nd", "bg-pink-200"],
    ["Pm", "bg-pink-200"],
    ["Sm", "bg-pink-200"],
    ["Eu", "bg-pink-200"],
    ["Gd", "bg-pink-200"],
    ["Tb", "bg-pink-200"],
    ["Dy", "bg-pink-200"],
    ["Ho", "bg-pink-200"],
    ["Er", "bg-pink-200"],
    ["Tm", "bg-pink-200"],
    ["Yb", "bg-pink-200"],
    ["Lu", "bg-pink-200"],
  ];

  const actinides = [
    ["Th", "bg-purple-300"],
    ["Pa", "bg-purple-300"],
    ["U", "bg-purple-300"],
    ["Np", "bg-purple-300"],
    ["Pu", "bg-purple-300"],
    ["Am", "bg-purple-300"],
    ["Cm", "bg-purple-300"],
    ["Bk", "bg-purple-300"],
    ["Cf", "bg-purple-300"],
    ["Es", "bg-purple-300"],
    ["Fm", "bg-purple-300"],
    ["Md", "bg-purple-300"],
    ["No", "bg-purple-300"],
    ["Lr", "bg-purple-300"],
  ];

  const numbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "+", "-"];

  const handleElementClick = (element) => {
    if (element && element.trim()) {
      setEquation((prev) => prev + element);
    }
  };

  const handleNumberClick = (num) => {
    setEquation((prev) => prev + num);
  };

  const handleSpace = () => {
    setEquation((prev) => prev + " ");
  };

  const handleClear = () => {
    setEquation("");
  };

  const handleReset = () => {
    setEquation("");
    setResult(null);
    setShowResult(false);
  };

  const loadExample = () => {
    setEquation("Cr2O7^2- + H^+ + e^- = Cr^3+ + H2O");
  };

  const balanceRedoxEquation = (inputEq) => {
    // Simple equation balancing logic - in real app this would be more complex
    const cleanEq = inputEq.replace(/\s+/g, "").toLowerCase();

    // Example equations and their balanced forms
    const equations = {
      "h2+o2=h2o": "H₂ + O₂ → H₂O",
      "h2+o2→h2o": "H₂ + O₂ → H₂O",
      "cr2o7^2-+h^++e^-=cr^3++h2o": "Cr₂O₇²⁻ + 14 H⁺ + 6 e⁻ → 2 Cr³⁺ + 7 H₂O",
      "cr2o7^2-+h^++e^-→cr^3++h2o": "Cr₂O₇²⁻ + 14 H⁺ + 6 e⁻ → 2 Cr³⁺ + 7 H₂O",
      "fe+o2=fe2o3": "4 Fe + 3 O₂ → 2 Fe₂O₃",
      "fe+o2→fe2o3": "4 Fe + 3 O₂ → 2 Fe₂O₃",
      "al+o2=al2o3": "4 Al + 3 O₂ → 2 Al₂O₃",
      "al+o2→al2o3": "4 Al + 3 O₂ → 2 Al₂O₃",
      "mg+o2=mgo": "2 Mg + O₂ → 2 MgO",
      "mg+o2→mgo": "2 Mg + O₂ → 2 MgO",
      "ca+h2o=ca(oh)2+h2": "Ca + 2 H₂O → Ca(OH)₂ + H₂",
      "ca+h2o→ca(oh)2+h2": "Ca + 2 H₂O → Ca(OH)₂ + H₂",
    };

    return equations[cleanEq] || inputEq.replace(/=/g, "→");
  };

  const calculateReaction = () => {
    if (!equation.trim()) return;

    const balancedEquation = balanceRedoxEquation(equation);

    setResult({
      input: equation,
      balanced: balancedEquation,
      oxidized: "Elements are being oxidized (losing electrons)",
      reduced: "Elements are being reduced (gaining electrons)",
    });
    setShowResult(true);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 bg-gray-50 min-h-screen">
      <div className="bg-blue-600 text-white p-4 rounded-t-lg">
        <h1 className="text-2xl font-bold">Redox Reaction Calculator</h1>
      </div>

      <div className="input_form p-6 rounded-b-lg">
        <p className="text-gray-700 mb-6">
          Enter the chemical equation and the calculator will immediately let
          you know which element is oxidised and which is reduced in it.
        </p>

        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <label className="font-medium text-gray-700">
              Enter an Equation:
            </label>
            <button
              onClick={loadExample}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 cursor-pointer"
            >
              Load Example
            </button>
          </div>

          <input
            type="text"
            value={equation}
            onChange={(e) => setEquation(e.target.value)}
            className="w-full p-3 bordered border-gray-300 rounded-lg text-lg"
            placeholder="Enter redox equation"
          />
        </div>

        {/* Periodic Table */}
        <div className="mb-6">
          {/* Main periodic table */}
          <div className="mb-4">
            {periodicElements.map((row, rowIndex) => (
              <div key={rowIndex} className="flex gap-1 mb-1">
                {row.map(([element, colorClass], colIndex) => (
                  <button
                    key={`${rowIndex}-${colIndex}`}
                    onClick={() => handleElementClick(element)}
                    disabled={!element.trim()}
                    className={`w-10 h-10 text-xs font-bold rounded ${
                      element.trim()
                        ? `${colorClass} hover:opacity-80 text-gray-800 cursor-pointer`
                        : "bg-transparent cursor-default"
                    }`}
                  >
                    {element}
                  </button>
                ))}
              </div>
            ))}
          </div>

          {/* Lanthanides and Actinides */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium w-20">Lanthanoids</span>
              <div className="flex gap-1">
                {lanthanides.map(([element, colorClass]) => (
                  <button
                    key={element}
                    onClick={() => handleElementClick(element)}
                    className={`w-10 h-10 text-xs font-bold cursor-pointer rounded ${colorClass} hover:opacity-80 text-gray-800`}
                  >
                    {element}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm font-medium w-20">Actinoids</span>
              <div className="flex gap-1">
                {actinides.map(([element, colorClass]) => (
                  <button
                    key={element}
                    onClick={() => handleElementClick(element)}
                    className={`w-10 h-10 text-xs cursor-pointer font-bold rounded ${colorClass} hover:opacity-80 text-gray-800`}
                  >
                    {element}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Control buttons */}
          <div className="flex gap-2 mb-4 justify-center items-center">
            <button
              onClick={handleSpace}
              className="bg-blue-600 cursor-pointer text-white px-6 py-2 rounded hover:bg-blue-700 font-medium"
            >
              SPACE
            </button>
            {numbers.map((num) => (
              <button
                key={num}
                onClick={() => handleNumberClick(num)}
                className="w-10 h-10 bg-purple-200 cursor-pointer hover:bg-purple-300 text-gray-800 font-bold rounded"
              >
                {num}
              </button>
            ))}
            <button
              onClick={handleClear}
              className="bg-blue-600 text-white cursor-pointer px-6 py-2 rounded hover:bg-blue-700 font-medium"
            >
              CLEAR
            </button>
          </div>
        </div>

        <div className="text-center mb-8">
          <div className="flex gap-4 justify-center">
            <button
              onClick={calculateReaction}
              className="bg-blue-600 cursor-pointer text-white px-12 py-3 text-lg font-bold rounded-lg hover:bg-blue-700"
            >
              CALCULATE
            </button>
            {showResult && (
              <button
                onClick={handleReset}
                className="bg-gray-500 cursor-pointer text-white px-12 py-3 text-lg font-bold rounded-lg hover:bg-gray-600"
              >
                RESET
              </button>
            )}
          </div>
        </div>

        {showResult && result && (
          <div className="bg-white bordered rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-blue-600">Result:</h2>
            </div>

            <div className="space-y-6">
              <div className="text-center">
                <p className="font-medium text-gray-700 mb-2">Your Input</p>
                <p className="text-lg  p-3 rounded bordered">{result.input}</p>
              </div>

              <div className="text-center">
                <p className="font-medium text-gray-700 mb-3">
                  Balanced Equation:
                </p>
                <div className="text-2xl font-mono  p-4 rounded bordered">
                  {result.balanced}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-red-50 p-4 rounded bordered border-red-200">
                  <h3 className="font-semibold text-red-800 mb-2">
                    Reduction (Gains electrons)
                  </h3>
                  <p className="text-red-700">Cr₂O₇²⁻ → 2 Cr³⁺</p>
                  <p className="text-sm text-red-600 mt-1">
                    Oxidation state: +6 → +3
                  </p>
                </div>

                <div className="bg-blue-50 p-4 rounded bordered border-blue-200">
                  <h3 className="font-semibold text-blue-800 mb-2">
                    Oxidation (Loses electrons)
                  </h3>
                  <p className="text-blue-700">6 e⁻ are consumed</p>
                  <p className="text-sm text-blue-600 mt-1">
                    Electrons transferred: 6
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RedoxReactionCalculator;

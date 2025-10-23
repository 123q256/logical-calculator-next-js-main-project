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

const LimitingReactantCalculator = () => {
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
  // data get

  // RTK mutation hook   // data get
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useMidpointCalculatorMutation();
  // data get

  const [equation, setEquation] = useState("Fe + O2 = Fe2O3");
  const [reactants, setReactants] = useState([
    {
      compound: "Fe",
      coefficient: 4,
      molarMass: 55.845,
      moles: 3,
      weight: 167.535,
    },
    {
      compound: "O2",
      coefficient: 3,
      molarMass: 31.9988,
      moles: 4,
      weight: 127.9952,
    },
  ]);
  const [products, setProducts] = useState([
    {
      compound: "Fe2O3",
      coefficient: 2,
      molarMass: 159.6882,
      moles: 1.5,
      weight: 239.5323,
    },
  ]);
  const [result, setResult] = useState(null);
  const [showResult, setShowResult] = useState(false);

  const periodicElements = [
    ["H", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "He"],
    [
      "Li",
      "Be",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "B",
      "C",
      "N",
      "O",
      "F",
      "Ne",
    ],
    [
      "Na",
      "Mg",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "Al",
      "Si",
      "P",
      "S",
      "Cl",
      "Ar",
    ],
    [
      "K",
      "Ca",
      "Sc",
      "Ti",
      "V",
      "Cr",
      "Mn",
      "Fe",
      "Co",
      "Ni",
      "Cu",
      "Zn",
      "Ga",
      "Ge",
      "As",
      "Se",
      "Br",
      "Kr",
    ],
    [
      "Rb",
      "Sr",
      "Y",
      "Zr",
      "Nb",
      "Mo",
      "Tc",
      "Ru",
      "Rh",
      "Pd",
      "Ag",
      "Cd",
      "In",
      "Sn",
      "Sb",
      "Te",
      "I",
      "Xe",
    ],
    [
      "Cs",
      "Ba",
      "La",
      "Hf",
      "Ta",
      "W",
      "Re",
      "Os",
      "Ir",
      "Pt",
      "Au",
      "Hg",
      "Tl",
      "Pb",
      "Bi",
      "Po",
      "At",
      "Rn",
    ],
    [
      "Fr",
      "Ra",
      "Ac",
      "Rf",
      "Db",
      "Sg",
      "Bh",
      "Hs",
      "Mt",
      "Ds",
      "Rg",
      "Cn",
      "Nh",
      "Fl",
      "Mc",
      "Lv",
      "Ts",
      "Og",
    ],
  ];

  const lanthanides = [
    "Ce",
    "Pr",
    "Nd",
    "Pm",
    "Sm",
    "Eu",
    "Gd",
    "Tb",
    "Dy",
    "Ho",
    "Er",
    "Tm",
    "Yb",
    "Lu",
  ];
  const actinides = [
    "Th",
    "Pa",
    "U",
    "Np",
    "Pu",
    "Am",
    "Cm",
    "Bk",
    "Cf",
    "Es",
    "Fm",
    "Md",
    "No",
    "Lr",
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

  const loadExample = () => {
    setEquation("Fe + O2 = Fe2O3");
  };

  const calculateReaction = () => {
    // Simulate calculation - in real app this would be complex chemistry calculations
    setResult({
      balancedEquation: "4 Fe + 3 O₂ → 2 Fe₂O₃",
      limitingReagent: "Fe",
    });
    setShowResult(true);
  };

  const handleMoleChange = (index, value, type) => {
    if (type === "reactant") {
      const newReactants = [...reactants];
      newReactants[index].moles = parseFloat(value) || 0;
      newReactants[index].weight = (
        newReactants[index].moles * newReactants[index].molarMass
      ).toFixed(4);
      setReactants(newReactants);
    } else {
      const newProducts = [...products];
      newProducts[index].moles = parseFloat(value) || 0;
      newProducts[index].weight = (
        newProducts[index].moles * newProducts[index].molarMass
      ).toFixed(4);
      setProducts(newProducts);
    }
  };

  const handleWeightChange = (index, value, type) => {
    if (type === "reactant") {
      const newReactants = [...reactants];
      newReactants[index].weight = parseFloat(value) || 0;
      newReactants[index].moles = (
        newReactants[index].weight / newReactants[index].molarMass
      ).toFixed(3);
      setReactants(newReactants);
    } else {
      const newProducts = [...products];
      newProducts[index].weight = parseFloat(value) || 0;
      newProducts[index].moles = (
        newProducts[index].weight / newProducts[index].molarMass
      ).toFixed(3);
      setProducts(newProducts);
    }
  };

  const getElementColor = (element) => {
    const alkaliMetals = ["Li", "Na", "K", "Rb", "Cs", "Fr"];
    const alkalineEarth = ["Be", "Mg", "Ca", "Sr", "Ba", "Ra"];
    const transitionMetals = [
      "Sc",
      "Ti",
      "V",
      "Cr",
      "Mn",
      "Fe",
      "Co",
      "Ni",
      "Cu",
      "Zn",
      "Y",
      "Zr",
      "Nb",
      "Mo",
      "Tc",
      "Ru",
      "Rh",
      "Pd",
      "Ag",
      "Cd",
      "Hf",
      "Ta",
      "W",
      "Re",
      "Os",
      "Ir",
      "Pt",
      "Au",
      "Hg",
      "Rf",
      "Db",
      "Sg",
      "Bh",
      "Hs",
      "Mt",
      "Ds",
      "Rg",
      "Cn",
    ];
    const postTransition = ["Al", "Ga", "In", "Sn", "Tl", "Pb", "Bi"];
    const metalloids = ["B", "Si", "Ge", "As", "Sb", "Te", "Po"];
    const nonMetals = ["H", "C", "N", "O", "P", "S", "Se"];
    const halogens = ["F", "Cl", "Br", "I", "At"];
    const nobleGases = ["He", "Ne", "Ar", "Kr", "Xe", "Rn"];
    const unknownProps = ["Nh", "Fl", "Mc", "Lv", "Ts", "Og"];

    if (alkaliMetals.includes(element))
      return "bg-yellow-300 hover:bg-yellow-400";
    if (alkalineEarth.includes(element))
      return "bg-orange-200 hover:bg-orange-300";
    if (transitionMetals.includes(element))
      return "bg-orange-300 hover:bg-orange-400";
    if (postTransition.includes(element))
      return "bg-gray-300 hover:bg-gray-400";
    if (metalloids.includes(element)) return "bg-green-200 hover:bg-green-300";
    if (nonMetals.includes(element)) return "bg-green-300 hover:bg-green-400";
    if (halogens.includes(element)) return "bg-cyan-300 hover:bg-cyan-400";
    if (nobleGases.includes(element)) return "bg-pink-300 hover:bg-pink-400";
    if (lanthanides.includes(element)) return "bg-pink-200 hover:bg-pink-300";
    if (actinides.includes(element)) return "bg-purple-300 hover:bg-purple-400";
    if (unknownProps.includes(element)) return "bg-gray-400 hover:bg-gray-500";
    return "bg-blue-300 hover:bg-blue-400";
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
      <div className="w-full mx-auto p-4 lg:p-8 md:p-8 input_form rounded-lg  space-y-6 mb-3">
        <div className=" p-6 rounded-b-lg ">
          <div className="mb-6">
            <div className="flex items-center gap-4 mb-4">
              <label className="font-medium text-gray-700">
                Enter an Equation:
              </label>
            </div>
            <input
              type="text"
              value={equation}
              onChange={(e) => setEquation(e.target.value)}
              className="input"
              placeholder="Enter chemical equation"
            />
          </div>
          {/* Periodic Table */}
          <div className="mb-6">
            {/* Main periodic table */}
            <div className="mb-4">
              {/* Row 1 */}
              <div className="flex gap-1 mb-1">
                <button
                  onClick={() => handleElementClick("H")}
                  className="w-10 h-10 text-xs cursor-pointer font-bold rounded bg-green-300 hover:bg-green-400 text-gray-800"
                >
                  H
                </button>
                <div className="flex-1"></div>
                <button
                  onClick={() => handleElementClick("He")}
                  className="w-10 h-10 text-xs cursor-pointer font-bold rounded bg-pink-300 hover:bg-pink-400 text-gray-800"
                >
                  He
                </button>
              </div>

              {/* Row 2 */}
              <div className="flex gap-1 mb-1">
                <button
                  onClick={() => handleElementClick("Li")}
                  className="w-10 h-10 text-xs cursor-pointer font-bold rounded bg-yellow-300 hover:bg-yellow-400 text-gray-800"
                >
                  Li
                </button>
                <button
                  onClick={() => handleElementClick("Be")}
                  className="w-10 h-10 text-xs cursor-pointer font-bold rounded bg-yellow-300 hover:bg-yellow-400 text-gray-800"
                >
                  Be
                </button>
                <div className="flex-1"></div>
                <button
                  onClick={() => handleElementClick("B")}
                  className="w-10 h-10 text-xs cursor-pointer font-bold rounded bg-green-300 hover:bg-green-400 text-gray-800"
                >
                  B
                </button>
                <button
                  onClick={() => handleElementClick("C")}
                  className="w-10 h-10 text-xs cursor-pointer font-bold rounded bg-green-300 hover:bg-green-400 text-gray-800"
                >
                  C
                </button>
                <button
                  onClick={() => handleElementClick("N")}
                  className="w-10 h-10 text-xs cursor-pointer font-bold rounded bg-green-300 hover:bg-green-400 text-gray-800"
                >
                  N
                </button>
                <button
                  onClick={() => handleElementClick("O")}
                  className="w-10 h-10 text-xs cursor-pointer font-bold rounded bg-green-300 hover:bg-green-400 text-gray-800"
                >
                  O
                </button>
                <button
                  onClick={() => handleElementClick("F")}
                  className="w-10 h-10 text-xs cursor-pointer font-bold rounded bg-green-300 hover:bg-green-400 text-gray-800"
                >
                  F
                </button>
                <button
                  onClick={() => handleElementClick("Ne")}
                  className="w-10 h-10 text-xs cursor-pointer font-bold rounded bg-pink-300 hover:bg-pink-400 text-gray-800"
                >
                  Ne
                </button>
              </div>

              {/* Row 3 */}
              <div className="flex gap-1 mb-1">
                <button
                  onClick={() => handleElementClick("Na")}
                  className="w-10 h-10 cursor-pointer text-xs font-bold rounded bg-yellow-300 hover:bg-yellow-400 text-gray-800"
                >
                  Na
                </button>
                <button
                  onClick={() => handleElementClick("Mg")}
                  className="w-10 h-10 cursor-pointer text-xs font-bold rounded bg-yellow-300 hover:bg-yellow-400 text-gray-800"
                >
                  Mg
                </button>
                <div className="flex-1"></div>
                <button
                  onClick={() => handleElementClick("Al")}
                  className="w-10 h-10 cursor-pointer text-xs font-bold rounded bg-green-300 hover:bg-green-400 text-gray-800"
                >
                  Al
                </button>
                <button
                  onClick={() => handleElementClick("Si")}
                  className="w-10 h-10 cursor-pointer text-xs font-bold rounded bg-green-300 hover:bg-green-400 text-gray-800"
                >
                  Si
                </button>
                <button
                  onClick={() => handleElementClick("P")}
                  className="w-10 h-10 cursor-pointer text-xs font-bold rounded bg-green-300 hover:bg-green-400 text-gray-800"
                >
                  P
                </button>
                <button
                  onClick={() => handleElementClick("S")}
                  className="w-10 h-10 cursor-pointer text-xs font-bold rounded bg-green-300 hover:bg-green-400 text-gray-800"
                >
                  S
                </button>
                <button
                  onClick={() => handleElementClick("Cl")}
                  className="w-10 h-10 cursor-pointer text-xs font-bold rounded bg-green-300 hover:bg-green-400 text-gray-800"
                >
                  Cl
                </button>
                <button
                  onClick={() => handleElementClick("Ar")}
                  className="w-10 h-10 cursor-pointer text-xs font-bold rounded bg-pink-300 hover:bg-pink-400 text-gray-800"
                >
                  Ar
                </button>
              </div>

              {/* Row 4 */}
              <div className="flex gap-1 mb-1">
                {[
                  "K",
                  "Ca",
                  "Sc",
                  "Ti",
                  "V",
                  "Cr",
                  "Mn",
                  "Fe",
                  "Co",
                  "Ni",
                  "Cu",
                  "Zn",
                  "Ga",
                  "Ge",
                  "As",
                  "Se",
                  "Br",
                  "Kr",
                ].map((el) => (
                  <button
                    key={el}
                    onClick={() => handleElementClick(el)}
                    className={`w-10 h-10 cursor-pointer text-xs font-bold rounded ${getElementColor(
                      el
                    )} text-gray-800`}
                  >
                    {el}
                  </button>
                ))}
              </div>

              {/* Row 5 */}
              <div className="flex gap-1 mb-1">
                {[
                  "Rb",
                  "Sr",
                  "Y",
                  "Zr",
                  "Nb",
                  "Mo",
                  "Tc",
                  "Ru",
                  "Rh",
                  "Pd",
                  "Ag",
                  "Cd",
                  "In",
                  "Sn",
                  "Sb",
                  "Te",
                  "I",
                  "Xe",
                ].map((el) => (
                  <button
                    key={el}
                    onClick={() => handleElementClick(el)}
                    className={`w-10 h-10 cursor-pointer text-xs font-bold rounded ${getElementColor(
                      el
                    )} text-gray-800`}
                  >
                    {el}
                  </button>
                ))}
              </div>

              {/* Row 6 */}
              <div className="flex gap-1 mb-1">
                {[
                  "Cs",
                  "Ba",
                  "La",
                  "Hf",
                  "Ta",
                  "W",
                  "Re",
                  "Os",
                  "Ir",
                  "Pt",
                  "Au",
                  "Hg",
                  "Tl",
                  "Pb",
                  "Bi",
                  "Po",
                  "At",
                  "Rn",
                ].map((el) => (
                  <button
                    key={el}
                    onClick={() => handleElementClick(el)}
                    className={`w-10 h-10 cursor-pointer text-xs font-bold rounded ${getElementColor(
                      el
                    )} text-gray-800`}
                  >
                    {el}
                  </button>
                ))}
              </div>

              {/* Row 7 */}
              <div className="flex gap-1 mb-4">
                {[
                  "Fr",
                  "Ra",
                  "Ac",
                  "Rf",
                  "Db",
                  "Sg",
                  "Bh",
                  "Hs",
                  "Mt",
                  "Ds",
                  "Rg",
                  "Cn",
                  "Nh",
                  "Fl",
                  "Mc",
                  "Lv",
                  "Ts",
                  "Og",
                ].map((el) => (
                  <button
                    key={el}
                    onClick={() => handleElementClick(el)}
                    className={`w-10 h-10 cursor-pointer text-xs font-bold rounded ${getElementColor(
                      el
                    )} text-gray-800`}
                  >
                    {el}
                  </button>
                ))}
              </div>
            </div>

            {/* Lanthanides and Actinides */}
            <div className="space-y-1">
              <div className="flex gap-1 justify-center">
                {lanthanides.map((element) => (
                  <button
                    key={element}
                    onClick={() => handleElementClick(element)}
                    className="w-10 h-10 cursor-pointer text-xs font-bold rounded bg-pink-300 hover:bg-pink-400 text-gray-800"
                  >
                    {element}
                  </button>
                ))}
              </div>

              <div className="flex gap-1 justify-center">
                {actinides.map((element) => (
                  <button
                    key={element}
                    onClick={() => handleElementClick(element)}
                    className="w-10 h-10 cursor-pointer text-xs font-bold rounded bg-purple-300 hover:bg-purple-400 text-gray-800"
                  >
                    {element}
                  </button>
                ))}
              </div>
            </div>

            {/* Control buttons */}
            <div className="flex gap-2 mb-4 justify-center">
              <button
                onClick={handleSpace}
                className="bg-blue-500 cursor-pointer mt-3 text-white px-6 py-2 rounded hover:bg-blue-600"
              >
                SPACE
              </button>
              <button
                onClick={handleClear}
                className="bg-red-500 cursor-pointer mt-3 text-white px-6 py-2 rounded hover:bg-red-600"
              >
                CLEAR
              </button>
            </div>

            {/* Numbers and operators */}
            <div className="flex gap-1 justify-center mb-6">
              <div className="bg-blue-600  text-white px-3 py-1 rounded-l text-sm font-medium">
                Your Input
              </div>
              {numbers.map((num) => (
                <button
                  key={num}
                  onClick={() => handleNumberClick(num)}
                  className="w-8 h-8 cursor-pointer bg-purple-200 hover:bg-purple-300 text-gray-800 font-bold rounded text-sm"
                >
                  {num}
                </button>
              ))}
              <div className="bg-blue-600  text-white px-3 py-1 rounded-r text-sm font-medium">
                Compound
              </div>
            </div>
          </div>
          <div className="mb-6 mt-10 text-center space-x-2">
            <Button type="submit" onClick={calculateReaction}>
              {data?.payload?.tech_lang_keys["calculate"]}
            </Button>
          </div>
        </div>
      </div>

      {showResult && (
        <div className="w-full result mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg shadow-md space-y-6 result">
          <div>
            <ResultActions lang={data?.payload?.tech_lang_keys} />
            <div className="bg-white  rounded-lg p-6 mt-3 ">
              <div className="text-center mb-6">
                <p className="font-medium text-gray-700 mb-2">Your Input</p>
                <p className="text-lg">{equation}</p>
              </div>
              <div className="text-center mb-6">
                <p className="font-medium text-gray-700 mb-2">
                  Balanced Equation
                </p>
                <p className="text-lg font-mono">{result.balancedEquation}</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3 font-medium">Compound</th>
                      <th className="text-left p-3 font-medium">Coefficient</th>
                      <th className="text-left p-3 font-medium">Molar Mass</th>
                      <th className="text-left p-3 font-medium">
                        Moles(g/mol)
                      </th>
                      <th className="text-left p-3 font-medium">Weight(g)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td
                        colSpan="5"
                        className="text-center p-3 bg-gray-100 font-medium"
                      >
                        Reactants
                      </td>
                    </tr>
                    {reactants.map((reactant, index) => (
                      <tr key={index} className="border-b">
                        <td className="p-3">{reactant.compound}</td>
                        <td className="p-3">{reactant.coefficient}</td>
                        <td className="p-3">{reactant.molarMass}</td>
                        <td className="p-3">
                          <input
                            type="number"
                            value={reactant.moles}
                            onChange={(e) =>
                              handleMoleChange(
                                index,
                                e.target.value,
                                "reactant"
                              )
                            }
                            className="w-full p-1 border rounded"
                          />
                        </td>
                        <td className="p-3">
                          <input
                            type="number"
                            value={reactant.weight}
                            onChange={(e) =>
                              handleWeightChange(
                                index,
                                e.target.value,
                                "reactant"
                              )
                            }
                            className="w-full p-1 border rounded"
                          />
                        </td>
                      </tr>
                    ))}
                    <tr>
                      <td
                        colSpan="5"
                        className="text-center p-3 bg-gray-100 font-medium"
                      >
                        Products
                      </td>
                    </tr>
                    {products.map((product, index) => (
                      <tr key={index} className="border-b">
                        <td className="p-3">{product.compound}</td>
                        <td className="p-3">{product.coefficient}</td>
                        <td className="p-3">{product.molarMass}</td>
                        <td className="p-3">
                          <input
                            type="number"
                            value={product.moles}
                            onChange={(e) =>
                              handleMoleChange(index, e.target.value, "product")
                            }
                            className="w-full p-1 border rounded"
                          />
                        </td>
                        <td className="p-3">
                          <input
                            type="number"
                            value={product.weight}
                            onChange={(e) =>
                              handleWeightChange(
                                index,
                                e.target.value,
                                "product"
                              )
                            }
                            className="w-full p-1 border rounded"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="text-center mt-6">
                <div className="inline-block bg-orange-100 border border-orange-300 rounded-lg px-6 py-3">
                  <p className="font-semibold text-orange-800">
                    The Limiting reagent is {result.limitingReagent}
                  </p>
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

export default LimitingReactantCalculator;

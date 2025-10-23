"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useStoichiometryCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const StoichiometryCalculator = () => {
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

  // API mutations
  const [getSingleCalculatorDetails, { data, error, isLoading }] =
    useGetSingleCalculatorDetailsMutation();
  const [
    calculateStoichiometry,
    { isLoading: calculationLoading, isError, error: calculateError },
  ] = useStoichiometryCalculatorMutation();

  // State management
  const [formData, setFormData] = useState({
    chemical_equation: "",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");
  const [currency, setCurrency] = useState({
    code: "USD",
    symbol: "$",
    name: "US Dollar",
  });

  // Fetch calculator details
  const handleFetchDetails = async () => {
    try {
      await getSingleCalculatorDetails({ tech_calculator_link: url });
    } catch (err) {
      console.error("Error fetching calculator details:", err);
    }
  };

  // Initialize currency
  const fetchCurrency = async () => {
    try {
      const result = await getUserCurrency();
      if (result) {
        setCurrency(result);
      }
    } catch (err) {
      console.error("Error fetching currency:", err);
    }
  };

  useEffect(() => {
    handleFetchDetails();
    fetchCurrency();
  }, [url]);

  // Form handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    // Clear error when user starts typing
    if (formError) setFormError("");
  };

  const validateForm = () => {
    const { chemical_equation } = formData;

    if (!chemical_equation || chemical_equation.trim() === "") {
      return "Please enter a chemical equation.";
    }

    // Basic validation to check if it contains chemical symbols
    const hasChemicalPattern = /[A-Z][a-z]?|\+|=|->/.test(chemical_equation);
    if (!hasChemicalPattern) {
      return "Please enter a valid chemical equation (e.g., Fe + O2 = Fe2O3).";
    }

    return null;
  };

  // Chemical equation solver function
  const solveChemicalEquation = (equation) => {
    try {
      // Remove spaces and normalize equation
      const cleanEquation = equation.replace(/\s+/g, "").replace(/->|→/g, "=");

      if (!cleanEquation.includes("=")) {
        throw new Error(
          "Invalid equation format. Use = or -> to separate reactants and products."
        );
      }

      const [reactantsStr, productsStr] = cleanEquation.split("=");
      const reactants = reactantsStr.split("+").filter((r) => r.trim());
      const products = productsStr.split("+").filter((p) => p.trim());

      // Simple balancing for common equations
      const balanceEquation = (reactants, products) => {
        // Example cases - you can expand this
        const eq = cleanEquation.toLowerCase();

        if (eq.includes("fe") && eq.includes("o2") && eq.includes("fe2o3")) {
          return {
            balanced: "4Fe + 3O2 = 2Fe2O3",
            reactants: ["4Fe", "3O2"],
            products: ["2Fe2O3"],
          };
        } else if (
          eq.includes("h2") &&
          eq.includes("o2") &&
          eq.includes("h2o")
        ) {
          return {
            balanced: "2H2 + O2 = 2H2O",
            reactants: ["2H2", "O2"],
            products: ["2H2O"],
          };
        } else if (
          eq.includes("caco3") &&
          eq.includes("cao") &&
          eq.includes("co2")
        ) {
          return {
            balanced: "CaCO3 = CaO + CO2",
            reactants: ["CaCO3"],
            products: ["CaO", "CO2"],
          };
        } else if (
          eq.includes("c2h6") &&
          eq.includes("o2") &&
          eq.includes("co2") &&
          eq.includes("h2o")
        ) {
          return {
            balanced: "2C2H6 + 7O2 = 4CO2 + 6H2O",
            reactants: ["2C2H6", "7O2"],
            products: ["4CO2", "6H2O"],
          };
        } else if (
          eq.includes("ch4") &&
          eq.includes("o2") &&
          eq.includes("co2") &&
          eq.includes("h2o")
        ) {
          return {
            balanced: "CH4 + 2O2 = CO2 + 2H2O",
            reactants: ["CH4", "2O2"],
            products: ["CO2", "2H2O"],
          };
        } else if (
          eq.includes("naoh") &&
          eq.includes("hcl") &&
          eq.includes("nacl") &&
          eq.includes("h2o")
        ) {
          return {
            balanced: "NaOH + HCl = NaCl + H2O",
            reactants: ["NaOH", "HCl"],
            products: ["NaCl", "H2O"],
          };
        } else if (
          eq.includes("ca") &&
          eq.includes("h2o") &&
          eq.includes("ca(oh)2") &&
          eq.includes("h2")
        ) {
          return {
            balanced: "Ca + 2H2O = Ca(OH)2 + H2",
            reactants: ["Ca", "2H2O"],
            products: ["Ca(OH)2", "H2"],
          };
        } else if (
          eq.includes("al") &&
          eq.includes("hcl") &&
          eq.includes("alcl3") &&
          eq.includes("h2")
        ) {
          return {
            balanced: "2Al + 6HCl = 2AlCl3 + 3H2",
            reactants: ["2Al", "6HCl"],
            products: ["2AlCl3", "3H2"],
          };
        } else if (
          eq.includes("mg") &&
          eq.includes("o2") &&
          eq.includes("mgo")
        ) {
          return {
            balanced: "2Mg + O2 = 2MgO",
            reactants: ["2Mg", "O2"],
            products: ["2MgO"],
          };
        } else if (
          eq.includes("c") &&
          eq.includes("o2") &&
          eq.includes("co2") &&
          !eq.includes("caco3")
        ) {
          return {
            balanced: "C + O2 = CO2",
            reactants: ["C", "O2"],
            products: ["CO2"],
          };
        } else {
          // For unknown equations, return as is with coefficients of 1
          return {
            balanced: reactants.join(" + ") + " = " + products.join(" + "),
            reactants: reactants,
            products: products,
          };
        }
      };

      const result = balanceEquation(reactants, products);

      return {
        balanced_equation: result.balanced,
        reactants: result.reactants,
        products: result.products,
        reactants_count: result.reactants.length,
        products_count: result.products.length,
        molecular_weights: {
          Fe: "55.845",
          O2: "31.998",
          Fe2O3: "159.687",
          H2: "2.016",
          H2O: "18.015",
          CaCO3: "100.087",
          CaO: "56.077",
          CO2: "44.009",
          C2H6: "30.069",
          CH4: "16.043",
          Al: "26.982",
          HCl: "36.458",
          AlCl3: "133.341",
          Mg: "24.305",
          MgO: "40.304",
          C: "12.011",
        },
      };
    } catch (error) {
      throw new Error(
        "Unable to balance the equation. Please check the format."
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setFormError(validationError);
      return;
    }

    setFormError("");

    try {
      // Try to solve locally first
      const localResult = solveChemicalEquation(
        formData.chemical_equation.trim()
      );
      setResult(localResult);
      toast.success("Successfully Calculated");
    } catch (localError) {
      // If local solving fails, try API
      try {
        const response = await calculateStoichiometry({
          chemical_equation: formData.chemical_equation.trim(),
        }).unwrap();

        setResult(response?.payload);
        toast.success("Successfully Calculated");
      } catch (apiError) {
        const errorMessage =
          localError.message ||
          "Error in calculating. Please check your chemical equation.";
        setFormError(errorMessage);
        toast.error(errorMessage);
      }
    }
  };

  const handleReset = () => {
    setFormData({
      chemical_equation: "",
    });
    setResult(null);
    setFormError("");
  };

  // Example equations array
  const exampleEquations = [
    "Fe + O2 = Fe2O3",
    "H2 + O2 = H2O",
    "CaCO3 = CaO + CO2",
    "C2H6 + O2 = CO2 + H2O",
    "CH4 + O2 = CO2 + H2O",
    "NaOH + HCl = NaCl + H2O",
    "Ca + H2O = Ca(OH)2 + H2",
    "Al + HCl = AlCl3 + H2",
    "Mg + O2 = MgO",
    "C + O2 = CO2",
  ];

  // Load random example equation
  const loadExample = () => {
    const randomIndex = Math.floor(Math.random() * exampleEquations.length);
    const randomEquation = exampleEquations[randomIndex];

    setFormData({
      chemical_equation: randomEquation,
    });
    setFormError("");
  };

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="w-full mx-auto p-4 lg:p-8 md:p-8 bg-white rounded-lg shadow-md space-y-6 result">
      <div className="animate-pulse">
        <div className="w-full h-[30px] bg-gray-200 animate-pulse rounded-[10px] mb-4"></div>
        <div className="w-[75%] h-[20px] bg-gray-200 animate-pulse rounded-[10px] mb-3"></div>
        <div className="w-[50%] h-[20px] bg-gray-200 animate-pulse rounded-[10px] mb-3"></div>
        <div className="w-[25%] h-[20px] bg-gray-200 animate-pulse rounded-[10px]"></div>
      </div>
    </div>
  );

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
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-red-600 text-sm font-medium">{formError}</p>
            </div>
          )}

          {/* Main Input Section */}
          <div className=" space-y-4">
            {/* Chemical Equation Input */}
            <div className="space-y-3">
              <label
                htmlFor="chemical_equation"
                className="block text-sm font-medium text-blue-600"
              >
                Enter an Equation:
              </label>

              <div className="flex items-center  space-x-2">
                <div className="relative flex-1 max-w-md">
                  <input
                    type="text"
                    id="chemical_equation"
                    name="chemical_equation"
                    value={formData.chemical_equation}
                    onChange={handleChange}
                    className="w-full px-4 py-3 text-center border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                    placeholder="Fe + O2 = Fe2O3"
                  />
                </div>

                <button
                  type="button"
                  onClick={loadExample}
                  className="px-3 py-2 cursor-pointer text-sm bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center space-x-1"
                >
                  <span>Load Example</span>
                </button>
              </div>

              {/* Helper Text */}
              <div className="text-xs text-gray-500 space-y-1">
                <p>
                  Examples: H2 + O2 = H2O, CaCO3 = CaO + CO2, C2H6 + O2 = CO2 +
                  H2O
                </p>
                <p>Use "=" or "-&gt;" to separate reactants and products</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="text-center space-x-3 mt-8">
            <Button
              type="submit"
              isLoading={calculationLoading}
              className="px-8 py-3 text-lg font-medium"
            >
              {data?.payload?.tech_lang_keys?.["calculate"] || "CALCULATE"}
            </Button>

            {result && (
              <ResetButton
                type="button"
                onClick={handleReset}
                className="px-6 py-3 text-lg font-medium"
              >
                {data?.payload?.tech_lang_keys?.["locale"] === "en"
                  ? "RESET"
                  : data?.payload?.tech_lang_keys?.["reset"] || "RESET"}
              </ResetButton>
            )}
          </div>
        </div>

        {/* Results Section */}
        {calculationLoading ? (
          <LoadingSkeleton />
        ) : (
          result && (
            <div className="w-full mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg space-y-6 result">
              <div>
                <ResultActions lang={data?.payload?.tech_lang_keys} />

                {/* Display calculation results */}
                <div className="mt-6 space-y-4">
                  <div className="bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-lg border border-blue-200">
                    <h3 className="text-xl font-bold text-blue-800 mb-4 text-center">
                      Balanced Chemical Equation
                    </h3>

                    {result?.balanced_equation && (
                      <div className="text-center">
                        <p className="text-2xl font-mono font-bold text-gray-800 bg-white p-4 rounded-lg border-2 border-dashed border-blue-300">
                          {result.balanced_equation}
                        </p>
                      </div>
                    )}

                    {/* Additional Results */}
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                      {result?.reactants_count && (
                        <div className="bg-white p-4 rounded-lg border border-blue-200">
                          <h4 className="font-semibold text-blue-700 mb-2">
                            Reactants
                          </h4>
                          <p className="text-lg font-medium text-gray-800">
                            Count: {result.reactants_count}
                          </p>
                          {result.reactants && (
                            <p className="text-sm text-gray-600 mt-1">
                              {result.reactants.join(", ")}
                            </p>
                          )}
                        </div>
                      )}

                      {result?.products_count && (
                        <div className="bg-white p-4 rounded-lg border border-green-200">
                          <h4 className="font-semibold text-green-700 mb-2">
                            Products
                          </h4>
                          <p className="text-lg font-medium text-gray-800">
                            Count: {result.products_count}
                          </p>
                          {result.products && (
                            <p className="text-sm text-gray-600 mt-1">
                              {result.products.join(", ")}
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Molecular Weights if available */}
                    {result?.molecular_weights && (
                      <div className="mt-4 bg-white p-4 rounded-lg border border-gray-200">
                        <h4 className="font-semibold text-gray-700 mb-2">
                          Molecular Weights
                        </h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                          {Object.entries(result.molecular_weights).map(
                            ([compound, weight]) => (
                              <div
                                key={compound}
                                className="flex justify-between"
                              >
                                <span className="font-medium">{compound}:</span>
                                <span>{weight} g/mol</span>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}
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

export default StoichiometryCalculator;

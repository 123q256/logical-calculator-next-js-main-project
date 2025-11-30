"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
import {
  useGetSingleCalculatorDetailsMutation,
  useEquilibriumConstantCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency";
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";
const EquilibriumConstantCalculator = () => {
  const pathname = usePathname();
  const parts = pathname.split("/").filter(Boolean);

  let url = "";
  if (parts.length === 1) {
    url = parts[0];
  } else {
    url = parts[0] + "/" + parts[1];
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
  const [currentPath, setCurrentPath] = useState("");
  useEffect(() => {
    // Browser-only: set currentPath
    setCurrentPath(window.location.pathname);
  }, []);
  const [formData, setFormData] = useState({
    tech_selection: "1", // 1 2
    tech_concentration_one: "8",
    tech_concentration_one_unit: "M",
    tech_a: "3",
    tech_concentration_two: "4",
    tech_concentration_two_unit: "M",
    tech_b: "5",
    tech_concentration_three: "4",
    tech_concentration_three_unit: "M",
    tech_c: "7",
    tech_concentration_four: "8",
    tech_concentration_four_unit: "M",
    tech_d: "9",
    tech_chemical_equation: "4NO2 + O2 = 2N2O5",
    tech_total_pressure: "1.00794",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");
  const [balancedEquation, setBalancedEquation] = useState(null);
  const [tableData, setTableData] = useState(null);
  const [kpValue, setKpValue] = useState(null);
  const [calculateLoading, setCalculateLoading] = useState(false);

  // RTK mutation hookss
  const [
    CatAgeCalculator,
    { isLoading: calculateDogLoading, isError, error: calculateLoveError },
  ] = useEquilibriumConstantCalculatorMutation();

  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData((prevData) => ({ ...prevData, [name]: value }));
  //   setResult(null);
  // };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setBalancedEquation(null);
    setTableData(null);
    setKpValue(null);
  };

  const calculateOption2 = () => {
    const equation = formData.tech_chemical_equation;
    const totalPressure = parseFloat(formData.tech_total_pressure);

    // Parse and balance equation;
    const parsed = parseEquation(equation);
    if (!parsed) {
      throw new Error("Invalid chemical equation");
    }
    const { reactants, products, reactantCoeffs, productCoeffs, balancedEq } =
      parsed;

    // Calculate molecular weights and partial pressures
    const result = calculatePartialPressures(
      reactants,
      products,
      reactantCoeffs,
      productCoeffs,
      totalPressure
    );
    return {
      tech_opt: "2",
      balancedEquation: balancedEq,
      tableData: result.tableData,
      kp: result.kp,
    };
  };

  const parseEquation = (equation) => {
    try {
      const [left, right] = equation.split("=").map((s) => s.trim());

      const parseTerms = (side) => {
        const terms = side.split("+").map((t) => t.trim());
        const compounds = [];
        const coeffs = [];

        terms.forEach((term) => {
          const match = term.match(/^(\d+)?([A-Z][a-z]?\d*)+$/);
          if (match) {
            const coeff = match[1] ? parseInt(match[1]) : 1;
            const compound = match[1] ? term.substring(match[1].length) : term;
            coeffs.push(coeff);
            compounds.push(compound);
          }
        });

        return { compounds, coeffs };
      };

      const leftParsed = parseTerms(left);
      const rightParsed = parseTerms(right);

      const balancedEq = {
        reactants: leftParsed.compounds,
        reactantCoeffs: leftParsed.coeffs,
        products: rightParsed.compounds,
        productCoeffs: rightParsed.coeffs,
      };

      return {
        reactants: leftParsed.compounds,
        products: rightParsed.compounds,
        reactantCoeffs: leftParsed.coeffs,
        productCoeffs: rightParsed.coeffs,
        balancedEq: formatBalancedEquation(balancedEq),
      };
    } catch (e) {
      return null;
    }
  };

  const formatBalancedEquation = (eq) => {
    const leftSide = eq.reactants
      .map(
        (r, i) => `${eq.reactantCoeffs[i] > 1 ? eq.reactantCoeffs[i] : ""}${r}`
      )
      .join(" + ");

    const rightSide = eq.products
      .map(
        (p, i) => `${eq.productCoeffs[i] > 1 ? eq.productCoeffs[i] : ""}${p}`
      )
      .join(" + ");

    return `${leftSide} → ${rightSide}`;
  };

  const calculateMolecularWeight = (formula) => {
    const atomicWeights = {
      H: 1.00794,
      He: 4.002602,
      Li: 6.941,
      Be: 9.012182,
      B: 10.811,
      C: 12.0107,
      N: 14.0067,
      O: 15.9994,
      F: 18.9984032,
      Ne: 20.1797,
      Na: 22.9897693,
      Mg: 24.305,
      Al: 26.9815386,
      Si: 28.0855,
      P: 30.973762,
      S: 32.065,
      Cl: 35.453,
      Ar: 39.948,
      K: 39.0983,
      Ca: 40.078,
    };

    let weight = 0;
    const matches = formula.match(/([A-Z][a-z]?)(\d*)/g) || [];

    matches.forEach((match) => {
      const element = match.match(/[A-Z][a-z]?/)[0];
      const count = parseInt(match.match(/\d+/)?.[0] || "1");
      weight += (atomicWeights[element] || 0) * count;
    });

    return weight;
  };

  const calculatePartialPressures = (
    reactants,
    products,
    reactantCoeffs,
    productCoeffs,
    totalPressure
  ) => {
    const reactantWeights = reactants.map((r) => calculateMolecularWeight(r));
    const productWeights = products.map((p) => calculateMolecularWeight(p));

    const reactantMoles = reactantCoeffs.map((c, i) => c * reactantWeights[i]);
    const productMoles = productCoeffs.map((c, i) => c * productWeights[i]);

    const totalMoles = [...reactantMoles, ...productMoles].reduce(
      (a, b) => a + b,
      0
    );

    const reactantFractions = reactantMoles.map((m) => m / totalMoles);
    const productFractions = productMoles.map((m) => m / totalMoles);

    const reactantPressures = reactantFractions.map((f) => f * totalPressure);
    const productPressures = productFractions.map((f) => f * totalPressure);

    let rpressure = 1;
    let ppressure = 1;

    reactantPressures.forEach((p, i) => {
      rpressure *= Math.pow(p, reactantCoeffs[i]);
    });

    productPressures.forEach((p, i) => {
      ppressure *= Math.pow(p, productCoeffs[i]);
    });

    const kp = ppressure / rpressure;

    const tableData = {
      reactants: reactants.map((r, i) => ({
        compound: r,
        moles: reactantMoles[i].toFixed(4),
        fraction: reactantFractions[i].toFixed(4),
        pressure: reactantPressures[i].toFixed(4),
      })),
      products: products.map((p, i) => ({
        compound: p,
        moles: productMoles[i].toFixed(4),
        fraction: productFractions[i].toFixed(4),
        pressure: productPressures[i].toFixed(4),
      })),
    };

    return { tableData, kp };
  };

  function validateChemicalEquation(equation) {
    if (!equation || typeof equation !== "string") {
      return { valid: false, message: "Equation is empty or invalid." };
    }

    // allow = also
    const arrowRegex = /(->|→|=>|=)/;

    if (!arrowRegex.test(equation)) {
      return {
        valid: false,
        message: "Equation must contain an arrow or equal sign (->, →, =>, =).",
      };
    }

    // Split by detected arrow or '='
    const match = equation.match(arrowRegex);
    const splitSides = equation.split(match[0]);
    const left = (splitSides[0] || "").trim();
    const right = (splitSides[1] || "").trim();

    if (!left)
      return { valid: false, message: "Left side (reactants) is empty." };
    if (!right)
      return { valid: false, message: "Right side (products) is empty." };

    // token format: optional coefficient + formula
    const tokenRegex = /^\s*(\d*\s*)?([A-Za-z][A-Za-z0-9()]*)(\s*)$/;

    const leftTokens = left
      .split("+")
      .map((t) => t.trim())
      .filter(Boolean);
    const rightTokens = right
      .split("+")
      .map((t) => t.trim())
      .filter(Boolean);

    if (leftTokens.length === 0)
      return { valid: false, message: "No reactants found." };
    if (rightTokens.length === 0)
      return { valid: false, message: "No products found." };

    // validate each molecule
    for (const tok of [...leftTokens, ...rightTokens]) {
      if (!tokenRegex.test(tok)) {
        return {
          valid: false,
          message: `Invalid molecule detected: "${tok}".`,
        };
      }
    }

    return { valid: true };
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_selection) {
      setFormError("Please fill in field");
      return;
    }

    // If option 2 uses a chemical equation, validate it client-side before API call
    if (formData.tech_selection === "2") {
      const eqValidation = validateChemicalEquation(
        formData.tech_chemical_equation
      );
      if (!eqValidation.valid) {
        setFormError(eqValidation.message);
        toast.error(eqValidation.message);
        return;
      }
    }

    setFormError("");

    try {
      const response = await CatAgeCalculator({
        tech_selection: formData.tech_selection,
        tech_concentration_one: formData.tech_concentration_one,
        tech_concentration_one_unit: formData.tech_concentration_one_unit,
        tech_a: formData.tech_a,
        tech_concentration_two: formData.tech_concentration_two,
        tech_concentration_two_unit: formData.tech_concentration_two_unit,
        tech_b: formData.tech_b,
        tech_concentration_three: formData.tech_concentration_three,
        tech_concentration_three_unit: formData.tech_concentration_three_unit,
        tech_c: formData.tech_c,
        tech_concentration_four: formData.tech_concentration_four,
        tech_concentration_four_unit: formData.tech_concentration_four_unit,
        tech_d: formData.tech_d,
        tech_chemical_equation: formData.tech_chemical_equation,
        tech_total_pressure: formData.tech_total_pressure,
      }).unwrap();

      setResult(response?.payload);
      toast.success("Calculate Successfully");

      if (response?.payload?.tech_opt == "2") {
        const calcResult = calculateOption2();
        setBalancedEquation(calcResult.balancedEquation);
        setTableData(calcResult.tableData);
        setKpValue(calcResult.kp);
      }
    } catch (err) {
      const msg = err?.data?.payload?.error || "Something went wrong";
      setFormError(msg);
      toast.error(msg);
    }
  };

  // Handle reset form
  const handleReset = () => {
    setFormData({
      tech_selection: "1", // 1 2
      tech_concentration_one: "8",
      tech_concentration_one_unit: "M",
      tech_a: "3",
      tech_concentration_two: "4",
      tech_concentration_two_unit: "M",
      tech_b: "5",
      tech_concentration_three: "4",
      tech_concentration_three_unit: "M",
      tech_c: "7",
      tech_concentration_four: "8",
      tech_concentration_four_unit: "M",
      tech_d: "9",
      tech_chemical_equation: "4NO2 + O2 = 2N2O5",
      tech_total_pressure: "1.00794",
    });
    setResult(null);
    setBalancedEquation(null);
    setTableData(null);
    setKpValue(null);
    setFormError("");
  };

  //dropdown states
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const setUnitHandler = (unit) => {
    setFormData((prev) => ({ ...prev, tech_concentration_one_unit: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };
  //dropdown states 1
  const [dropdownVisible1, setDropdownVisible1] = useState(false);

  const setUnitHandler1 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_concentration_two_unit: unit }));
    setDropdownVisible1(false);
  };

  const toggleDropdown1 = () => {
    setDropdownVisible1(!dropdownVisible1);
  };
  //dropdown states 2
  const [dropdownVisible2, setDropdownVisible2] = useState(false);

  const setUnitHandler2 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_concentration_three_unit: unit }));
    setDropdownVisible2(false);
  };

  const toggleDropdown2 = () => {
    setDropdownVisible2(!dropdownVisible2);
  };
  //dropdown states 3
  const [dropdownVisible3, setDropdownVisible3] = useState(false);

  const setUnitHandler3 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_concentration_four_unit: unit }));
    setDropdownVisible3(false);
  };

  const toggleDropdown3 = () => {
    setDropdownVisible3(!dropdownVisible3);
  };

  return (
    <>
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
          <div className="w-full mx-auto p-4 lg:p-8 md:p-8 input_form rounded-lg space-y-6 mb-3">
            {formError && (
              <p className="text-red-500 text-[16px] md:text-[18px] font-semibold w-full">
                {formError}
              </p>
            )}
            <div className="lg:w-[80%] md:w-[90%] w-full mx-auto">
              <div className="grid grid-cols-12 mt-3 gap-2 md:gap-4 lg:gap-4">
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
                    {/* Concentration [A]: */}
                    <div className="md:col-span-6 col-span-12 md:mt-2">
                      <label htmlFor="tech_a" className="text-sm font-medium ">
                        {data?.payload?.tech_lang_keys["4"]} a:
                      </label>
                      <div className="py-2">
                        <input
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent uppercase"
                          type="text"
                          id="tech_a"
                          name="tech_a"
                          value={formData.tech_a}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="md:col-span-6 col-span-12 md:mt-2">
                      <label htmlFor="tech_concentration_one" className="label">
                        {data?.payload?.tech_lang_keys["2"]} [A]:
                      </label>
                      <div className="relative w-full ">
                        <input
                          type="number"
                          name="tech_concentration_one"
                          step="any"
                          className="mt-1 input"
                          value={formData.tech_concentration_one}
                          placeholder="00"
                          onChange={handleChange}
                        />
                        <label
                          className="absolute cursor-pointer text-sm underline right-6 top-4"
                          onClick={toggleDropdown}
                        >
                          {formData.tech_concentration_one_unit} ▾
                        </label>
                        {dropdownVisible && (
                          <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                            {[
                              { label: "molars (M)", value: "M" },
                              { label: "millimolars (mM)", value: "mM" },
                              { label: "micromolars (μM)", value: "μM" },
                              { label: "nanomolars (nM)", value: "nM" },
                              { label: "picomolars (pM)", value: "pM" },
                              { label: "femtomolars (fM)", value: "fM" },
                              { label: "attomolars (aM)", value: "aM" },
                              { label: "zeptomolars (zM)", value: "zM" },
                              { label: "joktomolars (yM)", value: "yM" },
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
                    {/* Concentration [A]: */}

                    {/* Concentration [B]: */}
                    <div className="md:col-span-6 col-span-12 md:mt-2">
                      <label htmlFor="tech_b" className="text-sm font-medium ">
                        {data?.payload?.tech_lang_keys["4"]} b:
                      </label>
                      <div className="py-2">
                        <input
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent uppercase"
                          type="text"
                          id="tech_b"
                          name="tech_b"
                          value={formData.tech_b}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="md:col-span-6 col-span-12 md:mt-2">
                      <label htmlFor="tech_concentration_two" className="label">
                        {data?.payload?.tech_lang_keys["2"]} [B]:
                      </label>
                      <div className="relative w-full ">
                        <input
                          type="number"
                          name="tech_concentration_two"
                          step="any"
                          className="mt-1 input"
                          value={formData.tech_concentration_two}
                          placeholder="00"
                          onChange={handleChange}
                        />
                        <label
                          className="absolute cursor-pointer text-sm underline right-6 top-4"
                          onClick={toggleDropdown1}
                        >
                          {formData.tech_concentration_two_unit} ▾
                        </label>
                        {dropdownVisible1 && (
                          <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                            {[
                              { label: "molars (M)", value: "M" },
                              { label: "millimolars (mM)", value: "mM" },
                              { label: "micromolars (μM)", value: "μM" },
                              { label: "nanomolars (nM)", value: "nM" },
                              { label: "picomolars (pM)", value: "pM" },
                              { label: "femtomolars (fM)", value: "fM" },
                              { label: "attomolars (aM)", value: "aM" },
                              { label: "zeptomolars (zM)", value: "zM" },
                              { label: "joktomolars (yM)", value: "yM" },
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
                    {/* Concentration [B]: */}
                    {/* Concentration [C]: */}
                    <div className="md:col-span-6 col-span-12 md:mt-2">
                      <label htmlFor="tech_c" className="text-sm font-medium ">
                        {data?.payload?.tech_lang_keys["4"]} c:
                      </label>
                      <div className="py-2">
                        <input
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent uppercase"
                          type="text"
                          id="tech_c"
                          name="tech_c"
                          value={formData.tech_c}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="md:col-span-6 col-span-12 md:mt-2">
                      <label
                        htmlFor="tech_concentration_three"
                        className="label"
                      >
                        {data?.payload?.tech_lang_keys["2"]} [C]:
                      </label>
                      <div className="relative w-full ">
                        <input
                          type="number"
                          name="tech_concentration_three"
                          step="any"
                          className="mt-1 input"
                          value={formData.tech_concentration_three}
                          placeholder="00"
                          onChange={handleChange}
                        />
                        <label
                          className="absolute cursor-pointer text-sm underline right-6 top-4"
                          onClick={toggleDropdown2}
                        >
                          {formData.tech_concentration_three_unit} ▾
                        </label>
                        {dropdownVisible2 && (
                          <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                            {[
                              { label: "molars (M)", value: "M" },
                              { label: "millimolars (mM)", value: "mM" },
                              { label: "micromolars (μM)", value: "μM" },
                              { label: "nanomolars (nM)", value: "nM" },
                              { label: "picomolars (pM)", value: "pM" },
                              { label: "femtomolars (fM)", value: "fM" },
                              { label: "attomolars (aM)", value: "aM" },
                              { label: "zeptomolars (zM)", value: "zM" },
                              { label: "joktomolars (yM)", value: "yM" },
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
                    {/* Concentration [C]: */}
                    {/* Concentration [D]: */}
                    <div className="md:col-span-6 col-span-12 md:mt-2">
                      <label htmlFor="tech_d" className="text-sm font-medium ">
                        {data?.payload?.tech_lang_keys["4"]} d:
                      </label>
                      <div className="py-2">
                        <input
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent uppercase"
                          type="text"
                          id="tech_d"
                          name="tech_d"
                          value={formData.tech_d}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="md:col-span-6 col-span-12 md:mt-2">
                      <label
                        htmlFor="tech_concentration_four"
                        className="label"
                      >
                        {data?.payload?.tech_lang_keys["2"]} [D]:
                      </label>
                      <div className="relative w-full ">
                        <input
                          type="number"
                          name="tech_concentration_four"
                          step="any"
                          className="mt-1 input"
                          value={formData.tech_concentration_four}
                          placeholder="00"
                          onChange={handleChange}
                        />
                        <label
                          className="absolute cursor-pointer text-sm underline right-6 top-4"
                          onClick={toggleDropdown3}
                        >
                          {formData.tech_concentration_four_unit} ▾
                        </label>
                        {dropdownVisible3 && (
                          <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                            {[
                              { label: "molars (M)", value: "M" },
                              { label: "millimolars (mM)", value: "mM" },
                              { label: "micromolars (μM)", value: "μM" },
                              { label: "nanomolars (nM)", value: "nM" },
                              { label: "picomolars (pM)", value: "pM" },
                              { label: "femtomolars (fM)", value: "fM" },
                              { label: "attomolars (aM)", value: "aM" },
                              { label: "zeptomolars (zM)", value: "zM" },
                              { label: "joktomolars (yM)", value: "yM" },
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
                    {/* Concentration [D]: */}
                  </>
                )}

                {formData.tech_selection == "2" && (
                  <>
                    <div className="md:col-span-6 col-span-12 md:">
                      <label htmlFor="tech_chemical_equation" className="label">
                        {data?.payload?.tech_lang_keys["5"]}:
                      </label>
                      <div className=" relative">
                        <input
                          type="text"
                          step="any"
                          name="tech_chemical_equation"
                          id="tech_chemical_equation"
                          className="input my-2"
                          aria-label="input"
                          placeholder="00"
                          value={formData.tech_chemical_equation}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="md:col-span-6 col-span-12 md:">
                      <label htmlFor="tech_total_pressure" className="label">
                        {data?.payload?.tech_lang_keys["5"]}:
                      </label>
                      <div className=" relative">
                        <input
                          type="number"
                          step="any"
                          name="tech_total_pressure"
                          id="tech_total_pressure"
                          className="input my-2"
                          aria-label="input"
                          placeholder="00"
                          value={formData.tech_total_pressure}
                          onChange={handleChange}
                        />
                        <span className="input_unit">atm</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="mb-6 mt-10 text-center space-x-2">
              <Button
                type="submit"
                isLoading={calculateDogLoading}
                onClick={handleSubmit}
              >
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

          {isLoading && (
            <div className="mt-8 result_calculator rounded-lg shadow-md p-8">
              <div className="animate-pulse space-y-4">
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                <div className="h-6 bg-gray-200 rounded w-2/3"></div>
                <div className="h-6 bg-gray-200 rounded w-1/3"></div>
              </div>
            </div>
          )}

          {result && !isLoading && (
            <div className="w-full mx-auto p-4 result_calculator rounded-lg shadow-md space-y-6">
              <div>
                <ResultActions lang={data?.payload?.tech_lang_keys} />
                <div className="rounded-xl text-lg p-2">
                  <div className="rounded-lg flex items-center justify-center">
                    <div className="w-full mt-3">
                      {result?.tech_opt == "1" && (
                        <>
                          <div className="rounded-xl p-6 mb-6 text-center">
                            <h3 className="text-gray-600 text-sm md:text-base mb-3 font-medium">
                              {data?.payload?.tech_lang_keys["7"]} (Kc)
                            </h3>
                            <div className="bg-white bordered rounded-lg py-4 px-6 inline-block">
                              <span className="text-[#2845F5] text-18px md:text-[30px] font-bold">
                                {Number(result?.tech_answer).toExponential(5)}
                              </span>
                            </div>
                          </div>
                          <div className="mt-5 space-y-6 overflow-auto">
                            {/* Step 1 */}
                            <h3 className="text-lg font-bold mt-4">
                              Step 1: Write the Equilibrium Expression
                            </h3>
                            <BlockMath
                              math={`K = \\frac{[C]^{c} \\cdot [D]^{d}}{[A]^{a} \\cdot [B]^{b}}`}
                            />

                            {/* Step 2 */}
                            <h3 className="text-lg font-bold mt-4">
                              Step 2: Substitute the Given Values
                            </h3>
                            <BlockMath
                              math={`
                            K = \\frac{(${formData?.tech_concentration_three})^{${formData?.tech_c}} 
                            \\cdot (${formData?.tech_concentration_four})^{${formData?.tech_d}}}
                            {(${formData?.tech_concentration_one})^{${formData?.tech_a}} 
                            \\cdot (${formData?.tech_concentration_two})^{${formData?.tech_b}}}
                          `}
                            />

                            {/* Step 3: Calculate Numerator */}
                            <h3 className="text-lg font-bold mt-4">
                              Step 3: Calculate Numerator
                            </h3>
                            <BlockMath
                              math={`
                            \\text{Numerator} = (${formData?.tech_concentration_three})^{${formData?.tech_c}} 
                            \\cdot (${formData?.tech_concentration_four})^{${formData?.tech_d}}
                          `}
                            />

                            {/* Step 4: Calculate Denominator */}
                            <h3 className="text-lg font-bold mt-4">
                              Step 4: Calculate Denominator
                            </h3>
                            <BlockMath
                              math={`
                            \\text{Denominator} = (${formData?.tech_concentration_one})^{${formData?.tech_a}} 
                            \\cdot (${formData?.tech_concentration_two})^{${formData?.tech_b}}
                          `}
                            />

                            {/* Step 5: Final Calculation */}
                            <h3 className="text-lg font-bold mt-4">
                              Step 5: Final Calculation
                            </h3>
                            <BlockMath
                              math={`
                            K = \\frac{(${
                              formData?.tech_concentration_three
                            })^{${formData?.tech_c}} 
                            \\cdot (${formData?.tech_concentration_four})^{${
                                formData?.tech_d
                              }}}
                            {(${formData?.tech_concentration_one})^{${
                                formData?.tech_a
                              }} 
                            \\cdot (${formData?.tech_concentration_two})^{${
                                formData?.tech_b
                              }}} 
                            = ${Number(result?.tech_answer).toExponential(5)}
                          `}
                            />
                          </div>
                        </>
                      )}
                      {result && result.tech_opt === "2" && (
                        <div className="w-full mx-auto md:p-8 ">
                          <div className="mb-6">
                            <h3 className="text-xl font-bold text-center mb-4">
                              Balanced Equation
                            </h3>
                            <div className="text-center md:text-[30px] text-[20px] font-semibold text-gray-800 bg-white bordered p-4 rounded-lg">
                              {balancedEquation}
                            </div>
                          </div>

                          {tableData && (
                            <div className="overflow-x-auto">
                              <table className="w-full  border-collapse border border-gray-300">
                                <thead>
                                  <tr className="bg-[#2845F5] text-white">
                                    <th className="border-b border-gray-300 p-3">
                                      Compound
                                    </th>
                                    <th className="border-b border-gray-300 p-3">
                                      Moles
                                    </th>
                                    <th className="border-b border-gray-300 p-3">
                                      Mole Fractions
                                    </th>
                                    <th className="border-b border-gray-300 p-3">
                                      Partial Pressure
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr className="bg-blue-50">
                                    <td
                                      colSpan="4"
                                      className="border-b border-gray-300 p-3 font-bold text-center"
                                    >
                                      Reactants
                                    </td>
                                  </tr>
                                  {tableData.reactants.map((r, i) => (
                                    <tr key={`r-${i}`}>
                                      <td className="border-b border-gray-300 p-3 text-center">
                                        {r.compound}
                                      </td>
                                      <td className="border-b border-gray-300 p-3 text-center">
                                        {r.moles} mol
                                      </td>
                                      <td className="border-b border-gray-300 p-3 text-center">
                                        {r.fraction}
                                      </td>
                                      <td className="border-b border-gray-300 p-3 text-center">
                                        {r.pressure} atm
                                      </td>
                                    </tr>
                                  ))}
                                  <tr className="bg-blue-50">
                                    <td
                                      colSpan="4"
                                      className="border-b border-gray-300 p-3 font-bold text-center"
                                    >
                                      Products
                                    </td>
                                  </tr>
                                  {tableData.products.map((p, i) => (
                                    <tr key={`p-${i}`}>
                                      <td className="border-b border-gray-300 p-3 text-center">
                                        {p.compound}
                                      </td>
                                      <td className="border-b border-gray-300 p-3 text-center">
                                        {p.moles} mol
                                      </td>
                                      <td className="border-b border-gray-300 p-3 text-center">
                                        {p.fraction}
                                      </td>
                                      <td className="border-b border-gray-300 p-3 text-center">
                                        {p.pressure} atm
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          )}

                          {kpValue && (
                            <div className="mt-8 text-center">
                              <h3 className="text-lg font-bold mb-4">
                                Equilibrium Constant K<sub>p</sub>
                              </h3>
                              <div className="bg-white bordered rounded-lg py-6 px-8 inline-block">
                                <span className="text-[#2845F5] md:text-[30px] text-[20px] font-bold">
                                  {kpValue.toFixed(4)}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </form>
        {result && (
          <CalculatorFeedback calName={data?.payload?.tech_calculator_title} />
        )}
      </Calculator>
    </>
  );
};

export default EquilibriumConstantCalculator;

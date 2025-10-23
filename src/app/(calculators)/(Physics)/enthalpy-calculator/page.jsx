"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useEnthalpyCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const EnthalpyCalculator = () => {
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
    tech_calEnthalpy: "enthalpyFormula", // reactionScheme  enthalpyFormula
    tech_calFrom: "byStandard",
    tech_calFrom1: "2",
    tech_q1: "45",
    tech_q1_unit: "MJ",
    tech_q2: "45",
    tech_q2_unit: "ft_lbs",
    tech_v1: "45",
    tech_v1_unit: "mm3",
    tech_v2: "45",
    tech_v2_unit: "us_pt",
    tech_changeQ: "45",
    tech_changeQ_unit: "mm3",
    tech_changeV: "45",
    tech_changeV_unit: "mm3",
    tech_p: "45",
    tech_p_unit: "at",
    tech_a_n: "2",
    tech_rA: "12",
    tech_rA_values: "Ag(s)",
    tech_b_n: "2",
    tech_rB: "105.58",
    tech_rB_values: "Ag(s)",
    tech_c_n: "2",
    tech_rC: "105.58",
    tech_rC_values: "Ag(s)",
    tech_d_n: "2",
    tech_pD: "105.58",
    tech_pD_values: "Ag(s)",
    tech_e_n: "1",
    tech_pE: "105.58",
    tech_pE_values: "Ag(s)",
    tech_f_n: "1",
    tech_pF: "105.58",
    tech_pF_values: "Ag(s)",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useEnthalpyCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_calEnthalpy) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_calEnthalpy: formData.tech_calEnthalpy,
        tech_calFrom: formData.tech_calFrom,
        tech_calFrom1: formData.tech_calFrom1,
        tech_q1: formData.tech_q1,
        tech_q1_unit: formData.tech_q1_unit,
        tech_q2: formData.tech_q2,
        tech_q2_unit: formData.tech_q2_unit,
        tech_v1: formData.tech_v1,
        tech_v1_unit: formData.tech_v1_unit,
        tech_v2: formData.tech_v2,
        tech_v2_unit: formData.tech_v2_unit,
        tech_changeQ: formData.tech_changeQ,
        tech_changeQ_unit: formData.tech_changeQ_unit,
        tech_changeV: formData.tech_changeV,
        tech_changeV_unit: formData.tech_changeV_unit,
        tech_p: formData.tech_p,
        tech_p_unit: formData.tech_p_unit,
        tech_a_n: formData.tech_a_n,
        tech_rA: formData.tech_rA,
        tech_rA_values: formData.tech_rA_values,
        tech_b_n: formData.tech_b_n,
        tech_rB: formData.tech_rB,
        tech_rB_values: formData.tech_rB_values,
        tech_c_n: formData.tech_c_n,
        tech_rC: formData.tech_rC,
        tech_rC_values: formData.tech_rC_values,
        tech_d_n: formData.tech_d_n,
        tech_pD: formData.tech_pD,
        tech_pD_values: formData.tech_pD_values,
        tech_e_n: formData.tech_e_n,
        tech_pE: formData.tech_pE,
        tech_pE_values: formData.tech_pE_values,
        tech_f_n: formData.tech_f_n,
        tech_pF: formData.tech_pF,
        tech_pF_values: formData.tech_pF_values,
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
      tech_calEnthalpy: "enthalpyFormula", // reactionScheme  enthalpyFormula
      tech_calFrom: "byStandard",
      tech_calFrom1: "2",
      tech_q1: "45",
      tech_q1_unit: "MJ",
      tech_q2: "45",
      tech_q2_unit: "ft_lbs",
      tech_v1: "45",
      tech_v1_unit: "mm3",
      tech_v2: "45",
      tech_v2_unit: "us_pt",
      tech_changeQ: "45",
      tech_changeQ_unit: "mm3",
      tech_changeV: "45",
      tech_changeV_unit: "mm3",
      tech_p: "45",
      tech_p_unit: "at",
      tech_a_n: "2",
      tech_rA: "12",
      tech_rA_values: "Ag(s)",
      tech_b_n: "2",
      tech_rB: "105.58",
      tech_rB_values: "Ag(s)",
      tech_c_n: "2",
      tech_rC: "105.58",
      tech_rC_values: "Ag(s)",
      tech_d_n: "2",
      tech_pD: "105.58",
      tech_pD_values: "Ag(s)",
      tech_e_n: "1",
      tech_pE: "105.58",
      tech_pE_values: "Ag(s)",
      tech_f_n: "1",
      tech_pF: "105.58",
      tech_pF_values: "Ag(s)",
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
    setFormData((prev) => ({ ...prev, tech_q1_unit: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  //dropdown states
  const [dropdownVisible1, setDropdownVisible1] = useState(false);

  const setUnitHandler1 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_q2_unit: unit }));
    setDropdownVisible1(false);
  };

  const toggleDropdown1 = () => {
    setDropdownVisible1(!dropdownVisible1);
  };

  //dropdown states
  const [dropdownVisible2, setDropdownVisible2] = useState(false);

  const setUnitHandler2 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_v1_unit: unit }));
    setDropdownVisible2(false);
  };

  const toggleDropdown2 = () => {
    setDropdownVisible2(!dropdownVisible2);
  };

  //dropdown states
  const [dropdownVisible3, setDropdownVisible3] = useState(false);

  const setUnitHandler3 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_v2_unit: unit }));
    setDropdownVisible3(false);
  };

  const toggleDropdown3 = () => {
    setDropdownVisible3(!dropdownVisible3);
  };

  //dropdown states
  const [dropdownVisible4, setDropdownVisible4] = useState(false);

  const setUnitHandler4 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_changeQ_unit: unit }));
    setDropdownVisible4(false);
  };

  const toggleDropdown4 = () => {
    setDropdownVisible4(!dropdownVisible4);
  };

  //dropdown states
  const [dropdownVisible5, setDropdownVisible5] = useState(false);

  const setUnitHandler5 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_changeV_unit: unit }));
    setDropdownVisible5(false);
  };

  const toggleDropdown5 = () => {
    setDropdownVisible5(!dropdownVisible5);
  };

  //dropdown states
  const [dropdownVisible6, setDropdownVisible6] = useState(false);

  const setUnitHandler6 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_p_unit: unit }));
    setDropdownVisible6(false);
  };

  const toggleDropdown6 = () => {
    setDropdownVisible6(!dropdownVisible6);
  };

  const DATA_A = {
    None: "0",
    Custom: "0",
    "Ag(s)": "0",
    "Ag⁺(aq)": "105.58",
    "Ag₂O(s)": "-31.05",
    "Ag₂S(s)": "-31.8",
    "AgBr(aq)": "-15.98",
    "AgBr(s)": "-100.37",
    "AgCl(aq)": "-61.58",
    "AgCl(s)": "-127.7",
    "AgI(aq)": "50.38",
    "AgI(s)": "-61.84",
    "AgNO₃(s)": "-124.39",
    "Al(s)": "0",
    "Al₂O₃(s)": "-1669.8",
    "Al³⁺(aq)": "-524.7",
    "AlCl₃(s)": "-704.2",
    "As(s) ": "0",
    "As₂S₃(s) ": "-169",
    "AsO₄³⁻(aq)": "-888.14",
    "B(s)": "0",
    "B₂O₃(s)": "-1272.8",
    "Ba(s)": "0",
    "Ba²⁺(aq)": "-537.64",
    "BaCl₂(s)": "-860.1",
    "BaCO₃(aq)": "-1214.78",
    "BaCO₃(s)": "-1218.8",
    "BaO(s)": "-558.1",
    "BaSO₄(s)": "-1465.2",
    "BF₃(g)": "-1137",
    "Br⁻(aq)": "-121.55",
    "Br(g)": "111.88",
    "Br₂(g)": "30.907",
    "Br₂(l)": "0",
    "C(g)": "716.68",
    "C(s) - Diamond": "1.88",
    "C(s) - Graphite": "0",
    "CH₃CHO(g)": "-166.19",
    "CH₃CHO(l) - Acetaldehyde": "-192.3",
    "CH₃COCH₃(l) - Acetone": "-248.1",
    "CH₃COOH(aq)": "-485.76",
    "CH₃COOH(l) - Acetic acid": "-484.5",
    "CH₃NH₂(g) - Methylamine": "-22.97",
    "CH₃OH(g)": "-200.66",
    "CH₃OH(l) - Methanol": "-238.6",
    "CH₄(g) - Methane": "-74.81",
    "CHCl₃(l)": "-131.8",
    "(COOH)₂(s) - Oxalic acid": "-827.2",
    "C₂H₂(g) - Acetylene": "226.73",
    "C₂H₄(g) - Ethylene": "52.28",
    "C₂H₅OH(g)": "-235.1",
    "C₂H₅OH(l) - Ethanol": "-277.69",
    "C₂H₆(g) - Ethane": "-84.68",
    "C₃H₆(g) - Cyclopropane ": "53.3",
    "C₃H₆(g) - Propylene": "20.42",
    "C₃H₈(g) - Propane": "-103.8",
    "C₄H₁₀(g) - Butane": "-126.15",
    "C₅H₁₂(g) - Pentane": "-146.44",
    "C₆H₁₂(l) - Cyclohexane": "-156.4",
    "C₆H₁₂O₆(s) - Fructose": "-1266",
    "C₆H₁₂O₆(s) - Glucose": "-1273",
    "C₆H₁₄(l) - Haxane": "-198.7",
    "C₆H₅COOH(s) - Benzoic acid": "-385.1",
    "C₆H₅NH₂(l) - Aniline": "31.6",
    "C₆H₅OH(s) - Phenol": "-164.6",
    "C₆H₆(l) - Benzene": "49.03",
    "C₇H₈(l) - Toluene": "12",
    "C₈H₁₈(l) - Octane": "-250.1",
    "C₁₂H₂₂O₁₁(s) - Sucrose": "-2220",
    "CO(g)": "-110.5",
    "CO(NH₂)₂(s) - Urea": "-333.51",
    "CO₂(g)": "-393.5",
    "CO₃²⁻(aq)": "-677.14",
    "CCl₄(g)": "-102.9",
    "CCl₄(l)": "-139.5",
    "Ca(g)": "178.2",
    "Ca(OH)₂(aq)": "-1002.82",
    "Ca(OH)₂(s)": "-986.6",
    "Ca(s)": "0",
    "Ca²⁺(aq)": "-542.83",
    "CaBr₂(s)": "-682.8",
    "CaC₂(s)": "-59.8",
    "CaCl₂(aq)": "-877.1",
    "CaCl₂(s)": "-795",
    "CaCO₃(aq)": "-1219.97",
    "CaCO₃(s)": "-1207.1",
    "CaF₂(aq)": "-1208.09",
    "CaF₂(s)": "-1219.6",
    "CaO(s)": "-635.5",
    "CaSO₄(aq)": "-1452.1",
    "CaSO₄(s)": "-1432.7",
    "Ce(s)": "0",
    "Ce³⁺(aq)": "-696.2",
    "Ce⁴⁺(aq)": "-537.2",
    "Cl(g)": "121.68",
    "Cl⁻(aq)": "-167.16",
    "Cl₂(g)": "0",
    "CoO(s)": "-239.3",
    "Cr₂O₃(s)": "-1128.4",
    "CS₂(l)": "89.7",
    "Cu(s)": "0",
    "Cu⁺(aq)": "71.67",
    "Cu²⁺(aq)": "64.77",
    "Cu₂O(s)": "-168.6",
    "CuO(s)": "-157.3",
    "CuS(s)": "-48.5",
    "CuSO₄(s)": "-771.36",
    "D₂(g)": "0",
    "D₂O(l)": "-294.6",
    "D₂O(g)": "-249.2",
    "F⁻(aq)": "-332.63",
    "F₂(g)": "0",
    "Fe(s)": "0",
    "Fe²⁺(aq)": "-89.1",
    "Fe³⁺(aq)": "-48.5",
    "FeO(s)": "-272.04",
    "Fe₂O₃(s) - Hematite": "-824.2",
    "Fe₃O₄(s) - Magnetite": "-1118.4",
    "FeS(s) - α": "-100",
    "FeS₂(s) ": "-178.2",
    "H(g)": "217.97",
    "H⁺(aq)": "0",
    "H₂(g)": "0",
    "H₂O(g) - Water vapor": "-241.8",
    "H₂O(l) - Water": "-285.83",
    "H₂O₂(aq)": "-191.17",
    "H₂O₂(l)": "-187.8",
    "H₂S(aq)": "-39.7",
    "H₂S(g)": "-20.63",
    "H₂SO₄(aq)": "-909.27",
    "H₂SO₄(l)": "-813.99",
    "H₃PO₃(aq)": "-964",
    "H₃PO₄(aq)": "-277.4",
    "H₃PO₄(l)": "-1266.9",
    "HBr(g)": "-36.23",
    "HCHO(g) - Formaldehyde": "-108.57",
    "HCl(aq)": "-167.16",
    "HCl(g)": "-92.31",
    "HCN(g)": "135.1",
    "HCN(l)": "108.87",
    "HCOOH(l) - Formic acid": "-424.72",
    "HF(aq)": "-332.36",
    "HF(g)": "-271.1",
    "Hg(g)": "61.32",
    "Hg(l)": "0",
    "Hg₂Cl₂(s)": "-265.22",
    "HgO(s)": "-90.83",
    "HgS(s)": "-58.2",
    "HI(g)": "26.48",
    "HN₃(g)": "294.1",
    "HNO₃(aq)": "-207.36",
    "HNO₃(l)": "-174.1",
    "I⁻(aq)": "-55.19",
    "I₂(g)": "62.44",
    "I₂(s)": "0",
    "K(g)": "89.24",
    "K(s)": "0",
    "K⁺(aq)": "-252.38",
    "K₂S(aq)": "-471.5",
    "K₂S(s)": "-380.7",
    "KBr(s)": "-393.8",
    "KCl(s)": "-436.75",
    "KClO₃(s)": "-397.73",
    "KClO₄(s)": "-432.75",
    "KF(s)": "-567.27",
    "KI(s)": "-327.9",
    "KOH(aq)": "-482.37",
    "KOH(s)": "-424.76",
    "Mg(g)": "147.7",
    "Mg(OH)₂(s)": "-924.7",
    "Mg(s)": "0",
    "Mg²⁺(aq)": "-466.85",
    "MgBr₂(s)": "-524.3",
    "MgCl₂(s)": "-641.8",
    "MgCO₃(s)": "-1095.8",
    "MgO(s)": "-601.7",
    "MgSO₄(s)": "-1278.2",
    "MnO(s)": "-384.9",
    "MnO₂(s)": "-519.7",
    "N₂(g)": "0",
    "N₂H₄(g)": "95.4",
    "N₂H₄(l)": "50.63",
    "N₂O(g)": "82.05",
    "N₂O₄(g)": "9.16",
    "N₂O₄(l)": "-19.5",
    "Na(g)": "107.32",
    "Na(s)": "0",
    "Na⁺(aq)": "-240.12",
    "Na₂CO₃(s)": "-1130.9",
    "NaBr(s)": "-361.06",
    "NaCl(s)": "-411.15",
    "NaF(s)": -569,
    "NaHCO₃(s)": "-947.7",
    "NaI(s)": "-287.78",
    "NaOH(aq)": "-470.11",
    "NaOH(s)": "-425.61",
    "NH₂CH₂COOH(s) - Glycine": "-532.9",
    "NH₂OH(s)": "-114.2",
    "NH₃(aq)": "-80.29",
    "NH₃(g) - Ammonia": "-46.11",
    "NH₄⁺(aq)": "-132.51",
    "NH₄Cl(s)": "-314.43",
    "NH₄ClO₄(s)": "-295.31",
    "NH₄NO₃(s)": "-365.56",
    "NiO(s)": "-244.3",
    "NO(g)": "90.25",
    "NO₂(g)": "33.18",
    "NO₃⁻(aq)": "-205",
    "O₂(g)": "0",
    "O₃(g)": "142.7",
    "OH⁻(aq)": "-229.99",
    "P(s)": "0",
    "P₄(g)": "58.91",
    "P₄O₁₀(s)": "-2984",
    "Pb(s)": "0",
    "Pb²⁺(aq)": "-1.7",
    "Pb₃O₄(s)": "-734.7",
    "PbBr₂(aq)": "-244.8",
    "PbBr₂(s)": "-278.7",
    "PbCl₂(s)": "-359.2",
    "PbO(s)": "-217.9",
    "PbO₂(s)": "-277.4",
    "PbSO₄(s)": "-919.94",
    "PCl₃(g)": "-287",
    "PCl₃(l)": "-319.7",
    "PCl₅(g)": "-374.9",
    "PCl₅(s)": "-443.5",
    "PH₃(g)": "5.4",
    "S(s) - Monoclinic": "0.33",
    "S(s) - Rhombic": "0",
    "S²⁻(aq)": "33.1",
    "SbCl₃(g)": "-313.8",
    "SbCl₅(g) ": "-394.34",
    "SbH₃(g) ": "145.11",
    "SF₆(g)": "-1209",
    "Si(s)": "0",
    "SiO₂(s)": "-859.4",
    "SiO₂(s) - α": "-910.94",
    "Sn(s) - Gray": "-2.09",
    "Sn(s) - White": "0",
    "SnCl₂(s)": "-349.8",
    "SnCl₄(l)": "-545.2",
    "SnO(s)": "-285.8",
    "SnO₂(s)": "-580.7",
    "SO₂(g)": "-296.83",
    "SO₃(g)": "-395.72",
    "SO₄²⁻(aq)": "-909.27",
    "Zn(s)": "0",
    "Zn²⁺(aq)": "-153.89",
    "ZnO(s)": "-348.28",
    "ZnS(s)": "-202.9",
  };

  //dropdown states
  const [dropdownVisible7, setDropdownVisible7] = useState(false);

  const setUnitHandler7 = (unit) => {
    setFormData((prev) => ({
      ...prev,
      tech_rA_values: unit,
      tech_rA: DATA_A[unit], // set the numeric value in the input
    }));
    setDropdownVisible7(false);
  };

  const toggleDropdown7 = () => {
    setDropdownVisible7(!dropdownVisible7);
  };

  //dropdown states
  const [dropdownVisible07, setDropdownVisible07] = useState(false);

  const setUnitHandler07 = (unit) => {
    setFormData((prev) => ({
      ...prev,
      tech_rB_values: unit,
      tech_rB: DATA_A[unit], // set the numeric value in the input
    }));
    setDropdownVisible07(false);
  };

  const toggleDropdown07 = () => {
    setDropdownVisible07(!dropdownVisible07);
  };

  //dropdown states
  const [dropdownVisible8, setDropdownVisible8] = useState(false);

  const setUnitHandler8 = (unit) => {
    setFormData((prev) => ({
      ...prev,
      tech_rC_values: unit,
      tech_rC: DATA_A[unit], // set the numeric value in the input
    }));
    setDropdownVisible8(false);
  };

  const toggleDropdown8 = () => {
    setDropdownVisible8(!dropdownVisible8);
  };

  //dropdown states
  const [dropdownVisible9, setDropdownVisible9] = useState(false);

  const setUnitHandler9 = (unit) => {
    setFormData((prev) => ({
      ...prev,
      tech_pD_values: unit,
      tech_pD: DATA_A[unit], // set the numeric value in the input
    }));
    setDropdownVisible9(false);
  };

  const toggleDropdown9 = () => {
    setDropdownVisible9(!dropdownVisible9);
  };
  //dropdown states
  const [dropdownVisible10, setDropdownVisible10] = useState(false);

  const setUnitHandler10 = (unit) => {
    setFormData((prev) => ({
      ...prev,
      tech_pE_values: unit,
      tech_pE: DATA_A[unit], // set the numeric value in the input
    }));
    setDropdownVisible10(false);
  };

  const toggleDropdown10 = () => {
    setDropdownVisible10(!dropdownVisible10);
  };
  //dropdown states
  const [dropdownVisible11, setDropdownVisible11] = useState(false);

  const setUnitHandler11 = (unit) => {
    setFormData((prev) => ({
      ...prev,
      tech_pF_values: unit,
      tech_pF: DATA_A[unit], // set the numeric value in the input
    }));
    setDropdownVisible11(false);
  };

  const toggleDropdown11 = () => {
    setDropdownVisible11(!dropdownVisible11);
  };

  const conversionFactors1 = {
    J: 1,
    kJ: 0.001,
    MJ: 0.000001,
    Wh: 0.000277778,
    kWh: 0.000000277778,
    "ft-lbs": 0.737562,
    kcal: 0.000239006,
    eV: 6.242e18,
  };

  const conversionFactors2 = {
    J: 1000,
    kJ: 1,
    MJ: 0.001,
    Wh: 0.277778,
    kWh: 0.000277778,
    "ft-lbs": 737.562,
    kcal: 0.239006,
    eV: 6242000000000000000000,
  };

  const [tech_resultUnit1, setTechResultUnit1] = useState("J");
  const [tech_resultUnit2, setTechResultUnit2] = useState("J");
  const [tech_resultUnit3, setTechResultUnit3] = useState("J");

  const handleChange1 = (e) => {
    setTechResultUnit1(e.target.value);
  };
  const handleChange2 = (e) => {
    setTechResultUnit2(e.target.value);
  };
  const handleChange3 = (e) => {
    setTechResultUnit3(e.target.value);
  };

  let convertedValue1 = ""; // Declare pehle

  if (result?.tech_ans === "enthalpyFormula") {
    convertedValue1 = result?.tech_ans
      ? (result.tech_ans * conversionFactors1[tech_resultUnit1]).toFixed(4)
      : "";
  } else {
    convertedValue1 = result?.tech_ans
      ? (result.tech_ans * conversionFactors2[tech_resultUnit1]).toFixed(3)
      : "";
  }

  const convertedValue2 = result?.tech_initial_enth
    ? (result.tech_initial_enth * conversionFactors1[tech_resultUnit2]).toFixed(
        4
      )
    : "";
  const convertedValue3 = result?.tech_Final_enth
    ? (result.tech_Final_enth * conversionFactors1[tech_resultUnit3]).toFixed(4)
    : "";

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

          <div className="lg:w-[70%] md:w-[90%] w-full mx-auto ">
            <div className="grid grid-cols-12 mt-3  gap-4">
              <div className="col-span-12 flex">
                <div className="w-full py-2">
                  <div className="mt-2 mt-lg-2 calEnthalpy md:flex lg:flex justify-between align-items-center">
                    <label
                      htmlFor="calEnthalpy"
                      className="font-s-14 text-blue"
                    >
                      {data?.payload?.tech_lang_keys["1"]}:
                    </label>
                    <p className="mb-1 mb-lg-0">
                      <label className="pe-2" htmlFor="enthalpyFormula">
                        <input
                          type="radio"
                          name="tech_calEnthalpy"
                          value="enthalpyFormula"
                          id="enthalpyFormula"
                          className="mr-2 border"
                          onChange={handleChange}
                          checked={
                            formData.tech_calEnthalpy === "enthalpyFormula"
                          }
                        />
                        <span>{data?.payload?.tech_lang_keys["2"]}</span>
                      </label>
                    </p>
                    <p>
                      <label className="pe-2" htmlFor="reactionScheme">
                        <input
                          type="radio"
                          name="tech_calEnthalpy"
                          value="reactionScheme"
                          id="reactionScheme"
                          className="mr-2 border"
                          onChange={handleChange}
                          checked={
                            formData.tech_calEnthalpy === "reactionScheme"
                          }
                        />
                        <span>{data?.payload?.tech_lang_keys["3"]}</span>
                      </label>
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-span-6 hidden" id="calFrom">
                <label htmlFor="tech_calFrom" className="label">
                  {data?.payload?.tech_lang_keys["5"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_calFrom"
                    id="tech_calFrom"
                    value={formData.tech_calFrom}
                    onChange={handleChange}
                  >
                    <option value="byStandard">
                      {data?.payload?.tech_lang_keys["5"]}
                    </option>
                    <option value="byChange">
                      {data?.payload?.tech_lang_keys["6"]}
                    </option>
                  </select>
                </div>
              </div>
              <div className="col-span-6 hidden" id="calFrom1">
                <label htmlFor="tech_calFrom1" className="label">
                  {data?.payload?.tech_lang_keys["4"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_calFrom1"
                    id="tech_calFrom1"
                    value={formData.tech_calFrom1}
                    onChange={handleChange}
                  >
                    <option value="2">
                      2 {data?.payload?.tech_lang_keys["7"]}
                    </option>
                    <option value="3">
                      3 {data?.payload?.tech_lang_keys["7"]}{" "}
                    </option>
                  </select>
                </div>
              </div>

              <div className="col-span-12 items-center flex text-center justify-center">
                {formData.tech_calEnthalpy === "enthalpyFormula" && (
                  <>
                    <div className="" id="enthalpyFormulatext">
                      <strong>ΔH = ΔQ + p * ΔV</strong>
                    </div>
                  </>
                )}
                {formData.tech_calEnthalpy === "reactionScheme" && (
                  <>
                    <div className="" id="reactionSchemetext">
                      <strong>
                        a<sub>n</sub>A + b<sub>n</sub>B + c<sub>n</sub>C → d
                        <sub>n</sub>D + e<sub>n</sub>E + f<sub>n</sub>F
                      </strong>
                    </div>
                  </>
                )}
              </div>

              {formData.tech_calEnthalpy === "enthalpyFormula" && (
                <>
                  <div className="col-span-12 inp_wrap">
                    <div className="grid grid-cols-12 mt-3  gap-4">
                      <div className="col-span-6" id="q1">
                        <label htmlFor="tech_q1" className="label">
                          {data?.payload?.tech_lang_keys["8"]}
                        </label>
                        <div className="relative w-full ">
                          <input
                            type="number"
                            name="tech_q1"
                            step="any"
                            className="mt-1 input"
                            value={formData.tech_q1}
                            placeholder="00"
                            onChange={handleChange}
                          />
                          <label
                            className="absolute cursor-pointer text-sm underline right-6 top-4"
                            onClick={toggleDropdown}
                          >
                            {formData.tech_q1_unit} ▾
                          </label>
                          {dropdownVisible && (
                            <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                              {[
                                { label: "J", value: "J" },
                                { label: "kJ", value: "kJ" },
                                { label: "MJ", value: "MJ" },
                                { label: "Wh", value: "Wh" },
                                { label: "kWh", value: "kWh" },
                                { label: "ft-lbs", value: "ft_lbs" },
                                { label: "kcal", value: "kcal" },
                                { label: "kcal", value: "kcal" },
                                { label: "eV", value: "eV" },
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
                      <div className="col-span-6" id="q2">
                        <label htmlFor="tech_q2" className="label">
                          {data?.payload?.tech_lang_keys["9"]}
                        </label>
                        <div className="relative w-full ">
                          <input
                            type="number"
                            name="tech_q2"
                            step="any"
                            className="mt-1 input"
                            value={formData.tech_q2}
                            placeholder="00"
                            onChange={handleChange}
                          />
                          <label
                            className="absolute cursor-pointer text-sm underline right-6 top-4"
                            onClick={toggleDropdown1}
                          >
                            {formData.tech_q2_unit} ▾
                          </label>
                          {dropdownVisible1 && (
                            <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                              {[
                                { label: "J", value: "J" },
                                { label: "kJ", value: "kJ" },
                                { label: "MJ", value: "MJ" },
                                { label: "Wh", value: "Wh" },
                                { label: "kWh", value: "kWh" },
                                { label: "ft-lbs", value: "ft_lbs" },
                                { label: "kcal", value: "kcal" },
                                { label: "kcal", value: "kcal" },
                                { label: "eV", value: "eV" },
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
                      <div className="col-span-6" id="v1">
                        <label htmlFor="tech_v1" className="label">
                          {data?.payload?.tech_lang_keys["10"]}
                        </label>
                        <div className="relative w-full ">
                          <input
                            type="number"
                            name="tech_v1"
                            step="any"
                            className="mt-1 input"
                            value={formData.tech_v1}
                            placeholder="00"
                            onChange={handleChange}
                          />
                          <label
                            className="absolute cursor-pointer text-sm underline right-6 top-4"
                            onClick={toggleDropdown2}
                          >
                            {formData.tech_v1_unit} ▾
                          </label>
                          {dropdownVisible2 && (
                            <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                              {[
                                { label: "mm³", value: "mm3" },
                                { label: "cm³", value: "cm3" },
                                { label: "dm³", value: "dm3" },
                                { label: "m³", value: "m3" },
                                { label: "cu in", value: "cu_in" },
                                { label: "cu ft", value: "cu_ft" },
                                { label: "cu yd", value: "cu_yd" },
                                { label: "ml", value: "ml" },
                                { label: "cl", value: "cl" },
                                { label: "liters", value: "liters" },
                                { label: "US gal", value: "us_gal" },
                                { label: "UK gal", value: "uk_gal" },
                                { label: "US fl oz", value: "us_fl_oz" },
                                { label: "UK fl oz", value: "uk_fl_oz" },
                                { label: "cups", value: "cups" },
                                { label: "tbsp", value: "tbsp" },
                                { label: "tsp", value: "tsp" },
                                { label: "US qt", value: "us_qt" },
                                { label: "UK qt", value: "uk_qt" },
                                { label: "US pt", value: "us_pt" },
                                { label: "UK pt", value: "uk_pt" },
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
                      <div className="col-span-6" id="v2">
                        <label htmlFor="tech_v2" className="label">
                          {data?.payload?.tech_lang_keys["11"]}
                        </label>
                        <div className="relative w-full ">
                          <input
                            type="number"
                            name="tech_v2"
                            step="any"
                            className="mt-1 input"
                            value={formData.tech_v2}
                            placeholder="00"
                            onChange={handleChange}
                          />
                          <label
                            className="absolute cursor-pointer text-sm underline right-6 top-4"
                            onClick={toggleDropdown3}
                          >
                            {formData.tech_v2_unit} ▾
                          </label>
                          {dropdownVisible3 && (
                            <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                              {[
                                { label: "mm³", value: "mm3" },
                                { label: "cm³", value: "cm3" },
                                { label: "dm³", value: "dm3" },
                                { label: "m³", value: "m3" },
                                { label: "cu in", value: "cu_in" },
                                { label: "cu ft", value: "cu_ft" },
                                { label: "cu yd", value: "cu_yd" },
                                { label: "ml", value: "ml" },
                                { label: "cl", value: "cl" },
                                { label: "liters", value: "liters" },
                                { label: "US gal", value: "us_gal" },
                                { label: "UK gal", value: "uk_gal" },
                                { label: "US fl oz", value: "us_fl_oz" },
                                { label: "UK fl oz", value: "uk_fl_oz" },
                                { label: "cups", value: "cups" },
                                { label: "tbsp", value: "tbsp" },
                                { label: "tsp", value: "tsp" },
                                { label: "US qt", value: "us_qt" },
                                { label: "UK qt", value: "uk_qt" },
                                { label: "US pt", value: "us_pt" },
                                { label: "UK pt", value: "uk_pt" },
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
                      <div className="col-span-6 hidden" id="changeQ">
                        <label htmlFor="tech_changeQ" className="label">
                          {data?.payload?.tech_lang_keys["12"]}
                        </label>
                        <div className="relative w-full ">
                          <input
                            type="number"
                            name="tech_changeQ"
                            step="any"
                            className="mt-1 input"
                            value={formData.tech_changeQ}
                            placeholder="00"
                            onChange={handleChange}
                          />
                          <label
                            className="absolute cursor-pointer text-sm underline right-6 top-4"
                            onClick={toggleDropdown4}
                          >
                            {formData.tech_changeQ_unit} ▾
                          </label>
                          {dropdownVisible4 && (
                            <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                              {[
                                { label: "J", value: "J" },
                                { label: "kJ", value: "kJ" },
                                { label: "MJ", value: "MJ" },
                                { label: "Wh", value: "Wh" },
                                { label: "kWh", value: "kWh" },
                                { label: "ft-lbs", value: "ft_lbs" },
                                { label: "kcal", value: "kcal" },
                                { label: "kcal", value: "kcal" },
                                { label: "eV", value: "eV" },
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
                      <div className="col-span-6 hidden" id="changeV">
                        <label htmlFor="tech_changeV" className="label">
                          {data?.payload?.tech_lang_keys["13"]}
                        </label>
                        <div className="relative w-full ">
                          <input
                            type="number"
                            name="tech_changeV"
                            step="any"
                            className="mt-1 input"
                            value={formData.tech_changeV}
                            placeholder="00"
                            onChange={handleChange}
                          />
                          <label
                            className="absolute cursor-pointer text-sm underline right-6 top-4"
                            onClick={toggleDropdown5}
                          >
                            {formData.tech_changeV_unit} ▾
                          </label>
                          {dropdownVisible5 && (
                            <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                              {[
                                { label: "mm³", value: "mm3" },
                                { label: "cm³", value: "cm3" },
                                { label: "dm³", value: "dm3" },
                                { label: "m³", value: "m3" },
                                { label: "cu in", value: "cu_in" },
                                { label: "cu ft", value: "cu_ft" },
                                { label: "cu yd", value: "cu_yd" },
                                { label: "ml", value: "ml" },
                                { label: "cl", value: "cl" },
                                { label: "liters", value: "liters" },
                                { label: "US gal", value: "us_gal" },
                                { label: "UK gal", value: "uk_gal" },
                                { label: "US fl oz", value: "us_fl_oz" },
                                { label: "UK fl oz", value: "uk_fl_oz" },
                                { label: "cups", value: "cups" },
                                { label: "tbsp", value: "tbsp" },
                                { label: "tsp", value: "tsp" },
                                { label: "US qt", value: "us_qt" },
                                { label: "UK qt", value: "uk_qt" },
                                { label: "US pt", value: "us_pt" },
                                { label: "UK pt", value: "uk_pt" },
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
                      <div className="col-span-6" id="p">
                        <label htmlFor="tech_p" className="label">
                          {data?.payload?.tech_lang_keys["14"]}
                        </label>
                        <div className="relative w-full ">
                          <input
                            type="number"
                            name="tech_p"
                            step="any"
                            className="mt-1 input"
                            value={formData.tech_p}
                            placeholder="00"
                            onChange={handleChange}
                          />
                          <label
                            className="absolute cursor-pointer text-sm underline right-6 top-4"
                            onClick={toggleDropdown6}
                          >
                            {formData.tech_p_unit} ▾
                          </label>
                          {dropdownVisible6 && (
                            <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                              {[
                                { label: "Pa", value: "Pa" },
                                { label: "bar", value: "bar" },
                                { label: "psi", value: "psi" },
                                { label: "at", value: "at" },
                                { label: "atm", value: "atm" },
                                { label: "torr", value: "torr" },
                                { label: "hpa", value: "hpa" },
                                { label: "kPa", value: "kPa" },
                                { label: "MPa", value: "MPa" },
                                { label: "GPa", value: "GPa" },
                                { label: "in H", value: "in_hg" },
                                { label: "mmhg", value: "mmhg" },
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
                    </div>
                  </div>
                </>
              )}
              {formData.tech_calEnthalpy === "reactionScheme" && (
                <>
                  <strong className="col-span-12  heading mb-2 mb-lg-0">
                    {data?.payload?.tech_lang_keys["16"]}
                  </strong>
                  <div className="col-span-6 " id="a_n">
                    <label htmlFor="tech_a_n" className="label">
                      a<sub className="text-blue">n</sub>{" "}
                      {data?.payload?.tech_lang_keys["15"]}:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_a_n"
                        id="tech_a_n"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_a_n}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-span-6 " id="rA">
                    <label htmlFor="tech_rA" className="label">
                      {data?.payload?.tech_lang_keys["16"]}
                    </label>
                    <div className="relative w-full">
                      <input
                        type="number"
                        name="tech_rA"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_rA}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown7}
                      >
                        {formData.tech_rA_values} ▾
                      </label>

                      {dropdownVisible7 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0 max-h-64 overflow-y-auto">
                          {Object.keys(DATA_A).map((key, index) => (
                            <p
                              key={index}
                              className="p-2 hover:bg-gray-100 cursor-pointer"
                              onClick={() => setUnitHandler7(key)}
                            >
                              {key} ({DATA_A[key]})
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col-span-6 " id="b_n">
                    <label htmlFor="tech_b_n" className="label">
                      b<sub className="text-blue">n</sub>{" "}
                      {data?.payload?.tech_lang_keys["15"]}:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_b_n"
                        id="tech_b_n"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_b_n}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-span-6 " id="rB">
                    <label htmlFor="tech_rB" className="label">
                      {data?.payload?.tech_lang_keys["16"]} B
                    </label>
                    <div className="relative w-full">
                      <input
                        type="number"
                        name="tech_rB"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_rB}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown07}
                      >
                        {formData.tech_rB_values} ▾
                      </label>

                      {dropdownVisible07 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0 max-h-64 overflow-y-auto">
                          {Object.keys(DATA_A).map((key, index) => (
                            <p
                              key={index}
                              className="p-2 hover:bg-gray-100 cursor-pointer"
                              onClick={() => setUnitHandler07(key)}
                            >
                              {key} ({DATA_A[key]})
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="col-span-6 " id="c_n">
                    <label htmlFor="tech_c_n" className="label">
                      c<sub className="text-blue">n</sub>{" "}
                      {data?.payload?.tech_lang_keys["15"]}:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_c_n"
                        id="tech_c_n"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_c_n}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-span-6 " id="rC">
                    <label htmlFor="tech_rC" className="label">
                      {data?.payload?.tech_lang_keys["16"]} C
                    </label>
                    <div className="relative w-full">
                      <input
                        type="number"
                        name="tech_rC"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_rC}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown8}
                      >
                        {formData.tech_rC_values} ▾
                      </label>

                      {dropdownVisible8 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0 max-h-64 overflow-y-auto">
                          {Object.keys(DATA_A).map((key, index) => (
                            <p
                              key={index}
                              className="p-2 hover:bg-gray-100 cursor-pointer"
                              onClick={() => setUnitHandler8(key)}
                            >
                              {key} ({DATA_A[key]})
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <strong className="col-span-12  heading mt-1 mb-2 mb-lg-0">
                    {data?.payload?.tech_lang_keys["17"]}
                  </strong>
                  <div className="col-span-6 " id="d_n">
                    <label htmlFor="tech_d_n" className="label">
                      d<sub className="text-blue">n</sub>{" "}
                      {data?.payload?.tech_lang_keys["15"]}:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_d_n"
                        id="tech_d_n"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_d_n}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-span-6 " id="pD">
                    <label htmlFor="tech_pD" className="label">
                      {data?.payload?.tech_lang_keys["17"]} D
                    </label>
                    <div className="relative w-full">
                      <input
                        type="number"
                        name="tech_pD"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_pD}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown9}
                      >
                        {formData.tech_pD_values} ▾
                      </label>

                      {dropdownVisible9 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0 max-h-64 overflow-y-auto">
                          {Object.keys(DATA_A).map((key, index) => (
                            <p
                              key={index}
                              className="p-2 hover:bg-gray-100 cursor-pointer"
                              onClick={() => setUnitHandler9(key)}
                            >
                              {key} ({DATA_A[key]})
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col-span-6 " id="e_n">
                    <label htmlFor="tech_e_n" className="label">
                      e<sub className="text-blue">n</sub>{" "}
                      {data?.payload?.tech_lang_keys["15"]}:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_e_n"
                        id="tech_e_n"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_e_n}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-span-6 " id="pE">
                    <label htmlFor="tech_pE" className="label">
                      {data?.payload?.tech_lang_keys["17"]} E
                    </label>
                    <div className="relative w-full">
                      <input
                        type="number"
                        name="tech_pE"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_pE}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown10}
                      >
                        {formData.tech_pE_values} ▾
                      </label>

                      {dropdownVisible10 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0 max-h-64 overflow-y-auto">
                          {Object.keys(DATA_A).map((key, index) => (
                            <p
                              key={index}
                              className="p-2 hover:bg-gray-100 cursor-pointer"
                              onClick={() => setUnitHandler10(key)}
                            >
                              {key} ({DATA_A[key]})
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="col-span-6 " id="f_n">
                    <label htmlFor="tech_f_n" className="label">
                      f<sub className="text-blue">n</sub>{" "}
                      {data?.payload?.tech_lang_keys["15"]}:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_f_n"
                        id="tech_f_n"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_f_n}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-span-6 " id="pF">
                    <label htmlFor="tech_pF" className="label">
                      {data?.payload?.tech_lang_keys["17"]} F
                    </label>
                    <div className="relative w-full">
                      <input
                        type="number"
                        name="tech_pF"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_pF}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown11}
                      >
                        {formData.tech_pF_values} ▾
                      </label>

                      {dropdownVisible11 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0 max-h-64 overflow-y-auto">
                          {Object.keys(DATA_A).map((key, index) => (
                            <p
                              key={index}
                              className="p-2 hover:bg-gray-100 cursor-pointer"
                              onClick={() => setUnitHandler11(key)}
                            >
                              {key} ({DATA_A[key]})
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
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
              <div className="w-full mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg  flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="w-full md:w-[80%] lg:w-[60%] overflow-auto">
                        <table className="w-full text-[16px]">
                          <tbody>
                            <tr>
                              <td className="py-2 border-b" width="50%">
                                {data?.payload?.tech_lang_keys[18]}
                              </td>
                              <td className="py-2 border-b text-end circle_result">
                                {convertedValue1 || 0}
                              </td>

                              <td className="py-2 border-b text-end">
                                <select
                                  id="tech_resultUnit1"
                                  name="tech_resultUnit1"
                                  value={tech_resultUnit1}
                                  onChange={handleChange1}
                                  className="d-inline border-0 text-blue text-[16px] w-[90px] result_select_dropdown"
                                >
                                  <option value="J">J</option>
                                  <option value="kJ">kJ</option>
                                  <option value="MJ">MJ</option>
                                  <option value="Wh">Wh</option>
                                  <option value="kWh">kWh</option>
                                  <option value="ft-lbs">ft-lbs</option>
                                  <option value="kcal">kcal</option>
                                  <option value="eV">eV</option>
                                </select>
                              </td>
                            </tr>
                            {formData?.tech_calEnthalpy ===
                              "enthalpyFormula" && (
                              <>
                                <tr>
                                  <td className="py-2 border-b">
                                    {data?.payload?.tech_lang_keys[27]}
                                  </td>
                                  <td className="py-2 border-b text-end circle_result">
                                    {" "}
                                    {convertedValue2 || 0}{" "}
                                  </td>
                                  <td
                                    className="py-2 border-b relative text-center"
                                    style={{ width: "25%" }}
                                  >
                                    <select
                                      id="tech_resultUnit2"
                                      name="tech_resultUnit2"
                                      value={tech_resultUnit2}
                                      onChange={handleChange2}
                                      className="d-inline border-0 border-none text-blue text-[16px] w-[90px] result_select_dropdown"
                                    >
                                      <option value="J">J</option>
                                      <option value="kJ">kJ</option>
                                      <option value="MJ">MJ</option>
                                      <option value="Wh">Wh</option>
                                      <option value="kWh">kWh</option>
                                      <option value="ft-lbs">ft-lbs</option>
                                      <option value="kcal">kcal</option>
                                      <option value="mi">mi</option>
                                      <option value="eV">eV</option>
                                    </select>
                                  </td>
                                </tr>

                                <tr>
                                  <td className="py-2 border-b">
                                    {data?.payload?.tech_lang_keys[28]}
                                  </td>
                                  <td
                                    className="py-2 border-b text-end circle_result"
                                    data-target="3"
                                  >
                                    {convertedValue3 || 0}
                                  </td>
                                  <td
                                    className="py-2 border-b relative text-center"
                                    style={{ width: "20%" }}
                                  >
                                    <select
                                      id="tech_resultUnit3"
                                      name="tech_resultUnit3"
                                      value={tech_resultUnit3}
                                      onChange={handleChange3}
                                      className="d-inline border-0 border-none text-blue text-[16px] w-[90px] result_select_dropdown"
                                    >
                                      <option value="J">J</option>
                                      <option value="kJ">kJ</option>
                                      <option value="MJ">MJ</option>
                                      <option value="Wh">Wh</option>
                                      <option value="kWh">kWh</option>
                                      <option value="ft-lbs">ft-lbs</option>
                                      <option value="kcal">kcal</option>
                                      <option value="mi">mi</option>
                                      <option value="eV">eV</option>
                                    </select>
                                  </td>
                                </tr>
                              </>
                            )}
                          </tbody>
                        </table>
                      </div>

                      <div className="w-full overflow-auto">
                        <div className="mt-2">
                          {formData?.tech_calEnthalpy === "enthalpyFormula" ? (
                            <>
                              <p className="mt-2 font-s-18">
                                <strong className="text-blue">
                                  {data?.payload?.tech_lang_keys["19"]}:
                                </strong>
                              </p>
                              <div className="mt-2">
                                {data?.payload?.tech_lang_keys["20"]}
                              </div>
                              <div className="mt-2">
                                <BlockMath
                                  math={
                                    "\\Delta H = \\Delta Q + p \\cdot \\Delta V"
                                  }
                                />
                              </div>

                              {result?.tech_check === "byStandard" ? (
                                <>
                                  <div className="mt-2">
                                    {data?.payload?.tech_lang_keys["21"]}
                                  </div>
                                  <div className="mt-2">
                                    <BlockMath
                                      math={
                                        "\\Delta H = (Q_2 - Q_1) + p \\cdot (V_2 - V_1)"
                                      }
                                    />
                                  </div>
                                  <div className="mt-2">
                                    {data?.payload?.tech_lang_keys["22"]}
                                  </div>
                                  <div className="mt-2">
                                    Q₁ = {result?.tech_q1}, Q₂ ={" "}
                                    {result?.tech_q2}, V₁ = {result?.tech_v1},
                                    V₂ = {result?.tech_v2}, p = {result?.tech_p}
                                    , ΔH = ?
                                  </div>
                                  <div className="mt-2">
                                    <strong>
                                      {data?.payload?.tech_lang_keys["23"]}
                                    </strong>
                                  </div>
                                  <div className="mt-2">
                                    <BlockMath
                                      math={
                                        "\\Delta H = (Q_2 - Q_1) + p \\cdot (V_2 - V_1)"
                                      }
                                    />
                                  </div>
                                  <div className="mt-2">
                                    <BlockMath
                                      math={`\\Delta H = (${result?.tech_q2} - ${result?.tech_q1}) + (${result?.tech_p}) \\cdot (${result?.tech_v2} - ${result?.tech_v1})`}
                                    />
                                  </div>
                                  <div className="mt-2">
                                    <BlockMath
                                      math={`\\Delta H = (${
                                        result?.tech_q2 - result?.tech_q1
                                      }) + (${result?.tech_p}) \\cdot (${
                                        result?.tech_v2 - result?.tech_v1
                                      })`}
                                    />
                                  </div>
                                  <div className="mt-2">
                                    <BlockMath
                                      math={`\\Delta H = (${
                                        result?.tech_q2 - result?.tech_q1
                                      }) + (${
                                        result?.tech_p *
                                        (result?.tech_v2 - result?.tech_v1)
                                      })`}
                                    />
                                  </div>
                                  <div className="mt-2">
                                    ΔH = <strong>{result?.tech_ans}</strong>
                                  </div>
                                </>
                              ) : result?.tech_check === "byChange" ? (
                                <>
                                  <div className="mt-2">
                                    {data?.payload?.tech_lang_keys["22"]}
                                  </div>
                                  <div className="mt-2">
                                    ΔQ = {result?.tech_changeQ}, ΔV ={" "}
                                    {result?.tech_changeV}, p = {result?.tech_p}
                                    , ΔH = ?
                                  </div>
                                  <div className="mt-2">
                                    <strong>
                                      {data?.payload?.tech_lang_keys["23"]}
                                    </strong>
                                  </div>
                                  <div className="mt-2">
                                    <BlockMath
                                      math={
                                        "\\Delta H = \\Delta Q + p \\cdot \\Delta V"
                                      }
                                    />
                                  </div>
                                  <div className="mt-2">
                                    <BlockMath
                                      math={`\\Delta H = (${result?.tech_changeQ}) + (${result?.tech_p}) \\cdot (${result?.tech_changeV})`}
                                    />
                                  </div>
                                  <div className="mt-2">
                                    <BlockMath
                                      math={`\\Delta H = (${
                                        result?.tech_changeQ
                                      }) + (${
                                        result?.tech_p * result?.tech_changeV
                                      })`}
                                    />
                                  </div>
                                  <div className="mt-2">
                                    ΔH = <strong>{result?.tech_ans}</strong>
                                  </div>
                                </>
                              ) : null}
                            </>
                          ) : formData?.tech_calEnthalpy ===
                            "reactionScheme" ? (
                            <>
                              <div className="mt-2">
                                <strong>
                                  {data?.payload?.tech_lang_keys["24"]}:
                                </strong>
                              </div>
                              <div className="mt-2">
                                <strong>
                                  {data?.payload?.tech_lang_keys["25"]}:
                                </strong>
                              </div>
                              <div className="mt-2">
                                {result?.tech_reaction}
                              </div>
                              <div className="mt-2">
                                <strong>
                                  {data?.payload?.tech_lang_keys["26"]}:
                                </strong>
                              </div>
                              <div className="mt-2">
                                {result?.tech_text_vals?.map((val, i) => (
                                  <p key={i}>
                                    {result?.tech_text_labels?.[i]}: H
                                    <sub>f</sub> = {val} kJ
                                  </p>
                                ))}
                              </div>
                            </>
                          ) : null}
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

export default EnthalpyCalculator;

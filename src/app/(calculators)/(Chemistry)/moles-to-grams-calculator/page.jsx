"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useMolesToGramsCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const MolesToGramsCalculator = () => {
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
    tech_chemical_selection: "8",
    tech_chemical_name: "44.0526",
    tech_mm: "44.0526",
    tech_mm_unit: "dag/mol",
    tech_unit: "1", // 1 2 3
    tech_m: "1",
    tech_m_unit: "dag",
    tech_nm: "17",
    tech_nm_unit: "pmol",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateActivationCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useMolesToGramsCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;

    let updatedFormData = { ...formData, [name]: value };
    if (name === "tech_chemical_name") {
      // Jab chemical select ho to uski value tech_mm me daal do
      updatedFormData.tech_mm = value;
    }

    // Auto-update molar mass when tech_chemical_selection changes
    if (name === "tech_chemical_selection") {
      if (value === "8") {
        updatedFormData.tech_mm = "44.0526";
      } else if (value === "9") {
        updatedFormData.tech_mm = "227";
      } else {
        updatedFormData.tech_mm = "";
      }
    }

    setFormData(updatedFormData);
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_chemical_selection) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateActivationCalculator({
        tech_chemical_selection: formData.tech_chemical_selection,
        tech_chemical_name: formData.tech_chemical_name,
        tech_mm: formData.tech_mm,
        tech_mm_unit: formData.tech_mm_unit,
        tech_unit: formData.tech_unit,
        tech_m: formData.tech_m,
        tech_m_unit: formData.tech_m_unit,
        tech_nm: formData.tech_nm,
        tech_nm_unit: formData.tech_nm_unit,
      }).unwrap();
      setResult(response?.payload); // Assuming the response'
      toast.success("Successfully Calculated");
    } catch (err) {
      setFormError(err.data.payload.error);
      toast.error(err.data.payload.error);
    }
  };

  // Handle reset form
  const handleReset = () => {
    setFormData({
      tech_chemical_selection: "8",
      tech_chemical_name: "44.0526",
      tech_mm: "44.0526",
      tech_mm_unit: "dag/mol",
      tech_unit: "1", // 1 2 3
      tech_m: "1",
      tech_m_unit: "dag",
      tech_nm: "17",
      tech_nm_unit: "pmol",
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
  {
    /* <span className="text-blue input_unit">{currency.symbol}</span> */
  }
  // currency code

  //dropdown states
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const setUnitHandler = (unit) => {
    setFormData((prev) => ({ ...prev, tech_mm_unit: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  //dropdown states
  const [dropdownVisible1, setDropdownVisible1] = useState(false);

  const setUnitHandler1 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_m_unit: unit }));
    setDropdownVisible1(false);
  };

  const toggleDropdown1 = () => {
    setDropdownVisible1(!dropdownVisible1);
  };

  //dropdown states
  const [dropdownVisible2, setDropdownVisible2] = useState(false);

  const setUnitHandler2 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_nm_unit: unit }));
    setDropdownVisible2(false);
  };

  const toggleDropdown2 = () => {
    setDropdownVisible2(!dropdownVisible2);
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
      <form className="row" onSubmit={handleSubmit}>
        <div className="w-full mx-auto p-4 lg:p-8 md:p-8 input_form rounded-lg  space-y-6 mb-3">
          {formError && (
            <p className="text-red-500 text-lg font-semibold w-full">
              {formError}
            </p>
          )}

          <div className="lg:w-[70%] md:w-[90%] w-full mx-auto ">
            {formData.tech_unit != "3" && (
              <>
                <div className="grid grid-cols-1   gap-4 mt-2 cont">
                  <div className="w-full px-2 mb-2">
                    <p className="font-s-14">
                      <strong className="text-blue">
                        {data?.payload?.tech_lang_keys["1"]}
                      </strong>
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-12 gap-1  md:gap-4 mt-2 ">
                  <div className="lg:col-span-6 md:col-span-6 col-span-12">
                    <label htmlFor="tech_chemical_selection" className="label">
                      {data?.payload?.tech_lang_keys["2"]}:
                    </label>
                    <div className="mt-2">
                      <select
                        className="input"
                        aria-label="select"
                        name="tech_chemical_selection"
                        id="tech_chemical_selection"
                        value={formData.tech_chemical_selection}
                        onChange={handleChange}
                      >
                        <option value="8">
                          {data?.payload?.tech_lang_keys["3"]}
                        </option>
                        <option value="9">
                          {data?.payload?.tech_lang_keys["4"]}
                        </option>
                      </select>
                    </div>
                  </div>
                  <div
                    className="lg:col-span-6 md:col-span-6 col-span-12"
                    id="selection2"
                  >
                    <label htmlFor="tech_chemical_name" className="label">
                      &nbsp;
                    </label>
                    <div className="mt-2">
                      <select
                        className="input"
                        aria-label="select"
                        name="tech_chemical_name"
                        id="tech_chemical_name"
                        value={formData.tech_chemical_name}
                        onChange={handleChange}
                      >
                        {formData.tech_chemical_selection == "8" && (
                          <>
                            <option value="227">Actinium [Ac]</option>
                            <option value="107.868">Silver [Ag]</option>
                            <option value="26.9815">Aluminium [Al]</option>
                            <option value="243">Americium [Am]</option>
                            <option value="39.948">Argon [Ar]</option>
                            <option value="74.9216">Arsenic [As]</option>
                            <option value="210">Astatine [At]</option>
                            <option value="196.967">Gold [Au]</option>
                            <option value="10.811">Boron [B]</option>
                            <option value="137.327">Barium[Ba]</option>
                            <option value="9.0122">Beryllium[Be]</option>
                            <option value="262">Bohrium [Bh]</option>
                            <option value="208.98">Bismuth [Bi]</option>
                            <option value="247">Berkelium [Bk]</option>
                            <option value="79.904">Bromine [Br]</option>
                            <option value="12.0107">Carbon [C]</option>
                            <option value="40.078">Calcium [Ca]</option>
                            <option value="112.411">Cadmium [Cd]</option>
                            <option value="140.116">Cerium [Ce]</option>
                            <option value="251">Californium [Cf]</option>
                            <option value="35.453">Chlorine [Cl]</option>
                            <option value="247">Curium [Cm]</option>
                            <option value="63.546">Copper [Cu]</option>
                            <option value="132.905">Cesium [Cs]</option>
                            <option value="51.9961">Chromium [Cr]</option>
                            <option value="58.9332">Cobalt [Co]</option>
                            <option value="285">Copernicium [Cn]</option>
                            <option value="262">Dubnium [Db]</option>
                            <option value="281">Darmstadtium [Ds]</option>
                            <option value="162.5">Dysprosium [Dy]</option>
                            <option value="167.259">Erbium [Er]</option>
                            <option value="254">Einsteinium [Es]</option>
                            <option value="151.964">Europium [Eu]</option>
                            <option value="18.9984">Fluorine [F]</option>
                            <option value="55.845">Iron [Fe]</option>
                            <option value="289">Flevorium [Fl]</option>
                            <option value="257">Fermium [Fe]</option>
                            <option value="223">Francium[Fr]</option>
                            <option value="69.723">Galium [Ga]</option>
                            <option value="157.25">Gadollnium [Gd]</option>
                            <option value="72.64">Germanium [Ge]</option>
                            <option value="1.0079">Hydrogen [H]</option>
                            <option value="4.003">Helium [He]</option>
                            <option value="178.49">Hafnium [Hf]</option>
                            <option value="200.59">Mercury [Hg]</option>
                            <option value="164.93">Holmium [Ho]</option>
                            <option value="265">Hassium [Hs]</option>
                            <option value="126.904">Iodine [I]</option>
                            <option value="114.813">Indium [In]</option>
                            <option value="192.217">Iridium [Ir]</option>
                            <option value="39.098">Potassium [K]</option>
                            <option value="83.798">Krypton [Kr]</option>
                            <option value="138.906">Lanthanum [La]</option>
                            <option value="6.941">Lithium [Li]</option>
                            <option value="262">Lawrencium [Lr]</option>
                            <option value="293">Livermonium</option>
                            <option value="174.967">Luetium [Lu]</option>
                            <option value="260">Mendelevium [Md]</option>
                            <option value="24.305">Magnesium [Mg]</option>
                            <option value="54.938">Manganese [Mn]</option>
                            <option value="95.94">Molybdenum [Mo]</option>
                            <option value="266">Meitnerium [Mt]</option>
                            <option value="14.0067">Nitrogen [N]</option>
                            <option value="22.9898">Sodium [Na]</option>
                            <option value="92.9064">Niobium [Nb]</option>
                            <option value="144.24">Neodymium [Nd]</option>
                            <option value="20.1797">Neon [Ne]</option>
                            <option value="58.6934">Nickel [Ni]</option>
                            <option value="259">Nobelium [No]</option>
                            <option value="237">Neptunium [Np]</option>
                            <option value="31.999">Oxygen [O₂]</option>
                            <option value="190.23">Osmium [Os]</option>
                            <option value="30.9738">Phosporus [P]</option>
                            <option value="231.036">Protactinium [Pa]</option>
                            <option value="207.2">Lead [Pb]</option>
                            <option value="106.42">Palladium [Pd]</option>
                            <option value="">Promethium [Pm]</option>
                            <option value="210">Polonium [Po]</option>
                            <option value="140.908">Praseodymium [Pr]</option>
                            <option value="195.078">Platinum [Pt]</option>
                            <option value="244">Plutonium [Pu]</option>
                            <option value="226">Radium [Ra]</option>
                            <option value="85.4678">Rubidium [Rd]</option>
                            <option value="186.207">Rhenium [Re]</option>
                            <option value="261">Rutherfordium [Rf]</option>
                            <option value="272">Roentgenium [Rg]</option>
                            <option value="102.906">Rhodium [Rh]</option>
                            <option value="222">Radon [Rn]</option>
                            <option value="101.07">Ruthenium [Ru]</option>
                            <option value="32.065">Sulfur [S]</option>
                            <option value="121.76">Anitomy [Sb]</option>
                            <option value="44.9559">Scandium [Sc]</option>
                            <option value="78.96">Selenium [Se]</option>
                            <option value="266">Seaborgium [Sb]</option>
                            <option value="28.0855">Silicon [Si]</option>
                            <option value="150.36">Samarium [Sm]</option>
                            <option value="118.71">Tin [Sn]</option>
                            <option value="87.62">Strontium [Sr]</option>
                            <option value="158.925">Terbium [Tb]</option>
                            <option value="127.6">Technetium [Te]</option>
                            <option value="127.6">Tellurium [Te]</option>
                            <option value="232.038">Thorium [Th]</option>
                            <option value="47.867">Titanium [Ti]</option>
                            <option value="204.383">Thallium [Tl]</option>
                            <option value="168.934">Thullium [Tm]</option>
                            <option value="180.947">Tantulum [Ta]</option>
                            <option value="294">Ununoctium [Uuo]</option>
                            <option value="294">Ununpentium [Uup]</option>
                            <option value="294">Ununseptium [Uus]</option>
                            <option value="284">Ununtrium [Uut]</option>
                            <option value="50.9415">Vanadium [V]</option>
                            <option value="183.84">Tungsten [W]</option>
                            <option value="131.293">Xenon [Xe]</option>
                            <option value="88.9059">Yttrium [Y]</option>
                            <option value="173.04">Ytterbium [Yb]</option>
                            <option value="65.409">Zinc [Zn]</option>
                            <option value="91.224">Zirconium [Zr]</option>
                          </>
                        )}
                        {formData.tech_chemical_selection == "9" && (
                          <>
                            <option value="44.0526">
                              Acetaldehyde [C₂H₄O]
                            </option>
                            <option value="59.0672">Acetamide [C₂H₅NO]</option>
                            <option value="60.052">
                              Acetic acid [CH₃COOH]
                            </option>
                            <option value="58.0791">Acetone [C₃H₆O]</option>
                            <option value="41.0519">
                              Acetonitrile [C₂H₃N]
                            </option>
                            <option value="133.341">
                              Aluminium chloride [AlCl₃]
                            </option>
                            <option value="212.996">
                              Aluminium nitrate [Al(NO₃)₃]
                            </option>
                            <option value="342.151">
                              Aluminium sulfate [Al₂(SO₄)₃]
                            </option>
                            <option value="17.0305">Ammonia[NH₃]</option>
                            <option value="77.0825">
                              Ammonium acetate [CH₃COONH₄]
                            </option>
                            <option value="96.0858">
                              Ammonium carbonate [(NH₄)₂CO₃]
                            </option>
                            <option value="53.4915">
                              Ammonium chloride [NH₄Cl]
                            </option>
                            <option value="252.065">
                              Ammonium dichromate [(NH₄)₂Cr₂O₇]
                            </option>
                            <option value="35.0458">
                              Ammonium hydroxide [NH₄OH]
                            </option>
                            <option value="80.0434">
                              Ammonium nitrate [NH₄NO₃]
                            </option>
                            <option value="124.096">
                              Ammonium oxalate [(NH₄)₂C₂O₄]
                            </option>
                            <option value="132.14">
                              Ammonium sulfate [(NH₄)₂SO₄]
                            </option>
                            <option value="208.233">
                              Barium chloride [BaCl₂]
                            </option>
                            <option value="171.342">
                              Barium hydroxide [Ba(OH)₂]
                            </option>
                            <option value="261.337">
                              Barium nitrate [Ba(NO₃)₂]
                            </option>
                            <option value="78.1118">Benzene [C₆H₆]</option>
                            <option value="58.1222">Butane [C₄H₁₀]</option>
                            <option value="110.984">
                              {" "}
                              Calcium chloride [CaCl₂]
                            </option>
                            <option value="74.0927">
                              Calcium hydroxide [Ca(OH)₂]
                            </option>
                            <option value="164.088">
                              Calcium nitrate [Ca(NO₃)₂]{" "}
                            </option>
                            <option value="136.141">
                              Calcium sulfate [CaSO₄]
                            </option>
                            <option value="44.0095">
                              Carbon dioxide [CO₂]
                            </option>
                            <option value="76.1407">
                              Carbon disulfide [CS₂]
                            </option>
                            <option value="94.497">
                              Chloroacetic acid [C₂H₃ClO₂]
                            </option>
                            <option value="339.786">
                              Chloroauric acid [HAuCl₄]
                            </option>
                            <option value="119.378">Chloroform [CHCl₃]</option>
                            <option value="409.812">
                              Chloroplatinic acid [H₂PtCl₆]
                            </option>
                            <option value="192.124">
                              Citric acid [C₆H₈O₇]
                            </option>
                            <option value="128.942">
                              Dichloroacetic acid [C₂H₂Cl₂O₂]
                            </option>
                            <option value="74.1216">
                              Diethyl ether [(C₂H₅)₂O]
                            </option>
                            <option value="116.119">
                              Dimethylglyoxime [(CH₃CNOH)₂]
                            </option>
                            <option value="336.206">
                              EDTA, disodium salt [Na₂C₁₀H₁₄N₂O₈]
                            </option>
                            <option value="30.069">Ethane [C₂H₆]</option>
                            <option value="46.0684">Ethanol [C₂H₅OH]</option>
                            <option value="62.0678">
                              Ethylene glycol [(CH₂OH)₂]{" "}
                            </option>
                            <option value="30.026">Formaldehyde [CH₂O]</option>
                            <option value="46.0254">Formic acid [CH₂O₂]</option>
                            <option value="180.156">Fructose [C₆H₁₂O₆]</option>
                            <option value="180.156">Glucose [C₆H₁₂O₆]</option>
                            <option value="92.0938">Glycerol [C₃H₈O₃]</option>
                            <option value="144.092">
                              Hexafluorosilicic acid [H₂SiF₆]
                            </option>
                            <option value="32.0452">Hydrazine [N₂H₄]</option>
                            <option value="80.9119">
                              Hydrobromic acid [HBr]
                            </option>
                            <option value="36.4609">
                              Hydrochloric acid [HCl]
                            </option>
                            <option value="27.0253">
                              Hydrocyanic acid [HCN]
                            </option>
                            <option value="20.0063">
                              Hydrofluoric acid [HF]
                            </option>
                            <option value="2.0159">Hydrogen [H₂]</option>
                            <option value="34.0147">
                              Hydrogen peroxide [H₂O₂]
                            </option>
                            <option value="34.0809">
                              Hydrogen sulfide [H₂S]
                            </option>
                            <option value="127.912">
                              Hydroiodic acid [HI]
                            </option>
                            <option value="175.911">Iodic acid [HIO₃]</option>
                            <option value="74.1216">Isobutanol [C₄H₁₀O]</option>
                            <option value="90.0779">
                              Lactic acid [C₃H₆O₃]
                            </option>
                            <option value="342.296">Lactose [C₁₂H₂₂O₁₁]</option>
                            <option value="42.394">
                              Lithium chloride [LiCl]
                            </option>
                            <option value="95.211">
                              Magnesium chloride [MgCl₂]
                            </option>
                            <option value="148.315">
                              Magnesium nitrate [Mg(NO₃)₂]
                            </option>
                            <option value="120.368">
                              Magnesium sulfate [MgSO₄]
                            </option>
                            <option value="116.072">
                              Maleic acid [C₄H₄O₄]
                            </option>
                            <option value="104.061">
                              Malonic acid [C₃H₄O₄]
                            </option>
                            <option value="342.296">Maltose [C₁₂H₂₂O₁₁]</option>
                            <option value="182.172">Mannitol [C₆H₁₄O₆]</option>
                            <option value="16.0425">Methane [CH₄]</option>
                            <option value="32.0419">Methanol [CH₃OH]</option>
                            <option value="74.0785">
                              Methyl acetate [C₃H₆O₂]
                            </option>
                            <option value="129.599">
                              Nickel chloride [NiCl₂]
                            </option>
                            <option value="182.703">
                              Nickel nitrate [Ni(NO₃)₂]
                            </option>
                            <option value="154.756">
                              Nickel sulfate [NiSO₄]
                            </option>
                            <option value="162.232">Nicotine [C₁₀H₁₄N₂]</option>
                            <option value="63.0128">Nitric acid [HNO₃]</option>
                            <option value="28.0134">Nitrogen [N₂]</option>
                            <option value="31.9988">Oxygen [O₂]</option>
                            <option value="90.0349">
                              Oxalic acid [H₂C₂O₄]
                            </option>
                            <option value="97.9952">
                              Phosphoric acid [H₃PO₄]
                            </option>
                            <option value="100.115">
                              Potassium bicarbonate [KHCO₃]
                            </option>
                            <option value="167">
                              Potassium bromate [KBrO₃]
                            </option>
                            <option value="119.002">
                              Potassium bromide [KBr]
                            </option>
                            <option value="138.205">
                              Potassium carbonate [K₂CO₃]
                            </option>
                            <option value="74.551">
                              Potassium chloride [KCl]
                            </option>
                            <option value="194.19">
                              Potassium chromate [K₂CrO₄]
                            </option>
                            <option value="65.1154">
                              Potassium cyanide [KCN]
                            </option>
                            <option value="294.184">
                              Potassium dichromate [K₂Cr₂O₇]
                            </option>
                            <option value="174.175">
                              Potassium hydrogen phosphate [K₂HPO₄]
                            </option>
                            <option value="56.1053">
                              Potassium hydroxide [KOH]
                            </option>
                            <option value="214.001">
                              Potassium iodate [KIO₃]
                            </option>
                            <option value="166.002">
                              Potassium iodide [KI]
                            </option>
                            <option value="101.103">
                              Potassium nitrate [KNO₃]
                            </option>
                            <option value="85.1035">
                              Potassium nitrite [KNO₂]
                            </option>
                            <option value="158.034">
                              Potassium permanganate [KMnO₄]
                            </option>
                            <option value="174.259">
                              Potassium sulfate [K₂SO₄]
                            </option>
                            <option value="158.259">
                              Potassium sulfite [K₂SO₃]
                            </option>
                            <option value="226.267">
                              Potassium tartrate [K₂C₄H₄O₆]
                            </option>
                            <option value="97.1804">
                              Potassium thiocyanate [KCNS]
                            </option>
                            <option value="44.0956">Propane [C₃H₈]</option>
                            <option value="79.0999">Pyridine [C₅H₅N] </option>
                            <option value="110.111">Resorcinol [C₆H₆O₂]</option>
                            <option value="342.296">
                              Saccharose [C₁₂H₂₂O₁₁]
                            </option>
                            <option value="169.873">
                              Silver nitrate [AgNO₃]{" "}
                            </option>
                            <option value="311.799">
                              Silver sulfate [Ag₂SO₄]
                            </option>
                            <option value="82.0338">
                              Sodium acetate [NaC₂H₃O₂]
                            </option>
                            <option value="207.889">
                              Sodium arsenate [Na₃AsO₄]{" "}
                            </option>
                            <option value="102.894">
                              Sodium bromide [NaBr]
                            </option>
                            <option value="105.988">
                              Sodium carbonate [Na₂CO₃]
                            </option>
                            <option value="106.441">
                              Sodium chlorate [NaClO₃]
                            </option>
                            <option value="58.4428">
                              Sodium chloride [NaCl]
                            </option>
                            <option value="161.973">
                              Sodium chromate [Na₂CrO₄]
                            </option>
                            <option value="258.069">
                              Sodium citrate [Na₃C₆H₅O₇]
                            </option>
                            <option value="261.968">
                              Sodium dichromate [Na₂Cr₂O₇]
                            </option>
                            <option value="119.977">
                              Sodium dihydrogen phosphate [NaH₂PO₄]
                            </option>
                            <option value="68.0072">
                              Sodium formate [HCOONa]
                            </option>
                            <option value="84.0066">
                              Sodium hydrogen carbonate [NaHCO₃]
                            </option>
                            <option value="141.959">
                              Sodium hydrogen phosphate [Na₂HPO₄]
                            </option>
                            <option value="172.069">
                              Sodium hydrogen tartrate [NaHC₄H₄O₆]
                            </option>
                            <option value="39.9971">
                              Sodium hydroxide [NaOH]
                            </option>
                            <option value="84.9947">
                              Sodium nitrate [NaNO₃]
                            </option>
                            <option value="68.9953">
                              Sodium nitrite [NaNO₂]
                            </option>
                            <option value="163.941">
                              Sodium phosphate [Na₃PO₄]
                            </option>
                            <option value="210.159">
                              Sodium potassium tartrate [NaKC₄H₄O₆]
                            </option>
                            <option value="142.042">
                              Sodium sulfate [Na₂SO₄]
                            </option>
                            <option value="78.0445">
                              Sodium sulfide [Na₂S]
                            </option>
                            <option value="126.043">
                              Sodium sulfite [Na₂SO₃]
                            </option>
                            <option value="194.051">
                              Sodium tartrate [Na₂C₄H₄O₆]
                            </option>
                            <option value="158.108">
                              Sodium thiosulfate [Na₂S₂O₃]
                            </option>
                            <option value="158.526">
                              Strontium chloride [SrCl₂]
                            </option>
                            <option value="211.63">
                              Strontium nitrate [Sr(NO₃)₂]
                            </option>
                            <option value="98.0785">
                              Sulfuric acid [H₂SO₄]
                            </option>
                            <option value="82.0791">
                              Sulfurous acid [H₂SO₃]
                            </option>
                            <option value="150.087">
                              Tartaric acid [H₂C₄H₄O₆]
                            </option>
                            <option value="76.1209">Thiourea [CH₄N₂S]</option>
                            <option value="163.387">
                              Trichloroacetic acid [CCl₃COOH]
                            </option>
                            <option value="89.0932">Urethane [C₃H₇NO₂]</option>
                            <option value="176.124">Vitamin C [C₆H₈O₆]</option>
                            <option value="18.0153">Water [H₂O]</option>
                            <option value="225.217">
                              Zinc bromide [ZnBr₂]
                            </option>
                            <option value="136.315">
                              Zinc chloride [ZnCl₂]
                            </option>
                            <option value="189.419">
                              Zinc nitrate [Zn(NO₃)₂]
                            </option>
                            <option value="161.472">
                              Zinc sulfate [ZnSO₄]
                            </option>
                            <option value="161.443">Zinc Oxide [SO₄]</option>
                            <option value="132.056">
                              Di-Ammonium Phosphate [(NH4)3PO4]
                            </option>
                            <option value="74.122">Ether [(C2H5)2O]</option>
                            <option value="60.084">Quartz [SiO2]</option>
                            <option value="32.117">Silane[SiH4]</option>
                            <option value="210.228">Benzil [C14H10O2]</option>
                            <option value="76.012">
                              Dinitrogen Trioxide [N2O3]
                            </option>
                            <option value="69.62">Boron Oxide [B2O3]</option>
                            <option value="63.126">Pentaborane [B5H9]</option>
                            <option value="261.337">
                              Barium Nitrate [Ba(NO3)2]
                            </option>
                            <option value="63.126">
                              {" "}
                              Barium Hydroxide [Ba(OH)2]
                            </option>
                            <option value="208.233">
                              Barium Chloride [BaCl2]
                            </option>
                            <option value="197.336">
                              Barium Carbonate [BaCO3]
                            </option>
                            <option value="300.051">
                              Diamminedichloroplatinum [Pt(NH3)2Cl2]
                            </option>
                            <option value="194.704">
                              Stannic Fluoride [SnF4]
                            </option>
                            <option value="294.303">
                              Aspartame [C14H18N2O5]
                            </option>
                            <option value="206.281">
                              Ibuprofen [C13H18O2]
                            </option>
                            <option value="181.281">
                              Arsenic Trichloride [AsCl3]
                            </option>
                            <option value="162.232">Nicotine [C₁₀H₁₄N₂]</option>
                            <option value="150.218">Carvone [C10H14O]</option>
                            <option value="165.232">
                              Ephedrine [C10H15NO]
                            </option>
                            <option value="128.171">Naphthalene [C10H8]</option>
                            <option value="386.654">
                              Cholestrol [C27H46O]
                            </option>
                            <option value="44.053">
                              Ethylene Oxide [C2H4O]
                            </option>
                            <option value="62.068">
                              Ethylene Glycol [C2H6O2]
                            </option>
                            <option value="104.149">Styrene [C8H8]</option>
                            <option value="98.916">Phosgene [COCl2]</option>
                            <option value="283.794">
                              Ethyl 1-methyl-4-phenylpiperidine-4-carboxylate
                              [C15H22ClNO2]
                            </option>
                            <option value="58.079">
                              Propionaldehyde [C3H6O]
                            </option>
                            <option value="79.918">
                              Beryllium Chloride [BeCl2]
                            </option>
                            <option value="262.821">
                              Beryllium Iodide [BeI2]
                            </option>
                            <option value="72.106">
                              Tetrahydrofuran [C4H8O]
                            </option>
                            <option value="311.799">Ribose [C5H10O5]</option>
                            <option value="228.119">
                              Antimony Tricloride [SbCl3]
                            </option>
                            <option value="102.475">
                              Rubidium Hydroxide [RbOH]
                            </option>
                            <option value="108.059">
                              Sulfur Tetrafluoride [SF4]
                            </option>
                            <option value="146.055">
                              Sulfur Hexafluoride [SF6]
                            </option>
                            <option value="123.109">
                              Vitamin B3 [C6H5NO2]
                            </option>
                            <option value="58.079">
                              Propionaldehyde [C3H6O]
                            </option>
                            <option value="102.089">
                              Acetic Anhydride [C4H6O3]
                            </option>
                            <option value="147.002">
                              P-Dichlorobenzene [C6H4Cl2]
                            </option>
                            <option value="157.008">
                              Bromobenzene [C6H5Br]
                            </option>
                            <option value="96.063">Sulfate Ion [SO4]</option>
                            <option value="106.122">
                              Benzaldehyde [C7H6O]
                            </option>
                          </>
                        )}
                      </select>
                    </div>
                  </div>
                  <div
                    className="lg:col-span-6 md:col-span-6 col-span-12"
                    id="molar_mass"
                  >
                    <label htmlFor="tech_mm" className="label">
                      {data?.payload?.tech_lang_keys["5"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_mm"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_mm}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown}
                      >
                        {formData.tech_mm_unit} ▾
                      </label>
                      {dropdownVisible && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "g/mol", value: "g/mol" },
                            { label: "dag/mol", value: "dag/mol" },
                            { label: "kg/mol", value: "kg/mol" },
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
              </>
            )}

            <div className="grid grid-cols-1 mt-4  gap-4">
              <div className="space-y-2">
                <p>
                  <strong className="text-blue">
                    {data?.payload?.tech_lang_keys["6"]}
                  </strong>
                </p>
              </div>
            </div>
            <div className="grid grid-cols-12 gap-1  md:gap-4 mt-2">
              <div className="lg:col-span-6 md:col-span-6 col-span-12">
                <label htmlFor="tech_unit" className="label">
                  {data?.payload?.tech_lang_keys["7"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_unit"
                    id="tech_unit"
                    value={formData.tech_unit}
                    onChange={handleChange}
                  >
                    <option value="1">
                      {data?.payload?.tech_lang_keys["8"]}
                    </option>
                    <option value="2">
                      {data?.payload?.tech_lang_keys["9"]} (g)
                    </option>
                    <option value="3">
                      {data?.payload?.tech_lang_keys["5"]}
                    </option>
                  </select>
                </div>
              </div>

              {(formData.tech_unit == "1" || formData.tech_unit == "3") && (
                <>
                  <div
                    className="lg:col-span-6 md:col-span-6 col-span-12"
                    id="mass"
                  >
                    <label htmlFor="tech_m" className="label">
                      {data?.payload?.tech_lang_keys["9"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_m"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_m}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown1}
                      >
                        {formData.tech_m_unit} ▾
                      </label>
                      {dropdownVisible1 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "nanograms (ng)", value: "ng" },
                            { label: "micrograms (µg)", value: "µg" },
                            { label: "milligrams (mg)", value: "mg" },
                            { label: "grams (g)", value: "g" },
                            { label: "decagrams (dag)", value: "dag" },
                            { label: "kilograms (kg)", value: "kg" },
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
              {(formData.tech_unit == "2" || formData.tech_unit == "3") && (
                <>
                  <div
                    className="lg:col-span-6 md:col-span-6 col-span-12"
                    id="no_moles"
                  >
                    <label htmlFor="tech_nm" className="label">
                      {data?.payload?.tech_lang_keys["8"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_nm"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_nm}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown2}
                      >
                        {formData.tech_nm_unit} ▾
                      </label>
                      {dropdownVisible2 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "moles (mol)", value: "mol" },
                            { label: "millimoles (mmol)", value: "mmol" },
                            { label: "micromoles (μmol)", value: "μmol" },
                            { label: "nanomoles (nmol)", value: "nmol" },
                            { label: "picomoles (pmol)", value: "pmol" },
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

                  <div className="rounded-lg flex items-center justify-center">
                    <div className="w-full p-3 radius-10 mt-3">
                      <div className="w-full mt-2">
                        {result?.tech_ans1 && result?.tech_ans2 && (
                          <>
                            <p>
                              <strong>
                                {data?.payload?.tech_lang_keys["8"]}
                              </strong>
                            </p>
                            <p>
                              <strong className="text-[#119154] text-[28px]">
                                {result.tech_ans1}{" "}
                                <span className="text-[#119154] text-[20px]">
                                  (mol)
                                </span>
                              </strong>
                            </p>
                            <p>
                              <strong>
                                {data?.payload?.tech_lang_keys["10"]} /{" "}
                                {data?.payload?.tech_lang_keys["11"]}
                              </strong>
                            </p>
                            <p>
                              <strong className="text-[#119154] text-[28px]">
                                {result.tech_ans2}
                              </strong>
                            </p>

                            <p className="mt-3 mb-2">
                              <strong>
                                {data?.payload?.tech_lang_keys["12"]}:
                              </strong>
                            </p>
                            <p className="my-2">
                              {data?.payload?.tech_lang_keys["5"]} ={" "}
                              {result.tech_ans91} g / mol <br />
                              {data?.payload?.tech_lang_keys["9"]} ={" "}
                              {result.tech_ans90} g <br />
                              {data?.payload?.tech_lang_keys["8"]} = ? <br />
                              {data?.payload?.tech_lang_keys["10"]} /{" "}
                              {data?.payload?.tech_lang_keys["11"]} = ?
                            </p>
                            <p className="my-2">
                              <strong>
                                {data?.payload?.tech_lang_keys["13"]}
                              </strong>
                            </p>
                            <p className="my-2">
                              {data?.payload?.tech_lang_keys["8"]} ={" "}
                              {data?.payload?.tech_lang_keys["9"]} /{" "}
                              {data?.payload?.tech_lang_keys["5"]}
                            </p>
                            <p className="my-2">
                              {data?.payload?.tech_lang_keys["10"]} /{" "}
                              {data?.payload?.tech_lang_keys["11"]} ={" "}
                              {data?.payload?.tech_lang_keys["8"]} *
                              6.02214085774
                            </p>

                            <p className="mt-3 mb-2">
                              <strong>
                                {data?.payload?.tech_lang_keys["14"]}:{" "}
                              </strong>
                              {data?.payload?.tech_lang_keys["15"]}
                            </p>
                            <p className="my-2">
                              {data?.payload?.tech_lang_keys["8"]} ={" "}
                              {result.tech_ans90} / {result.tech_ans91}
                            </p>
                            <p className="my-2">
                              {data?.payload?.tech_lang_keys["8"]} ={" "}
                              {result.tech_ans1}
                            </p>
                            <p className="my-2">
                              {data?.payload?.tech_lang_keys["10"]} /{" "}
                              {data?.payload?.tech_lang_keys["11"]} ={" "}
                              {result.tech_ans1} * 6.02214085774
                            </p>
                            <p className="my-2">
                              {data?.payload?.tech_lang_keys["10"]} /{" "}
                              {data?.payload?.tech_lang_keys["11"]} ={" "}
                              {result.tech_ans2}
                            </p>
                          </>
                        )}

                        {result?.tech_ans3 && result?.tech_ans4 && (
                          <>
                            <p>
                              <strong>
                                {data?.payload?.tech_lang_keys["9"]}
                              </strong>
                            </p>
                            <p>
                              <strong className="text-[#119154] text-[28px]">
                                {result.tech_ans3}{" "}
                                <span className="text-[#119154] text-[20px]">
                                  (g)
                                </span>
                              </strong>
                            </p>
                            <p>
                              <strong>
                                {data?.payload?.tech_lang_keys["10"]} /{" "}
                                {data?.payload?.tech_lang_keys["11"]}
                              </strong>
                            </p>
                            <p>
                              <strong className="text-[#119154] text-[28px]">
                                {result.tech_ans4}
                              </strong>
                            </p>

                            <p className="mt-3 mb-2">
                              <strong>
                                {data?.payload?.tech_lang_keys["12"]}:
                              </strong>
                            </p>
                            <p className="my-2">
                              {data?.payload?.tech_lang_keys["5"]} ={" "}
                              {result.tech_ans90} (g/mol) <br />
                              {data?.payload?.tech_lang_keys["8"]} ={" "}
                              {result.tech_ans91} (mol) <br />
                              {data?.payload?.tech_lang_keys["9"]} = ? <br />
                              {data?.payload?.tech_lang_keys["10"]} /{" "}
                              {data?.payload?.tech_lang_keys["11"]} = ?
                            </p>
                            <p className="my-2">
                              {data?.payload?.tech_lang_keys["13"]}
                            </p>
                            <p className="my-2">
                              {data?.payload?.tech_lang_keys["9"]} ={" "}
                              {data?.payload?.tech_lang_keys["8"]} *{" "}
                              {data?.payload?.tech_lang_keys["5"]}
                            </p>
                            <p className="my-2">
                              {data?.payload?.tech_lang_keys["10"]} /{" "}
                              {data?.payload?.tech_lang_keys["11"]} ={" "}
                              {data?.payload?.tech_lang_keys["8"]} *
                              6.02214085774
                            </p>

                            <p className="mt-3 mb-2">
                              <strong>
                                {data?.payload?.tech_lang_keys["14"]}:{" "}
                              </strong>
                              {data?.payload?.tech_lang_keys["15"]}
                            </p>
                            <p className="my-2">
                              {data?.payload?.tech_lang_keys["9"]} ={" "}
                              {result.tech_ans90} * {result.tech_ans91}
                            </p>
                            <p className="my-2">
                              {data?.payload?.tech_lang_keys["9"]} ={" "}
                              {result.tech_ans3} (g)
                            </p>
                            <p className="my-2">
                              {data?.payload?.tech_lang_keys["10"]} /{" "}
                              {data?.payload?.tech_lang_keys["11"]} ={" "}
                              {result.tech_ans91} * 6.02214085774
                            </p>
                            <p className="my-2">
                              {data?.payload?.tech_lang_keys["10"]} /{" "}
                              {data?.payload?.tech_lang_keys["11"]} ={" "}
                              {result.tech_ans4}
                            </p>
                          </>
                        )}

                        {result?.tech_ans5 && result?.tech_ans6 && (
                          <>
                            <p>
                              <strong>
                                {data?.payload?.tech_lang_keys["5"]}
                              </strong>
                            </p>
                            <p>
                              <strong className="text-[#119154] text-[28px]">
                                {result.tech_ans5}{" "}
                                <span className="text-[#119154] text-[20px]">
                                  (g/mol)
                                </span>
                              </strong>
                            </p>
                            <p>
                              <strong>
                                {data?.payload?.tech_lang_keys["10"]} /{" "}
                                {data?.payload?.tech_lang_keys["11"]}
                              </strong>
                            </p>
                            <p>
                              <strong className="text-[#119154] text-[28px]">
                                {result.tech_ans6}
                              </strong>
                            </p>

                            <p className="mt-3 mb-2">
                              <strong>
                                {data?.payload?.tech_lang_keys["12"]}:
                              </strong>
                            </p>
                            <p className="my-2">
                              {data?.payload?.tech_lang_keys["9"]} ={" "}
                              {result.tech_ans90} g <br />
                              {data?.payload?.tech_lang_keys["8"]} ={" "}
                              {result.tech_ans91} mol <br />
                              {data?.payload?.tech_lang_keys["5"]} = ? <br />
                              {data?.payload?.tech_lang_keys["10"]} /{" "}
                              {data?.payload?.tech_lang_keys["11"]} = ?
                            </p>
                            <p className="my-2">
                              {data?.payload?.tech_lang_keys["13"]}
                            </p>
                            <p className="my-2">
                              {data?.payload?.tech_lang_keys["5"]} ={" "}
                              {data?.payload?.tech_lang_keys["9"]} /{" "}
                              {data?.payload?.tech_lang_keys["8"]}
                            </p>
                            <p className="my-2">
                              {data?.payload?.tech_lang_keys["10"]} /{" "}
                              {data?.payload?.tech_lang_keys["11"]} ={" "}
                              {data?.payload?.tech_lang_keys["8"]} *
                              6.02214085774
                            </p>

                            <p className="mt-3 mb-2">
                              <strong>
                                {data?.payload?.tech_lang_keys["14"]}:{" "}
                              </strong>
                              {data?.payload?.tech_lang_keys["15"]}
                            </p>
                            <p className="my-2">
                              {data?.payload?.tech_lang_keys["5"]} ={" "}
                              {result.tech_ans90} / {result.tech_ans91}
                            </p>
                            <p className="my-2">
                              {data?.payload?.tech_lang_keys["5"]} ={" "}
                              {result.tech_ans5} (g/mol)
                            </p>
                            <p className="my-2">
                              {data?.payload?.tech_lang_keys["10"]} /{" "}
                              {data?.payload?.tech_lang_keys["11"]} ={" "}
                              {result.tech_ans91} * 6.02214085774
                            </p>
                            <p className="my-2">
                              {data?.payload?.tech_lang_keys["10"]} /{" "}
                              {data?.payload?.tech_lang_keys["11"]} ={" "}
                              {result.tech_ans6}
                            </p>
                          </>
                        )}
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

export default MolesToGramsCalculator;

"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useGramsToMolesCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const GramsToMolesCalculator = () => {
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
    tech_chemical_selection: "1",
    tech_chemical_name: "23.948",
    tech_mm: "23.948",
    tech_mm_unit: "kg/mol",
    tech_unit: "2", // 1 2 3
    tech_m: "4",
    tech_m_unit: "µg",
    tech_nm: "2",
    tech_nm_unit: "mol",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateActivationCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useGramsToMolesCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;

    let updatedFormData = { ...formData, [name]: value };
    if (name === "tech_chemical_name") {
      // Jab chemical select ho to uski value tech_mm me daal do
      updatedFormData.tech_mm = value;
    }
    setFormData(updatedFormData);

    if (name === "tech_chemical_selection") {
      let mmValue = "";

      switch (value) {
        case "1":
          mmValue = "18.015";
          break;
        case "2":
          mmValue = "58.443";
          break;
        case "3":
          mmValue = "36.461";
          break;
        case "4":
          mmValue = "39.997";
          break;
        case "5":
          mmValue = "16.042";
          break;
        case "6":
          mmValue = "55.845";
          break;
        case "7":
          mmValue = "10";
          break;
        default:
          mmValue = "";
      }

      // Update both selected chemical and molar mass in form data
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
        tech_mm: mmValue,
      }));
    } else {
      // For other inputs, normal update
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }

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
      tech_chemical_selection: "1",
      tech_chemical_name: "23.948",
      tech_mm: "23.948",
      tech_mm_unit: "kg/mol",
      tech_unit: "2", // 1 2 3
      tech_m: "4",
      tech_m_unit: "µg",
      tech_nm: "2",
      tech_nm_unit: "mol",
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
        <div className="w-full mx-auto p-4 lg:p-8 md:p-8 input_form rounded-lg space-y-6 mb-3">
          {formError && (
            <p className="text-red-500 text-lg font-semibold w-full">
              {formError}
            </p>
          )}
          <div className="lg:w-[60%] md:w-[80%] w-full mx-auto ">
            <div className="w-full px-2 mb-2">
              <p className="font-s-14">
                <strong className="text-blue">
                  {data?.payload?.tech_lang_keys["20"]}:{" "}
                </strong>
                {data?.payload?.tech_lang_keys["21"]}
              </p>
            </div>
            <div className="grid grid-cols-12 gap-1  md:gap-4">
              <div className="lg:col-span-6 md:col-span-6 col-span-12 relative">
                <label htmlFor="tech_chemical_selection" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
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
                    <option value="1">
                      {data?.payload?.tech_lang_keys["2"]}
                    </option>
                    <option value="2">
                      {data?.payload?.tech_lang_keys["3"]}
                    </option>
                    <option value="3">
                      {data?.payload?.tech_lang_keys["4"]}
                    </option>
                    <option value="4">
                      {data?.payload?.tech_lang_keys["5"]}
                    </option>
                    <option value="5">
                      {data?.payload?.tech_lang_keys["6"]}
                    </option>
                    <option value="6">
                      {data?.payload?.tech_lang_keys["7"]}
                    </option>
                    <option value="7">
                      {data?.payload?.tech_lang_keys["8"]}
                    </option>
                  </select>
                </div>
              </div>

              {formData.tech_chemical_selection != "7" && (
                <>
                  <div
                    className="lg:col-span-6 md:col-span-6 col-span-12 "
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
                        {formData.tech_chemical_selection == "1" && (
                          <>
                            <option value="18.015">Water(H₂O)</option>
                            <option value="28.014">Nitrogen(N₂)</option>
                            <option value="31.999">Oxygen(O₂)</option>
                            <option value="2.016">Hydrogen(H₂)</option>
                            <option value="4.003">Helium(He)</option>
                            <option value="44.01">Carbon Dioxide(CO₂)</option>
                            <option value="17.031">Ammonia(NH₃)</option>
                            <option value="34.081">
                              Hydrogen sulfide(H₂S)
                            </option>
                            <option value="119.378">Choloform(CHCL₃)</option>
                          </>
                        )}
                        {formData.tech_chemical_selection == "2" && (
                          <>
                            <option value="58.443">
                              Sodium Chloride(NaCl)
                            </option>
                            <option value="74.551">
                              Potassium Chloride(KCL)
                            </option>
                            <option value="95.211">
                              Magnesium Chloride(MgCl₂)
                            </option>
                            <option value="110.984">
                              Calcium Chloride(CaCI₂)
                            </option>
                            <option value="53.491">
                              Ammonium Chloride(NH₄Cl)
                            </option>
                            <option value="84.995">
                              Sodium Nitrate(NaNO₃)
                            </option>
                            <option value="101.103">
                              Potassium Nitrate(KNO₃)
                            </option>
                            <option value="80.043">
                              Ammonium Nitrate(NH₄NO₃)
                            </option>
                            <option value="182.703">
                              Nikel Nitrate(Ni(NO₃)₂)
                            </option>
                            <option value="169.873">
                              Silver Nitrate(AgNO₃)
                            </option>
                            <option value="100.087">
                              Calcium Carbonate(CaCO₃)
                            </option>
                            <option value="120.368">
                              Magnesium Sulfate(MgSO₄)
                            </option>
                            <option value="136.141">
                              Calcium Sulphate(CaSO₄)
                            </option>
                            <option value="158.034">
                              Potassium Permanganate(KmnO₄)
                            </option>
                          </>
                        )}
                        {formData.tech_chemical_selection == "3" && (
                          <>
                            <option value="36.461">
                              Hydrochloric Acid(HCL)
                            </option>
                            <option value="98.078">
                              Sulphuric Acid(H₂SO₄)
                            </option>
                            <option value="82.079">
                              Sulfurous Acid(H₂SO₃)
                            </option>
                            <option value="34.081">
                              Hydrosulfuric Acid(H₂S)
                            </option>
                            <option value="63.013">Nitric Acid(HNO₃)</option>
                            <option value="47.013">Nitrous Acid(HNO₂)</option>
                            <option value="97.995">
                              Phosphoric Acid(H₃PO₄)
                            </option>
                            <option value="81.996">
                              Phosphorus Acid(H₃PO₃)
                            </option>
                            <option value="80.912">
                              Hydrobromic Acid(HBr)
                            </option>
                            <option value="20.006">Hydrofluoric(HF)</option>
                            <option value="46.025">Formic Acid(HCOOH)</option>
                            <option value="60.052">Acetic Acid(CH₃COOH)</option>
                          </>
                        )}
                        {formData.tech_chemical_selection == "4" && (
                          <>
                            <option value="39.997">
                              Sodium Hydroxide(NaOH)
                            </option>
                            <option value="98.078">
                              Sodium Hydroxide(KOH)
                            </option>
                            <option value="58.32">
                              Magnesium Hydroxide(Mg(OH)₂)
                            </option>
                            <option value="74.093">
                              Calcium Hydroxide(Ca(OH)₂)
                            </option>
                            <option value="78.004">
                              Aliminium Hydroxide(Al(OH)₃)
                            </option>
                            <option value="23.948">
                              Lithium Hydroxide(LiOH)
                            </option>
                          </>
                        )}
                        {formData.tech_chemical_selection == "5" && (
                          <>
                            <option value="16.042">Methane(CH₄)</option>
                            <option value="36.069">Ethane(C₂H₆)</option>
                            <option value="44.096">Propane(C₃H₈)</option>
                            <option value="58.122">Butane(C₄H₁₀)</option>
                            <option value="32.042">CH₃OH</option>
                            <option value="46.068">Methanol(C₂H₅OH)</option>
                            <option value="78.112">Benzene(C₆H₆)</option>
                            <option value="180.156">Glucose(C₆H₁₂O₆)</option>
                            <option value="176.124">Vitamin C(C₆H₈O₆)</option>
                          </>
                        )}
                        {formData.tech_chemical_selection == "6" && (
                          <>
                            <option value="55.845">Iron(Fe)</option>
                            <option value="26.892">Aluminium(Al)</option>
                            <option value="63.456">Copper(Cu)</option>
                            <option value="47.867">Titanium(Ti)</option>
                            <option value="107.868">Silver(Ag)</option>
                            <option value="196.967">Gold(Au)</option>
                            <option value="58.693">Nickel(Ni)</option>
                            <option value="51.996">Chromium(Cr)</option>
                            <option value="58.933">Cobalt(Co)</option>
                            <option value="54.938">Manganese(Mn)</option>
                            <option value="200.59">Mercury(Hg)</option>
                            <option value="207.2">Lead(Pb)</option>
                            <option value="238.029">Uranium(U)</option>
                          </>
                        )}
                      </select>
                    </div>
                  </div>
                </>
              )}

              {(formData.tech_unit == "1" || formData.tech_unit == "2") && (
                <>
                  <div
                    className="lg:col-span-6 md:col-span-6 col-span-12"
                    id="molar_mass"
                  >
                    <label htmlFor="tech_mm" className="label">
                      {data?.payload?.tech_lang_keys["9"]}
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
                            { label: "g/mol1", value: "g/mol1" },
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
                </>
              )}
            </div>
            <div className="w-full px-2 my-2">
              <p>
                <strong className="text-blue">
                  {data?.payload?.tech_lang_keys["10"]}
                </strong>
              </p>
            </div>
            <div className="grid grid-cols-12 gap-1  md:gap-4 mt-2">
              <div className="lg:col-span-6 md:col-span-6 col-span-12">
                <label htmlFor="tech_unit" className="label">
                  {data?.payload?.tech_lang_keys["11"]}
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
                      {data?.payload?.tech_lang_keys["12"]}
                    </option>
                    <option value="2">
                      {data?.payload?.tech_lang_keys["13"]}
                    </option>
                    <option value="3">
                      {data?.payload?.tech_lang_keys["9"]}
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
                      {data?.payload?.tech_lang_keys["13"]}
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
                      {data?.payload?.tech_lang_keys["12"]}
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
                                {data?.payload?.tech_lang_keys["12"]}
                              </strong>
                            </p>
                            <p>
                              <strong className="text-[#119154] text-[20px] md:text-[28px]">
                                {result.tech_ans1}{" "}
                                <span className="text-[#119154] text-[20px]">
                                  (mol)
                                </span>
                              </strong>
                            </p>
                            <p>
                              <strong>
                                {data?.payload?.tech_lang_keys["14"]} /{" "}
                                {data?.payload?.tech_lang_keys["15"]}
                              </strong>
                            </p>
                            <p>
                              <strong className="text-[#119154] text-[20px] md:text-[28px]">
                                {result.tech_ans2}
                              </strong>
                            </p>
                            <p className="text-[20px] mt-3 mb-2">
                              <strong>
                                {data?.payload?.tech_lang_keys["16"]}:
                              </strong>
                            </p>
                            <p className="my-2">
                              {data?.payload?.tech_lang_keys["9"]} ={" "}
                              {result.tech_ans91} g / mol <br />
                              {data?.payload?.tech_lang_keys["13"]} ={" "}
                              {result.tech_ans90} g <br />
                              {data?.payload?.tech_lang_keys["12"]} = ? <br />
                              {data?.payload?.tech_lang_keys["14"]} /{" "}
                              {data?.payload?.tech_lang_keys["15"]} = ?
                            </p>
                            <p className="mt-3 mb-2">
                              <strong>
                                {data?.payload?.tech_lang_keys["17"]}
                              </strong>
                            </p>
                            <p className="my-2">
                              {data?.payload?.tech_lang_keys["12"]} ={" "}
                              {data?.payload?.tech_lang_keys["13"]} /{" "}
                              {data?.payload?.tech_lang_keys["9"]}
                            </p>
                            <p className="my-2">
                              {data?.payload?.tech_lang_keys["14"]} /{" "}
                              {data?.payload?.tech_lang_keys["15"]} ={" "}
                              {data?.payload?.tech_lang_keys["12"]} *
                              6.02214085774
                            </p>
                            <p className="mt-3 mb-2">
                              <strong>
                                {data?.payload?.tech_lang_keys["18"]}:{" "}
                              </strong>
                              {data?.payload?.tech_lang_keys["19"]}
                            </p>
                            <p className="my-2">
                              {data?.payload?.tech_lang_keys["12"]} ={" "}
                              {result.tech_ans90} / {result.tech_ans91}
                            </p>
                            <p className="my-2">
                              {data?.payload?.tech_lang_keys["12"]} ={" "}
                              {result.tech_ans1}
                            </p>
                            <p className="my-2">
                              {data?.payload?.tech_lang_keys["14"]} /{" "}
                              {data?.payload?.tech_lang_keys["15"]} ={" "}
                              {result.tech_ans1} * 6.02214085774
                            </p>
                            <p className="my-2">
                              {data?.payload?.tech_lang_keys["14"]} /{" "}
                              {data?.payload?.tech_lang_keys["15"]} ={" "}
                              {result.tech_ans2}
                            </p>
                          </>
                        )}

                        {result?.tech_ans3 && result?.tech_ans4 && (
                          <>
                            <p>
                              <strong>
                                {data?.payload?.tech_lang_keys["13"]}
                              </strong>
                            </p>
                            <p>
                              <strong className="text-[#119154] text-[20px] md:text-[28px]">
                                {result.tech_ans3}{" "}
                                <span className="text-[#119154] text-[20px]">
                                  (g)
                                </span>
                              </strong>
                            </p>
                            <p>
                              <strong>
                                {data?.payload?.tech_lang_keys["14"]} /{" "}
                                {data?.payload?.tech_lang_keys["15"]}
                              </strong>
                            </p>
                            <p>
                              <strong className="text-[#119154] text-[20px] md:text-[28px]">
                                {result.tech_ans4}
                              </strong>
                            </p>
                            <p className="text-[20px] mt-3 mb-2">
                              <strong>
                                {data?.payload?.tech_lang_keys["16"]}:
                              </strong>
                            </p>
                            <p className="my-2">
                              {data?.payload?.tech_lang_keys["9"]} ={" "}
                              {result.tech_ans90} (g/mol)
                              <br />
                              {data?.payload?.tech_lang_keys["12"]} ={" "}
                              {result.tech_ans91} (mol)
                              <br />
                              {data?.payload?.tech_lang_keys["13"]} = ?<br />
                              {data?.payload?.tech_lang_keys["14"]} /{" "}
                              {data?.payload?.tech_lang_keys["15"]} = ?
                            </p>
                            <p className="mt-3 mb-2">
                              <strong>
                                {data?.payload?.tech_lang_keys["17"]}
                              </strong>
                            </p>
                            <p className="my-2">
                              {data?.payload?.tech_lang_keys["13"]} ={" "}
                              {data?.payload?.tech_lang_keys["12"]} *{" "}
                              {data?.payload?.tech_lang_keys["9"]}
                            </p>
                            <p className="my-2">
                              {data?.payload?.tech_lang_keys["14"]} /{" "}
                              {data?.payload?.tech_lang_keys["15"]} ={" "}
                              {data?.payload?.tech_lang_keys["12"]} *
                              6.02214085774
                            </p>
                            <p className="mt-3 mb-2">
                              <strong>
                                {data?.payload?.tech_lang_keys["18"]}:{" "}
                              </strong>
                              {data?.payload?.tech_lang_keys["19"]}
                            </p>
                            <p className="my-2">
                              {data?.payload?.tech_lang_keys["13"]} ={" "}
                              {result.tech_ans90} * {result.tech_ans91}
                            </p>
                            <p className="my-2">
                              {data?.payload?.tech_lang_keys["13"]} ={" "}
                              {result.tech_ans3} (g)
                            </p>
                            <p className="my-2">
                              {data?.payload?.tech_lang_keys["14"]} /{" "}
                              {data?.payload?.tech_lang_keys["15"]} ={" "}
                              {result.tech_ans91} * 6.02214085774
                            </p>
                            <p className="my-2">
                              {data?.payload?.tech_lang_keys["14"]} /{" "}
                              {data?.payload?.tech_lang_keys["15"]} ={" "}
                              {result.tech_ans4}
                            </p>
                          </>
                        )}

                        {result?.tech_ans5 && result?.tech_ans6 && (
                          <>
                            <p>
                              <strong>
                                {data?.payload?.tech_lang_keys["9"]}
                              </strong>
                            </p>
                            <p>
                              <strong className="text-[#119154] text-[20px] md:text-[28px]">
                                {result.tech_ans5}{" "}
                                <span className="text-[#119154] text-[20px]">
                                  (g/mol)
                                </span>
                              </strong>
                            </p>
                            <p>
                              <strong>
                                {data?.payload?.tech_lang_keys["14"]} /{" "}
                                {data?.payload?.tech_lang_keys["15"]}
                              </strong>
                            </p>
                            <p>
                              <strong className="text-[#119154] text-[20px] md:text-[28px]">
                                {result.tech_ans6}
                              </strong>
                            </p>
                            <p className="text-[20px] mt-3 mb-2">
                              <strong>
                                {data?.payload?.tech_lang_keys["16"]}:
                              </strong>
                            </p>
                            <p className="my-2">
                              {data?.payload?.tech_lang_keys["13"]} ={" "}
                              {result.tech_ans90} g <br />
                              {data?.payload?.tech_lang_keys["12"]} ={" "}
                              {result.tech_ans91} mol <br />
                              {data?.payload?.tech_lang_keys["9"]} = ? <br />
                              {data?.payload?.tech_lang_keys["14"]} /{" "}
                              {data?.payload?.tech_lang_keys["15"]} = ?
                            </p>
                            <p className="mt-3 mb-2">
                              <strong>
                                {data?.payload?.tech_lang_keys["17"]}
                              </strong>
                            </p>
                            <p className="my-2">
                              {data?.payload?.tech_lang_keys["9"]} ={" "}
                              {data?.payload?.tech_lang_keys["13"]} /{" "}
                              {data?.payload?.tech_lang_keys["12"]}
                            </p>
                            <p className="my-2">
                              {data?.payload?.tech_lang_keys["14"]} /{" "}
                              {data?.payload?.tech_lang_keys["15"]} ={" "}
                              {data?.payload?.tech_lang_keys["12"]} *
                              6.02214085774
                            </p>
                            <p className="mt-3 mb-2">
                              <strong>
                                {data?.payload?.tech_lang_keys["18"]}:{" "}
                              </strong>
                              {data?.payload?.tech_lang_keys["19"]}
                            </p>
                            <p className="my-2">
                              {data?.payload?.tech_lang_keys["9"]} ={" "}
                              {result.tech_ans90} / {result.tech_ans91}
                            </p>
                            <p className="my-2">
                              {data?.payload?.tech_lang_keys["9"]} ={" "}
                              {result.tech_ans5} (g/mol)
                            </p>
                            <p className="my-2">
                              {data?.payload?.tech_lang_keys["14"]} /{" "}
                              {data?.payload?.tech_lang_keys["15"]} ={" "}
                              {result.tech_ans91} * 6.02214085774
                            </p>
                            <p className="my-2">
                              {data?.payload?.tech_lang_keys["14"]} /{" "}
                              {data?.payload?.tech_lang_keys["15"]} ={" "}
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

export default GramsToMolesCalculator;

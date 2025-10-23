"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useMolalityCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const MolalityCalculator = () => {
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
    tech_type: "first", // second  first
    tech_find: "3",
    tech_amount_solute: "8",
    tech_amount_solute_unit: "mol",
    tech_mass_solvent: "7",
    tech_mass_solvent_unit: "µg",
    tech_molality: "7",
    tech_molality_unit: "mol / dag",
    tech_density: "997",
    tech_density_unit: "1186.5529",
    tech_molecular_mass_solute: "25",
    tech_molecular_mass_solute_unit: "0.001",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateActivationCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useMolalityCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_type) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateActivationCalculator({
        tech_type: formData.tech_type,
        tech_find: formData.tech_find,
        tech_amount_solute: formData.tech_amount_solute,
        tech_amount_solute_unit: formData.tech_amount_solute_unit,
        tech_mass_solvent: formData.tech_mass_solvent,
        tech_mass_solvent_unit: formData.tech_mass_solvent_unit,
        tech_molality: formData.tech_molality,
        tech_molality_unit: formData.tech_molality_unit,
        tech_density: formData.tech_density,
        tech_density_unit: formData.tech_density_unit,
        tech_molecular_mass_solute: formData.tech_molecular_mass_solute,
        tech_molecular_mass_solute_unit:
          formData.tech_molecular_mass_solute_unit,
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
      tech_type: "first", // second  first
      tech_find: "3",
      tech_amount_solute: "8",
      tech_amount_solute_unit: "mol",
      tech_mass_solvent: "7",
      tech_mass_solvent_unit: "µg",
      tech_molality: "7",
      tech_molality_unit: "mol / dag",
      tech_density: "997",
      tech_density_unit: "1186.5529",
      tech_molecular_mass_solute: "25",
      tech_molecular_mass_solute_unit: "0.001",
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

  const densityOptions = [
    { label: "Centigram per Liter", value: "0.01" },
    { label: "Decigram per Liter", value: "0.1" },
    { label: "Dekagram per Liter", value: "10" },
    { label: "Earth's Density (mean)", value: "0.0002" },
    { label: "Femtogram per Liter", value: "1E-15" },
    { label: "Grain per Foot³", value: "0.0023" },
    { label: "Grain per Gallon (UK)", value: "0.0143" },
    { label: "Grain per Gallon (US)", value: "0.0171" },
    { label: "Gram per Centimeter³", value: "1000" },
    { label: "Gram per Liter", value: "1" },
    { label: "Gram per Meter³", value: "0.001" },
    { label: "Gram per Milliliter", value: "1000" },
    { label: "Gram per Millimeter³", value: "1000000" },
    { label: "Hectogram per Liter", value: "100" },
    { label: "Kilogram per Centimeter³", value: "1000000" },
    { label: "Kilogram per Centimeter³", value: "1000000" },
    { label: "Kilogram per Cubic Decimeter", value: "1000" },
    { label: "Kilogram per Liter", value: "1000" },
    { label: "Kilogram per Meter³", value: "1" },
    { label: "Megagram per Liter", value: "1000000" },
    { label: "Microgram per Liter", value: "1E-6" },
    { label: "Milligram per Centimeter³", value: "0.001" },
    { label: "Milligram per Liter", value: "1E-6" },
    { label: "Milligram per Meter³", value: "1000" },
    { label: "Milligram per Millimeter³", value: "1E-9" },
    { label: "Nanogram per Liter", value: "1.0012" },
    { label: "Ounce per Foot³", value: "6.236" },
    { label: "Ounce per Gallon (UK)", value: "7.4892" },
    { label: "Ounce per Gallon (US)", value: "1729.994" },
    { label: "Ounce per Inch³", value: "1E-12" },
    { label: "Picogram per Liter", value: "5.155E+96" },
    { label: "Planck Density", value: "16.0185" },
    { label: "Pound per Foot³", value: "99.7764" },
    { label: "Pound per Gallon (UK)", value: "119.8264" },
    { label: "Pound per Gallon (US)", value: "27679.9047" },
    { label: "Pound per Inch³", value: "27679.9047" },
    { label: "Pound per Inch³", value: "0.5933" },
    { label: "Pound per Yard³", value: "515.3788" },
    { label: "Slug per Foot³", value: "890574.5976" },
    { label: "Slug per Inch³", value: "19.0881" },
    { label: "Slug per Yard³", value: "1328.9392" },
    { label: "Ton (long) per Yard³", value: "1186.5529" },
  ];

  //dropdown states
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const setUnitHandler = (unit) => {
    setFormData((prev) => ({ ...prev, tech_amount_solute_unit: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  //dropdown states
  const [dropdownVisible1, setDropdownVisible1] = useState(false);

  const setUnitHandler1 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_mass_solvent_unit: unit }));
    setDropdownVisible1(false);
  };

  const toggleDropdown1 = () => {
    setDropdownVisible1(!dropdownVisible1);
  };

  //dropdown states
  const [dropdownVisible2, setDropdownVisible2] = useState(false);

  const setUnitHandler2 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_molality_unit: unit }));
    setDropdownVisible2(false);
  };

  const toggleDropdown2 = () => {
    setDropdownVisible2(!dropdownVisible2);
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
      <form className="row" onSubmit={handleSubmit}>
        <div className="w-full mx-auto p-4 lg:p-8 md:p-8 input_form rounded-lg space-y-6 mb-3">
          {formError && (
            <p className="text-red-500 text-lg font-semibold w-full">
              {formError}
            </p>
          )}

          <div className="lg:w-[60%] md:w-[80%] w-full mx-auto ">
            <div className="col-12 col-lg-9 mx-auto mt-2 lg:w-[50%] w-full">
              <input
                type="hidden"
                name="tech_type"
                id="calculator_time"
                value={formData.tech_type}
              />
              <div className="flex flex-wrap items-center bg-blue-100 border border-blue-500 text-center rounded-lg px-1">
                {/* Date Cal Tab */}
                <div className="lg:w-1/2 w-full px-2 py-1">
                  <div
                    className={`bg-white px-3 py-2 cursor-pointer rounded-md transition-colors duration-300 hover_tags hover:text-white pacetab  ${
                      formData.tech_type === "first" ? "tagsUnit" : ""
                    }`}
                    id="first"
                    onClick={() => {
                      setFormData({ ...formData, tech_type: "first" });
                      setResult(null);
                      setFormError(null);
                    }}
                  >
                    {data?.payload?.tech_lang_keys["1"]}
                  </div>
                </div>
                {/* Time Cal Tab */}
                <div className="lg:w-1/2 w-full px-2 py-1">
                  <div
                    className={`bg-white px-3 py-2 cursor-pointer rounded-md transition-colors duration-300 hover_tags hover:text-white pacetab ${
                      formData.tech_type === "second" ? "tagsUnit" : ""
                    }`}
                    id="second"
                    onClick={() => {
                      setFormData({ ...formData, tech_type: "second" });
                      setResult(null);
                      setFormError(null);
                    }}
                  >
                    {data?.payload?.tech_lang_keys["2"]}
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-12 mt-3   gap-2 md:gap-4 lg:gap-4">
              {formData.tech_type == "first" && (
                <>
                  <div className="col-span-12 input-field finch">
                    <label htmlFor="tech_find" className="label">
                      I want to calculate:
                    </label>
                    <div className="mt-2">
                      <select
                        className="input"
                        aria-label="select"
                        name="tech_find"
                        id="tech_find"
                        value={formData.tech_find}
                        onChange={handleChange}
                      >
                        <option value="1">
                          {data?.payload?.tech_lang_keys["3"]}
                        </option>
                        <option value="2">
                          {data?.payload?.tech_lang_keys["4"]}{" "}
                        </option>
                        <option value="3">
                          {data?.payload?.tech_lang_keys["5"]}{" "}
                        </option>
                      </select>
                    </div>
                  </div>

                  {(formData.tech_find == "1" || formData.tech_find == "3") && (
                    <>
                      <div className="col-span-12 md:col-span-6 lg:col-span-6 input-field amount_solute">
                        <label htmlFor="tech_amount_solute" className="label">
                          {data?.payload?.tech_lang_keys["4"]}
                        </label>
                        <div className="relative w-full ">
                          <input
                            type="number"
                            name="tech_amount_solute"
                            step="any"
                            className="mt-1 input"
                            value={formData.tech_amount_solute}
                            placeholder="00"
                            onChange={handleChange}
                          />
                          <label
                            className="absolute cursor-pointer text-sm underline right-6 top-4"
                            onClick={toggleDropdown}
                          >
                            {formData.tech_amount_solute_unit} ▾
                          </label>
                          {dropdownVisible && (
                            <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                              {[
                                { label: "mole (mol)", value: "mol" },
                                { label: "millimole (mmol)", value: "mmol" },
                                { label: "micormole (µmol)", value: "µmol" },
                                { label: "nanomol (nmol)", value: "nmol" },
                                { label: "picomol (pmol)", value: "pmol" },
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
                  {(formData.tech_find == "1" || formData.tech_find == "2") && (
                    <>
                      <div className="col-span-12 md:col-span-6 lg:col-span-6 input-field mass_solvent">
                        <label htmlFor="tech_mass_solvent" className="label">
                          {data?.payload?.tech_lang_keys["5"]}
                        </label>
                        <div className="relative w-full ">
                          <input
                            type="number"
                            name="tech_mass_solvent"
                            step="any"
                            className="mt-1 input"
                            value={formData.tech_mass_solvent}
                            placeholder="00"
                            onChange={handleChange}
                          />
                          <label
                            className="absolute cursor-pointer text-sm underline right-6 top-4"
                            onClick={toggleDropdown1}
                          >
                            {formData.tech_mass_solvent_unit} ▾
                          </label>
                          {dropdownVisible1 && (
                            <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                              {[
                                { label: "micrograms (µg)", value: "µg" },
                                { label: "milligrams (mg)", value: "mg" },
                                { label: "grams (g)", value: "g" },
                                { label: "decagrams (dag)", value: "dag" },
                                { label: "kilograms (kg)", value: "kg" },
                                { label: "ounces (oz)", value: "oz" },
                                { label: "pounds (lbs)", value: "lbs" },
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
                  {(formData.tech_find == "2" || formData.tech_find == "3") && (
                    <>
                      <div className="col-span-12 md:col-span-6 lg:col-span-6 input-field molality">
                        <label htmlFor="tech_molality" className="label">
                          {data?.payload?.tech_lang_keys["3"]}
                        </label>
                        <div className="relative w-full ">
                          <input
                            type="number"
                            name="tech_molality"
                            step="any"
                            className="mt-1 input"
                            value={formData.tech_molality}
                            placeholder="00"
                            onChange={handleChange}
                          />
                          <label
                            className="absolute cursor-pointer text-sm underline right-6 top-4"
                            onClick={toggleDropdown2}
                          >
                            {formData.tech_molality_unit} ▾
                          </label>
                          {dropdownVisible2 && (
                            <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                              {[
                                {
                                  label: "mol/micrograms (µg)",
                                  value: "mol/µg",
                                },
                                {
                                  label: "mol/milligrams (mg)",
                                  value: "mol/mg",
                                },
                                { label: "mol/grams (g)", value: "mol/g" },
                                {
                                  label: "mol/decagrams (dag)",
                                  value: "mol/dag",
                                },
                                {
                                  label: "mol/kilograms (kg)",
                                  value: "mol/kg",
                                },
                                { label: "mol/ounces (oz)", value: "mol/oz" },
                                { label: "mol/pounds (lbs)", value: "mol/lbs" },
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
                </>
              )}
              {formData.tech_type == "second" && (
                <>
                  <div className="col-span-12 input-field whole ">
                    <div className="grid grid-cols-12 mt-3   gap-2 md:gap-2 lg:gap-2">
                      <div className="col-span-12 ">
                        <label htmlFor="tech_molality" className="label">
                          {data?.payload?.tech_lang_keys["3"]}
                        </label>
                        <div className="relative w-full ">
                          <input
                            type="number"
                            name="tech_molality"
                            step="any"
                            className="mt-1 input"
                            value={formData.tech_molality}
                            placeholder="00"
                            onChange={handleChange}
                          />
                          <label
                            className="absolute cursor-pointer text-sm underline right-6 top-4"
                            onClick={toggleDropdown2}
                          >
                            {formData.tech_molality_unit} ▾
                          </label>
                          {dropdownVisible2 && (
                            <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                              {[
                                {
                                  label: "mol/micrograms (µg)",
                                  value: "mol/µg",
                                },
                                {
                                  label: "mol/milligrams (mg)",
                                  value: "mol/mg",
                                },
                                { label: "mol/grams (g)", value: "mol/g" },
                                {
                                  label: "mol/decagrams (dag)",
                                  value: "mol/dag",
                                },
                                {
                                  label: "mol/kilograms (kg)",
                                  value: "mol/kg",
                                },
                                { label: "mol/ounces (oz)", value: "mol/oz" },
                                { label: "mol/pounds (lbs)", value: "mol/lbs" },
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
                      <div className="col-span-12 md:col-span-6 lg:col-span-6">
                        <label htmlFor="tech_density" className="label">
                          {data?.payload?.tech_lang_keys["7"]} [ρ]:
                        </label>
                        <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_density"
                            id="tech_density"
                            className="input my-2"
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_density}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="col-span-12 md:col-span-6 lg:col-span-6">
                        <label htmlFor="tech_density_unit" className="label">
                          &nbsp;
                        </label>
                        <div className="mt-2">
                          <select
                            className="input"
                            aria-label="select"
                            name="tech_density_unit"
                            id="tech_density_unit"
                            value={formData.tech_density_unit}
                            onChange={handleChange}
                          >
                            {densityOptions.map((option, idx) => (
                              <option key={idx} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="col-span-12 md:col-span-6 lg:col-span-6">
                        <label
                          htmlFor="tech_molecular_mass_solute"
                          className="label"
                        >
                          {data?.payload?.tech_lang_keys["8"]}:
                        </label>
                        <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_molecular_mass_solute"
                            id="tech_molecular_mass_solute"
                            className="input my-2"
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_molecular_mass_solute}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="col-span-12 md:col-span-6 lg:col-span-6">
                        <label
                          htmlFor="tech_molecular_mass_solute_unit"
                          className="label"
                        >
                          &nbsp;
                        </label>
                        <div className="mt-2">
                          <select
                            className="input"
                            aria-label="select"
                            name="tech_molecular_mass_solute_unit"
                            id="tech_molecular_mass_solute_unit"
                            value={formData.tech_molecular_mass_solute_unit}
                            onChange={handleChange}
                          >
                            <option value="4155.8441558">
                              Assarion (Biblical Roman)
                            </option>
                            <option value="6.022136651E+26">
                              Atomic Mass Unit
                            </option>
                            <option value="1E+21">Attogram</option>
                            <option value="175.43859649">
                              Bekan (Biblical Hebrew)
                            </option>
                            <option value="5000">Carat</option>
                            <option value="100000">Centigram</option>
                            <option value="6.022173643E+26">Dalton</option>
                            <option value="100">Decagram</option>
                            <option value="10000">Decigram</option>
                            <option value="259.74025974">
                              Denarius (Biblical Roman)
                            </option>
                            <option value="2.990800894E+26">
                              Deuteron Mass
                            </option>
                            <option value="2.990800894E+26">
                              Didrachma (Biblical Greek)
                            </option>
                            <option value="1.67336010709505E-25">
                              Drachma (Biblical Greek)
                            </option>
                            <option value="9.10938970730895E-31">
                              Earth's Mass
                            </option>
                            <option value="1E-15">Electron Mass (Rest)</option>
                            <option value="1E+15">Exagram</option>
                            <option value="1E+18">Femtogram</option>
                            <option value="1000000000">Gamma</option>
                            <option value="1754.3859649">
                              Gerah (Biblical Hebrew)
                            </option>
                            <option value="5.978633201E+26">Gigagram</option>
                            <option value="1E-12">Gigatonne</option>
                            <option value="15432.358353">Grain</option>
                            <option value="1000">Gram</option>
                            <option value="10">Hectogram</option>
                            <option value="0.0196841306">
                              Hundredweight(UK)
                            </option>
                            <option value="5.26592943654555E-28">
                              Jupiter Mass
                            </option>
                            <option value="1">Kilogram</option>
                            <option value="0.1019716213">
                              Kilo-Force Square Second Per Foot
                            </option>
                            <option value="0.0022046226218">KiloPound</option>
                            <option value="1E-06">Kiloton(Metric)</option>
                            <option value="33246.753247">
                              Lepton (Biblical Roman)
                            </option>
                            <option value="0.001">Megragram</option>
                            <option value="1E-09">Megatonne</option>
                            <option value="1000000000">Microgram</option>
                            <option value="1000000">Milligram</option>
                            <option value="2.9411764706">
                              Mina(Biblical Greek)
                            </option>
                            <option value="2.9411764706">
                              Mina(Biblical Hebrew)
                            </option>
                            <option value="5.309172492E+27">Muon Mass</option>
                            <option value="1000000000000">Nanogram</option>
                            <option value="5.970403753E+26">
                              Neutron Mass
                            </option>
                            <option value="35.27396195">Ounce</option>
                            <option value="643.01493137">Pennyweight</option>
                            <option value="1E-12">Petagram</option>
                            <option value="1E+15">Picogram</option>
                            <option value="45940892.448">Planck Mass</option>
                            <option value="45940892.448">Pound</option>
                            <option value="2.6792288807">
                              Pound(Troy or Apothecary)
                            </option>
                            <option value="70.988848424">Poundal</option>
                            <option value="0.0685217658999999">
                              Pound-Force Square Second Per Foot
                            </option>
                            <option value="5.978633201E+26">Proton Mass</option>
                            <option value="16623.376623">
                              Quadrans(Biblical Romans)
                            </option>
                            <option value="0.0787365221999998">
                              Quarter(UK)
                            </option>
                            <option value="0.0881849049000002">
                              Quarter(US)
                            </option>
                            <option value="0.01">Quintal</option>
                            <option value="0.000984206527611061">
                              Scruple(Apotherapy)
                            </option>
                            <option value="87.719298246">
                              Shekel(Biblical Hebrew)
                            </option>
                            <option value="87.719298246">Slug</option>
                            <option value="1.988E+30">Solar Mass</option>
                            <option value="0.1574730444">Stone (UK)</option>
                            <option value="0.1763698097">Stone (US)</option>
                            <option value="5.02765208647562E-31s">
                              Sun's Mass
                            </option>
                            <option value="0.0490196078">
                              Talent(Biblical Greek)
                            </option>
                            <option value="0.0292397661">
                              Talent(Biblical Hebrew)
                            </option>
                            <option value="1E-09">Teragram</option>
                            <option value="73.529411765">
                              Tetradrachma(Biblical Greek)
                            </option>
                            <option value="30.612244898">
                              Ton (Assay)(UK)
                            </option>
                            <option value="34.285710367">
                              Ton (Assay)(US)
                            </option>
                            <option value="0.000984206527611061">
                              Ton(Long)
                            </option>
                            <option value="0.001">Ton(Metric)</option>
                            <option value="0.0011023113">Ton(Short)</option>
                            <option value="0.001">Tonne</option>
                          </select>
                        </div>
                      </div>
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
                      <div className="w-full text-center">
                        {result?.tech_type == "first" && (
                          <>
                            {result?.tech_method == "1" && (
                              <>
                                <p>
                                  <strong className="text-[14px] md:text-[18px] lg:text-[18px]">
                                    {data?.payload?.tech_lang_keys["3"]}
                                  </strong>
                                </p>
                                <div className="flex justify-center">
                                  <p className="text-[25px] bg-[#2845F5] text-white rounded-lg px-3 py-2  my-3">
                                    <strong className=" text-[20px] md:text-[32px] lg:text-[32px]">
                                      {Number(result?.tech_molality).toFixed(2)}
                                      <span className="text-[16px] md:text-[22px] lg:text-[22px]">
                                        {" "}
                                        (mol/kg){" "}
                                      </span>
                                    </strong>
                                  </p>
                                </div>
                              </>
                            )}
                            {result?.tech_method == "2" && (
                              <>
                                <p>
                                  <strong className="text-[14px] md:text-[18px] lg:text-[18px]">
                                    {data?.payload?.tech_lang_keys["4"]}
                                  </strong>
                                </p>
                                <div className="flex justify-center">
                                  <p className="text-[25px] bg-[#2845F5] text-white rounded-lg px-3 py-2  my-3">
                                    <strong className="text-[20px] md:text-[32px] lg:text-[32px]">
                                      {Number(
                                        result?.tech_amount_of_solute
                                      ).toFixed(2)}
                                      <span className="text-[16px] md:text-[22px] lg:text-[22px]">
                                        {" "}
                                        (mol){" "}
                                      </span>
                                    </strong>
                                  </p>
                                </div>
                              </>
                            )}
                            {result?.tech_method == "3" && (
                              <>
                                <p>
                                  <strong className="text-[14px] md:text-[18px] lg:text-[18px]">
                                    {data?.payload?.tech_lang_keys["5"]}
                                  </strong>
                                </p>
                                <div className="flex justify-center">
                                  <p className="text-[25px] bg-[#2845F5] text-white rounded-lg px-3 py-2  my-3">
                                    <strong className="text-[20px] md:text-[32px] lg:text-[32px]">
                                      {Number(
                                        result?.tech_amount_of_solvent
                                      ).toFixed(2)}
                                      <span className="text-[16px] md:text-[22px] lg:text-[22px]">
                                        {" "}
                                        (kg){" "}
                                      </span>
                                    </strong>
                                  </p>
                                </div>
                              </>
                            )}
                          </>
                        )}

                        {result?.tech_type == "second" && (
                          <>
                            <p>
                              <strong className="text-[14px] md:text-[18px] lg:text-[18px]">
                                {data?.payload?.tech_lang_keys["6"]} [M]
                              </strong>
                            </p>
                            <div className="flex justify-center">
                              <p className="text-[25px] bg-[#2845F5] text-white rounded-lg px-3 py-2  my-3">
                                <strong className="text-[20px] md:text-[32px] lg:text-[32px]">
                                  {result?.tech_molality * 0.001}
                                  <span className="text-[16px] md:text-[22px] lg:text-[22px]">
                                    {" "}
                                    (m/L){" "}
                                  </span>
                                </strong>
                              </p>
                            </div>
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

export default MolalityCalculator;

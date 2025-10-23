"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useMassPercentCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const MassPercentCalculator = () => {
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
    tech_find: "1", // 1 2 3 4 5 6
    tech_mass_solute: "12",
    tech_mass_solute_unit: "kg",
    tech_mass_solvent: "20",
    tech_mass_solvent_unit: "kg",
    tech_mass_percentage: "20",
    tech_mass_chemical: "20",
    tech_mass_chemical_unit: "kg",
    tech_total_mass_compound: "20",
    tech_total_mass_compound_unit: "kg",
    tech_first_value: Number(20),
    tech_first_value_unit: "Atomic mass amu",
    tech_second_value: Number(10),
    tech_second_value_unit: "Atomic mass amu",
    tech_third_value: Number(10),
    tech_third_value_unit: "Atomic mass amu",
    tech_four_value: Number(10),
    tech_four_value_unit: "Atomic mass amu",
    tech_five_value: Number(10),
    tech_five_value_unit: "Atomic mass amu",
    tech_six_value: Number(10),
    tech_six_value_unit: "Atomic mass amu",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateActivationCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useMassPercentCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_find) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateActivationCalculator({
        tech_find: formData.tech_find,
        tech_mass_solute: formData.tech_mass_solute,
        tech_mass_solute_unit: formData.tech_mass_solute_unit,
        tech_mass_solvent: formData.tech_mass_solvent,
        tech_mass_solvent_unit: formData.tech_mass_solvent_unit,
        tech_mass_percentage: formData.tech_mass_percentage,
        tech_mass_chemical: formData.tech_mass_chemical,
        tech_mass_chemical_unit: formData.tech_mass_chemical_unit,
        tech_total_mass_compound: formData.tech_total_mass_compound,
        tech_total_mass_compound_unit: formData.tech_total_mass_compound_unit,
        tech_first_value: formData.tech_first_value,
        tech_first_value_unit: formData.tech_first_value_unit,
        tech_second_value: formData.tech_second_value,
        tech_second_value_unit: formData.tech_second_value_unit,
        tech_third_value: formData.tech_third_value,
        tech_third_value_unit: formData.tech_third_value_unit,
        tech_four_value: formData.tech_four_value,
        tech_four_value_unit: formData.tech_four_value_unit,
        tech_five_value: formData.tech_five_value,
        tech_five_value_unit: formData.tech_five_value_unit,
        tech_six_value: formData.tech_six_value,
        tech_six_value_unit: formData.tech_six_value_unit,
      }).unwrap();
      setResult(response); // Assuming the response'
      toast.success("Successfully Calculated");
    } catch (err) {
      setFormError(err.data.error);
      toast.error(err.data.error);
    }
  };

  // Handle reset form
  const handleReset = () => {
    setFormData({
      tech_find: "1", // 1 2 3 4 5 6
      tech_mass_solute: "12",
      tech_mass_solute_unit: "kg",
      tech_mass_solvent: "20",
      tech_mass_solvent_unit: "kg",
      tech_mass_percentage: "20",
      tech_mass_chemical: "20",
      tech_mass_chemical_unit: "kg",
      tech_total_mass_compound: "20",
      tech_total_mass_compound_unit: "kg",
      tech_first_value: "20",
      tech_first_value_unit: "Atomic mass amu",
      tech_second_value: "10",
      tech_second_value_unit: "Atomic mass amu",
      tech_third_value: "10",
      tech_third_value_unit: "Atomic mass amu",
      tech_four_value: "10",
      tech_four_value_unit: "Atomic mass amu",
      tech_five_value: "10",
      tech_five_value_unit: "Atomic mass amu",
      tech_six_value: "10",
      tech_six_value_unit: "Atomic mass amu",
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
    setFormData((prev) => ({ ...prev, tech_mass_solute_unit: unit }));
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
    setFormData((prev) => ({ ...prev, tech_mass_chemical_unit: unit }));
    setDropdownVisible2(false);
  };

  const toggleDropdown2 = () => {
    setDropdownVisible2(!dropdownVisible2);
  };

  //dropdown states
  const [dropdownVisible3, setDropdownVisible3] = useState(false);

  const setUnitHandler3 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_total_mass_compound_unit: unit }));
    setDropdownVisible3(false);
  };

  const toggleDropdown3 = () => {
    setDropdownVisible3(!dropdownVisible3);
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

          <div className="lg:w-[60%] md:w-[80%] w-full mx-auto ">
            <div className="grid grid-cols-1  gap-4">
              <div className=" relative">
                <label htmlFor="tech_find" className="label">
                  Find:
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
                    <option value="1">Mass Percentage for a Solute</option>
                    <option value="2">Mass of Solute </option>
                    <option value="3"> Mass of Solvent</option>
                    <option value="4"> Mass Percentage for a Chemical</option>
                    <option value="5"> Mass of Chemical</option>
                    <option value="6"> Total Mass of Compound</option>
                    <option value="7"> Percent Composition</option>
                  </select>
                </div>
              </div>
            </div>
            {(formData.tech_find == "1" ||
              formData.tech_find == "2" ||
              formData.tech_find == "3" ||
              formData.tech_find == "4" ||
              formData.tech_find == "5" ||
              formData.tech_find == "6") && (
              <>
                <div className="grid grid-cols-1 mt-4 lg:grid-cols-2 md:grid-cols-2  gap-4">
                  {(formData.tech_find == "1" ||
                    formData.tech_find == "12" ||
                    formData.tech_find == "3") && (
                    <>
                      <div className=" input-field mass_solute">
                        <label htmlFor="tech_mass_solute" className="label">
                          Mass of solute:
                        </label>
                        <div className="relative w-full ">
                          <input
                            type="number"
                            name="tech_mass_solute"
                            step="any"
                            className="mt-1 input"
                            value={formData.tech_mass_solute}
                            placeholder="00"
                            onChange={handleChange}
                          />
                          <label
                            className="absolute cursor-pointer text-sm underline right-6 top-4"
                            onClick={toggleDropdown}
                          >
                            {formData.tech_mass_solute_unit} ▾
                          </label>
                          {dropdownVisible && (
                            <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                              {[
                                { label: "micrograms (μg)", value: "μg" },
                                { label: "milligrams (mg)", value: "mg" },
                                { label: "grams (g)", value: "g" },
                                { label: "decagrams (dag)", value: "dag" },
                                { label: "kilograms (kg)", value: "kg" },
                                { label: "metric tons (t)", value: "t" },
                                { label: "ounces (oz)", value: "oz" },
                                { label: "pounds (lbs)", value: "lbs" },
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
                      <div className=" input-field mass_solvent">
                        <label htmlFor="tech_mass_solvent" className="label">
                          Mass of solvent:
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
                                { label: "micrograms (μg)", value: "μg" },
                                { label: "milligrams (mg)", value: "mg" },
                                { label: "grams (g)", value: "g" },
                                { label: "decagrams (dag)", value: "dag" },
                                { label: "kilograms (kg)", value: "kg" },
                                { label: "metric tons (t)", value: "t" },
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
                  {(formData.tech_find == "2" ||
                    formData.tech_find == "3" ||
                    formData.tech_find == "5" ||
                    formData.tech_find == "6") && (
                    <>
                      <div className=" input-field mass_percentage  ">
                        <label htmlFor="tech_mass_percentage" className="label">
                          Mass Percentage:
                        </label>
                        <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_mass_percentage"
                            id="tech_mass_percentage"
                            className="input my-2"
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_mass_percentage}
                            onChange={handleChange}
                          />
                          <span className="input_unit">%</span>
                        </div>
                      </div>
                    </>
                  )}
                  {(formData.tech_find == "4" || formData.tech_find == "6") && (
                    <>
                      <div className=" input-field mass_chemical ">
                        <label htmlFor="tech_mass_chemical" className="label">
                          Mass of chemical:
                        </label>
                        <div className="relative w-full ">
                          <input
                            type="number"
                            name="tech_mass_chemical"
                            step="any"
                            className="mt-1 input"
                            value={formData.tech_mass_chemical}
                            placeholder="00"
                            onChange={handleChange}
                          />
                          <label
                            className="absolute cursor-pointer text-sm underline right-6 top-4"
                            onClick={toggleDropdown2}
                          >
                            {formData.tech_mass_chemical_unit} ▾
                          </label>
                          {dropdownVisible2 && (
                            <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                              {[
                                { label: "micrograms (μg)", value: "μg" },
                                { label: "milligrams (mg)", value: "mg" },
                                { label: "grams (g)", value: "g" },
                                { label: "decagrams (dag)", value: "dag" },
                                { label: "kilograms (kg)", value: "kg" },
                                { label: "metric tons (t)", value: "t" },
                                { label: "ounces (oz)", value: "oz" },
                                { label: "pounds (lbs)", value: "lbs" },
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
                  {(formData.tech_find == "4" || formData.tech_find == "5") && (
                    <>
                      <div className=" input-field total_mass_compound ">
                        <label
                          htmlFor="tech_total_mass_compound"
                          className="label"
                        >
                          Total mass of compound :
                        </label>
                        <div className="relative w-full ">
                          <input
                            type="number"
                            name="tech_total_mass_compound"
                            step="any"
                            className="mt-1 input"
                            value={formData.tech_total_mass_compound}
                            placeholder="00"
                            onChange={handleChange}
                          />
                          <label
                            className="absolute cursor-pointer text-sm underline right-6 top-4"
                            onClick={toggleDropdown3}
                          >
                            {formData.tech_total_mass_compound_unit} ▾
                          </label>
                          {dropdownVisible3 && (
                            <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                              {[
                                { label: "micrograms (μg)", value: "μg" },
                                { label: "milligrams (mg)", value: "mg" },
                                { label: "grams (g)", value: "g" },
                                { label: "decagrams (dag)", value: "dag" },
                                { label: "kilograms (kg)", value: "kg" },
                                { label: "metric tons (t)", value: "t" },
                                { label: "ounces (oz)", value: "oz" },
                                { label: "pounds (lbs)", value: "lbs" },
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
                    </>
                  )}
                </div>
              </>
            )}

            {formData.tech_find == "7" && (
              <>
                <div className="grid grid-cols-12  gap-2  input-field  mt-5 ">
                  <div className="col-span-6 md:col-span-6">
                    <label htmlFor="tech_first_value" className="label">
                      No of 1st elements atoms:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_first_value"
                        id="tech_first_value"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_first_value}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-span-6 md:col-span-6">
                    <label htmlFor="tech_first_value_unit" className="label">
                      &nbsp;
                    </label>
                    <div className="mt-2">
                      <select
                        className="input"
                        aria-label="select"
                        name="tech_first_value_unit"
                        id="tech_first_value_unit"
                        value={formData.tech_first_value_unit}
                        onChange={handleChange}
                      >
                        <option value="Atomic mass amu">Atomic mass amu</option>
                        <option value="H (Hydrogen)">H (Hydrogen)</option>
                        <option value="He (Helium)">He (Helium)</option>
                        <option value="Li (Lithium)">Li (Lithium)</option>
                        <option value="Be (Beryllium)">Be (Beryllium)</option>
                        <option value="B (Boron)">B (Boron)</option>
                        <option value="C (Carbon)">C (Carbon)</option>
                        <option value="N (Nitrogen)">N (Nitrogen)</option>
                        <option value="O (Oxygen)">O (Oxygen)</option>
                        <option value="F (Fluorine)">F (Fluorine)</option>
                        <option value="Ne (Neon)">Ne (Neon)</option>
                        <option value="Na (Sodium)">Na (Sodium)</option>
                        <option value="Mg (Magnesium)">Mg (Magnesium)</option>
                        <option value="Al (Aluminium)">Al (Aluminium)</option>
                        <option value="Si (Silicon)">Si (Silicon)</option>
                        <option value="P (Phosphorus)">P (Phosphorus)</option>
                        <option value="S (Sulfur)">S (Sulfur)</option>
                        <option value="Cl (Chlorine)">Cl (Chlorine)</option>
                        <option value="Ar (Argon)">Ar (Argon)</option>
                        <option value="K (Potassium)">K (Potassium)</option>
                        <option value="Ca (Calcium)">Ca (Calcium)</option>
                        <option value="Sc (Scandium)">Sc (Scandium)</option>
                        <option value="Ti (Titanium)">Ti (Titanium)</option>
                        <option value="V  (Vanadium)">V (Vanadium)</option>
                        <option value="Cr (Chromium)">Cr (Chromium)</option>
                        <option value="Mn (Manganese)">Mn (Manganese)</option>
                        <option value="Fe (Iron)">Fe (Iron)</option>
                        <option value="Co ( Cobalt)">Co ( Cobalt)</option>
                        <option value="Ni (Nickel)">Ni (Nickel)</option>
                        <option value="Cu (Copper)">Cu (Copper)</option>
                        <option value="Zn (Zinc)">Zn (Zinc)</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-span-6 md:col-span-6">
                    <label htmlFor="tech_second_value" className="label">
                      No of 2nd elements atoms:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_second_value"
                        id="tech_second_value"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_second_value}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-span-6 md:col-span-6">
                    <label htmlFor="tech_second_value_unit" className="label">
                      &nbsp;
                    </label>
                    <div className="mt-2">
                      <select
                        className="input"
                        aria-label="select"
                        name="tech_second_value_unit"
                        id="tech_second_value_unit"
                        value={formData.tech_second_value_unit}
                        onChange={handleChange}
                      >
                        <option value="Atomic mass amu">Atomic mass amu</option>
                        <option value="H (Hydrogen)">H (Hydrogen)</option>
                        <option value="He (Helium)">He (Helium)</option>
                        <option value="Li (Lithium)">Li (Lithium)</option>
                        <option value="Be (Beryllium)">Be (Beryllium)</option>
                        <option value="B (Boron)">B (Boron)</option>
                        <option value="C (Carbon)">C (Carbon)</option>
                        <option value="N (Nitrogen)">N (Nitrogen)</option>
                        <option value="O (Oxygen)">O (Oxygen)</option>
                        <option value="F (Fluorine)">F (Fluorine)</option>
                        <option value="Ne (Neon)">Ne (Neon)</option>
                        <option value="Na (Sodium)">Na (Sodium)</option>
                        <option value="Mg (Magnesium)">Mg (Magnesium)</option>
                        <option value="Al (Aluminium)">Al (Aluminium)</option>
                        <option value="Si (Silicon)">Si (Silicon)</option>
                        <option value="P (Phosphorus)">P (Phosphorus)</option>
                        <option value="S (Sulfur)">S (Sulfur)</option>
                        <option value="Cl (Chlorine)">Cl (Chlorine)</option>
                        <option value="Ar (Argon)">Ar (Argon)</option>
                        <option value="K (Potassium)">K (Potassium)</option>
                        <option value="Ca (Calcium)">Ca (Calcium)</option>
                        <option value="Sc (Scandium)">Sc (Scandium)</option>
                        <option value="Ti (Titanium)">Ti (Titanium)</option>
                        <option value="V  (Vanadium)">V (Vanadium)</option>
                        <option value="Cr (Chromium)">Cr (Chromium)</option>
                        <option value="Mn (Manganese)">Mn (Manganese)</option>
                        <option value="Fe (Iron)">Fe (Iron)</option>
                        <option value="Co ( Cobalt)">Co ( Cobalt)</option>
                        <option value="Ni (Nickel)">Ni (Nickel)</option>
                        <option value="Cu (Copper)">Cu (Copper)</option>
                        <option value="Zn (Zinc)">Zn (Zinc)</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-span-6 md:col-span-6">
                    <label htmlFor="tech_third_value" className="label">
                      No of 3rd elements atoms:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_third_value"
                        id="tech_third_value"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_third_value}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-span-6 md:col-span-6">
                    <label htmlFor="tech_third_value_unit" className="label">
                      &nbsp;
                    </label>
                    <div className="mt-2">
                      <select
                        className="input"
                        aria-label="select"
                        name="tech_third_value_unit"
                        id="tech_third_value_unit"
                        value={formData.tech_third_value_unit}
                        onChange={handleChange}
                      >
                        <option value="Atomic mass amu">Atomic mass amu</option>
                        <option value="H (Hydrogen)">H (Hydrogen)</option>
                        <option value="He (Helium)">He (Helium)</option>
                        <option value="Li (Lithium)">Li (Lithium)</option>
                        <option value="Be (Beryllium)">Be (Beryllium)</option>
                        <option value="B (Boron)">B (Boron)</option>
                        <option value="C (Carbon)">C (Carbon)</option>
                        <option value="N (Nitrogen)">N (Nitrogen)</option>
                        <option value="O (Oxygen)">O (Oxygen)</option>
                        <option value="F (Fluorine)">F (Fluorine)</option>
                        <option value="Ne (Neon)">Ne (Neon)</option>
                        <option value="Na (Sodium)">Na (Sodium)</option>
                        <option value="Mg (Magnesium)">Mg (Magnesium)</option>
                        <option value="Al (Aluminium)">Al (Aluminium)</option>
                        <option value="Si (Silicon)">Si (Silicon)</option>
                        <option value="P (Phosphorus)">P (Phosphorus)</option>
                        <option value="S (Sulfur)">S (Sulfur)</option>
                        <option value="Cl (Chlorine)">Cl (Chlorine)</option>
                        <option value="Ar (Argon)">Ar (Argon)</option>
                        <option value="K (Potassium)">K (Potassium)</option>
                        <option value="Ca (Calcium)">Ca (Calcium)</option>
                        <option value="Sc (Scandium)">Sc (Scandium)</option>
                        <option value="Ti (Titanium)">Ti (Titanium)</option>
                        <option value="V  (Vanadium)">V (Vanadium)</option>
                        <option value="Cr (Chromium)">Cr (Chromium)</option>
                        <option value="Mn (Manganese)">Mn (Manganese)</option>
                        <option value="Fe (Iron)">Fe (Iron)</option>
                        <option value="Co ( Cobalt)">Co ( Cobalt)</option>
                        <option value="Ni (Nickel)">Ni (Nickel)</option>
                        <option value="Cu (Copper)">Cu (Copper)</option>
                        <option value="Zn (Zinc)">Zn (Zinc)</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-span-6 md:col-span-6">
                    <label htmlFor="tech_four_value" className="label">
                      No of 4th elements atoms:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_four_value"
                        id="tech_four_value"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_four_value}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-span-6 md:col-span-6">
                    <label htmlFor="tech_four_value_unit" className="label">
                      &nbsp;
                    </label>
                    <div className="mt-2">
                      <select
                        className="input"
                        aria-label="select"
                        name="tech_four_value_unit"
                        id="tech_four_value_unit"
                        value={formData.tech_four_value_unit}
                        onChange={handleChange}
                      >
                        <option value="Atomic mass amu">Atomic mass amu</option>
                        <option value="H (Hydrogen)">H (Hydrogen)</option>
                        <option value="He (Helium)">He (Helium)</option>
                        <option value="Li (Lithium)">Li (Lithium)</option>
                        <option value="Be (Beryllium)">Be (Beryllium)</option>
                        <option value="B (Boron)">B (Boron)</option>
                        <option value="C (Carbon)">C (Carbon)</option>
                        <option value="N (Nitrogen)">N (Nitrogen)</option>
                        <option value="O (Oxygen)">O (Oxygen)</option>
                        <option value="F (Fluorine)">F (Fluorine)</option>
                        <option value="Ne (Neon)">Ne (Neon)</option>
                        <option value="Na (Sodium)">Na (Sodium)</option>
                        <option value="Mg (Magnesium)">Mg (Magnesium)</option>
                        <option value="Al (Aluminium)">Al (Aluminium)</option>
                        <option value="Si (Silicon)">Si (Silicon)</option>
                        <option value="P (Phosphorus)">P (Phosphorus)</option>
                        <option value="S (Sulfur)">S (Sulfur)</option>
                        <option value="Cl (Chlorine)">Cl (Chlorine)</option>
                        <option value="Ar (Argon)">Ar (Argon)</option>
                        <option value="K (Potassium)">K (Potassium)</option>
                        <option value="Ca (Calcium)">Ca (Calcium)</option>
                        <option value="Sc (Scandium)">Sc (Scandium)</option>
                        <option value="Ti (Titanium)">Ti (Titanium)</option>
                        <option value="V  (Vanadium)">V (Vanadium)</option>
                        <option value="Cr (Chromium)">Cr (Chromium)</option>
                        <option value="Mn (Manganese)">Mn (Manganese)</option>
                        <option value="Fe (Iron)">Fe (Iron)</option>
                        <option value="Co ( Cobalt)">Co ( Cobalt)</option>
                        <option value="Ni (Nickel)">Ni (Nickel)</option>
                        <option value="Cu (Copper)">Cu (Copper)</option>
                        <option value="Zn (Zinc)">Zn (Zinc)</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-span-6 md:col-span-6">
                    <label htmlFor="tech_five_value" className="label">
                      No of 5th elements atoms:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_five_value"
                        id="tech_five_value"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_five_value}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-span-6 md:col-span-6">
                    <label htmlFor="tech_five_value_unit" className="label">
                      &nbsp;
                    </label>
                    <div className="mt-2">
                      <select
                        className="input"
                        aria-label="select"
                        name="tech_five_value_unit"
                        id="tech_five_value_unit"
                        value={formData.tech_five_value_unit}
                        onChange={handleChange}
                      >
                        <option value="Atomic mass amu">Atomic mass amu</option>
                        <option value="H (Hydrogen)">H (Hydrogen)</option>
                        <option value="He (Helium)">He (Helium)</option>
                        <option value="Li (Lithium)">Li (Lithium)</option>
                        <option value="Be (Beryllium)">Be (Beryllium)</option>
                        <option value="B (Boron)">B (Boron)</option>
                        <option value="C (Carbon)">C (Carbon)</option>
                        <option value="N (Nitrogen)">N (Nitrogen)</option>
                        <option value="O (Oxygen)">O (Oxygen)</option>
                        <option value="F (Fluorine)">F (Fluorine)</option>
                        <option value="Ne (Neon)">Ne (Neon)</option>
                        <option value="Na (Sodium)">Na (Sodium)</option>
                        <option value="Mg (Magnesium)">Mg (Magnesium)</option>
                        <option value="Al (Aluminium)">Al (Aluminium)</option>
                        <option value="Si (Silicon)">Si (Silicon)</option>
                        <option value="P (Phosphorus)">P (Phosphorus)</option>
                        <option value="S (Sulfur)">S (Sulfur)</option>
                        <option value="Cl (Chlorine)">Cl (Chlorine)</option>
                        <option value="Ar (Argon)">Ar (Argon)</option>
                        <option value="K (Potassium)">K (Potassium)</option>
                        <option value="Ca (Calcium)">Ca (Calcium)</option>
                        <option value="Sc (Scandium)">Sc (Scandium)</option>
                        <option value="Ti (Titanium)">Ti (Titanium)</option>
                        <option value="V  (Vanadium)">V (Vanadium)</option>
                        <option value="Cr (Chromium)">Cr (Chromium)</option>
                        <option value="Mn (Manganese)">Mn (Manganese)</option>
                        <option value="Fe (Iron)">Fe (Iron)</option>
                        <option value="Co ( Cobalt)">Co ( Cobalt)</option>
                        <option value="Ni (Nickel)">Ni (Nickel)</option>
                        <option value="Cu (Copper)">Cu (Copper)</option>
                        <option value="Zn (Zinc)">Zn (Zinc)</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-span-6 md:col-span-6">
                    <label htmlFor="tech_six_value" className="label">
                      No of 6th elements atoms:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_six_value"
                        id="tech_six_value"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_six_value}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-span-6 md:col-span-6">
                    <label htmlFor="tech_six_value_unit" className="label">
                      &nbsp;
                    </label>
                    <div className="mt-2">
                      <select
                        className="input"
                        aria-label="select"
                        name="tech_six_value_unit"
                        id="tech_six_value_unit"
                        value={formData.tech_six_value_unit}
                        onChange={handleChange}
                      >
                        <option value="Atomic mass amu">Atomic mass amu</option>
                        <option value="H (Hydrogen)">H (Hydrogen)</option>
                        <option value="He (Helium)">He (Helium)</option>
                        <option value="Li (Lithium)">Li (Lithium)</option>
                        <option value="Be (Beryllium)">Be (Beryllium)</option>
                        <option value="B (Boron)">B (Boron)</option>
                        <option value="C (Carbon)">C (Carbon)</option>
                        <option value="N (Nitrogen)">N (Nitrogen)</option>
                        <option value="O (Oxygen)">O (Oxygen)</option>
                        <option value="F (Fluorine)">F (Fluorine)</option>
                        <option value="Ne (Neon)">Ne (Neon)</option>
                        <option value="Na (Sodium)">Na (Sodium)</option>
                        <option value="Mg (Magnesium)">Mg (Magnesium)</option>
                        <option value="Al (Aluminium)">Al (Aluminium)</option>
                        <option value="Si (Silicon)">Si (Silicon)</option>
                        <option value="P (Phosphorus)">P (Phosphorus)</option>
                        <option value="S (Sulfur)">S (Sulfur)</option>
                        <option value="Cl (Chlorine)">Cl (Chlorine)</option>
                        <option value="Ar (Argon)">Ar (Argon)</option>
                        <option value="K (Potassium)">K (Potassium)</option>
                        <option value="Ca (Calcium)">Ca (Calcium)</option>
                        <option value="Sc (Scandium)">Sc (Scandium)</option>
                        <option value="Ti (Titanium)">Ti (Titanium)</option>
                        <option value="V  (Vanadium)">V (Vanadium)</option>
                        <option value="Cr (Chromium)">Cr (Chromium)</option>
                        <option value="Mn (Manganese)">Mn (Manganese)</option>
                        <option value="Fe (Iron)">Fe (Iron)</option>
                        <option value="Co ( Cobalt)">Co ( Cobalt)</option>
                        <option value="Ni (Nickel)">Ni (Nickel)</option>
                        <option value="Cu (Copper)">Cu (Copper)</option>
                        <option value="Zn (Zinc)">Zn (Zinc)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </>
            )}
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
              <div className="w-full mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg  space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg  flex items-center justify-center">
                    <div className="w-full p-3 radius-10 mt-3">
                      <div className="w-full">
                        {result?.tech_method == "1" && (
                          <>
                            <p>
                              <strong>Mass Percentage</strong>
                            </p>
                            <p>
                              <strong className="text-[#119154] text-[28px]">
                                {result?.tech_mass_percent}{" "}
                                <span className="text-[#119154] text-[16px] md:text-[20px]">
                                  (%)
                                </span>
                              </strong>
                            </p>
                            <div className="col-12 overflow-auto grid grid-col-12 gap-2">
                              <table
                                className="col-span-12 md:col-span-6"
                                cellSpacing="0"
                              >
                                <tbody>
                                  <tr>
                                    <td className="border-b py-2 pe-2">
                                      Mass Solution
                                    </td>
                                    <td className="border-b py-2 ps-2">
                                      <strong>
                                        {result?.tech_mass_solution} (kg)
                                      </strong>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2 pe-2">
                                      Mass of Solute
                                    </td>
                                    <td className="border-b py-2 ps-2">
                                      <strong>
                                        {formData?.tech_mass_solute} (kg)
                                      </strong>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 pe-2">
                                      Mass of Solvent
                                    </td>
                                    <td className="py-2 ps-2">
                                      <strong>
                                        {formData?.tech_mass_solvent} (kg)
                                      </strong>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </>
                        )}
                        {result?.tech_method == "2" && (
                          <>
                            <p>
                              <strong>Mass Solute</strong>
                            </p>
                            <p>
                              <strong className="text-[#119154] text-[28px]">
                                {result?.tech_mass_solute}{" "}
                                <span className="text-[#119154] text-[16px] md:text-[20px]">
                                  (kg)
                                </span>
                              </strong>
                            </p>
                            <div className="col-12 overflow-auto grid grid-col-12 gap-2">
                              <table
                                className="col-span-12 md:col-span-6"
                                cellSpacing="0"
                              >
                                <tbody>
                                  <tr>
                                    <td className="border-b py-2 pe-2">
                                      Mass Solution
                                    </td>
                                    <td className="border-b py-2 ps-2">
                                      <strong>
                                        {result?.tech_mass_solution} (kg)
                                      </strong>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2 pe-2">
                                      Mass of Solvent
                                    </td>
                                    <td className="border-b py-2 ps-2">
                                      <strong>
                                        {formData?.tech_mass_solvent} (kg)
                                      </strong>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 pe-2">
                                      Mass Percentage
                                    </td>
                                    <td className="py-2 ps-2">
                                      <strong>
                                        {formData?.tech_mass_percentage} (kg)
                                      </strong>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </>
                        )}
                        {result?.tech_method == "3" && (
                          <>
                            <p>
                              <strong>Mass of Solvent</strong>
                            </p>
                            <p>
                              <strong className="text-[#119154] text-[28px]">
                                {result?.tech_mass_solvent}{" "}
                                <span className="text-[#119154] text-[16px] md:text-[20px]">
                                  (kg)
                                </span>
                              </strong>
                            </p>
                            <div className="col-12 overflow-auto grid grid-col-12 gap-2">
                              <table
                                className="col-span-12 md:col-span-6"
                                cellSpacing="0"
                              >
                                <tbody>
                                  <tr>
                                    <td className="border-b py-2 pe-2">
                                      Mass Solution
                                    </td>
                                    <td className="border-b py-2 ps-2">
                                      <strong>
                                        {result?.tech_mass_solution} (kg)
                                      </strong>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="border-b py-2 pe-2">
                                      Mass of Solute
                                    </td>
                                    <td className="border-b py-2 ps-2">
                                      <strong>
                                        {formData?.tech_mass_solute} (kg)
                                      </strong>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 pe-2">
                                      Mass Percentage
                                    </td>
                                    <td className="py-2 ps-2">
                                      <strong>
                                        {formData?.tech_mass_percentage} (kg)
                                      </strong>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </>
                        )}
                        {result?.tech_method == "4" && (
                          <>
                            <p>
                              <strong>Mass Percentage</strong>
                            </p>
                            <p>
                              <strong className="text-[#119154] text-[28px]">
                                {result?.tech_mass_percent}{" "}
                                <span className="text-[#119154] text-[16px] md:text-[20px]">
                                  (%)
                                </span>
                              </strong>
                            </p>
                            <div className="col-12 overflow-auto grid grid-col-12 gap-2">
                              <table
                                className="col-span-12 md:col-span-6"
                                cellSpacing="0"
                              >
                                <tbody>
                                  <tr>
                                    <td className="border-b py-2 pe-2">
                                      Mass of Chemical
                                    </td>
                                    <td className="border-b py-2 ps-2">
                                      <strong>
                                        {formData?.tech_mass_chemical} (kg)
                                      </strong>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 pe-2">
                                      Total Mass of Compound
                                    </td>
                                    <td className="py-2 ps-2">
                                      <strong>
                                        {formData?.tech_total_mass_compound}{" "}
                                        (kg)
                                      </strong>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </>
                        )}
                        {result?.tech_method == "5" && (
                          <>
                            <p>
                              <strong>Mass of Chemical</strong>
                            </p>
                            <p>
                              <strong className="text-[#119154] text-[28px]">
                                {result?.tech_mass_of_chemical}{" "}
                                <span className="text-[#119154] text-[16px] md:text-[20px]">
                                  (kg)
                                </span>
                              </strong>
                            </p>
                            <div className="col-12 overflow-auto grid grid-col-12 gap-2">
                              <table
                                className="col-span-12 md:col-span-6"
                                cellSpacing="0"
                              >
                                <tbody>
                                  <tr>
                                    <td className="border-b py-2 pe-2">
                                      Mass Percentage
                                    </td>
                                    <td className="border-b py-2 ps-2">
                                      <strong>
                                        {formData?.tech_mass_percentage} (kg)
                                      </strong>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 pe-2">
                                      Total Mass of Compound
                                    </td>
                                    <td className="py-2 ps-2">
                                      <strong>
                                        {formData?.tech_total_mass_compound}{" "}
                                        (kg)
                                      </strong>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </>
                        )}
                        {result?.tech_method == "6" && (
                          <>
                            <p>
                              <strong>Total Mass of Compound</strong>
                            </p>
                            <p>
                              <strong className="text-[#119154] text-[28px]">
                                {result?.tech_total_mass_compound}{" "}
                                <span className="text-[#119154] text-[16px] md:text-[20px]">
                                  (kg)
                                </span>
                              </strong>
                            </p>
                            <div className="col-12 overflow-auto grid grid-col-12 gap-2">
                              <table
                                className="col-span-12 md:col-span-6"
                                cellSpacing="0"
                              >
                                <tbody>
                                  <tr>
                                    <td className="border-b py-2 pe-2">
                                      Mass Percentage
                                    </td>
                                    <td className="border-b py-2 ps-2">
                                      <strong>
                                        {formData?.tech_mass_percentage} (kg)
                                      </strong>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 pe-2">
                                      Mass of Chemical
                                    </td>
                                    <td className="py-2 ps-2">
                                      <strong>
                                        {formData?.tech_mass_chemical} (kg)
                                      </strong>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </>
                        )}
                        {result?.tech_method == "7" && (
                          <>
                            <div className="col-12 overflow-auto grid grid-col-12 gap-2">
                              <table
                                className="col-span-12 md:col-span-8"
                                cellSpacing="0"
                              >
                                <thead>
                                  <tr>
                                    <th className="text-start border-b py-2 pe-2">
                                      Element
                                    </th>
                                    <th className="text-start border-b py-2 px-2">
                                      Number
                                    </th>
                                    <th className="text-start border-b py-2 px-2">
                                      Mass
                                    </th>
                                    <th className="text-start border-b py-2 ps-2">
                                      Percent Composition
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {result?.tech_value1 && (
                                    <tr>
                                      <td className="border-b py-2 pe-2">
                                        <strong className="text-blue">
                                          {result.tech_name1}
                                        </strong>
                                      </td>
                                      <td className="border-b py-2 px-2">
                                        <strong>{result.tech_punk}</strong>
                                      </td>
                                      <td className="border-b py-2 px-2">
                                        <strong>{result.tech_punk1}</strong>
                                      </td>
                                      <td className="border-b py-2 ps-2">
                                        <strong>
                                          {(
                                            (result.tech_punk1 /
                                              result.tech_call) *
                                            100 *
                                            result.tech_punk
                                          ).toFixed(10)}
                                        </strong>
                                      </td>
                                    </tr>
                                  )}
                                  {result?.tech_value2 && (
                                    <tr>
                                      <td className="border-b py-2 pe-2">
                                        <strong className="text-blue">
                                          {result.tech_name2}
                                        </strong>
                                      </td>
                                      <td className="border-b py-2 px-2">
                                        <strong>{result.tech_punk2}</strong>
                                      </td>
                                      <td className="border-b py-2 px-2">
                                        <strong>{result.tech_punk3}</strong>
                                      </td>
                                      <td className="border-b py-2 ps-2">
                                        <strong>
                                          {(
                                            (result.tech_punk3 /
                                              result.tech_call) *
                                            100 *
                                            result.tech_punk2
                                          ).toFixed(10)}
                                        </strong>
                                      </td>
                                    </tr>
                                  )}
                                  {result?.tech_value3 && (
                                    <tr>
                                      <td className="border-b py-2 pe-2">
                                        <strong className="text-blue">
                                          {result.tech_name3}
                                        </strong>
                                      </td>
                                      <td className="border-b py-2 px-2">
                                        <strong>{result.tech_punk4}</strong>
                                      </td>
                                      <td className="border-b py-2 px-2">
                                        <strong>{result.tech_punk5}</strong>
                                      </td>
                                      <td className="border-b py-2 ps-2">
                                        <strong>
                                          {(
                                            (result.tech_punk5 /
                                              result.tech_call) *
                                            100 *
                                            result.tech_punk4
                                          ).toFixed(10)}
                                        </strong>
                                      </td>
                                    </tr>
                                  )}
                                  {result?.tech_value4 && (
                                    <tr>
                                      <td className="border-b py-2 pe-2">
                                        <strong className="text-blue">
                                          {result.tech_name4}
                                        </strong>
                                      </td>
                                      <td className="border-b py-2 px-2">
                                        <strong>{result.tech_punk6}</strong>
                                      </td>
                                      <td className="border-b py-2 px-2">
                                        <strong>{result.tech_punk7}</strong>
                                      </td>
                                      <td className="border-b py-2 ps-2">
                                        <strong>
                                          {(
                                            (result.tech_punk7 /
                                              result.tech_call) *
                                            100 *
                                            result.tech_punk6
                                          ).toFixed(10)}
                                        </strong>
                                      </td>
                                    </tr>
                                  )}
                                  {result?.tech_value5 && (
                                    <tr>
                                      <td className="border-b py-2 pe-2">
                                        <strong className="text-blue">
                                          {result.tech_name5}
                                        </strong>
                                      </td>
                                      <td className="border-b py-2 px-2">
                                        <strong>{result.tech_punk8}</strong>
                                      </td>
                                      <td className="border-b py-2 px-2">
                                        <strong>{result.tech_punk9}</strong>
                                      </td>
                                      <td className="border-b py-2 ps-2">
                                        <strong>
                                          {(
                                            (result.tech_punk9 /
                                              result.tech_call) *
                                            100 *
                                            result.tech_punk8
                                          ).toFixed(10)}
                                        </strong>
                                      </td>
                                    </tr>
                                  )}
                                  {result?.tech_value6 && (
                                    <tr>
                                      <td className="border-b py-2 pe-2">
                                        <strong className="text-blue">
                                          {result.tech_name6}
                                        </strong>
                                      </td>
                                      <td className="border-b py-2 px-2">
                                        <strong>{result.tech_punk10}</strong>
                                      </td>
                                      <td className="border-b py-2 px-2">
                                        <strong>{result.tech_punk11}</strong>
                                      </td>
                                      <td className="border-b py-2 ps-2">
                                        <strong>
                                          {(
                                            (result.tech_punk11 /
                                              result.tech_call) *
                                            100 *
                                            result.tech_punk10
                                          ).toFixed(10)}
                                        </strong>
                                      </td>
                                    </tr>
                                  )}
                                </tbody>
                              </table>
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

export default MassPercentCalculator;

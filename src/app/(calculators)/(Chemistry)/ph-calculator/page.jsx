"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { usePhCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const PhCalculator = () => {
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
    tech_chemical_selection: "1", // 1 2 3 4 5
    tech_chemical_name: "0.00000000013",
    tech_operation: Number(1),
    tech_concentration: Number(4),
    tech_con_units: "M",
    tech_f_length: Number(4),
    tech_fl_units: "ng",
    tech_post_space: Number(4),
    tech_po_units: "mm³",
    tech_second: Number(7),
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateActivationCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = usePhCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
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
        tech_operation: formData.tech_operation,
        tech_concentration: formData.tech_concentration,
        tech_con_units: formData.tech_con_units,
        tech_f_length: formData.tech_f_length,
        tech_fl_units: formData.tech_fl_units,
        tech_post_space: formData.tech_post_space,
        tech_po_units: formData.tech_po_units,
        tech_second: formData.tech_second,
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
      tech_chemical_selection: "1", // 1 2 3 4 5
      tech_chemical_name: "0.00000000013",
      tech_operation: "1",
      tech_concentration: "4",
      tech_con_units: "M",
      tech_f_length: "4",
      tech_fl_units: "ng",
      tech_post_space: "4",
      tech_po_units: "mm³",
      tech_second: "7",
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
    setFormData((prev) => ({ ...prev, tech_con_units: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  //dropdown states
  const [dropdownVisible1, setDropdownVisible1] = useState(false);

  const setUnitHandler1 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_fl_units: unit }));
    setDropdownVisible1(false);
  };

  const toggleDropdown1 = () => {
    setDropdownVisible1(!dropdownVisible1);
  };

  //dropdown states
  const [dropdownVisible2, setDropdownVisible2] = useState(false);

  const setUnitHandler2 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_po_units: unit }));
    setDropdownVisible2(false);
  };

  const toggleDropdown2 = () => {
    setDropdownVisible2(!dropdownVisible2);
  };

  useEffect(() => {
    // For setting tech_operation
    if (["1", "2", "3", "4"].includes(formData.tech_chemical_selection)) {
      setFormData((prevData) => ({
        ...prevData,
        tech_operation: 1, // Default [H⁺]
      }));
    }

    // For setting tech_chemical_name
    if (formData.tech_chemical_selection === "3") {
      setFormData((prev) => ({
        ...prev,
        tech_chemical_name: "0.0069&141.94",
      }));
    } else if (formData.tech_chemical_selection === "4") {
      setFormData((prev) => ({
        ...prev,
        tech_chemical_name: "0.00000000043&93.13",
      }));
    } else if (formData.tech_chemical_selection === "1") {
      setFormData((prev) => ({
        ...prev,
        tech_chemical_name: "0.0069",
      }));
    } else if (formData.tech_chemical_selection === "2") {
      setFormData((prev) => ({
        ...prev,
        tech_chemical_name: "0.00000000043",
      }));
    }
  }, [formData.tech_chemical_selection]);

  // Best Solution (Reusable function banake):
  const formatNumberSmart = (num) => {
    const number = Number(num);
    if (isNaN(number)) return "0";
    return Math.abs(number) >= 1e6 || (Math.abs(number) < 1e-4 && number !== 0)
      ? number.toExponential(6)
      : number.toLocaleString(undefined, { maximumFractionDigits: 6 });
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
            <div className="grid grid-cols-1  lg:grid-cols-2 md:grid-cols-2 gap-1  md:gap-4">
              <div className="space-y-2 relative">
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
                      {data?.payload?.tech_lang_keys["3"]}{" "}
                    </option>
                    <option value="3">
                      {data?.payload?.tech_lang_keys["4"]}{" "}
                    </option>
                    <option value="4">
                      {data?.payload?.tech_lang_keys["5"]}{" "}
                    </option>
                    <option value="5">[H⁺], [OH⁻], or pOH </option>
                  </select>
                </div>
              </div>

              {(formData.tech_chemical_selection == "1" ||
                formData.tech_chemical_selection == "2" ||
                formData.tech_chemical_selection == "3" ||
                formData.tech_chemical_selection == "4") && (
                <>
                  <div className="space-y-2 relative" id="selection2">
                    {formData.tech_chemical_selection == "1" && (
                      <>
                        <label htmlFor="tech_chemical_name" className="label">
                          {data?.payload?.tech_lang_keys["6"]}:
                        </label>
                      </>
                    )}
                    {formData.tech_chemical_selection == "2" && (
                      <>
                        <label htmlFor="tech_chemical_name" className="label">
                          Base:
                        </label>
                      </>
                    )}
                    {formData.tech_chemical_selection == "3" && (
                      <>
                        <label htmlFor="tech_chemical_name" className="label">
                          {data?.payload?.tech_lang_keys["6"]}:
                        </label>
                      </>
                    )}
                    {formData.tech_chemical_selection == "4" && (
                      <>
                        <label htmlFor="tech_chemical_name" className="label">
                          Base:
                        </label>
                      </>
                    )}
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
                            <option value="0.000018">
                              Acetic acid - CH₃COOH
                            </option>
                            <option value="0.0069">
                              Arsenic acid - H₃AsO₄
                            </option>
                            <option value="0.00000000059">
                              Arsenious acid - H₃AsO₃
                            </option>
                            <option value="0.000065">
                              Benzoic acid - C₆H₅COOH
                            </option>
                            <option value="0.00000000058">
                              Boric acid - H₃BO₃
                            </option>
                            <option value="0.00000045">
                              Carbonic acid - H₂CO₃
                            </option>
                            <option value="0.0007447">
                              Citric acid - C₃H₅O(COOH)₃
                            </option>
                            <option value="0.00018">Formic acid - HCOOH</option>
                            <option value="0.00000000072">
                              Hydrocyanic acid - HCN
                            </option>
                            <option value="0.00063">
                              Hydrofluoric acid - HF
                            </option>
                            <option value="0.0000001">
                              Hydrosulfuric acid - H₂S
                            </option>
                            <option value="10000000">
                              Hydrochloric acid - HCl
                            </option>
                            <option value="0.00000005">
                              Hypochlorous acid - HClO
                            </option>
                            <option value="1">Perchloric acid - HClO₄</option>
                            <option value="0.011">Chlorous acid - HClO₂</option>
                            <option value="1000">Sulfuric acid - H₂SO₄</option>
                            <option value="0.015">
                              Sulfurous acid - H₂SO₃
                            </option>
                            <option value="27.5">Nitric acid - HNO₃</option>
                            <option value="0.00051">Nitrous acid - HNO₂</option>
                            <option value="0.00000000013">
                              Phenol - C₆H₅OH
                            </option>
                            <option value="0.0069">
                              Phosphoric acid - H₃PO₄
                            </option>
                            <option value="0.05">
                              Phosphorous acid - H₃PO₃
                            </option>
                          </>
                        )}
                        {formData.tech_chemical_selection == "2" && (
                          <>
                            <option value="0.63">
                              sodium hydroxide - NaOH
                            </option>
                            <option value="0.00000000043">
                              aniline - C₆H₅NH₂
                            </option>
                            <option value="0.000018">ammonia - NH₃</option>
                            <option value="0.0025">
                              magnesium hydroxide - Mg(OH)₂
                            </option>
                            <option value="0.00013">
                              iron (II) hydroxide - Fe(OH)₂
                            </option>
                            <option value="2.3">
                              lithium hydroxide - LiOH
                            </option>
                            <option value="0.0000000014">
                              aluminium hydroxide - Al(OH)₃
                            </option>
                          </>
                        )}
                        {formData.tech_chemical_selection == "3" && (
                          <>
                            <option value="0.000018&60.052">
                              Acetic acid - CH₃COOH
                            </option>
                            <option value="0.0069&141.94">
                              Arsenic acid - H₃AsO₄
                            </option>
                            <option value="0.00000000059&125.94">
                              Arsenious acid - H₃AsO₃
                            </option>
                            <option value="0.000065&122.123">
                              Benzoic acid - C₆H₅COOH
                            </option>
                            <option value="0.00000000058&61.83">
                              Boric acid - H₃BO₃
                            </option>
                            <option value="0.00000045&62.024">
                              Carbonic acid - H₂CO₃
                            </option>
                            <option value="0.0007447&192.124">
                              Citric acid - C₃H₅O(COOH)₃
                            </option>
                            <option value="0.00018&46.025">
                              Formic acid - HCOOH
                            </option>
                            <option value="0.00000000072&27.0253">
                              Hydrocyanic acid - HCN
                            </option>
                            <option value="0.00063&20.0063">
                              Hydrofluoric acid - HF
                            </option>
                            <option value="0.0000001&34.0809">
                              Hydrosulfuric acid - H₂S
                            </option>
                            <option value="10000000&36.46">
                              Hydrochloric acid - HCl
                            </option>
                            <option value="0.00000005&52.46">
                              Hypochlorous acid - HClO
                            </option>
                            <option value="1&100.46">
                              Perchloric acid - HClO₄
                            </option>
                            <option value="0.011&68.46">
                              Chlorous acid - HClO₂
                            </option>
                            <option value="1000&98.079">
                              Sulfuric acid - H₂SO₄
                            </option>
                            <option value="0.015&82.07">
                              Sulfurous acid - H₂SO₃
                            </option>
                            <option value="27.5&63.01">
                              Nitric acid - HNO₃
                            </option>
                            <option value="0.00051&47.013">
                              Nitrous acid - HNO₂
                            </option>
                            <option value="0.00000000013&94.11">
                              Phenol - C₆H₅OH
                            </option>
                            <option value="0.0069&97.994">
                              Phosphoric acid - H₃PO₄
                            </option>
                            <option value="0.05&82">
                              Phosphorous acid - H₃PO₃
                            </option>
                          </>
                        )}
                        {formData.tech_chemical_selection == "4" && (
                          <>
                            <option value="0.63&39.997">
                              sodium hydroxide - NaOH
                            </option>
                            <option value="0.00000000043&93.13">
                              aniline - C₆H₅NH₂
                            </option>
                            <option value="0.000018&17.031">
                              ammonia - NH₃
                            </option>
                            <option value="0.0025&58.3197">
                              magnesium hydroxide - Mg(OH)₂
                            </option>
                            <option value="0.00013&89.86">
                              iron (II) hydroxide - Fe(OH)₂
                            </option>
                            <option value="2.3&23.95">
                              lithium hydroxide - LiOH
                            </option>
                            <option value="0.0000000014&78">
                              aluminium hydroxide - Al(OH)₃
                            </option>
                          </>
                        )}
                      </select>
                    </div>
                  </div>
                </>
              )}
              {formData.tech_chemical_selection == "5" && (
                <>
                  <div className="space-y-2 relative " id="selection">
                    <label htmlFor="tech_operation" className="label">
                      {data?.payload?.tech_lang_keys["7"]}:
                    </label>
                    <div className="mt-2">
                      <select
                        className="input"
                        aria-label="select"
                        name="tech_operation"
                        id="tech_operation"
                        value={formData.tech_operation}
                        onChange={handleChange}
                      >
                        <option value="1">[H⁺]</option>
                        <option value="2">pOH</option>
                        <option value="3">[OH⁻]</option>
                      </select>
                    </div>
                  </div>
                </>
              )}
              {(formData.tech_operation === "1" ||
                formData.tech_operation === "3" ||
                ((formData.tech_chemical_selection === "1" ||
                  formData.tech_chemical_selection === "2" ||
                  formData.tech_chemical_selection === "5") &&
                  formData.tech_operation !== "2")) && (
                <>
                  <div className="space-y-2" id="third">
                    <label htmlFor="tech_concentration" className="label">
                      {data?.payload?.tech_lang_keys["8"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_concentration"
                        step="any"
                        className="input"
                        value={formData.tech_concentration}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown}
                      >
                        {formData.tech_con_units} ▾
                      </label>
                      {dropdownVisible && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "molars (M)", value: "M" },
                            { label: "millimolars (mM)", value: "mM" },
                            { label: "micromolars (µM)", value: "µM" },
                            { label: "nanomolars (nM)", value: "nM" },
                            { label: "picomolars (pM)", value: "pM" },
                            { label: "femtomolars (fM)", value: "fM" },
                            { label: "attomolars (aM)", value: "aM" },
                            { label: "zeptomolars (zM)", value: "zM" },
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

              {(formData.tech_chemical_selection == "3" ||
                formData.tech_chemical_selection == "4") && (
                <>
                  <div className="space-y-2" id="weight">
                    <label htmlFor="tech_f_length" className="label">
                      {data?.payload?.tech_lang_keys["9"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_f_length"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_f_length}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown1}
                      >
                        {formData.tech_fl_units} ▾
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
                            { label: "tons (t)", value: "t" },
                            { label: "grain (gr)", value: "gr" },
                            { label: "dram (dr)", value: "dr" },
                            { label: "pounds (lbs)", value: "lbs" },
                            { label: "stones", value: "stones" },
                            { label: "oz t", value: "oz t" },
                            { label: "oz", value: "oz" },
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
              {(formData.tech_chemical_selection == "3" ||
                formData.tech_chemical_selection == "4") && (
                <>
                  <div className="space-y-2" id="volume">
                    <label htmlFor="tech_post_space" className="label">
                      {data?.payload?.tech_lang_keys["10"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_post_space"
                        step="any"
                        className="mt-1 input"
                        value={formData.tech_post_space}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown2}
                      >
                        {formData.tech_po_units} ▾
                      </label>
                      {dropdownVisible2 && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "cubic millimeters (mm³)", value: "mm³" },
                            { label: "cubic centimeters (cm³)", value: "cm³" },
                            { label: "cubic decimeters (dm³)", value: "dm³" },
                            { label: "cubic meters (m³)", value: "m³" },
                            { label: "cubic inches (in³)", value: "in³" },
                            { label: "cubic feet (ft³)", value: "ft³" },
                            { label: "milliliters (ml)", value: "ml" },
                            { label: "centiliters (cl)", value: "cl" },
                            { label: "liters", value: "liters" },
                            { label: "US gallons (US gal)", value: "US gal" },
                            { label: "UK gallons (UK gal)", value: "UK gal" },
                            {
                              label: "US fluid ounces (US fl oz)",
                              value: "US fl oz",
                            },
                            {
                              label: "UK fluid ounces (UK fl oz)",
                              value: "UK fl oz",
                            },
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

              {formData.tech_operation == "2" && (
                <>
                  <div className="space-y-2 relative " id="selection">
                    <label htmlFor="tech_second" className="label">
                      PoH:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_second"
                        id="tech_second"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_second}
                        onChange={handleChange}
                      />
                      <span className="input_unit">{currency.symbol}</span>
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
                    <div className="w-full rounded-lg mt-3 text-[16px] md:text-[20px]">
                      <div className="w-full mt-2">
                        {result?.tech_pH && (
                          <>
                            <p className="text-xl font-semibold">pH:</p>
                            <p className="text-[#119154] text-3xl font-semibold">
                              {formatNumberSmart(result?.tech_pH)}
                            </p>
                          </>
                        )}
                        <div className="w-full overflow-auto mt-3">
                          <table className="w-full lg:w-1/2 border-collapse text-[16px]">
                            <tbody>
                              {result?.tech_H && (
                                <>
                                  <tr>
                                    <td className="border-b py-2 font-semibold">
                                      [H⁺]
                                    </td>
                                    <td className="border-b py-2 font-semibold">
                                      {formatNumberSmart(result?.tech_H)}
                                    </td>
                                  </tr>
                                </>
                              )}

                              {result?.tech_pho && (
                                <>
                                  <tr>
                                    <td className="border-b py-2 font-semibold">
                                      pOH
                                    </td>
                                    <td className="border-b py-2 font-semibold">
                                      {formatNumberSmart(result?.tech_pho)}
                                    </td>
                                  </tr>
                                </>
                              )}

                              {result?.tech_OH && (
                                <>
                                  <tr>
                                    <td className="border-b py-2 font-semibold">
                                      OH⁻
                                    </td>
                                    <td className="border-b py-2 font-semibold">
                                      {formatNumberSmart(result?.tech_OH)}
                                    </td>
                                  </tr>
                                </>
                              )}
                              {result?.tech_pka && (
                                <>
                                  <tr>
                                    <td className="border-b py-2 font-semibold">
                                      Pka:
                                    </td>
                                    <td className="border-b py-2 font-semibold">
                                      {formatNumberSmart(result?.tech_pka)}
                                    </td>
                                  </tr>
                                </>
                              )}
                            </tbody>
                          </table>
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

export default PhCalculator;

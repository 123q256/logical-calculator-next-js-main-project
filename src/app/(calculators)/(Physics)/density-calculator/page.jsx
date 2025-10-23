"use client";

import React, { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useDensityCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const DensityCalculator = () => {
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
    tech_calc: "simple",
    tech_to_cals: "density", // volume  density mass
    tech_dens_unt: "kg/m³",
    tech_volu_unt: "m³",
    tech_mass_unt: "kg",
    tech_dns: "10",
    tech_sldns: "kg/m³",
    tech_vol: "32",
    tech_slvol: "m³",
    tech_mas: "9",
    tech_slmas: "kg",
    tech_lgn: "50",
    tech_sllgn: "cm",
    tech_wdt: "40",
    tech_slwdt: "cm",
    tech_hgt: "40",
    tech_slhgt: "cm",
    tech_sladvol: "m³",
    tech_dens_lok_unt: "kg/m³",
    tech_slcat: "metals",
    tech_slmtl: "aluminum",
    tech_slmtl_no: "concrete",
    tech_slgas: "air0",
    tech_sllqd: "cooking_oil",
    tech_slastr: "earth",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useDensityCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_calc) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_calc: formData.tech_calc,
        tech_to_cals: formData.tech_to_cals,
        tech_dens_unt: formData.tech_dens_unt,
        tech_volu_unt: formData.tech_volu_unt,
        tech_mass_unt: formData.tech_mass_unt,
        tech_dns: formData.tech_dns,
        tech_sldns: formData.tech_sldns,
        tech_vol: formData.tech_vol,
        tech_slvol: formData.tech_slvol,
        tech_mas: formData.tech_mas,
        tech_slmas: formData.tech_slmas,
        tech_lgn: formData.tech_lgn,
        tech_sllgn: formData.tech_sllgn,
        tech_wdt: formData.tech_wdt,
        tech_slwdt: formData.tech_slwdt,
        tech_hgt: formData.tech_hgt,
        tech_slhgt: formData.tech_slhgt,
        tech_sladvol: formData.tech_sladvol,
        tech_dens_lok_unt: formData.tech_dens_lok_unt,
        tech_slcat: formData.tech_slcat,
        tech_slmtl: formData.tech_slmtl,
        tech_slmtl_no: formData.tech_slmtl_no,
        tech_slgas: formData.tech_slgas,
        tech_sllqd: formData.tech_sllqd,
        tech_slastr: formData.tech_slastr,
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
      tech_calc: "simple",
      tech_to_cals: "density", // volume  density mass
      tech_dens_unt: "kg/m³",
      tech_volu_unt: "m³",
      tech_mass_unt: "kg",
      tech_dns: "10",
      tech_sldns: "kg/m³",
      tech_vol: "32",
      tech_slvol: "m³",
      tech_mas: "9",
      tech_slmas: "kg",
      tech_lgn: "50",
      tech_sllgn: "cm",
      tech_wdt: "40",
      tech_slwdt: "cm",
      tech_hgt: "40",
      tech_slhgt: "cm",
      tech_sladvol: "m³",
      tech_dens_lok_unt: "kg/m³",
      tech_slcat: "metals",
      tech_slmtl: "aluminum",
      tech_slmtl_no: "concrete",
      tech_slgas: "air0",
      tech_sllqd: "cooking_oil",
      tech_slastr: "earth",
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

  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef(null);

  // For sliding animation, we use maxHeight
  const [maxHeight, setMaxHeight] = useState("0px");

  useEffect(() => {
    if (isOpen) {
      setMaxHeight(contentRef.current.scrollHeight + "px");
    } else {
      setMaxHeight("0px");
    }
  }, [isOpen]);

  // Toggle open state
  const toggleOpen = () => setIsOpen(!isOpen);

  // density
  const [tech_slcat, setTechSlcat] = React.useState("default_value");

  // State for each select input
  const [densLokUnt, setDensLokUnt] = useState("kg/dm³");
  const [densLokCat, setDensLokCat] = useState("metals");
  const [densCatMtl, setDensCatMtl] = useState("aluminum");
  const [densCatMtlNo, setDensCatMtlNo] = useState("concrete");
  const [densCatGas, setDensCatGas] = useState("air0");
  const [densCatLqd, setDensCatLqd] = useState("cooking_oil");
  const [densCatAstr, setDensCatAstr] = useState("earth");
  const [densVal, setDensVal] = useState(null);

  // Helper to show/hide categories (optional in React, we just conditionally render)

  useEffect(() => {
    let val;

    if (densLokCat === "metals") {
      if (densCatMtl === "aluminum") val = 2700;
      else if (densCatMtl === "beryllium") val = 1850;
      else if (densCatMtl === "brass") val = 8600;
      else if (densCatMtl === "copper") val = 8940;
      else if (densCatMtl === "gold") val = 19320;
      else if (densCatMtl === "iron") val = 7870;
      else if (densCatMtl === "lead") val = 11340;
      else if (densCatMtl === "magnesium") val = 1740;
      else if (densCatMtl === "mercury") val = 13546;
      else if (densCatMtl === "nickel") val = 8900;
      else if (densCatMtl === "platium") val = 21450;
      else if (densCatMtl === "plutonium") val = 19840;
      else if (densCatMtl === "potassium") val = 860;
      else if (densCatMtl === "silver") val = 10500;
      else if (densCatMtl === "sodium") val = 970;
      else if (densCatMtl === "tin") val = 7310;
      else if (densCatMtl === "titanium") val = 240;
      else if (densCatMtl === "uranium") val = 18800;
      else if (densCatMtl === "zinc") val = 7000;
    } else if (densLokCat === "non-metals") {
      if (densCatMtlNo === "concrete") val = 2400;
      else if (densCatMtlNo === "cork") val = 240;
      else if (densCatMtlNo === "diamond") val = 3500;
      else if (densCatMtlNo === "ice") val = 916.7;
      else if (densCatMtlNo === "nylon") val = 1150;
      else if (densCatMtlNo === "oak") val = 710;
      else if (densCatMtlNo === "pine") val = 373;
      else if (densCatMtlNo === "plastics") val = 1175;
      else if (densCatMtlNo === "styrofoam") val = 75;
      else if (densCatMtlNo === "wood") val = 700;
    } else if (densLokCat === "gases") {
      if (densCatGas === "air0") val = 1.293;
      else if (densCatGas === "air20") val = 1.205;
      else if (densCatGas === "carbon_dioxide0") val = 1.977;
      else if (densCatGas === "carbon_dioxide20") val = 1.842;
      else if (densCatGas === "carbon_monoxide0") val = 1.25;
      else if (densCatGas === "carbon_monoxide20") val = 1.165;
      else if (densCatGas === "hydrogen") val = 0.0898;
      else if (densCatGas === "helium") val = 0.179;
      else if (densCatGas === "methane0") val = 0.717;
      else if (densCatGas === "methane20") val = 0.688;
      else if (densCatGas === "nitrogen0") val = 1.2506;
      else if (densCatGas === "nitrogen20") val = 1.165;
      else if (densCatGas === "oxygen0") val = 1.429;
      else if (densCatGas === "oxygen20") val = 1.331;
      else if (densCatGas === "propane20") val = 1.882;
      else if (densCatGas === "water_vapor") val = 0.804;
    } else if (densLokCat === "liquids") {
      if (densCatLqd === "cooking_oil") val = 920;
      else if (densCatLqd === "liquid_hydrogen") val = 70;
      else if (densCatLqd === "liquid_oxygen") val = 1141;
      else if (densCatLqd === "water_fresh") val = 1000;
      else if (densCatLqd === "water_salt") val = 1030;
    } else if (densLokCat === "astronomy") {
      if (densCatAstr === "earth") val = 5515;
      else if (densCatAstr === "earth_core") val = 13000;
      else if (densCatAstr === "sun_core_min") val = 33000;
      else if (densCatAstr === "sun_core_max") val = 160000;
      else if (densCatAstr === "super_black_hole") val = 900000;
      else if (densCatAstr === "dwarf_star") val = 2100000000;
      else if (densCatAstr === "atomic_nuclei") val = 230000000000000000;
      else if (densCatAstr === "neutron_star") val = 480000000000000000;
      else if (densCatAstr === "stellar_black_hole") val = 1000000000000000000;
    }

    // Unit conversions
    if (
      densLokUnt === "kg/dm³" ||
      densLokUnt === "kg/L" ||
      densLokUnt === "g/mL" ||
      densLokUnt === "t/m³" ||
      densLokUnt === "g/cm³"
    ) {
      val = val / 1000;
    } else if (densLokUnt === "oz/cu_in") {
      val = val / 1730;
    } else if (densLokUnt === "lb/cu_in") {
      val = val / 27680;
    } else if (densLokUnt === "lb/cu_ft") {
      val = val / 16.018;
    } else if (densLokUnt === "lb/cu_yd") {
      val = val * 1.6855549959513;
    } else if (densLokUnt === "lb/us_gal") {
      val = val / 120;
    } else if (densLokUnt === "g/l") {
      val = val;
    } else if (densLokUnt === "g/dl") {
      val = val / 10;
    } else if (densLokUnt === "mg/l") {
      val = val * 1000;
    }

    setDensVal(val);
  }, [
    densLokUnt,
    densLokCat,
    densCatMtl,
    densCatMtlNo,
    densCatGas,
    densCatLqd,
    densCatAstr,
  ]);

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
            <div className="col-12  mx-auto mt-2  w-full">
              <div className="col-lg-2 font-s-14 hidden d-lg-block">
                {data?.payload?.tech_lang_keys["3"]}:
              </div>
              <input
                type="hidden"
                name="tech_to_cals"
                id="calculator_time"
                value={formData.tech_to_cals}
              />
              <div className="flex flex-wrap items-center bg-blue-100 border border-blue-500 text-center rounded-lg px-1">
                {/* Date Cal Tab */}
                <div className="lg:w-1/3 w-full px-2 py-1">
                  <div
                    className={`bg-white px-3 py-2 cursor-pointer rounded-md transition-colors duration-300 hover_tags hover:text-white pacetab  ${
                      formData.tech_to_cals === "density" ? "tagsUnit" : ""
                    }`}
                    id="density"
                    onClick={() => {
                      setFormData({ ...formData, tech_to_cals: "density" });
                      setResult(null);
                      setFormError(null);
                    }}
                  >
                    {data?.payload?.tech_lang_keys["4"]}
                  </div>
                </div>
                {/* Time Cal Tab */}
                <div className="lg:w-1/3 w-full px-2 py-1">
                  <div
                    className={`bg-white px-3 py-2 cursor-pointer rounded-md transition-colors duration-300 hover_tags hover:text-white pacetab ${
                      formData.tech_to_cals === "volume" ? "tagsUnit" : ""
                    }`}
                    id="volume"
                    onClick={() => {
                      setFormData({ ...formData, tech_to_cals: "volume" });
                      setResult(null);
                      setFormError(null);
                    }}
                  >
                    {data?.payload?.tech_lang_keys["5"]}
                  </div>
                </div>
                <div className="lg:w-1/3 w-full px-2 py-1">
                  <div
                    className={`bg-white px-3 py-2 cursor-pointer rounded-md transition-colors duration-300 hover_tags hover:text-white pacetab ${
                      formData.tech_to_cals === "mass" ? "tagsUnit" : ""
                    }`}
                    id="mass"
                    onClick={() => {
                      setFormData({ ...formData, tech_to_cals: "mass" });
                      setResult(null);
                      setFormError(null);
                    }}
                  >
                    {data?.payload?.tech_lang_keys["6"]}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-12   mt-3  gap-4">
                <div className="col-span-12">
                  <div className="grid grid-cols-12 gap-4">
                    {formData.tech_to_cals == "density" && (
                      <>
                        <div
                          className="col-span-12 md:col-span-6 lg:col-span-6"
                          id="dens_unt"
                        >
                          <label htmlFor="tech_dens_unt" className="label">
                            {data?.payload?.tech_lang_keys["7"]}:
                          </label>
                          <div className="mt-2">
                            <select
                              className="input"
                              aria-label="select"
                              name="tech_dens_unt"
                              id="tech_dens_unt"
                              value={formData.tech_dens_unt}
                              onChange={handleChange}
                            >
                              {[
                                "kg/m³",
                                "kg/dm³",
                                "kg/L",
                                "g/mL",
                                "t/m³",
                                "g/cm³",
                                "oz/cu_in",
                                "lb/cu_in",
                                "lb/cu_ft",
                                "lb/cu_yd",
                                "lb/us_gal",
                                "g/l",
                                "g/dl",
                                "mg/l",
                              ].map((unit, index) => (
                                <option key={index} value={unit}>
                                  {unit}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </>
                    )}
                    {formData.tech_to_cals == "volume" && (
                      <>
                        <div
                          className="col-span-12 md:col-span-6 lg:col-span-6"
                          id="volu_unt"
                        >
                          <label htmlFor="tech_volu_unt" className="label">
                            {data?.payload?.tech_lang_keys["9"]}:
                          </label>
                          <div className="mt-2">
                            <select
                              className="input"
                              aria-label="select"
                              name="tech_volu_unt"
                              id="tech_volu_unt"
                              value={formData.tech_volu_unt}
                              onChange={handleChange}
                            >
                              {[
                                { name: "m³", val: "m³" },
                                { name: "mm³", val: "mm³" },
                                { name: "cm³", val: "cm³" },
                                { name: "dm³", val: "dm³" },
                                { name: "cu in", val: "cu_in" },
                                { name: "cu ft", val: "cu_ft" },
                                { name: "cu yd", val: "cu_yd" },
                                { name: "ml", val: "ml" },
                                { name: "cl", val: "cl" },
                                { name: "liters", val: "liters" },
                                { name: "hl", val: "hl" },
                                { name: "US gal", val: "US_gal" },
                                { name: "UK gal", val: "UK_gal" },
                                { name: "US fl oz", val: "US_fl_oz" },
                                { name: "UK fl oz", val: "UK_fl_oz" },
                                { name: "cups", val: "cups" },
                                { name: "tbsp", val: "tbsp" },
                                { name: "tsp", val: "tsp" },
                                { name: "US qt", val: "US_qt" },
                                { name: "UK qt", val: "UK_qt" },
                                { name: "US pt", val: "US_pt" },
                                { name: "UK pt", val: "UK_pt" },
                              ].map((unit, index) => (
                                <option key={index} value={unit.val}>
                                  {unit.name}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </>
                    )}
                    {formData.tech_to_cals == "mass" && (
                      <>
                        <div
                          className="col-span-12 md:col-span-6 lg:col-span-6"
                          id="mass_unt"
                        >
                          <label htmlFor="tech_mass_unt" className="label">
                            {data?.payload?.tech_lang_keys["10"]}:
                          </label>
                          <div className="mt-2">
                            <select
                              className="input"
                              aria-label="select"
                              name="tech_mass_unt"
                              id="tech_mass_unt"
                              value={formData.tech_mass_unt}
                              onChange={handleChange}
                            >
                              {[
                                { name: "kg", val: "kg" },
                                { name: "µg", val: "µg" },
                                { name: "mg", val: "mg" },
                                { name: "g", val: "g" },
                                { name: "dag", val: "dag" },
                                { name: "t", val: "t" },
                                { name: "gr", val: "gr" },
                                { name: "dr", val: "dr" },
                                { name: "oz", val: "oz" },
                                { name: "lb", val: "lb" },
                                { name: "stone", val: "stone" },
                                { name: "US ton", val: "US_ton" },
                                { name: "Long ton", val: "Long_ton" },
                                { name: "Earths", val: "Earths" },
                                { name: "Suns", val: "Suns" },
                                { name: "me", val: "me" },
                                { name: "mp", val: "mp" },
                                { name: "mn", val: "mn" },
                                { name: "u", val: "u" },
                                { name: "oz t", val: "oz_t" },
                              ].map((unit, index) => (
                                <option key={index} value={unit.val}>
                                  {unit.name}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <div className="col-span-12">
                  <div className="grid grid-cols-12 gap-4">
                    {(formData.tech_to_cals == "volume" ||
                      formData.tech_to_cals == "mass") && (
                      <>
                        <div
                          className="col-span-12 md:col-span-6 lg:col-span-6"
                          id="dens_blk_dns"
                        >
                          <label htmlFor="tech_dns" className="label">
                            {data?.payload?.tech_lang_keys["4"]}:
                          </label>
                          <div className="grid grid-cols-12 gap-4">
                            <div className="col-span-6 ">
                              <input
                                type="number"
                                step="any"
                                name="tech_dns"
                                id="tech_dns"
                                className="input "
                                aria-label="input"
                                placeholder="00"
                                value={formData.tech_dns}
                                onChange={handleChange}
                              />
                            </div>
                            <div className="col-span-6 ps-2 ">
                              <div className="">
                                <select
                                  className="input"
                                  aria-label="select"
                                  name="tech_sldns"
                                  id="tech_sldns"
                                  value={formData.tech_sldns}
                                  onChange={handleChange}
                                >
                                  {[
                                    { name: "kg/m³", val: "kg/m³" },
                                    { name: "kg/dm³", val: "kg/dm³" },
                                    { name: "kg/L", val: "kg/L" },
                                    { name: "g/mL", val: "g/mL" },
                                    { name: "t/m³", val: "t/m³" },
                                    { name: "g/cm³", val: "g/cm³" },
                                    { name: "oz/cu in", val: "oz/cu_in" },
                                    { name: "lb/cu in", val: "lb/cu_in" },
                                    { name: "lb/cu ft", val: "lb/cu_ft" },
                                    { name: "lb/cu yd", val: "lb/cu_yd" },
                                    { name: "lb/US gal", val: "lb/us_gal" },
                                    { name: "g/L", val: "g/l" },
                                    { name: "g/dL", val: "g/dl" },
                                    { name: "mg/L", val: "mg/l" },
                                  ].map((unit, index) => (
                                    <option key={index} value={unit.val}>
                                      {unit.name}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    )}

                    {(formData.tech_to_cals == "density" ||
                      formData.tech_to_cals == "mass") && (
                      <>
                        <div
                          className="col-span-12 md:col-span-6 lg:col-span-6"
                          id="dens_blk_vol"
                        >
                          <label htmlFor="tech_vol" className="label">
                            {data?.payload?.tech_lang_keys["5"]}:
                          </label>
                          <div className="grid grid-cols-12 gap-4">
                            <div className="col-span-6 ">
                              <input
                                type="number"
                                step="any"
                                name="tech_vol"
                                id="tech_vol"
                                className="input "
                                aria-label="input"
                                placeholder="00"
                                value={formData.tech_vol}
                                onChange={handleChange}
                              />
                            </div>
                            <div className="col-span-6  ">
                              <select
                                className="input"
                                aria-label="select"
                                name="tech_slvol"
                                id="tech_slvol"
                                value={formData.tech_slvol}
                                onChange={handleChange}
                              >
                                {[
                                  { name: "m³", val: "m³" },
                                  { name: "mm³", val: "mm³" },
                                  { name: "cm³", val: "cm³" },
                                  { name: "dm³", val: "dm³" },
                                  { name: "cu in", val: "cu_in" },
                                  { name: "cu ft", val: "cu_ft" },
                                  { name: "cu yd", val: "cu_yd" },
                                  { name: "ml", val: "ml" },
                                  { name: "cl", val: "cl" },
                                  { name: "liters", val: "liters" },
                                  { name: "hl", val: "hl" },
                                  { name: "US gal", val: "US_gal" },
                                  { name: "UK gal", val: "UK_gal" },
                                  { name: "US fl oz", val: "US_fl_oz" },
                                  { name: "UK fl oz", val: "UK_fl_oz" },
                                  { name: "cups", val: "cups" },
                                  { name: "tbsp", val: "tbsp" },
                                  { name: "tsp", val: "tsp" },
                                  { name: "US qt", val: "US_qt" },
                                  { name: "UK qt", val: "UK_qt" },
                                  { name: "US pt", val: "US_pt" },
                                  { name: "UK pt", val: "UK_pt" },
                                ].map((unit, index) => (
                                  <option key={index} value={unit.val}>
                                    {unit.name}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                        </div>
                      </>
                    )}

                    {(formData.tech_to_cals == "density" ||
                      formData.tech_to_cals == "volume") && (
                      <>
                        <div
                          className="col-span-12 md:col-span-6 lg:col-span-6"
                          id="dens_blk_mas"
                        >
                          <label htmlFor="tech_vol" className="label">
                            {data?.payload?.tech_lang_keys["6"]}:
                          </label>
                          <div className="grid grid-cols-12 gap-4">
                            <div className="col-span-6 ">
                              <input
                                type="number"
                                step="any"
                                name="tech_mas"
                                id="tech_mas"
                                className="input"
                                aria-label="input"
                                placeholder="00"
                                value={formData.tech_mas}
                                onChange={handleChange}
                              />
                            </div>
                            <div className="col-span-6 ps-2 ">
                              <select
                                className="input"
                                aria-label="select"
                                name="tech_slmas"
                                id="tech_slmas"
                                value={formData.tech_slmas}
                                onChange={handleChange}
                              >
                                {[
                                  { name: "kg", val: "kg" },
                                  { name: "µg", val: "µg" },
                                  { name: "mg", val: "mg" },
                                  { name: "g", val: "g" },
                                  { name: "dag", val: "dag" },
                                  { name: "t", val: "t" },
                                  { name: "gr", val: "gr" },
                                  { name: "dr", val: "dr" },
                                  { name: "oz", val: "oz" },
                                  { name: "lb", val: "lb" },
                                  { name: "stone", val: "stone" },
                                  { name: "US ton", val: "US_ton" },
                                  { name: "Long ton", val: "Long_ton" },
                                  { name: "Earths", val: "Earths" },
                                  { name: "Suns", val: "Suns" },
                                  { name: "me", val: "me" },
                                  { name: "mp", val: "mp" },
                                  { name: "mn", val: "mn" },
                                  { name: "u", val: "u" },
                                  { name: "oz t", val: "oz_t" },
                                ].map((unit, index) => (
                                  <option key={index} value={unit.val}>
                                    {unit.name}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                        </div>
                      </>
                    )}

                    {/* <div className="col-span-12 md:col-span-6 lg:col-span-6" id="dens_blk_lgn">
                                <label htmlFor="tech_lgn" className="label">
                                  {data?.payload?.tech_lang_keys["11"]}:
                                    </label>
                                <div className="grid grid-cols-12 gap-4">
                                    <div className="col-span-6  "> 
                                        <input
                                              type="number"
                                              step="any"
                                              name="tech_lgn"
                                              id="tech_lgn"
                                              className="input"
                                              aria-label="input"
                                              placeholder="00"
                                              value={formData.tech_lgn}
                                              onChange={handleChange}
                                            />
                                    </div>
                                    <div className="col-span-6 "> 
                                    <select
                                        className="input"
                                        aria-label="select"
                                        name="tech_sllgn"
                                        id="tech_sllgn"
                                        value={formData.tech_sllgn}
                                        onChange={handleChange}
                                      >
                                        {[
                                          { name: "cm", val: "cm" },
                                          { name: "mm", val: "mm" },
                                          { name: "m", val: "m" },
                                          { name: "in", val: "in" },
                                          { name: "ft", val: "ft" },
                                          { name: "yd", val: "yd" }
                                        ].map((unit, index) => (
                                          <option key={index} value={unit.val}>
                                            {unit.name}
                                          </option>
                                        ))}
                                      </select>
                                    </div>
                                </div>
                            </div>
                            <div className="col-span-12 md:col-span-6 lg:col-span-6" id="dens_blk_wdt">
                                <label htmlFor="tech_lgn" className="label">
                                  {data?.payload?.tech_lang_keys["12"]}:
                                    </label>
                                <div className="grid grid-cols-12 gap-4">
                                    <div className="col-span-6  "> 
                                        <input
                                              type="number"
                                              step="any"
                                              name="tech_wdt"
                                              id="tech_wdt"
                                              className="input "
                                              aria-label="input"
                                              placeholder="00"
                                              value={formData.tech_wdt}
                                              onChange={handleChange}
                                            />

                                    </div>
                                    <div className="col-span-6 "> 
                                    <select
                                    className="input"
                                    aria-label="select"
                                    name="tech_slwdt"
                                    id="tech_slwdt"
                                    value={formData.tech_slwdt}
                                    onChange={handleChange}
                                  >
                                    {[
                                      { name: "cm", val: "cm" },
                                      { name: "mm", val: "mm" },
                                      { name: "m", val: "m" },
                                      { name: "in", val: "in" },
                                      { name: "ft", val: "ft" },
                                      { name: "yd", val: "yd" }
                                    ].map((unit, index) => (
                                      <option key={index} value={unit.val}>
                                        {unit.name}
                                      </option>
                                    ))}
                                  </select>

                                    </div>
                                </div>
                            </div>
                            <div className="col-span-12 md:col-span-6 lg:col-span-6" id="dens_blk_hgt">
                              <label htmlFor="tech_lgn" className="label">
                                  {data?.payload?.tech_lang_keys["13"]}:
                                  </label>
                                <div className="grid grid-cols-12 gap-4">
                                    <div className="col-span-6  "> 
                                        <input
                                              type="number"
                                              step="any"
                                              name="tech_hgt"
                                              id="tech_hgt"
                                              className="input"
                                              aria-label="input"
                                              placeholder="00"
                                              value={formData.tech_hgt}
                                              onChange={handleChange}
                                            />
                                    </div>
                                    <div className="col-span-6"> 
                                      <select
                                        className="input"
                                        aria-label="select"
                                        name="tech_slhgt"
                                        id="tech_slhgt"
                                        value={formData.tech_slhgt}
                                        onChange={handleChange}
                                      >
                                        {[
                                          { name: "cm", val: "cm" },
                                          { name: "mm", val: "mm" },
                                          { name: "m", val: "m" },
                                          { name: "in", val: "in" },
                                          { name: "ft", val: "ft" },
                                          { name: "yd", val: "yd" }
                                        ].map((unit, index) => (
                                          <option key={index} value={unit.val}>
                                            {unit.name}
                                          </option>
                                        ))}
                                      </select>

                                    </div>
                                </div>
                            </div>
                            <div className="col-span-12 md:col-span-6 lg:col-span-6" id="dens_adv_vol">
                              <label htmlFor="tech_sladvol" className="label">
                              {data?.payload?.tech_lang_keys["9"]}:
                            </label>
                              <div className="mt-2">
                                <select
                                  className="input"
                                  aria-label="select"
                                  name="tech_sladvol"
                                  id="tech_sladvol"
                                  value={formData.tech_sladvol}
                                  onChange={handleChange}
                                >
                                  <option value="m³">m³</option>
                                  <option value="mm³">mm³</option>
                                  <option value="cm³">cm³</option>
                                  <option value="dm³">dm³</option>
                                  <option value="cu_in">cu in</option>
                                  <option value="cu_ft">cu ft</option>
                                  <option value="cu_yd">cu yd</option>
                                  <option value="ml">ml</option>
                                  <option value="cl">cl</option>
                                  <option value="liters">liters</option>
                                  <option value="hl">hl</option>
                                  <option value="US_gal">US gal</option>
                                  <option value="UK_gal">UK gal</option>
                                  <option value="US_fl_oz">US fl oz</option>
                                  <option value="UK_fl_oz">UK fl oz</option>
                                  <option value="cups">cups</option>
                                  <option value="tbsp">tbsp</option>
                                  <option value="tsp">tsp</option>
                                  <option value="US_qt">US qt</option>
                                  <option value="UK_qt">UK qt</option>
                                  <option value="US_pt">US pt</option>
                                  <option value="UK_pt">UK pt</option>
                                </select>
                              </div>

                            </div> */}
                  </div>
                </div>
              </div>

              {/* Clickable header with arrow */}
              <div
                className="col-span-12 cursor-pointer current_gpa flex items-center justify-center my-3 gap-3 select-none mt-5"
                onClick={toggleOpen}
                role="button"
                aria-expanded={isOpen}
              >
                <strong className="text-[16px]">
                  {data?.payload?.tech_lang_keys["14"]}
                </strong>
                <img
                  src="/images/new-down.png"
                  width="16"
                  height="16"
                  alt="Toggle"
                  className={`mt-1 max-w-[16px] transition-transform duration-300 ease-in-out ${
                    isOpen ? "rotate-90" : "rotate-0"
                  }`}
                />
              </div>

              {/* The sliding content */}
              <div
                ref={contentRef}
                style={{
                  maxHeight: maxHeight,
                  overflow: "hidden",
                  transition: "max-height 0.5s ease",
                }}
                className="col-span-12 "
              >
                <div className="grid grid-cols-12 gap-4 bordered rounded-lg pb-2 p-3">
                  {/* Unit Selector */}
                  <div className="col-span-12" id="dens_lok_unt">
                    <p className="label">
                      {data?.payload?.tech_lang_keys["7"]}
                    </p>
                    <select
                      className="input dens_lok_answer"
                      aria-label="select"
                      name="tech_dens_lok_unt"
                      id="tech_dens_lok_unt"
                      value={densLokUnt}
                      onChange={(e) => setDensLokUnt(e.target.value)}
                    >
                      <option value="kg/m³">kg/m³</option>
                      <option value="kg/dm³">kg/dm³</option>
                      <option value="kg/L">kg/L</option>
                      <option value="g/mL">g/mL</option>
                      <option value="t/m³">t/m³</option>
                      <option value="g/cm³">g/cm³</option>
                      <option value="oz/cu_in">oz/cu in</option>
                      <option value="lb/cu_in">lb/cu in</option>
                      <option value="lb/cu_ft">lb/cu ft</option>
                      <option value="lb/cu_yd">lb/cu yd</option>
                      <option value="lb/us_gal">lb/US gal</option>
                      <option value="g/l">g/L</option>
                      <option value="g/dl">g/dL</option>
                      <option value="mg/l">mg/L</option>
                    </select>
                  </div>
                  {/* Category Selector */}
                  <div className="col-span-4" id="dens_lok_cat">
                    <p className="label">
                      {data?.payload?.tech_lang_keys["15"]}
                    </p>
                    <select
                      className="input dens_lok_answer mt-3"
                      aria-label="select"
                      name="tech_slcat"
                      id="tech_slcat"
                      value={densLokCat}
                      onChange={(e) => setDensLokCat(e.target.value)}
                    >
                      <option value="metals">
                        {data?.payload?.tech_lang_keys["17"]}
                      </option>
                      <option value="non-metals">
                        {data?.payload?.tech_lang_keys["18"]}
                      </option>
                      <option value="gases">
                        {data?.payload?.tech_lang_keys["19"]}
                      </option>
                      <option value="liquids">
                        {data?.payload?.tech_lang_keys["20"]}
                      </option>
                      <option value="astronomy">
                        {data?.payload?.tech_lang_keys["21"]}
                      </option>
                    </select>
                  </div>
                  {/* Metal Subcategory Selector (conditionally shown) */}
                  {densLokCat === "metals" && (
                    <div className="col-span-8" id="dens_cat_mtl">
                      <div className="col m8 s8 unit_h paddings_rl20_10">
                        <p className="label">
                          {data?.payload?.tech_lang_keys["16"]}
                        </p>
                        <select
                          className="input dens_lok_answer"
                          aria-label="select"
                          name="tech_slmtl"
                          id="tech_slmtl"
                          value={densCatMtl}
                          onChange={(e) => setDensCatMtl(e.target.value)}
                        >
                          <option value="aluminum">
                            {data?.payload?.tech_lang_keys["22"]}
                          </option>
                          <option value="beryllium">
                            {data?.payload?.tech_lang_keys["23"]}
                          </option>
                          <option value="brass">
                            {data?.payload?.tech_lang_keys["24"]}
                          </option>
                          <option value="copper">
                            {data?.payload?.tech_lang_keys["25"]}
                          </option>
                          <option value="gold">
                            {data?.payload?.tech_lang_keys["26"]}
                          </option>
                          <option value="iron">
                            {data?.payload?.tech_lang_keys["27"]}
                          </option>
                          <option value="lead">
                            {data?.payload?.tech_lang_keys["28"]}
                          </option>
                          <option value="magnesium">
                            {data?.payload?.tech_lang_keys["29"]}
                          </option>
                          <option value="mercury">
                            {data?.payload?.tech_lang_keys["30"]}
                          </option>
                          <option value="nickel">
                            {data?.payload?.tech_lang_keys["31"]}
                          </option>
                          <option value="platium">
                            {data?.payload?.tech_lang_keys["32"]}
                          </option>
                          <option value="plutonium">
                            {data?.payload?.tech_lang_keys["33"]}
                          </option>
                          <option value="potassium">
                            {data?.payload?.tech_lang_keys["34"]}
                          </option>
                          <option value="silver">
                            {data?.payload?.tech_lang_keys["35"]}
                          </option>
                          <option value="sodium">
                            {data?.payload?.tech_lang_keys["36"]}
                          </option>
                          <option value="tin">
                            {data?.payload?.tech_lang_keys["37"]}
                          </option>
                          <option value="titanium">
                            {data?.payload?.tech_lang_keys["38"]}
                          </option>
                          <option value="uranium">
                            {data?.payload?.tech_lang_keys["39"]}
                          </option>
                          <option value="zinc">
                            {data?.payload?.tech_lang_keys["40"]}
                          </option>
                        </select>
                      </div>
                    </div>
                  )}

                  {/* Non-metals */}
                  {densLokCat === "non-metals" && (
                    <div className="col-span-8 ps-2" id="dens_cat_mtl_no">
                      <div className="col m8 s8 unit_h paddings_rl20_10">
                        <p className="text-blue font-s-14 pb-2">
                          {data?.payload?.tech_lang_keys["16"]}
                        </p>
                        <select
                          name="tech_slmtl_no"
                          className="input dens_lok_answer"
                          value={densCatMtlNo}
                          onChange={(e) => setDensCatMtlNo(e.target.value)}
                        >
                          <option value="concrete">
                            {data?.payload?.tech_lang_keys["41"]}
                          </option>
                          <option value="cork">
                            {data?.payload?.tech_lang_keys["42"]}
                          </option>
                          <option value="diamond">
                            {data?.payload?.tech_lang_keys["43"]}
                          </option>
                          <option value="ice">
                            {data?.payload?.tech_lang_keys["44"]}
                          </option>
                          <option value="nylon">
                            {data?.payload?.tech_lang_keys["45"]}
                          </option>
                          <option value="oak">
                            {data?.payload?.tech_lang_keys["46"]}
                          </option>
                          <option value="pine">
                            {data?.payload?.tech_lang_keys["47"]}
                          </option>
                          <option value="plastics">
                            {data?.payload?.tech_lang_keys["48"]}
                          </option>
                          <option value="styrofoam">
                            {data?.payload?.tech_lang_keys["49"]}
                          </option>
                          <option value="wood">
                            {data?.payload?.tech_lang_keys["50"]}
                          </option>
                        </select>
                      </div>
                    </div>
                  )}
                  {/* Gases */}
                  {densLokCat === "gases" && (
                    <div className="col-span-8 ps-2" id="dens_cat_gas">
                      <div className="col m8 s8 unit_h paddings_rl20_10">
                        <p className="text-blue font-s-14 pb-2">
                          {data?.payload?.tech_lang_keys["16"]}
                        </p>
                        <select
                          name="tech_slgas"
                          className="input dens_lok_answer"
                          value={densCatGas}
                          onChange={(e) => setDensCatGas(e.target.value)}
                        >
                          <option value="air0">
                            {data?.payload?.tech_lang_keys["51"]}
                          </option>
                          <option value="air20">
                            {data?.payload?.tech_lang_keys["52"]}
                          </option>
                          <option value="carbon_dioxide0">
                            {data?.payload?.tech_lang_keys["53"]}
                          </option>
                          <option value="carbon_dioxide20">
                            {data?.payload?.tech_lang_keys["54"]}
                          </option>
                          <option value="carbon_monoxide0">
                            {data?.payload?.tech_lang_keys["55"]}
                          </option>
                          <option value="carbon_monoxide20">
                            {data?.payload?.tech_lang_keys["56"]}
                          </option>
                          <option value="hydrogen">
                            {data?.payload?.tech_lang_keys["57"]}
                          </option>
                          <option value="helium">
                            {data?.payload?.tech_lang_keys["58"]}
                          </option>
                          <option value="methane0">
                            {data?.payload?.tech_lang_keys["59"]}
                          </option>
                          <option value="methane20">
                            {data?.payload?.tech_lang_keys["60"]}
                          </option>
                          <option value="nitrogen0">
                            {data?.payload?.tech_lang_keys["61"]}
                          </option>
                          <option value="nitrogen20">
                            {data?.payload?.tech_lang_keys["62"]}
                          </option>
                          <option value="oxygen0">
                            {data?.payload?.tech_lang_keys["63"]}
                          </option>
                          <option value="oxygen20">
                            {data?.payload?.tech_lang_keys["64"]}
                          </option>
                          <option value="propane20">
                            {data?.payload?.tech_lang_keys["65"]}
                          </option>
                          <option value="water_vapor">
                            {data?.payload?.tech_lang_keys["66"]}
                          </option>
                        </select>
                      </div>
                    </div>
                  )}
                  {/* Liquids */}
                  {densLokCat === "liquids" && (
                    <div className="col-span-8 ps-2" id="dens_cat_lqd">
                      <div className="col m8 s8 unit_h paddings_rl20_10">
                        <p className="text-blue font-s-14 pb-2">
                          {data?.payload?.tech_lang_keys["16"]}
                        </p>
                        <select
                          name="tech_sllqd"
                          className="input dens_lok_answer"
                          value={densCatLqd}
                          onChange={(e) => setDensCatLqd(e.target.value)}
                        >
                          <option value="cooking_oil">
                            {data?.payload?.tech_lang_keys["67"]}
                          </option>
                          <option value="liquid_hydrogen">
                            {data?.payload?.tech_lang_keys["68"]}
                          </option>
                          <option value="liquid_oxygen">
                            {data?.payload?.tech_lang_keys["69"]}
                          </option>
                          <option value="water_fresh">
                            {data?.payload?.tech_lang_keys["70"]}
                          </option>
                          <option value="water_salt">
                            {data?.payload?.tech_lang_keys["71"]}
                          </option>
                        </select>
                      </div>
                    </div>
                  )}
                  {/* Astral */}
                  {densLokCat === "astronomy" && (
                    <div className="col-span-8 ps-2" id="dens_cat_astr">
                      <div className="col m8 s8 unit_h paddings_rl20_10">
                        <p className="text-blue font-s-14 pb-2">
                          {data?.payload?.tech_lang_keys["16"]}
                        </p>
                        <select
                          name="tech_slastr"
                          className="input dens_lok_answer"
                          value={densCatAstr}
                          onChange={(e) => setDensCatAstr(e.target.value)}
                        >
                          <option value="earth">
                            {data?.payload?.tech_lang_keys["72"]}
                          </option>
                          <option value="earth_core">
                            {data?.payload?.tech_lang_keys["73"]}
                          </option>
                          <option value="sun_core_min">
                            {data?.payload?.tech_lang_keys["74"]}
                          </option>
                          <option value="sun_core_max">
                            {data?.payload?.tech_lang_keys["75"]}
                          </option>
                          <option value="super_black_hole">
                            {data?.payload?.tech_lang_keys["76"]}
                          </option>
                          <option value="dwarf_star">
                            {data?.payload?.tech_lang_keys["77"]}
                          </option>
                          <option value="atomic_nuclei">
                            {data?.payload?.tech_lang_keys["78"]}
                          </option>
                          <option value="neutron_star">
                            {data?.payload?.tech_lang_keys["79"]}
                          </option>
                          <option value="stellar_black_hole">
                            {data?.payload?.tech_lang_keys["80"]}
                          </option>
                        </select>
                      </div>
                    </div>
                  )}
                  {/* Result Display */}
                  <p className="col-span-12 ps-2 text-center text-blue">
                    {data?.payload?.tech_lang_keys["res"]}
                  </p>
                  <div
                    className="col-span-12 ps-2 text-center mt-3 bg-sky p-2 bordered rounded-lg"
                    id="dens_lok_ans"
                  >
                    <p className="text-[18px] pt-2">
                      <strong>{data?.payload?.tech_lang_keys["4"]}</strong>
                    </p>
                    <p className="text-[32px] px-3 py-2 d-inline-block my-2">
                      <strong className="text-blue dens_lok_ansr">
                        {" "}
                        {densVal !== null
                          ? `${densVal} ${densLokUnt}`
                          : "Select options to see density"}
                      </strong>
                    </p>
                  </div>
                </div>
              </div>
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
              <div className="w-full result mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg flex items-center justify-center">
                    <div className="w-full my-5">
                      <div className="w-full">
                        <div className="col s12 s12 dnsty_wrap">
                          <div className="text-center">
                            <p className="text-[18px] font-semibold">
                              {result?.tech_anstitle === "m" ? (
                                <span>
                                  {data?.payload?.tech_lang_keys["6"]}
                                </span>
                              ) : result?.tech_anstitle === "v" ? (
                                <span>
                                  {data?.payload?.tech_lang_keys["5"]}
                                </span>
                              ) : result?.tech_anstitle === "d" ? (
                                <span>
                                  {data?.payload?.tech_lang_keys["4"]}
                                </span>
                              ) : null}
                            </p>
                            <p className="md:text-[25px] text-[18px] bg-[#2845F5] text-white rounded-lg px-3 py-2 inline-block my-3 wrap_dnst">
                              <strong className="text-blue">
                                {result?.tech_ansval}
                              </strong>
                            </p>
                          </div>

                          {formData?.tech_calc === "simple" ? (
                            <>
                              {/* <div className="text-center kin_res_frm">
                                  {formData?.tech_to_cals && (
                                    <>
                                      {formData.tech_to_cals === "density" ? (
                                        <p>
                                          <img
                                          src="/images/density-dns-formula.png"
                                            width="110"
                                            height="80"
                                            className="max-width formula_img"
                                            alt="Displacement Calculator Formula 3"
                                          />
                                        </p>
                                      ) : formData.tech_to_cals === "volume" ? (
                                        <p>
                                          <img
                                             src="/images/density-vol-formula.png"
                                            width="165"
                                            height="102"
                                            className="display_inline padding_5 m_b_n_10 formula_img"
                                            alt="Displacement Calculator Formula 3"
                                          />
                                        </p>
                                      ) : formData.tech_to_cals === "mass" ? (
                                        <p>
                                          <img
                                             src="/images/density-mas-formula.png"
                                            width="225"
                                            height="58"
                                            className="display_inline padding_5 m_b_n_10 formula_img"
                                            alt="Displacement Calculator Formula 3"
                                          />
                                        </p>
                                      ) : null}
                                    </>
                                  )}
                                </div> */}

                              {/* <p className="font-s-18 font-semibold">
                                  {data?.payload?.tech_lang_keys["82"]}
                                </p> */}

                              <div className="col-lg-8 text-[16px] overflow-auto">
                                <table className="w-100 disp_tbl">
                                  <tbody>
                                    {/* <tr>
                                        <td className="border-b py-2 font-semibold">
                                          {result?.tech_anstitle1 === "m"
                                            ? data?.payload?.tech_lang_keys["6"]
                                            : result?.tech_anstitle1 === "v"
                                            ? data?.payload?.tech_lang_keys["5"]
                                            : result?.tech_anstitle1 === "d"
                                            ? data?.payload?.tech_lang_keys["4"]
                                            : ""}
                                          :
                                        </td>
                                        <td className="border-b py-2">{result?.tech_ansval1}</td>
                                      </tr>
                                      <tr>
                                        <td className="border-b py-2 font-semibold">
                                          {result?.tech_anstitle2 === "m"
                                            ? data?.payload?.tech_lang_keys["6"]
                                            : result?.tech_anstitle2 === "v"
                                            ? data?.payload?.tech_lang_keys["5"]
                                            : result?.tech_anstitle2 === "d"
                                            ? data?.payload?.tech_lang_keys["4"]
                                            : ""}
                                          :
                                        </td>
                                        <td className="border-b py-2">{result?.tech_ansval2}</td>
                                      </tr> */}
                                    <tr>
                                      <td className="border-b py-2 font-semibold">
                                        {data?.payload?.tech_lang_keys["81"]}:
                                      </td>
                                      <td className="border-b py-2">
                                        {result?.ansval3}
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </>
                          ) : (
                            <>
                              <p className="text-[16px] font-semibold">
                                {data?.payload?.tech_lang_keys["82"]}:
                              </p>
                              <div className="col-lg-8 text-[16px] overflow-auto">
                                <table className="w-100 disp_tbl">
                                  <tbody>
                                    <tr>
                                      <td className="border-b py-2 font-semibold">
                                        {data?.payload?.tech_lang_keys["6"]}:
                                      </td>
                                      <td className="border-b py-2">
                                        {result?.tech_mass}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="border-b py-2 font-semibold">
                                        {data?.payload?.tech_lang_keys["11"]}:
                                      </td>
                                      <td className="border-b py-2">
                                        {result?.tech_lngt}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="border-b py-2 font-semibold">
                                        {data?.payload?.tech_lang_keys["12"]}:
                                      </td>
                                      <td className="border-b py-2">
                                        {result?.tech_wdth}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="border-b py-2 font-semibold">
                                        {data?.payload?.tech_lang_keys["13"]}:
                                      </td>
                                      <td className="border-b py-2">
                                        {result?.tech_hgth}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="border-b py-2 font-semibold">
                                        {data?.payload?.tech_lang_keys["5"]}:
                                      </td>
                                      <td className="border-b py-2">
                                        {result?.tech_vlme}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="border-b py-2 font-semibold">
                                        {data?.payload?.tech_lang_keys["81"]}:
                                      </td>
                                      <td className="border-b py-2">
                                        {result?.ansval3}
                                      </td>
                                    </tr>
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

export default DensityCalculator;

"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useMolecularFormulaCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const MolecularFormulaCalculator = () => {
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
    tech_no1: "1",
    tech_opt1: "62.50234383789@@Oxygen (O) - Standard Atomic Weight",
    tech_no2: "1",
    tech_opt2: "100000@@Centigram",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateActivationCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useMolecularFormulaCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // if (!formData.tech_no1 || !formData.tech_opt1  || !formData.tech_no2 || !formData.tech_opt2 ) {
    //   setFormError("Please fill in input.");
    //   return;
    // }

    setFormError("");
    try {
      const response = await calculateActivationCalculator({
        tech_no1: formData.tech_no1,
        tech_opt1: formData.tech_opt1,
        tech_no2: formData.tech_no2,
        tech_opt2: formData.tech_opt2,
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
      tech_no1: "1",
      tech_opt1: "28.20635771303@@Chlorine (Cl) - Standard Atomic Weight",
      tech_no2: "1",
      tech_opt2: "4155.8441558@@Assarion (Biblical Roman)",
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

          <div className="lg:w-[80%] md:w-[94%] w-full mx-auto ">
            <div className="grid grid-cols-12  lg:gap-4 md:gap-4 gap-1">
              <div className="lg:col-span-6 md:col-span-6 col-span-12">
                <label htmlFor="tech_no1" className="label">
                  {data?.payload?.tech_lang_keys["1"]} (M)
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_no1"
                    id="tech_no1"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_no1}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="lg:col-span-6 md:col-span-6 col-span-12 ">
                <label htmlFor="tech_opt1" className="label">
                  &nbsp;
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_opt1"
                    id="tech_opt1"
                    value={formData.tech_opt1}
                    onChange={handleChange}
                  >
                    <option value="28.20635771303@@Chlorine (Cl) - Standard Atomic Weight">
                      Chlorine (Cl) - Standard Atomic Weight
                    </option>
                    <option value="14.10317885651@@Chlorine molecule (Cl₂) - Molecular Mass">
                      Chlorine molecule (Cl₂) - Molecular Mass
                    </option>
                    <option value="1000@@Gram Per Mole">Gram Per Mole</option>
                    <option value="992.122546977@@Hydrogen (H) - Standard Atomic Weight">
                      Hydrogen (H) - Standard Atomic Weight
                    </option>
                    <option value="496.0612734885@@Hydrogen molecule (H₂) - Molecular Mass">
                      Hydrogen molecule (H₂) - Molecular Mass
                    </option>
                    <option value="17.90670606142@@Iron (Fe) - Standard Atomic Weight">
                      Iron (Fe) - Standard Atomic Weight
                    </option>
                    <option value="1@@Kilogram Per Mole">
                      Kilogram Per Mole
                    </option>
                    <option value="62.50234383789@@Oxygen (O) - Standard Atomic Weight">
                      Oxygen (O) - Standard Atomic Weight
                    </option>
                    <option value="31.1866521129@@Sulfur (S) - Standard Atomic Weight">
                      Sulfur (S) - Standard Atomic Weight
                    </option>
                    <option value="3.898331514112@@Sulfur molecule (S₈) - Molecular Mass">
                      Sulfur molecule (S₈) - Molecular Mass
                    </option>
                    <option value="17.11075659692@@Table salt (sodium chloride) (NaCl) - Molecular Mass">
                      Table salt (sodium chloride) (NaCl) - Molecular Mass
                    </option>
                    <option value="2.921444006669@@Table sugar (sucrose) (C₁₂H₂₂O₁₁) - Molecular Mass">
                      Table sugar (sucrose) (C₁₂H₂₂O₁₁) - Molecular Mass
                    </option>
                    <option value="55.50843506179@@Water Molecule (H₂O) - Molecular Mass">
                      Water Molecule (H₂O) - Molecular Mass
                    </option>
                  </select>
                </div>
              </div>
              <div className="lg:col-span-6 md:col-span-6 col-span-12 ">
                <label htmlFor="tech_no2" className="label">
                  {data?.payload?.tech_lang_keys["2"]}
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_no2"
                    id="tech_no2"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_no2}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="lg:col-span-6 md:col-span-6 col-span-12 lawn_mowed">
                <label htmlFor="tech_opt2" className="label">
                  &nbsp;
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_opt2"
                    id="tech_opt2"
                    value={formData.tech_opt2}
                    onChange={handleChange}
                  >
                    <option value="4155.8441558@@Assarion (Biblical Roman)">
                      Assarion (Biblical Roman)
                    </option>
                    <option value="6.022136651E+26@@Atomic Mass Unit">
                      Atomic Mass Unit
                    </option>
                    <option value="1E+21@@Attogram">Attogram</option>
                    <option value="175.43859649@@Bekan (Biblical Hebrew)">
                      Bekan (Biblical Hebrew)
                    </option>
                    <option value="5000@@Carat">Carat</option>
                    <option value="100000@@Centigram">Centigram</option>
                    <option value="6.022173643E+26@@Dalton">Dalton</option>
                    <option value="100@@Decagram">Decagram</option>
                    <option value="10000@@Decigram">Decigram</option>
                    <option value="259.74025974@@Denarius (Biblical Roman)">
                      Denarius (Biblical Roman)
                    </option>
                    <option value="2.990800894E+26@@Deuteron Mass">
                      Deuteron Mass
                    </option>
                    <option value="2.990800894E+26@@Didrachma (Biblical Greek)">
                      Didrachma (Biblical Greek)
                    </option>
                    <option value="1.67336010709505E-25@@Drachma (Biblical Greek)">
                      Drachma (Biblical Greek)
                    </option>
                    <option value="9.10938970730895E-31@@Earth's Mass">
                      Earth's Mass
                    </option>
                    <option value="1E-15@@Electron Mass (Rest)">
                      Electron Mass (Rest)
                    </option>
                    <option value="1E+15@@Exagram">Exagram</option>
                    <option value="1E+18@@Femtogram">Femtogram</option>
                    <option value="1000000000@@Gamma">Gamma</option>
                    <option value="1754.3859649@@Gerah (Biblical Hebrew)">
                      Gerah (Biblical Hebrew)
                    </option>
                    <option value="5.978633201E+26@@Gigagram">Gigagram</option>
                    <option value="1E-12@@Gigatonne">Gigatonne</option>
                    <option value="15432.358353@@Grain">Grain</option>
                    <option value="1000@@Gram">Gram</option>
                    <option value="10@@Hectogram">Hectogram</option>
                    <option value="0.0196841306@@Hundredweight(UK)">
                      Hundredweight(UK)
                    </option>
                    <option value="5.26592943654555E-28@@Jupiter Mass">
                      Jupiter Mass
                    </option>
                    <option value="1@@Kilogram">Kilogram</option>
                    <option value="0.1019716213@@Kilo-Force Square Second Per Foot">
                      Kilo-Force Square Second Per Foot
                    </option>
                    <option value="0.0022046226218@@KiloPound">
                      KiloPound
                    </option>
                    <option value="1E-06 Kiloton@@Kiloton(Metric)">
                      Kiloton(Metric)
                    </option>
                    <option value="33246.753247@@Lepton (Biblical Roman)">
                      Lepton (Biblical Roman)
                    </option>
                    <option value="0.001@@Megragram">Megragram</option>
                    <option value="1E-09@@Megatonne">Megatonne</option>
                    <option value="1000000000@@Microgram">Microgram</option>
                    <option value="1000000@@Milligram">Milligram</option>
                    <option value="2.9411764706@@Mina(Biblical Greek)">
                      Mina(Biblical Greek)
                    </option>
                    <option value="2.9411764706@@Mina(Biblical Hebrew)">
                      Mina(Biblical Hebrew)
                    </option>
                    <option value="5.309172492E+27@@Muon Mass">
                      Muon Mass
                    </option>
                    <option value="1000000000000@@Nanogram">Nanogram</option>
                    <option value="5.970403753E+26@@Neutron Mass">
                      Neutron Mass
                    </option>
                    <option value="35.27396195@@Ounce">Ounce</option>
                    <option value="643.01493137@@Pennyweight">
                      Pennyweight
                    </option>
                    <option value="1E-12@@Petagram">Petagram</option>
                    <option value="1E+15@@Picogram">Picogram</option>
                    <option value="45940892.448@@Planck Mass">
                      Planck Mass
                    </option>
                    <option value="45940892.448@@Pound">Pound</option>
                    <option value="2.6792288807@@Pound(Troy or Apothecary)">
                      Pound(Troy or Apothecary)
                    </option>
                    <option value="70.988848424@@Poundal">Poundal</option>
                    <option value="0.0685217658999999@@Pound-Force Square Second Per Foot">
                      Pound-Force Square Second Per Foot
                    </option>
                    <option value="5.978633201E+26@@Proton Mass">
                      Proton Mass
                    </option>
                    <option value="16623.376623@@Quadrans(Biblical Romans)">
                      Quadrans(Biblical Romans)
                    </option>
                    <option value="0.0787365221999998@@Quarter(UK)">
                      Quarter(UK)
                    </option>
                    <option value="0.0881849049000002@@Quarter(US)">
                      Quarter(US)
                    </option>
                    <option value="0.01@@Quintal">Quintal</option>
                    <option value="0.000984206527611061@@Scruple(Apotherapy)">
                      Scruple(Apotherapy)
                    </option>
                    <option value="87.719298246@@Shekel(Biblical Hebrew)">
                      Shekel(Biblical Hebrew)
                    </option>
                    <option value="87.719298246@@Slug">Slug</option>
                    <option value="1.988E+30@@Solar Mass">Solar Mass</option>
                    <option value="0.1574730444@@Stone (UK)">Stone (UK)</option>
                    <option value="0.1763698097@@Stone (US)">Stone (US)</option>
                    <option value="5.02765208647562E-31@@Sun's Mass">
                      Sun's Mass
                    </option>
                    <option value="0.0490196078@@Talent(Biblical Greek)">
                      Talent(Biblical Greek)
                    </option>
                    <option value="0.0292397661@@Talent(Biblical Hebrew)">
                      Talent(Biblical Hebrew)
                    </option>
                    <option value="1E-09@@Teragram">Teragram</option>
                    <option value="73.529411765@@Tetradrachma(Biblical Greek)">
                      Tetradrachma(Biblical Greek)
                    </option>
                    <option value="30.612244898@@Ton (Assay)(UK)">
                      Ton (Assay)(UK)
                    </option>
                    <option value="34.285710367@@Ton (Assay)(US)">
                      Ton (Assay)(US)
                    </option>
                    <option value="0.000984206527611061@@Ton(Long)">
                      Ton(Long)
                    </option>
                    <option value="0.001@@Ton(Metric)">Ton(Metric)</option>
                    <option value="0.0011023113@@Ton(Short)">Ton(Short)</option>
                    <option value="0.001@@Tonne">Tonne</option>
                  </select>
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
              <div className="w-full mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg  flex items-center justify-center">
                    <div className="w-full mt-3 ">
                      <div
                        className="w-full  result canvas_div_pdf lg:text-[18px] md:text-[18px] text-[16px]"
                        id="printThis"
                      >
                        <div className="col m10 s12">
                          <div className="text-center pt-1 pb-2">
                            <p className=" text-[#2845F5] text-[20px] relative inline-block rounded-full  p-3">
                              {data?.payload?.tech_lang_keys["3"]}
                            </p>
                            <p className="text-[28px] bordered rounded-lg text-[#ff6d00] font-bold  bg-sky">
                              {Number(result?.tech_final_result3).toFixed(5)}
                            </p>
                          </div>
                          <p className="w-full py-2 text-[25px] text-[#2845F5]">
                            <strong>
                              {data?.payload?.tech_lang_keys["4"]}:
                            </strong>
                          </p>
                          <p className="w-full py-2 lg:text-[18px] md:text-[18px] text-[16px] ">
                            <strong>
                              {data?.payload?.tech_lang_keys["5"]}:
                            </strong>
                          </p>
                          <p className="w-full py-2 lg:text-[18px] md:text-[18px] text-[16px] ">
                            {data?.payload?.tech_lang_keys["1"]} ={" "}
                            {result?.tech_no1} {result?.tech_name} <br />{" "}
                            {data?.payload?.tech_lang_keys["2"]} ={" "}
                            {result?.tech_no2} {result?.tech_name2}
                          </p>
                          <p className="w-full py-2 lg:text-[18px] md:text-[18px] text-[16px] ">
                            <strong>
                              {data?.payload?.tech_lang_keys["6"]}:
                            </strong>
                          </p>
                          <p className="w-full py-2 lg:text-[18px] md:text-[18px] text-[16px] ">
                            {data?.payload?.tech_lang_keys["3"]} ={" "}
                            {data?.payload?.tech_lang_keys["1"]} /{" "}
                            {data?.payload?.tech_lang_keys["2"]}
                          </p>
                          <p className="w-full py-2 lg:text-[18px] md:text-[18px] text-[16px] text-[#2845F5] ">
                            <strong>
                              {data?.payload?.tech_lang_keys["7"]}:
                            </strong>
                          </p>
                          <p className="w-full py-2 lg:text-[18px] md:text-[18px] text-[16px] ">
                            <strong>
                              {data?.payload?.tech_lang_keys["1"]}:
                            </strong>{" "}
                            1 {result?.tech_name} = {result?.tech_nbr1}{" "}
                            {data?.payload?.tech_lang_keys["8"]}
                          </p>
                          <p className="w-full py-2 lg:text-[18px] md:text-[18px] text-[16px]">
                            {data?.payload?.tech_lang_keys["9"]}{" "}
                            {result?.tech_no1} {result?.tech_name}{" "}
                            {data?.payload?.tech_lang_keys["10"]}, <br />{" "}
                            <strong>
                              {data?.payload?.tech_lang_keys["1"]}
                            </strong>{" "}
                            = {result?.tech_no1} / {result?.tech_nbr1} ={" "}
                            {result?.tech_final_result1}{" "}
                            {data?.payload?.tech_lang_keys["8"]}
                          </p>
                          <p className="w-full py-2 lg:text-[18px] md:text-[18px] text-[16px]">
                            <strong>
                              {data?.payload?.tech_lang_keys["2"]}:
                            </strong>{" "}
                            1 {result?.tech_name2} = {result?.tech_nbr2}{" "}
                            {data?.payload?.tech_lang_keys["11"]}{" "}
                          </p>
                          <p className="w-full py-2 lg:text-[18px] md:text-[18px] text-[16px]">
                            {data?.payload?.tech_lang_keys["9"]}{" "}
                            {result?.tech_no2} {result?.tech_name2}{" "}
                            {data?.payload?.tech_lang_keys["12"]}, <br />{" "}
                            <strong>
                              {data?.payload?.tech_lang_keys["2"]}
                            </strong>{" "}
                            = {result?.tech_no2} / {result?.tech_nbr2} ={" "}
                            {result?.tech_final_result2}{" "}
                            {data?.payload?.tech_lang_keys["11"]}
                          </p>
                          <p className="w-full py-2 lg:text-[18px] md:text-[18px] text-[16px] text-[#2845F5]">
                            <strong>
                              {data?.payload?.tech_lang_keys["3"]}:
                            </strong>
                          </p>
                          <p className="w-full py-2 lg:text-[18px] md:text-[18px] text-[16px]">
                            = {data?.payload?.tech_lang_keys["1"]} /{" "}
                            {data?.payload?.tech_lang_keys["2"]}
                          </p>
                          <p className="w-full py-2 lg:text-[18px] md:text-[18px] text-[16px]">
                            = {result?.tech_final_result1} /{" "}
                            {result?.tech_final_result2}
                          </p>
                          <p className="w-full py-2 lg:text-[18px] md:text-[18px] text-[16px] orange-text text-accent-4">
                            <strong>
                              = {Number(result?.tech_final_result3).toFixed(5)}
                            </strong>
                          </p>
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

export default MolecularFormulaCalculator;

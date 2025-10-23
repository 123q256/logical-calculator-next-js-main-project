"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useElectronConfigurationCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const ElectronConfigurationCalculator = () => {
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
    tech_element: "Og",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateActivationCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useElectronConfigurationCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_element) {
      setFormError("Please fill in field");
      return;
    }

    setFormError("");
    try {
      const response = await calculateActivationCalculator({
        tech_element: formData.tech_element,
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
      tech_element: "Og",
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

  const names = [
    "Hydrogen (H)",
    "Helium (He)",
    "Lithium (Li)",
    "Beryllium (Be)",
    "Boron (B)",
    "Carbon (C)",
    "Nitrogen (N)",
    "Oxygen (O)",
    "Fluorine (F)",
    "Neon (Ne)",
    "Sodium (Na)",
    "Magnesium (Mg)",
    "Aluminum (Al)",
    "Silicon (Si)",
    "Phosphorus (P)",
    "Sulfur (S)",
    "Chlorine (Cl)",
    "Argon (Ar)",
    "Potassium (K)",
    "Calcium (Ca)",
    "Scandium (Sc)",
    "Titanium (Ti)",
    "Vanadium (V)",
    "Chromium (Cr)",
    "Manganese (Mn)",
    "Iron (Fe)",
    "Cobalt (Co)",
    "Nickel (Ni)",
    "Copper (Cu)",
    "Zinc (Zn)",
    "Gallium (Ga)",
    "Germanium (Ge)",
    "Arsenic (As)",
    "Selenium (Se)",
    "Bromine (Br)",
    "Krypton (Kr)",
    "Rubidium (Rb)",
    "Strontium (Sr)",
    "Yttrium (Y)",
    "Zirconium (Zr)",
    "Niobium (Nb)",
    "Molybdenum (Mo)",
    "Technetium (Tc)",
    "Ruthenium (Ru)",
    "Rhodium (Rh)",
    "Palladium (Pd)",
    "Silver (Ag)",
    "Cadmium (Cd)",
    "Indium (In)",
    "Tin (Sn)",
    "Antimony (Sb)",
    "Tellurium (Te)",
    "Iodine (I)",
    "Xenon (Xe)",
    "Cesium (Cs)",
    "Barium (Ba)",
    "Lanthanum (La)",
    "Cerium (Ce)",
    "Praseodymium (Pr)",
    "Neodymium (Nd)",
    "Promethium (Pm)",
    "Samarium (Sm)",
    "Europium (Eu)",
    "Gadolinium (Gd)",
    "Terbium (Tb)",
    "Dysprosium (Dy)",
    "Holmium (Ho)",
    "Erbium (Er)",
    "Thulium (Tm)",
    "Ytterbium (Yb)",
    "Lutetium (Lu)",
    "Hafnium (Hf)",
    "Tantalum (Ta)",
    "Tungsten (W)",
    "Rhenium (Re)",
    "Osmium (Os)",
    "Iridium (Ir)",
    "Platinum (Pt)",
    "Gold (Au)",
    "Mercury (Hg)",
    "Thallium (Tl)",
    "Lead (Pb)",
    "Bismuth (Bi)",
    "Polonium (Po)",
    "Astatine (At)",
    "Radon (Rn)",
    "Francium (Fr)",
    "Radium (Ra)",
    "Actinium (Ac)",
    "Thorium (Th)",
    "Protactinium (Pa)",
    "Uranium (U)",
    "Neptunium (Np)",
    "Plutonium (Pu)",
    "Americium (Am)",
    "Curium (Cm)",
    "Berkelium (Bk)",
    "Californium (Cf)",
    "Einsteinium (Es)",
    "Fermium (Fm)",
    "Mendelevium (Md)",
    "Nobelium (No)",
    "Lawrencium (Lr)",
    "Rutherfordium (Rf)",
    "Dubnium (Db)",
    "Seaborgium (Sg)",
    "Bohrium (Bh)",
    "Hassium (Hs)",
    "Meitnerium (Mt)",
    "Darmstadtium (Ds)",
    "Roentgenium (Rg)",
    "Copernicium (Cn)",
    "Nihonium (Nh)",
    "Flerovium (Fl)",
    "Moscovium (Mc)",
    "Livermorium (Lv)",
    "Tennessine (Ts)",
    "Oganesson (Og)",
  ];

  const values = [
    "H",
    "He",
    "Li",
    "Be",
    "B",
    "C",
    "N",
    "O",
    "F",
    "Ne",
    "Na",
    "Mg",
    "Al",
    "Si",
    "P",
    "S",
    "Cl",
    "Ar",
    "K",
    "Ca",
    "Sc",
    "Ti",
    "V",
    "Cr",
    "Mn",
    "Fe",
    "Co",
    "Ni",
    "Cu",
    "Zn",
    "Ga",
    "Ge",
    "As",
    "Se",
    "Br",
    "Kr",
    "Rb",
    "Sr",
    "Y",
    "Zr",
    "Nb",
    "Mo",
    "Tc",
    "Ru",
    "Rh",
    "Pd",
    "Ag",
    "Cd",
    "In",
    "Sn",
    "Sb",
    "Te",
    "I",
    "Xe",
    "Cs",
    "Ba",
    "La",
    "Ce",
    "Pr",
    "Nd",
    "Pm",
    "Sm",
    "Eu",
    "Gd",
    "Tb",
    "Dy",
    "Ho",
    "Er",
    "Tm",
    "Yb",
    "Lu",
    "Hf",
    "Ta",
    "W",
    "Re",
    "Os",
    "Ir",
    "Pt",
    "Au",
    "Hg",
    "Tl",
    "Pb",
    "Bi",
    "Po",
    "At",
    "Rn",
    "Fr",
    "Ra",
    "Ac",
    "Th",
    "Pa",
    "U",
    "Np",
    "Pu",
    "Am",
    "Cm",
    "Bk",
    "Cf",
    "Es",
    "Fm",
    "Md",
    "No",
    "Lr",
    "Rf",
    "Db",
    "Sg",
    "Bh",
    "Hs",
    "Mt",
    "Ds",
    "Rg",
    "Cn",
    "Nh",
    "Fl",
    "Mc",
    "Lv",
    "Ts",
    "Og",
  ];

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

          <div className="lg:w-[40%] md:w-[60%] w-full mx-auto ">
            <div className="grid grid-cols-12mt-3  gap-2 md:gap-4 lg:gap-4">
              <div className="col-span-12">
                <div className="element">
                  <div className="add_related col-8 mx-auto">
                    <label htmlFor="tech_element" className="label">
                      {data?.payload?.tech_lang_keys["1"] ??
                        "Select an Element"}
                      :
                    </label>
                    <div className="mt-2">
                      <select
                        className="input"
                        aria-label="select"
                        name="tech_element"
                        id="tech_element"
                        value={formData.tech_element}
                        onChange={handleChange}
                      >
                        {names.map((name, index) => (
                          <option key={values[index]} value={values[index]}>
                            {name}
                          </option>
                        ))}
                      </select>
                    </div>
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
              <div className="w-full mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg  flex items-center justify-center mt-3">
                    <div className="w-full">
                      <div className="w-full">
                        <div className="overflow-x-auto whitespace-nowrap p-2  mt-4">
                          <p>
                            <strong>
                              {data?.payload?.tech_lang_keys["2"]}
                            </strong>
                          </p>
                          <p className="text-[#119154] text-[16px] md:text-[20px] font-semibold">
                            <span className="block md:inline">
                              {result?.tech_configuration}
                            </span>
                          </p>

                          <p className="mt-2">
                            <strong>
                              {data?.payload?.tech_lang_keys["3"]}
                            </strong>
                          </p>
                          <p className="text-[#119154] text-[16px] md:text-[20px] font-semibold">
                            <span className="block md:inline">
                              {result?.tech_valenceConfiguration}
                            </span>
                          </p>
                        </div>

                        <div className="w-full overflow-auto mt-2 text-[16px]">
                          <table
                            className="w-full md:w-[80%] lg:w-[60%] "
                            cellSpacing="0"
                          >
                            <tbody>
                              <tr>
                                <td className="border-b py-2">
                                  {data?.payload?.tech_lang_keys["4"]}
                                </td>
                                <td className="text-end border-b py-2">
                                  <strong>{result?.tech_atomicNumber}</strong>
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 border-b">
                                  {data?.payload?.tech_lang_keys["7"]}
                                </td>
                                <td className="text-end border-b py-2">
                                  <strong>{result?.tech_atomicMass}</strong>
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  {data?.payload?.tech_lang_keys["5"]}
                                </td>
                                <td className="text-end border-b py-2">
                                  <strong>{result?.tech_element}</strong>
                                </td>
                              </tr>
                              <tr>
                                <td className="border-b py-2">
                                  {data?.payload?.tech_lang_keys["6"]}
                                </td>
                                <td className="text-end border-b py-2">
                                  <strong>{result?.tech_phase}</strong>
                                </td>
                              </tr>
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

export default ElectronConfigurationCalculator;

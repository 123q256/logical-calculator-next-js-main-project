"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

Chart.register(ArcElement, Tooltip, Legend);

import {
  useGetSingleCalculatorDetailsMutation,
  useMolarMassCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const MolarMassCalculator = () => {
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
    tech_cmpnd: "CH3CONHC6H4OC2H5",
    tech_elem: "none",
    tech_f: "CH3CONHC6H4OC2H5",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateActivationCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useMolarMassCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => {
      let updatedData = { ...prevData, [name]: value };

      if (name === "tech_cmpnd") {
        updatedData.tech_elem = "none"; // reset opposite
        updatedData.tech_f = value; // set to input field
      } else if (name === "tech_elem") {
        updatedData.tech_cmpnd = "none"; // reset opposite
        updatedData.tech_f = value; // set to input field
      }

      return updatedData;
    });

    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_f) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateActivationCalculator({
        tech_cmpnd: formData.tech_cmpnd,
        tech_elem: formData.tech_elem,
        tech_f: formData.tech_f,
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
      tech_cmpnd: "CH3CONHC6H4OC2H5",
      tech_elem: "none",
      tech_f: "CH3CONHC6H4OC2H5",
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
    "Select Element",
    "Actinium [Ac]",
    "Aluminum [Al]",
    "Americium [Am]",
    "Antimony [Sb]",
    "Argon [Ar]",
    "Arsenic [As]",
    "Astatine [At]",
    "Barium [Ba]",
    "Berkelium [Bk]",
    "Beryllium [Be]",
    "Bismuth [Bi]",
    "Bohrium [Bh]",
    "Boron [B]",
    "Bromine [Br]",
    "Cadmium [Cd]",
    "Calcium [Ca]",
    "Californium [Cf]",
    "Carbon [C]",
    "Cerium [Ce]",
    "Cesium [Cs]",
    "Chlorine [Cl]",
    "Chromium [Cr]",
    "Cobalt [Co]",
    "Copper [Cu]",
    "Curium [Cm]",
    "Dubnium [Db]",
    "Dysprosium [Dy]",
    "Einsteinium [Es]",
    "Erbium [Er]",
    "Europium [Eu]",
    "Fermium [Fm]",
    "Fluorine [F]",
    "Francium [Fr]",
    "Gadolinium [Gd]",
    "Gallium [Ga]",
    "Germanium [Ge]",
    "Gold [Au]",
    "Hafnium [Hf]",
    "Hassium [Hs]",
    "Helium [He]",
    "Holmium [Ho]",
    "Hydrogen [H]",
    "Indium [In]",
    "Iodine [I]",
    "Iridium [Ir]",
    "Iron [Fe]",
    "Krypton [Kr]",
    "Lanthanum [La]",
    "Lawrencium [Lr]",
    "Lead [Pb]",
    "Lithium [Li]",
    "Lutetium [Lu]",
    "Magnesium [Mg]",
    "Manganese [Mn]",
    "Meitnerium [Mt]",
    "Mendelevium [Md]",
    "Mercury [Hg]",
    "Molybdenum [Mo]",
    "Neodymium [Nd]",
    "Neon [Ne]",
    "Neptunium [Np]",
    "Nickel [Ni]",
    "Niobium [Nb]",
    "Nitrogen [N]",
    "Nobelium [No]",
    "Osmium [Os]",
    "Oxygen [O]",
    "Palladium [Pd]",
    "Phosphorus [P]",
    "Platinum [Pt]",
    "Plutonium [Pu]",
    "Polonium [Po]",
    "Potassium [K]",
    "Praseodymium [Pr]",
    "Promethium [Pm]",
    "Protactinium [Pa]",
    "Radium [Ra]",
    "Radon [Rn]",
    "Rhenium [Re]",
    "Rhodium [Rh]",
    "Rubidium [Rb]",
    "Ruthenium [Ru]",
    "Rutherfordium [Rf]",
    "Samarium [Sm]",
    "Scandium [Sc]",
    "Seaborgium [Sg]",
    "Selenium [Se]",
    "Silicon [Si]",
    "Silver [Ag]",
    "Sodium [Na]",
    "Strontium [Sr]",
    "Sulfur [S]",
    "Tantalum [Ta]",
    "Technetium [Tc]",
    "Tellurium [Te]",
    "Terbium [Tb]",
    "Thallium [Tl]",
    "Thorium [Th]",
    "Thulium [Tm]",
    "Tin [Sn]",
    "Titanium [Ti]",
    "Tungsten [W]",
    "Uranium [U]",
    "Vanadium [V]",
    "Xenon [Xe]",
    "Ytterbium [Yb]",
    "Yttrium [Y]",
    "Zinc [Zn]",
    "Zirconium [Zr]",
  ];

  const values = [
    "none",
    "Ac",
    "Al",
    "Am",
    "Sb",
    "Ar",
    "As",
    "At",
    "Ba",
    "Bk",
    "Be",
    "Bi",
    "Bh",
    "B",
    "Br",
    "Cd",
    "Ca",
    "Cf",
    "C",
    "Ce",
    "Cs",
    "Cl",
    "Cr",
    "Co",
    "Cu",
    "Cm",
    "Db",
    "Dy",
    "Es",
    "Er",
    "Eu",
    "Fm",
    "F",
    "Fr",
    "Gd",
    "Ga",
    "Ge",
    "Au",
    "Hf",
    "Hs",
    "He",
    "Ho",
    "H",
    "In",
    "I",
    "Ir",
    "Fe",
    "Kr",
    "La",
    "Lr",
    "Pb",
    "Li",
    "Lu",
    "Mg",
    "Mn",
    "Mt",
    "Md",
    "Hg",
    "Mo",
    "Nd",
    "Ne",
    "Np",
    "Ni",
    "Nb",
    "N",
    "No",
    "Os",
    "O",
    "Pd",
    "P",
    "Pt",
    "Pu",
    "Po",
    "K",
    "Pr",
    "Pm",
    "Pa",
    "Ra",
    "Rn",
    "Re",
    "Rh",
    "Rb",
    "Ru",
    "Rf",
    "Sm",
    "Sc",
    "Sg",
    "Se",
    "Si",
    "Ag",
    "Na",
    "Sr",
    "S",
    "Ta",
    "Tc",
    "Te",
    "Tb",
    "Tl",
    "Th",
    "Tm",
    "Sn",
    "Ti",
    "W",
    "U",
    "V",
    "Xe",
    "Yb",
    "Y",
    "Zn",
    "Zr",
  ];

  // Safe labels array (slice ignoring last element)
  const labels = Array.isArray(result?.tech_elem)
    ? result.tech_elem.slice(0, result.tech_elem.length - 1)
    : [];

  // Safe data values (slice ignoring last element, convert to numbers with 2 decimals)
  const dataValues = Array.isArray(result?.tech_frac)
    ? result.tech_frac.slice(0, result.tech_frac.length - 1).map((v) => {
        const num = Number(v);
        return isNaN(num) ? 0 : Number(num.toFixed(2));
      })
    : [];

  // Prepare Chart.js data object
  const datachart = {
    labels: labels,
    datasets: [
      {
        data: dataValues,
        backgroundColor: ["#99EA48", "#ff9f00"], // add more colors if you have more slices
        hoverBackgroundColor: ["#99EA48", "#ff9f00"],
      },
    ],
  };

  // Chart.js options
  const options = {
    plugins: {
      legend: { display: false },
      title: { display: false },
    },
    responsive: true,
    maintainAspectRatio: false,
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

          <div className="lg:w-[50%] md:w-[80%] w-full mx-auto ">
            <div className="grid grid-cols-1  gap-1  md:gap-4">
              <div className="space-y-2 relative">
                <label htmlFor="tech_cmpnd" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_cmpnd"
                    id="tech_cmpnd"
                    value={formData.tech_cmpnd}
                    onChange={handleChange}
                  >
                    <option value="none">Select Compound</option>
                    <option value="C19H29COOH">
                      Abietic Acid [C19H29COOH]
                    </option>
                    <option value="C12H10">Acenaphthene [C12H10]</option>
                    <option value="C12H6O2">Acenaphthoquinone [C12H6O2]</option>
                    <option value="C12H8">Acenaphthylene [C12H8]</option>
                    <option value="CH3CHO">Acetaldehyde [CH3CHO]</option>
                    <option value="C8H9NO">Acetanilide [C8H9NO]</option>
                    <option value="CH3COOH">Acetic Acid [CH3COOH]</option>
                    <option value="CH3COCH3">Acetone [CH3COCH3]</option>
                    <option value="CH3CN">Acetonitrile [CH3CN]</option>
                    <option value="C8H8O">Acetophenone [C8H8O]</option>
                    <option value="C6H5CHO">Benzaldehyde [C6H5CHO]</option>
                    <option value="C6H6">Benzene [C6H6]</option>
                    <option value="C6H5COOH">Benzoic Acid [C6H5COOH]</option>
                    <option value="C7H8O">Benzyl Alcohol [C7H8O]</option>
                    <option value="C6H5Br">Bromobenzene [C6H5Br]</option>
                    <option value="CH3Br">Bromomethane [CH3Br]</option>
                    <option value="C4H8O">Butanal [C4H8O]</option>
                    <option value="C4H10">Butane [C4H10]</option>
                    <option value="C4H10O">2-Butanol [C4H10O]</option>
                    <option value="CO2">Carbon Dioxide [CO2]</option>
                    <option value="H2CO3">Carbonic Acid [H2CO3]</option>
                    <option value="C6H10O5">Cellulose [C6H10O5]</option>
                    <option value="C2HCl3O.H2O">
                      Chloral Hydrate [C2HCl3O.H2O]
                    </option>
                    <option value="C2H3Cl">Chloroethene [C2H3Cl]</option>
                    <option value="CHCl3">Chloroform [CHCl3]</option>
                    <option value="C3H4OH(COOH)3">
                      Citric Acid [C3H4OH(COOH)3]
                    </option>
                    <option value="C6H12">Cyclohexane [C6H12]</option>
                    <option value="C4H10O">Diethyl Ether [C4H10O]</option>
                    <option value="C2H6">Ethane [C2H6]</option>
                    <option value="CH3CH2OH">Ethanol [CH3CH2OH]</option>
                    <option value="C2H4">Ethene [C2H4]</option>
                    <option value="C21H20BrN3">
                      Ethidium Bromide [C21H20BrN3]
                    </option>
                    <option value="C4H8O2">Ethyl Acetate [C4H8O2]</option>
                    <option value="C2H7N">Ethylamine [C2H7N]</option>
                    <option value="C8H10">Ethylbenzene [C8H10]</option>
                    <option value="C2H4">Ethylene [C2H4]</option>
                    <option value="HOCH2CH2OH">
                      Ethylene Glycol [HOCH2CH2OH]
                    </option>
                    <option value="HCHO">Formaldehyde [HCHO]</option>
                    <option value="C6H12O6">Glucose [C6H12O6]</option>
                    <option value="C3H8O3">Glycerol [C3H8O3]</option>
                    <option value="NH2CH2COOH">Glycine [NH2CH2COOH]</option>
                    <option value="C7H16">Heptane [C7H16]</option>
                    <option value="C6H14">Hexane [C6H14]</option>
                    <option value="NH2CH(C4H5N2)COOH">
                      Histidine [NH2CH(C4H5N2)COOH]
                    </option>
                    <option value="C10H18O">Isoborneol [C10H18O]</option>
                    <option value="CH3CH(OH)COOH">
                      Lactic Acid [CH3CH(OH)COOH]
                    </option>
                    <option value="C12H22O11">Lactose [C12H22O11]</option>
                    <option value="C6H14N2O2">Lysine [C6H14N2O2]</option>
                    <option value="C4H2O3">Maleic Anhydride [C4H2O3]</option>
                    <option value="CH4">Methane [CH4]</option>
                    <option value="CH3OH">Methanol [CH3OH]</option>
                    <option value="C3H6O2">Methyl Acetate [C3H6O2]</option>
                    <option value="CH3CH(CH3)CH3">
                      2-Methylpropene [CH3CH(CH3)CH3]
                    </option>
                    <option value="C10H8">Naphthalene [C10H8]</option>
                    <option value="C8H18">Octane [C8H18]</option>
                    <option value="C5H12">Pentane [C5H12]</option>
                    <option value="CH3CONHC6H4OC2H5">
                      Phenacetin [CH3CONHC6H4OC2H5]
                    </option>
                    <option value="C3H8">Propane [C3H8]</option>
                    <option value="CH3CH2COOH">
                      Propionic Acid [CH3CH2COOH]
                    </option>
                    <option value="C7H6O3">Salicylie Acid [C7H6O3]</option>
                    <option value="C8H8">Styrene [C8H8]</option>
                    <option value="C12H22O11">Sucrose [C12H22O11]</option>
                    <option value="C6H5CH3">Toluene [C6H5CH3]</option>
                    <option value="C5H11NO2">Valine [C5H11NO2]</option>
                    <option value="H2O">Water [H2O]</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="tech_elem" className="label">
                  {data?.payload?.tech_lang_keys["2"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_elem"
                    id="tech_elem"
                    value={formData.tech_elem}
                    onChange={handleChange}
                  >
                    {names.map((name, index) => (
                      <option key={index} value={values[index]}>
                        {name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="tech_f" className="label">
                  {data?.payload?.tech_lang_keys["3"]}:
                </label>
                <div className=" relative">
                  <input
                    type="text"
                    step="any"
                    name="tech_f"
                    id="tech_f"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_f}
                    onChange={handleChange}
                  />
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

                  <div className="rounded-lg flex items-center justify-center">
                    <div className="w-full p-3 rounded-lg mt-3 text-[14px] md:text-[18px]">
                      <div className="w-full">
                        <p>
                          <strong>{data?.payload?.tech_lang_keys["4"]}</strong>
                        </p>
                        <p
                          className="text-[#119154] text-3xl font-semibold"
                          dangerouslySetInnerHTML={{
                            __html: result?.tech_mass,
                          }}
                        />

                        <div
                          className="w-full overflow-auto mt-2"
                          dangerouslySetInnerHTML={{
                            __html: result?.tech_table,
                          }}
                        />

                        <p className="mt-3">
                          <strong>{data?.payload?.tech_lang_keys["5"]}</strong>
                        </p>
                        <p
                          className="text-lg mt-1"
                          dangerouslySetInnerHTML={{
                            __html: result?.tech_hill,
                          }}
                        />

                        <p className="mt-1">
                          <strong>{data?.payload?.tech_lang_keys["6"]}</strong>
                        </p>
                        <p
                          className="text-lg mt-1"
                          dangerouslySetInnerHTML={{ __html: result?.tech_emp }}
                        />

                        <p className="mt-1">
                          <strong>{data?.payload?.tech_lang_keys["7"]}</strong>
                        </p>
                        <p
                          className="text-lg mt-1"
                          dangerouslySetInnerHTML={{
                            __html: result?.tech_n_mass,
                          }}
                        />

                        <p className="mt-1">
                          <strong>{data?.payload?.tech_lang_keys["8"]}</strong>
                        </p>
                        <p
                          className="text-lg mt-1"
                          dangerouslySetInnerHTML={{
                            __html: result?.tech_m_mass,
                          }}
                        />

                        <div className="w-full mt-5">
                          <p>
                            <strong>
                              {data?.payload?.tech_lang_keys["9"]}:
                            </strong>
                          </p>
                          <div
                            style={{ width: "250px", height: "250px" }}
                            className="mt-5"
                          >
                            <Pie data={datachart} options={options} />
                          </div>
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

export default MolarMassCalculator;

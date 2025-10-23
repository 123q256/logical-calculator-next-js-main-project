"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useSolarPanelCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const SolarPanelCalculator = () => {
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
    tech_first: "1300",
    tech_units1: "yr",
    tech_operations1: "2", //  1 2
    tech_operations2: "1&&Afghanistan",
    tech_operations3: "1&&Alberta (Calgary)",
    tech_operations4: "1&&Alaska (Anchorage)",
    tech_second: "50",
    tech_third: "50",
    tech_four: "85",
    tech_five: "5",
    tech_units5: "m²",
    tech_six: "7",
    tech_units6: "cm²",
    tech_seven: "300",
    tech_units7: "W",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useSolarPanelCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_first || !formData.tech_units1) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_first: formData.tech_first,
        tech_units1: formData.tech_units1,
        tech_operations1: formData.tech_operations1,
        tech_operations2: formData.tech_operations2,
        tech_operations3: formData.tech_operations3,
        tech_operations4: formData.tech_operations4,
        tech_second: formData.tech_second,
        tech_third: formData.tech_third,
        tech_four: formData.tech_four,
        tech_five: formData.tech_five,
        tech_units5: formData.tech_units5,
        tech_six: formData.tech_six,
        tech_units6: formData.tech_units6,
        tech_seven: formData.tech_seven,
        tech_units7: formData.tech_units7,
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
      tech_first: "1300",
      tech_units1: "yr",
      tech_operations1: "2", //  1 2
      tech_operations2: "1&&Afghanistan",
      tech_operations3: "1&&Alberta (Calgary)",
      tech_operations4: "1&&Alaska (Anchorage)",
      tech_second: "50",
      tech_third: "50",
      tech_four: "85",
      tech_five: "5",
      tech_units5: "m²",
      tech_six: "7",
      tech_units6: "cm²",
      tech_seven: "300",
      tech_units7: "W",
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
    setFormData((prev) => ({ ...prev, tech_units1: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  //dropdown states
  const [dropdownVisible1, setDropdownVisible1] = useState(false);

  const setUnitHandler1 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_units5: unit }));
    setDropdownVisible1(false);
  };

  const toggleDropdown1 = () => {
    setDropdownVisible1(!dropdownVisible1);
  };

  //dropdown states
  const [dropdownVisible2, setDropdownVisible2] = useState(false);

  const setUnitHandler2 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_units6: unit }));
    setDropdownVisible2(false);
  };

  const toggleDropdown2 = () => {
    setDropdownVisible2(!dropdownVisible2);
  };

  //dropdown states
  const [dropdownVisible3, setDropdownVisible3] = useState(false);

  const setUnitHandler3 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_units7: unit }));
    setDropdownVisible3(false);
  };

  const toggleDropdown3 = () => {
    setDropdownVisible3(!dropdownVisible3);
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
            <div
              className="grid grid-cols-1  lg:grid-cols-2 md:grid-cols-2 gap-1  md:gap-4"
              id="f1"
            >
              <div className="space-y-2">
                <label htmlFor="tech_first" className="label">
                  {data?.payload?.tech_lang_keys["4"]}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_first"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_first}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown}
                  >
                    {formData.tech_units1} ▾
                  </label>
                  {dropdownVisible && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "/yr", value: "yr" },
                        { label: "/mon", value: "mon" },
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
              <div className="space-y-2">
                <label htmlFor="tech_operations1" className="label">
                  {data?.payload?.tech_lang_keys["4"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_operations1"
                    id="tech_operations1"
                    value={formData.tech_operations1}
                    onChange={handleChange}
                  >
                    <option value="1">
                      {data?.payload?.tech_lang_keys["5"]}
                    </option>
                    <option value="2">
                      {data?.payload?.tech_lang_keys["6"]}
                    </option>
                  </select>
                </div>
              </div>
              {formData.tech_operations1 == "2" && (
                <>
                  <div className="space-y-2 " id="country">
                    <label htmlFor="tech_operations2" className="label">
                      {data?.payload?.tech_lang_keys["7"]}:
                    </label>
                    <div className="mt-1">
                      <select
                        className="input"
                        aria-label="select"
                        name="tech_operations2"
                        id="tech_operations2"
                        value={formData.tech_operations2}
                        onChange={handleChange}
                      >
                        <option className="hidel" value="1&&Afghanistan">
                          Afghanistan
                        </option>
                        <option className="hidel" value="2&&Albania (Tirane)">
                          Albania (Tirane)
                        </option>
                        <option className="hidel" value="3&&Algeria (Algiers)">
                          Algeria (Algiers)
                        </option>
                        <option
                          className="hidel"
                          value="4&&Am. Samoa (Pago Pago)"
                        >
                          Am. Samoa (Pago Pago)
                        </option>
                        <option
                          className="hidel"
                          value="5&&Andorra (Andorra la Vella)"
                        >
                          Andorra (Andorra la Vella)
                        </option>
                        <option className="hidel" value="6&&Angola (Luanda)">
                          Angola (Luanda)
                        </option>
                        <option
                          className="hidel"
                          value="7&&Antigua and Barbuda (W. Indies)"
                        >
                          {" "}
                          Antigua and Barbuda (W. Indies)
                        </option>
                        <option
                          className="hidel"
                          value="8&&Argentina (Buenos Aires)"
                        >
                          Argentina (Buenos Aires)
                        </option>
                        <option className="hidel" value="9&&Armenia (Yerevan)">
                          Armenia (Yerevan)
                        </option>
                        <option
                          className="hidel"
                          value="10&&Aruba (Oranjestad)"
                        >
                          Aruba (Oranjestad)
                        </option>
                        <option
                          className="hidel"
                          value="11&&Australia (Canberra)"
                        >
                          Australia (Canberra)
                        </option>
                        <option className="hidel" value="12&&Austria (Vienna)">
                          Austria (Vienna)
                        </option>
                        <option className="hidel" value="13&&Azerbaijan (Baku)">
                          Azerbaijan (Baku)
                        </option>
                        <option className="hidel" value="14&&Bahamas (Nassau)">
                          Bahamas (Nassau)
                        </option>
                        <option className="hidel" value="15&&Bahrain (Manama)">
                          Bahrain (Manama)
                        </option>
                        <option
                          className="hidel"
                          value="16&&Bangladesh (Dhaka)"
                        >
                          Bangladesh (Dhaka)
                        </option>
                        <option
                          className="hidel"
                          value="17&&Barbados (Bridgetown)"
                        >
                          Barbados (Bridgetown)
                        </option>
                        <option className="hidel" value="18&&Belarus (Minsk)">
                          Belarus (Minsk)
                        </option>
                        <option
                          className="hidel"
                          value="19&&Belgium (Brussels)"
                        >
                          Belgium (Brussels)
                        </option>
                        <option className="hidel" value="20&&Belize (Belmopan)">
                          Belize (Belmopan)
                        </option>
                        <option
                          className="hidel"
                          value="21&&Benin (Porto-Novo)"
                        >
                          Benin (Porto-Novo)
                        </option>
                        <option className="hidel" value="22&&Bhutan (Thimphu)">
                          Bhutan (Thimphu)
                        </option>
                        <option className="hidel" value="23&&Bolivia (La Paz)">
                          Bolivia (La Paz)
                        </option>

                        <option
                          className="hidel"
                          value="24&&Bosnia and Herzegovina (Sarajevo)"
                        >
                          {" "}
                          Bosnia and Herzegovina (Sarajevo)
                        </option>
                        <option
                          className="hidel"
                          value="25&&Botswana (Gaborone)"
                        >
                          Botswana (Gaborone)
                        </option>
                        <option className="hidel" value="26&&Brazil (Brasilia)">
                          Brazil (Brasilia)
                        </option>
                        <option
                          className="hidel"
                          value="27&&British Virgin Islands (Road Town)"
                        >
                          {" "}
                          British Virgin Islands (Road Town)
                        </option>
                        <option
                          className="hidel"
                          value="28&&Brunei Darussalam (Bandar Seri Begawan)"
                        >
                          {" "}
                          Brunei Darussalam (Bandar Seri Begawan)
                        </option>
                        <option className="hidel" value="29&&Bulgaria (Sofia)">
                          Bulgaria (Sofia)
                        </option>
                        <option
                          className="hidel"
                          value="30&&Burkina Faso (Ouagadougou)"
                        >
                          Burkina Faso (Ouagadougou){" "}
                        </option>
                        <option
                          className="hidel"
                          value="31&&Burundi (Bujumbura)"
                        >
                          Burundi (Bujumbura)
                        </option>
                        <option
                          className="hidel"
                          value="32&&Cambodia (Phnom Penh)"
                        >
                          Cambodia (Phnom Penh)
                        </option>
                        <option
                          className="hidel"
                          value="33&&Cameroon (Yaounde)"
                        >
                          Cameroon (Yaounde)
                        </option>
                        <option className="hidel_can" value="34&&Canada">
                          Canada
                        </option>
                        <option
                          className="hidel"
                          value="35&&Cape Verde (Praia)"
                        >
                          Cape Verde (Praia)
                        </option>
                        <option
                          className="hidel"
                          value="36&&Cayman Islands (George Town)"
                        >
                          Cayman Islands (George Town)
                        </option>
                        <option
                          className="hidel"
                          value="37&&Central African Republic (Bangui)"
                        >
                          {" "}
                          Central African Republic (Bangui)
                        </option>
                        <option className="hidel" value="38&&Chad (N'Djamena)">
                          Chad (N'Djamena)
                        </option>
                        <option className="hidel" value="39&&Chile (Santiago)">
                          Chile (Santiago)
                        </option>
                        <option className="hidel" value="40&&China (Beijing)">
                          China (Beijing)
                        </option>
                        <option className="hidel" value="41&&Colombia (Bogota)">
                          Colombia (Bogota)
                        </option>
                        <option className="hidel" value="42&&Comros (Moroni)">
                          Comros (Moroni)
                        </option>
                        <option
                          className="hidel"
                          value="43&&Congo (Brazzaville)"
                        >
                          Congo (Brazzaville)
                        </option>
                        <option className="hidel" value="44&&Congo (Kinshasa)">
                          Congo (Kinshasa)
                        </option>
                        <option
                          className="hidel"
                          value="45&&Costa Rica (San Jose)"
                        >
                          Costa Rica (San Jose)
                        </option>
                        <option
                          className="hidel"
                          value="46&&Cote d'Ivoire (Yamoussoukro)"
                        >
                          Cote d'Ivoire (Yamoussoukro)
                        </option>
                        <option className="hidel" value="47&&Croatia (Zagreb)">
                          Croatia (Zagreb)
                        </option>
                        <option className="hidel" value="48&&Cuba (Havana)">
                          Cuba (Havana)
                        </option>
                        <option className="hidel" value="49&&Cyprus (Nicosia)">
                          Cyprus (Nicosia)
                        </option>
                        <option
                          className="hidel"
                          value="50&&Czech Republic (Prague)"
                        >
                          Czech Republic (Prague)
                        </option>
                        <option
                          className="hidel"
                          value="51&&Denmark (Copenhagen)"
                        >
                          Denmark (Copenhagen)
                        </option>
                        <option
                          className="hidel"
                          value="52&&Djibouti (Djibouti)"
                        >
                          Djibouti (Djibouti)
                        </option>
                        <option className="hidel" value="53&&Dominica (Roseau)">
                          Dominica (Roseau)
                        </option>
                        <option
                          className="hidel"
                          value="54&&Dominica Republic (Santo Domingo)"
                        >
                          Dominica Republic (Santo Domingo)
                        </option>
                        <option className="hidel" value="55&&East Timor (Dili)">
                          East Timor (Dili)
                        </option>
                        <option className="hidel" value="56&&Ecuador (Quito)">
                          Ecuador (Quito)
                        </option>
                        <option className="hidel" value="57&&Egypt (Cairo)">
                          Egypt (Cairo)
                        </option>
                        <option
                          className="hidel"
                          value="58&&El Salvador (San Salvador)"
                        >
                          El Salvador (San Salvador)
                        </option>
                        <option
                          className="hidel"
                          value="59&&Equatorial Guinea (Malabo)"
                        >
                          Equatorial Guinea (Malabo)
                        </option>
                        <option className="hidel" value="60&&Eritrea (Asmara)">
                          Eritrea (Asmara)
                        </option>
                        <option className="hidel" value="61&&Estonia (Tallinn)">
                          Estonia (Tallinn)
                        </option>
                        <option
                          className="hidel"
                          value="62&&Ethiopia (Addis Ababa)"
                        >
                          Ethiopia (Addis Ababa)
                        </option>
                        <option
                          className="hidel"
                          value="63&&Falkland Islands (Stanley)"
                        >
                          Falkland Islands (Stanley)
                        </option>
                        <option
                          className="hidel"
                          value="64&&Faroe Islands (Torshavn)"
                        >
                          Faroe Islands (Torshavn)
                        </option>
                        <option className="hidel" value="65&&Fiji (Suva)">
                          Fiji (Suva)
                        </option>
                        <option
                          className="hidel"
                          value="66&&Finland (Helsinki)"
                        >
                          Finland (Helsinki)
                        </option>
                        <option className="hidel" value="67&&France (Paris)">
                          France (Paris)
                        </option>
                        <option
                          className="hidel"
                          value="68&&Gabon (Libreville)"
                        >
                          Gabon (Libreville)
                        </option>
                        <option className="hidel" value="69&&Gambia (Banjul)">
                          Gambia (Banjul)
                        </option>
                        <option className="hidel" value="70&&Georgia (Tbilisi)">
                          Georgia (Tbilisi)
                        </option>
                        <option className="hidel" value="71&&Germany (Berlin)">
                          Germany (Berlin)
                        </option>
                        <option className="hidel" value="72&&Ghana (Accra)">
                          Ghana (Accra)
                        </option>
                        <option className="hidel" value="73&&Greece (Athens)">
                          Greece (Athens)
                        </option>
                        <option className="hidel" value="74&&Greenland (Nuuk)">
                          Greenland (Nuuk)
                        </option>
                        <option
                          className="hidel"
                          value="75&&Guadeloupe (Basse-Terre)"
                        >
                          Guadeloupe (Basse-Terre)
                        </option>
                        <option
                          className="hidel"
                          value="76&&Guatemala (Guatemala)"
                        >
                          Guatemala (Guatemala)
                        </option>
                        <option
                          className="hidel"
                          value="77&&Guernsey (St. Peter Port)"
                        >
                          Guernsey (St. Peter Port)
                        </option>
                        <option className="hidel" value="78&&Guiana (Cayenne)">
                          Guiana (Cayenne)
                        </option>
                        <option className="hidel" value="79&&Guinea (Conakry)">
                          Guinea (Conakry)
                        </option>
                        <option
                          className="hidel"
                          value="80&&Guinea-Bissau (Bissau)"
                        >
                          Guinea-Bissau (Bissau)
                        </option>
                        <option
                          className="hidel"
                          value="81&&Guyana (Georgetown)"
                        >
                          Guyana (Georgetown)
                        </option>
                        <option
                          className="hidel"
                          value="82&&Haiti (Port-au-Prince)"
                        >
                          Haiti (Port-au-Prince)
                        </option>
                        <option
                          className="hidel"
                          value="83&&Heard and McDonald Islands()"
                        >
                          Heard and McDonald Islands()
                        </option>
                        <option
                          className="hidel"
                          value="84&&Honduras (Tegucigalpa)"
                        >
                          Honduras (Tegucigalpa)
                        </option>
                        <option
                          className="hidel"
                          value="85&&Hungary (Budapest)"
                        >
                          Hungary (Budapest)
                        </option>
                        <option
                          className="hidel"
                          value="86&&Iceland (Reykjavik)"
                        >
                          Iceland (Reykjavik)
                        </option>
                        <option className="hidel" value="87&&India (New Delhi)">
                          India (New Delhi)
                        </option>
                        <option
                          className="hidel"
                          value="88&&Indonesia (Jakarta)"
                        >
                          Indonesia (Jakarta)
                        </option>
                        <option className="hidel" value="89&&Iran (Tehran)">
                          Iran (Tehran)
                        </option>
                        <option className="hidel" value="90&&Iraq (Baghdad)">
                          Iraq (Baghdad)
                        </option>
                        <option className="hidel" value="91&&Ireland (Dublin)">
                          Ireland (Dublin)
                        </option>
                        <option
                          className="hidel"
                          value="92&&Israel (Jerusalem)"
                        >
                          Israel (Jerusalem)
                        </option>
                        <option className="hidel" value="93&&Italy (Rome)">
                          Italy (Rome)
                        </option>
                        <option
                          className="hidel"
                          value="94&&Jamaica (Kingston)"
                        >
                          Jamaica (Kingston)
                        </option>
                        <option className="hidel" value="95&&Jordan (Amman)">
                          Jordan (Amman)
                        </option>
                        <option
                          className="hidel"
                          value="96&&Kazakhstan (Astana)"
                        >
                          Kazakhstan (Astana)
                        </option>
                        <option className="hidel" value="97&&Kenya (Nairobi)">
                          Kenya (Nairobi)
                        </option>
                        <option className="hidel" value="98&&Kiribati (Tarawa)">
                          Kiribati (Tarawa)
                        </option>
                        <option className="hidel" value="99&&Kuwait (Kuwait)">
                          Kuwait (Kuwait)
                        </option>
                        <option
                          className="hidel"
                          value="100&&Kyrgyzstan (Bishkek)"
                        >
                          Kyrgyzstan (Bishkek)
                        </option>
                        <option className="hidel" value="101&&Laos (Vientiane)">
                          Laos (Vientiane)
                        </option>
                        <option className="hidel" value="102&&Latvia (Riga)">
                          Latvia (Riga)
                        </option>
                        <option className="hidel" value="103&&Lebanon (Beirut)">
                          Lebanon (Beirut)
                        </option>
                        <option className="hidel" value="104&&Lesotho (Maseru)">
                          Lesotho (Maseru)
                        </option>
                        <option
                          className="hidel"
                          value="105&&Liberia (Monrovia)"
                        >
                          Liberia (Monrovia)
                        </option>
                        <option className="hidel" value="106&&Libya (Tripoli)">
                          Libya (Tripoli)
                        </option>
                        <option
                          className="hidel"
                          value="107&&Liechtenstein (Vaduz)"
                        >
                          Liechtenstein (Vaduz)
                        </option>
                        <option
                          className="hidel"
                          value="108&&Lithuania (Vilnius)"
                        >
                          Lithuania (Vilnius)
                        </option>
                        <option
                          className="hidel"
                          value="109&&Luxembourg (Luxembourg City)"
                        >
                          Luxembourg (Luxembourg City)
                        </option>
                        <option
                          className="hidel"
                          value="110&&Macao, China (Macau)"
                        >
                          Macao, China (Macau)
                        </option>
                        <option
                          className="hidel"
                          value="111&&Macedonia (Skopje)"
                        >
                          Macedonia (Skopje)
                        </option>
                        <option
                          className="hidel"
                          value="112&&Madagascar (Antananarivo)"
                        >
                          Madagascar (Antananarivo)
                        </option>
                        <option
                          className="hidel"
                          value="113&&Malawi (Lilongwe)"
                        >
                          Malawi (Lilongwe)
                        </option>
                        <option
                          className="hidel"
                          value="114&&Malaysia (Kuala Lumpur)"
                        >
                          Malaysia (Kuala Lumpur)
                        </option>
                        <option className="hidel" value="115&&Maldives (Male)">
                          Maldives (Male)
                        </option>
                        <option className="hidel" value="116&&Mali (Bamako)">
                          Mali (Bamako)
                        </option>
                        <option className="hidel" value="117&&Malta (Valletta)">
                          Malta (Valletta)
                        </option>
                        <option
                          className="hidel"
                          value="118&&Martinique (Fort-de-France)"
                        >
                          Martinique (Fort-de-France)
                        </option>
                        <option
                          className="hidel"
                          value="119&&Mauritania (Nouakchott)"
                        >
                          Mauritania (Nouakchott)
                        </option>
                        <option
                          className="hidel"
                          value="120&&Mayotte (Mamoudzou)"
                        >
                          Mayotte (Mamoudzou)
                        </option>
                        <option
                          className="hidel"
                          value="121&&Mexico (Mexico City)"
                        >
                          Mexico (Mexico City)
                        </option>
                        <option
                          className="hidel"
                          value="122&&Micronesia (Palikir)"
                        >
                          Micronesia (Palikir)
                        </option>
                        <option
                          className="hidel"
                          value="123&&Moldova (Chisinau)"
                        >
                          Moldova (Chisinau)
                        </option>
                        <option
                          className="hidel"
                          value="124&&Mozambique (Maputo)"
                        >
                          Mozambique (Maputo)
                        </option>
                        <option className="hidel" value="125&&Myanmar (Yangon)">
                          Myanmar (Yangon)
                        </option>
                        <option
                          className="hidel"
                          value="126&&Namibia (Windhoek)"
                        >
                          Namibia (Windhoek)
                        </option>
                        <option
                          className="hidel"
                          value="127&&Nepal (Kathmandu)"
                        >
                          Nepal (Kathmandu)
                        </option>
                        <option
                          className="hidel"
                          value="128&&Netherlands (Amsterdam)"
                        >
                          Netherlands (Amsterdam)
                        </option>
                        <option
                          className="hidel"
                          value="129&&Netherlands Antilles (Willemstad)"
                        >
                          {" "}
                          Netherlands Antilles (Willemstad)
                        </option>
                        <option
                          className="hidel"
                          value="130&&New Caledonia (Noumea)"
                        >
                          New Caledonia (Noumea)
                        </option>
                        <option
                          className="hidel"
                          value="131&&New Zealand (Wellington)"
                        >
                          New Zealand (Wellington)
                        </option>
                        <option
                          className="hidel"
                          value="132&&Nicaragua (Managua)"
                        >
                          Nicaragua (Managua)
                        </option>
                        <option className="hidel" value="133&&Niger (Niamey)">
                          Niger (Niamey)
                        </option>
                        <option className="hidel" value="134&&Nigeria (Abuja)">
                          Nigeria (Abuja)
                        </option>
                        <option
                          className="hidel"
                          value="135&&Norfolk Island (Kingston)"
                        >
                          Norfolk Island (Kingston)
                        </option>
                        <option
                          className="hidel"
                          value="136&&North Korea (Pyongyang)"
                        >
                          North Korea (Pyongyang)
                        </option>
                        <option
                          className="hidel"
                          value="137&&Northern Mariana Islands (Saipan)"
                        >
                          Northern Mariana Islands (Saipan)
                        </option>
                        <option className="hidel" value="138&&Norway (Oslo)">
                          Norway (Oslo)
                        </option>
                        <option className="hidel" value="139&&Oman (Muscat)">
                          Oman (Muscat)
                        </option>
                        <option
                          className="hidel"
                          value="140&&Pakistan (Islamabad)"
                        >
                          Pakistan (Islamabad)
                        </option>
                        <option className="hidel" value="141&&Palau (Koror)">
                          Palau (Koror)
                        </option>
                        <option
                          className="hidel"
                          value="142&&Panama (Panama City)"
                        >
                          Panama (Panama City)
                        </option>
                        <option
                          className="hidel"
                          value="143&&Papua New Guinea (Port Moresby)"
                        >
                          {" "}
                          Papua New Guinea (Port Moresby)
                        </option>
                        <option
                          className="hidel"
                          value="144&&Paraguay (Asuncion)"
                        >
                          Paraguay (Asuncion)
                        </option>
                        <option className="hidel" value="145&&Peru (Lima)">
                          Peru (Lima)
                        </option>
                        <option
                          className="hidel"
                          value="146&&Philippines (Manila)"
                        >
                          Philippines (Manila)
                        </option>
                        <option className="hidel" value="147&&Poland (Warsaw)">
                          Poland (Warsaw)
                        </option>
                        <option
                          className="hidel"
                          value="148&&Polynesia (Papeete)"
                        >
                          Polynesia (Papeete)
                        </option>
                        <option
                          className="hidel"
                          value="149&&Portugal (Lisbon)"
                        >
                          Portugal (Lisbon)
                        </option>
                        <option
                          className="hidel"
                          value="150&&Puerto Rico (San Juan)"
                        >
                          Puerto Rico (San Juan)
                        </option>
                        <option className="hidel" value="151&&Qatar (Doha)">
                          Qatar (Doha)
                        </option>
                        <option className="hidel" value="152&&Rawanda (Kigali)">
                          Rawanda (Kigali)
                        </option>
                        <option
                          className="hidel"
                          value="153&&Romania (Bucharest)"
                        >
                          Romania (Bucharest)
                        </option>
                        <option className="hidel" value="154&&Russia(Moscow)">
                          Russia(Moscow)
                        </option>
                        <option
                          className="hidel"
                          value="155&&Saint Kitts and Nevis (Basseterre)"
                        >
                          Saint Kitts and Nevis (Basseterre)
                        </option>
                        <option
                          className="hidel"
                          value="156&&Saint Lucia (Castries)"
                        >
                          Saint Lucia (Castries)
                        </option>
                        <option
                          className="hidel"
                          value="157&&Saint Pierre and Miquelon (Saint-Pierre)"
                        >
                          {" "}
                          Saint Pierre and Miquelon (Saint-Pierre)
                        </option>
                        <option
                          className="hidel"
                          value="158&&Saint vincent and the Grenadines (Kingstown)"
                        >
                          Saint vincent and the Grenadines (Kingstown)
                        </option>
                        <option className="hidel" value="159&&Samoa (Apia)">
                          Samoa (Apia)
                        </option>
                        <option
                          className="hidel"
                          value="160&&San Marino (San Marino)"
                        >
                          San Marino (San Marino)
                        </option>
                        <option
                          className="hidel"
                          value="161&&Sao Tome and Principe (Sao Tome)"
                        >
                          Sao Tome and Principe (Sao Tome)
                        </option>
                        <option
                          className="hidel"
                          value="162&&Saudi Arabia (Riyadh)"
                        >
                          Saudi Arabia (Riyadh)
                        </option>
                        <option className="hidel" value="163&&Senegal (Dakar)">
                          Senegal (Dakar)
                        </option>
                        <option
                          className="hidel"
                          value="164&&Serbia (Belgrade)"
                        >
                          Serbia (Belgrade)
                        </option>
                        <option
                          className="hidel"
                          value="165&&Sierra Leone (Freetown)"
                        >
                          Sierra Leone (Freetown)
                        </option>
                        <option
                          className="hidel"
                          value="166&&Slovakia (Bratislava)"
                        >
                          Slovakia (Bratislava)
                        </option>
                        <option
                          className="hidel"
                          value="167&&Slovenia (Ljubljana)"
                        >
                          Slovenia (Ljubljana)
                        </option>
                        <option
                          className="hidel"
                          value="168&&Solomon Islands (Honiara)"
                        >
                          Solomon Islands (Honiara)
                        </option>
                        <option
                          className="hidel"
                          value="169&&Somalia (Mogadishu)"
                        >
                          Somalia (Mogadishu)
                        </option>
                        <option
                          className="hidel"
                          value="170&&South Africa (Pretoria)"
                        >
                          South Africa (Pretoria)
                        </option>
                        <option
                          className="hidel"
                          value="171&&South Korea (Seoul)"
                        >
                          South Korea (Seoul)
                        </option>
                        <option className="hidel" value="172&&Spain (Madrid)">
                          Spain (Madrid)
                        </option>
                        <option className="hidel" value="173&&Sudan (Khartoum)">
                          Sudan (Khartoum)
                        </option>
                        <option
                          className="hidel"
                          value="174&&Suriname (Paramaribo)"
                        >
                          Suriname (Paramaribo){" "}
                        </option>
                        <option
                          className="hidel"
                          value="175&&Swaziland (Mbabane)"
                        >
                          Swaziland (Mbabane)
                        </option>
                        <option
                          className="hidel"
                          value="176&&Sweden (Stockholm)"
                        >
                          Sweden (Stockholm)
                        </option>
                        <option
                          className="hidel"
                          value="177&&Switzerland (Bern)"
                        >
                          Switzerland (Bern)
                        </option>
                        <option className="hidel" value="178&&Syria (Damascus)">
                          Syria (Damascus)
                        </option>
                        <option
                          className="hidel"
                          value="179&&Tajikistan (Dushanbe)"
                        >
                          Tajikistan (Dushanbe)
                        </option>
                        <option
                          className="hidel"
                          value="180&&Tanzania (Dodoma)"
                        >
                          Tanzania (Dodoma)
                        </option>
                        <option
                          className="hidel"
                          value="181&&Thailand (Bangkok)"
                        >
                          Thailand (Bangkok)
                        </option>
                        <option className="hidel" value="182&&Togo (Lome)">
                          Togo (Lome)
                        </option>
                        <option
                          className="hidel"
                          value="183&&Tonga (Nuku'alofa)"
                        >
                          Tonga (Nuku'alofa)
                        </option>
                        <option className="hidel" value="184&&Tunisia (Tunis)">
                          Tunisia (Tunis)
                        </option>
                        <option className="hidel" value="185&&Turkey (Ankara)">
                          Turkey (Ankara)
                        </option>
                        <option
                          className="hidel"
                          value="186&&Turkmenistan (Ashgabat)"
                        >
                          Turkmenistan (Ashgabat)
                        </option>
                        <option
                          className="hidel"
                          value="187&&Tuvalu (Funafuti)"
                        >
                          Tuvalu (Funafuti)
                        </option>
                        <option className="hidel" value="188&&Uganda (Kampala)">
                          Uganda (Kampala)
                        </option>
                        <option className="hidel" value="189&&Ukraine (Kiev)">
                          Ukraine (Kiev)
                        </option>
                        <option
                          className="hidel"
                          value="190&&United Arab Emirates (Abu Dhabi)"
                        >
                          {" "}
                          United Arab Emirates (Abu Dhabi)
                        </option>
                        <option
                          className="hidel"
                          value="191&&United Kingdom (London)"
                        >
                          United Kingdom (London)
                        </option>
                        <option
                          className="hidel"
                          value="192&&Uruguay (Montevideo)"
                        >
                          Uruguay (Montevideo)
                        </option>
                        <option
                          className="hidel"
                          value="193&&US of Virgin Islands (Charlotte Amalie)"
                        >
                          US of Virgin Islands (Charlotte Amalie)
                        </option>
                        <option className="hidel_usa" value="194&&USA">
                          USA
                        </option>
                        <option
                          className="hidel"
                          value="195&&Uzbekistan (Tashkent)"
                        >
                          Uzbekistan (Tashkent)
                        </option>
                        <option
                          className="hidel"
                          value="196&&Vanuatu (Port-Vila)"
                        >
                          Vanuatu (Port-Vila)
                        </option>
                        <option
                          className="hidel"
                          value="197&&Venezuela (Caracas)"
                        >
                          Venezuela (Caracas)
                        </option>
                        <option className="hidel" value="198&&Viet Nam (Hanoi)">
                          Viet Nam (Hanoi)
                        </option>
                        <option className="hidel" value="199&&Zambia (Lusaka)">
                          Zambia (Lusaka)
                        </option>
                        <option
                          className="hidel"
                          value="200&&Zimbabwe (Harare)"
                        >
                          Zimbabwe (Harare)
                        </option>
                      </select>
                    </div>
                  </div>
                </>
              )}
              {formData.tech_operations2 == "34&&Canada" && (
                <>
                  <div className="space-y-2 " id="can_city">
                    <label htmlFor="tech_operations3" className="label">
                      {data?.payload?.tech_lang_keys["8"]}/
                      {data?.payload?.tech_lang_keys["9"]}:
                    </label>
                    <div className="mt-1">
                      <select
                        className="input"
                        aria-label="select"
                        name="tech_operations3"
                        id="tech_operations3"
                        value={formData.tech_operations3}
                        onChange={handleChange}
                      >
                        <option value="1&&Alberta (Calgary)">
                          Alberta (Calgary)
                        </option>
                        <option value="2&&Alberta (Edmonton)">
                          Alberta (Edmonton)
                        </option>
                        <option value="3&&British Columbia (Nelson)">
                          British Columbia (Nelson)
                        </option>
                        <option value="4&&British Columbia (Vancouver)">
                          British Columbia (Vancouver)
                        </option>
                        <option value="5&&British Columbia (Victoria)">
                          British Columbia (Victoria)
                        </option>
                        <option value="6&&Manitoba (Winnipeg)">
                          Manitoba (Winnipeg)
                        </option>
                        <option value="7&&New Brunswick (Fredericton)">
                          New Brunswick (Fredericton)
                        </option>
                        <option value="8&&Newfoundland (St. John's)">
                          Newfoundland (St. John's)
                        </option>
                        <option value="9&&Northwest Territories (Yellowknife)">
                          Northwest Territories (Yellowknife)
                        </option>
                        <option value="10&&Nova Scotia (Halifax)">
                          Nova Scotia (Halifax)
                        </option>
                        <option value="11&&Nunavut (Iqaluit)">
                          Nunavut (Iqaluit)
                        </option>
                        <option value="12&&Ontario (Kingston)">
                          Ontario (Kingston)
                        </option>
                        <option value="13&&Ontario (London)">
                          Ontario (London)
                        </option>
                        <option value="14&&Ontario (Ottawa)">
                          Ontario (Ottawa)
                        </option>
                        <option value="15&&Ontario (Toronto)">
                          Ontario (Toronto)
                        </option>
                        <option value="16&&Quebec (Montreal)">
                          Quebec (Montreal)
                        </option>
                        <option value="17&&Quebec (Quebec)">
                          Quebec (Quebec)
                        </option>
                        <option value="18&&Saskatchewan (Moose Jaw)">
                          Saskatchewan (Moose Jaw)
                        </option>
                        <option value="19&&Yukon (Whitehorse)">
                          Yukon (Whitehorse)
                        </option>
                      </select>
                    </div>
                  </div>
                </>
              )}
              {formData.tech_operations2 == "194&&USA" && (
                <>
                  <div className="space-y-2 " id="usa_city">
                    <label htmlFor="tech_operations4" className="label">
                      {data?.payload?.tech_lang_keys["11"]} (
                      {data?.payload?.tech_lang_keys["10"]})
                    </label>
                    <div className="mt-1">
                      <select
                        className="input"
                        aria-label="select"
                        name="tech_operations4"
                        id="tech_operations4"
                        value={formData.tech_operations4}
                        onChange={handleChange}
                      >
                        <option value="1&&Alaska (Anchorage)">
                          Alaska (Anchorage)
                        </option>
                        <option value="2&&Alaska (Juneau)">
                          Alaska (Juneau)
                        </option>
                        <option value="3&&Alaska (Sitka)">
                          Alaska (Sitka)
                        </option>
                        <option value="4&&Alabama (Birmingham)">
                          Alabama (Birmingham)
                        </option>
                        <option value="5&&Alabama (Mobile)">
                          Alabama (Mobile)
                        </option>
                        <option value="6&&Alabama (Montgomery)">
                          Alabama (Montgomery)
                        </option>
                        <option value="7&&Alaska (Nome)">Alaska (Nome)</option>
                        <option value="8&&Arizona (Flagstaff)">
                          Arizona (Flagstaff)
                        </option>
                        <option value="9&&Arizona (Phoenix)">
                          Arizona (Phoenix)
                        </option>
                        <option value="10&&Arkansas (Hot Springs)">
                          Arkansas (Hot Springs)
                        </option>
                        <option value="11&&California (El Centro)">
                          California (El Centro)
                        </option>
                        <option value="12&&California (Fresno)">
                          California (Fresno)
                        </option>
                        <option value="13&&California (Long Beach)">
                          California (Long Beach)
                        </option>
                        <option value="14&&California (Los Angeles)">
                          California (Los Angeles)
                        </option>
                        <option value="15&&California (Oakland)">
                          California (Oakland)
                        </option>
                        <option value="16&&California (Sacramento)">
                          California (Sacramento)
                        </option>
                        <option value="17&&California (San Diego)">
                          California (San Diego)
                        </option>
                        <option value="18&&California (San Francisco)">
                          California (San Francisco)
                        </option>
                        <option value="19&&California (San Jose)">
                          California (San Jose)
                        </option>
                        <option value="20&&Colorado (Denver)">
                          Colorado (Denver)
                        </option>
                        <option value="21&&Colorado (Grand Junction)">
                          Colorado (Grand Junction)
                        </option>
                        <option value="22&&Connecticut (New Haven)">
                          Connecticut (New Haven)
                        </option>
                        <option value="23&&D.C. (Washington)">
                          D.C. (Washington)
                        </option>
                        <option value="24&&Florida (Jacksonville)">
                          Florida (Jacksonville)
                        </option>
                        <option value="25&&Florida (Key West)">
                          Florida (Key West)
                        </option>
                        <option value="26&&Florida (Miami)">
                          Florida (Miami)
                        </option>
                        <option value="27&&Florida (Tampa)">
                          Florida (Tampa)
                        </option>
                        <option value="28&&Georgia (Atlanta)">
                          Georgia (Atlanta)
                        </option>
                        <option value="29&&Georgia (Savannah)">
                          Georgia (Savannah)
                        </option>
                        <option value="30&&Hawaii (Honolulu)">
                          Hawaii (Honolulu)
                        </option>
                        <option value="31&&Idaho (Boise)">Idaho (Boise)</option>
                        <option value="32&&Idaho (Idaho Falls)">
                          Idaho (Idaho Falls)
                        </option>
                        <option value="33&&Idaho (Lewiston)">
                          Idaho (Lewiston)
                        </option>
                        <option value="34&&Illinois (Chicago)">
                          Illinois (Chicago)
                        </option>
                        <option value="35&&Illinois (Springfield)">
                          Illinois (Springfield)
                        </option>
                        <option value="36&&Indiana (Indianapolis)">
                          Indiana (Indianapolis)
                        </option>
                        <option value="37&&Iowa (Des Moines)">
                          Iowa (Des Moines)
                        </option>
                        <option value="38&&Iowa (Dubuque)">
                          Iowa (Dubuque)
                        </option>
                        <option value="39&&Kansas (Wichita)">
                          Kansas (Wichita)
                        </option>
                        <option value="40&&Kentucky (Louisville)">
                          Kentucky (Louisville)
                        </option>
                        <option value="41&&Louisiana (New Orleans)">
                          Louisiana (New Orleans)
                        </option>
                        <option value="42&&Louisiana (Shreveport)">
                          Louisiana (Shreveport)
                        </option>
                        <option value="43&&Maine (Bangor)">
                          Maine (Bangor)
                        </option>
                        <option value="44&&Maine (Eastport)">
                          Maine (Eastport)
                        </option>
                        <option value="45&&Maine (Portland)">
                          Maine (Portland)
                        </option>
                        <option value="46&&Maryland (Baltimore)">
                          Maryland (Baltimore)
                        </option>
                        <option value="47&&Massachusetts (Boston)">
                          Massachusetts (Boston)
                        </option>
                        <option value="48&&Massachusetts (Springfield)">
                          Massachusetts (Springfield)
                        </option>
                        <option value="49&&Michigan (Detroit)">
                          Michigan (Detroit)
                        </option>
                        <option value="50&&Michigan (Grand Rapids)">
                          Michigan (Grand Rapids)
                        </option>
                        <option value="51&&Minnesota (Duluth)">
                          Minnesota (Duluth)
                        </option>
                        <option value="52&&Minnesota (Minneapolis)">
                          Minnesota (Minneapolis)
                        </option>
                        <option value="53&&Mississippi (Jackson)">
                          Mississippi (Jackson)
                        </option>
                        <option value="54&&Missouri (Kansas City)">
                          Missouri (Kansas City)
                        </option>
                        <option value="55&&Missouri (Springfield)">
                          Missouri (Springfield)
                        </option>
                        <option value="56&&Missouri (St. Louis)">
                          Missouri (St. Louis)
                        </option>
                        <option value="57&&Montana (Havre)">
                          Montana (Havre)
                        </option>
                        <option value="58&&Montana (Helena)">
                          Montana (Helena)
                        </option>
                        <option value="59&&Nebraska (Lincoln)">
                          Nebraska (Lincoln)
                        </option>
                        <option value="60&&Nebraska (Omaha)">
                          Nebraska (Omaha)
                        </option>
                        <option value="61&&Nevada (Las Vegas)">
                          Nevada (Las Vegas)
                        </option>
                        <option value="62&&Nevada (Reno)">Nevada (Reno)</option>
                        <option value="63&&New Hampshire (Manchester)">
                          New Hampshire (Manchester)
                        </option>
                        <option value="64&&New Jersey (Newark)">
                          New Jersey (Newark)
                        </option>
                        <option value="65&&New Mexico (Albuquerque)">
                          New Mexico (Albuquerque)
                        </option>
                        <option value="66&&New Mexico (Carlsbad)">
                          New Mexico (Carlsbad)
                        </option>
                        <option value="67&&New Mexico (Santa Fe)">
                          New Mexico (Santa Fe)
                        </option>
                        <option value="68&&New York (Albany)">
                          New York (Albany)
                        </option>
                        <option value="69&&New York (Buffalo)">
                          New York (Buffalo)
                        </option>
                        <option value="70&&New York (New York)">
                          New York (New York)
                        </option>
                        <option value="71&&New York (Syracuse)">
                          New York (Syracuse)
                        </option>
                        <option value="72&&North Carolina (Charlotte)">
                          North Carolina (Charlotte)
                        </option>
                        <option value="73&&North Carolina (Raleigh)">
                          North Carolina (Raleigh)
                        </option>
                        <option value="74&&North Carolina (Wilmington)">
                          North Carolina (Wilmington)
                        </option>
                        <option value="75&&North Dakota (Bismarck)">
                          North Dakota (Bismarck)
                        </option>
                        <option value="76&&North Dakota (Fargo)">
                          North Dakota (Fargo)
                        </option>
                        <option value="77&&Ohio (Cincinnati)">
                          Ohio (Cincinnati)
                        </option>
                        <option value="78&&Ohio (Cleveland)">
                          Ohio (Cleveland)
                        </option>
                        <option value="79&&Ohio (Columbus)">
                          Ohio (Columbus)
                        </option>
                        <option value="80&&Ohio (Toledo)">Ohio (Toledo)</option>
                        <option value="81&&Oklahoma (Oklahoma City)">
                          Oklahoma (Oklahoma City)
                        </option>
                        <option value="82&&Oklahoma (Tulsa)">
                          Oklahoma (Tulsa)
                        </option>
                        <option value="83&&Oregon (Baker)">
                          Oregon (Baker)
                        </option>
                        <option value="84&&Oregon (Eugene)">
                          Oregon (Eugene)
                        </option>
                        <option value="85&&Oregon (Klamath Falls)">
                          Oregon (Klamath Falls)
                        </option>
                        <option value="86&&Oregon (Portland)">
                          Oregon (Portland)
                        </option>
                        <option value="87&&Pennsylvania (Philadelphia)">
                          Pennsylvania (Philadelphia)
                        </option>
                        <option value="88&&Pennsylvania (Pittsburgh)">
                          Pennsylvania (Pittsburgh)
                        </option>
                        <option value="89&&Puerto Rico (San Juan)">
                          Puerto Rico (San Juan)
                        </option>
                        <option value="90&&Rhode Island (Providence)">
                          Rhode Island (Providence)
                        </option>
                        <option value="91&&South Carolina (Charleston)">
                          South Carolina (Charleston)
                        </option>
                        <option value="92&&South Carolina (Columbia)">
                          South Carolina (Columbia)
                        </option>
                        <option value="93&&South Dakota (Pierre)">
                          South Dakota (Pierre)
                        </option>
                        <option value="94&&South Dakota (Sioux Falls)">
                          South Dakota (Sioux Falls)
                        </option>
                        <option value="95&&Tennessee (Knoxville)">
                          Tennessee (Knoxville)
                        </option>
                        <option value="96&&Tennessee (Memphis)">
                          Tennessee (Memphis)
                        </option>
                        <option value="97&&Tennessee (Nashville)">
                          Tennessee (Nashville)
                        </option>
                        <option value="98&&Texas (Amarillo)">
                          Texas (Amarillo)
                        </option>
                        <option value="99&&Texas (Austin)">
                          Texas (Austin)
                        </option>
                        <option value="100&&Texas (Dallas)">
                          Texas (Dallas)
                        </option>
                        <option value="101&&Texas (El Paso)">
                          Texas (El Paso)
                        </option>
                        <option value="102&&Texas (Fort Worth)">
                          Texas (Fort Worth)
                        </option>
                        <option value="103&&Texas (Houston)">
                          Texas (Houston)
                        </option>
                        <option value="104&&Texas (San Antonio)">
                          Texas (San Antonio)
                        </option>
                        <option value="105&&Utah (Richfield)">
                          Utah (Richfield)
                        </option>
                        <option value="106&&Utah (Salt Lake City)">
                          Utah (Salt Lake City)
                        </option>
                        <option value="107&&Vermont (Montpelier)">
                          Vermont (Montpelier)
                        </option>
                        <option value="108&&Virginia (Richmond)">
                          Virginia (Richmond)
                        </option>
                        <option value="109&&Virginia (Roanoke)">
                          Virginia (Roanoke)
                        </option>
                        <option value="110&&Virginia (Virginia Beach)">
                          Virginia (Virginia Beach)
                        </option>
                        <option value="111&&Washington (Seattle)">
                          Washington (Seattle)
                        </option>
                        <option value="112&&Washington (Spokane)">
                          Washington (Spokane)
                        </option>
                        <option value="113&&West Virginia (Charleston)">
                          West Virginia (Charleston)
                        </option>
                        <option value="114&&Wisconsin (Milwaukee)">
                          Wisconsin (Milwaukee)
                        </option>
                        <option value="115&&Wyoming (Cheyenne)">
                          Wyoming (Cheyenne)
                        </option>
                      </select>
                    </div>
                  </div>
                </>
              )}
              {formData.tech_operations1 == "1" && (
                <>
                  <div className="space-y-2 tno ">
                    <label htmlFor="tech_second" className="label">
                      {data?.payload?.tech_lang_keys["12"]}:
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
                      <span className="input_unit">
                        {data?.payload?.tech_lang_keys["19"]}
                      </span>
                    </div>
                  </div>
                </>
              )}
              <div className="space-y-2 tno ">
                <label htmlFor="tech_third" className="label">
                  {data?.payload?.tech_lang_keys["13"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_third"
                    id="tech_third"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_third}
                    onChange={handleChange}
                  />
                  <span className="input_unit">%</span>
                </div>
              </div>
              <div className="space-y-2 tno relative">
                <label htmlFor="tech_four" className="label">
                  {data?.payload?.tech_lang_keys["14"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_four"
                    id="tech_four"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_four}
                    onChange={handleChange}
                  />
                  <span className="input_unit">%</span>
                </div>
              </div>
              <div className="space-y-2" id="f1">
                <label htmlFor="tech_five" className="label">
                  {data?.payload?.tech_lang_keys["15"]}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_five"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_five}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown1}
                  >
                    {formData.tech_units5} ▾
                  </label>
                  {dropdownVisible1 && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "m²", value: "m²" },
                        { label: "km²", value: "km²" },
                        { label: "ft²", value: "ft²" },
                        { label: "yd²", value: "yd²" },
                        { label: "mi²", value: "mi²" },
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
              <div className="space-y-2" id="f1">
                <label htmlFor="tech_six" className="label">
                  {data?.payload?.tech_lang_keys["16"]}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_six"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_six}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown2}
                  >
                    {formData.tech_units6} ▾
                  </label>
                  {dropdownVisible2 && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "cm²", value: "cm²" },
                        { label: "m²", value: "m²" },
                        { label: "in²", value: "in²" },
                        { label: "ft²", value: "ft²" },
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
              <div className="space-y-2" id="f1">
                <label htmlFor="tech_seven" className="label">
                  {data?.payload?.tech_lang_keys["17"]}
                </label>
                <div className="relative w-full ">
                  <input
                    type="number"
                    name="tech_seven"
                    step="any"
                    className="mt-1 input"
                    value={formData.tech_seven}
                    placeholder="00"
                    onChange={handleChange}
                  />
                  <label
                    className="absolute cursor-pointer text-sm underline right-6 top-4"
                    onClick={toggleDropdown3}
                  >
                    {formData.tech_units7} ▾
                  </label>
                  {dropdownVisible3 && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                      {[
                        { label: "W", value: "W" },
                        { label: "kW", value: "kW" },
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
                    <div className="w-full  md:p-3 rounded-lg mt-3">
                      <div className="lg:w-2/3 mt-2">
                        <table className="w-full text-[16px] md:text-[18px]">
                          <tbody>
                            <tr>
                              <td className="py-2 border-b border-gray-300 w-7/10">
                                <strong>
                                  {data?.payload?.tech_lang_keys[18]}
                                </strong>
                              </td>
                              <td className="py-2 border-b border-gray-300">
                                {result?.tech_sas_ans} (kW)
                              </td>
                            </tr>
                            {result?.shph && (
                              <>
                                <tr>
                                  <td className="py-2 border-b border-gray-300 w-7/10">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[12]}
                                    </strong>
                                  </td>
                                  <td className="py-2 border-b border-gray-300">
                                    {result?.shph} (
                                    {data?.payload?.tech_lang_keys["19"]})
                                  </td>
                                </tr>
                              </>
                            )}
                            <tr>
                              <td className="py-2 border-b border-gray-300 w-7/10">
                                <strong>
                                  {data?.payload?.tech_lang_keys[20]}
                                </strong>
                              </td>
                              <td className="py-2 border-b border-gray-300">
                                {result?.tech_panels_ans} (
                                {data?.payload?.tech_lang_keys["21"]})
                              </td>
                            </tr>
                            <tr>
                              <td className="py-2 border-b border-gray-300 w-7/10">
                                <strong>
                                  {data?.payload?.tech_lang_keys[22]}
                                </strong>
                              </td>
                              <td className="py-2 border-b border-gray-300">
                                {result?.tech_area_ans} (m²)
                              </td>
                            </tr>
                          </tbody>
                        </table>
                        <p className="mt-2" id="line">
                          {result?.tech_line}
                        </p>
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

export default SolarPanelCalculator;

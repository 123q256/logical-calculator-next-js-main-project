import React, {
  useEffect,
  useState,
  useCallback,
  Component,
  useRef,
} from "react";
import { useLocation, useParams } from "react-router-dom";
import { useGetSingleConverterDataMutation } from "../../redux/services/converter/converterApi";
import ConverterWrap from "./component/ConverterWrap";
import AccelerationAngularConverter from "./Pages/AccelerationAngularConverter";
import AccelerationConverter from "./Pages/AccelerationConverter";
import AngleConverter from "./Pages/AngleConverter";
import AreaConverter from "./Pages/AreaConverter";
import DataStorageConverte from "./Pages/DataStorageConverte";
import DensityConverter from "./Pages/DensityConverter";
import EnergyConverter from "./Pages/EnergyConverter";
import ForceConverter from "./Pages/ForceConverter";
import FuelConsumptionConverter from "./Pages/FuelConsumptionConverter";
import LengthConverter from "./Pages/LengthConverter";
import MomentOfForceConverter from "./Pages/MomentOfForceConverter";
import MomentOfInertiaConverter from "./Pages/MomentOfInertiaConverter";
import NumbersConverter from "./Pages/NumbersConverter";
import PowerConverter from "./Pages/PowerConverter";
import PressureConverter from "./Pages/PressureConverter";
import SpecificVolumeConverter from "./Pages/SpecificVolumeConverter";
import SpeedConverter from "./Pages/SpeedConverter";
import TemperatureConverter from "./Pages/TemperatureConverter";
import TimeConverter from "./Pages/TimeConverter";
import TorqueConverter from "./Pages/TorqueConverter";
import VelocityAngularConverter from "./Pages/VelocityAngularConverter";
import VolumeConverter from "./Pages/VolumeConverter";
import VolumeDryConverter from "./Pages/VolumeDryConverter";
import WeightAndMassConverter from "./Pages/WeightAndMassConverter";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import { Helmet } from "react-helmet";

const Converter = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  // const searchValue = searchParams.get("search");
  const [getSingleConverterDetails, { data, error, isLoading }] =
    useGetSingleConverterDataMutation();
  const [loading, setLoading] = useState(true);

  const params = useParams();
  const handleFetchDetails = useCallback(async () => {
    try {
      await getSingleConverterDetails({
        tech_calculator_link: params["unit-conveter"],
      });
      setLoading(false); // Set loading to false after fetching data
    } catch (err) {
      console.error("Error fetching calculator details:", err);
    }
  }, [getSingleConverterDetails, params]);

  useEffect(() => {
    handleFetchDetails();
  }, [handleFetchDetails]);

  // Helper function to format a raw link string into a human-readable title,
  // matching the logic from your Blade template.
  const formatLinkTitle = (link) => {
    // PHP: $cal_title=explode('/', $value->cal_link);
    const cal_title_parts = link.split("/");

    // PHP: $cal_title_=explode('-', $cal_title[1]);
    // We need to ensure cal_title_parts[1] exists before splitting,
    // as some links might be top-level (e.g., "volume-converter").
    const relevantPart =
      cal_title_parts.length > 1 ? cal_title_parts[1] : cal_title_parts[0];
    const cal_title_words = relevantPart.split("-");

    // PHP: foreach ($cal_title_ as $key => $value_) { $cal_title.=$value_.' '; }
    // In JS, map and join is more idiomatic. Also capitalize first letter of each word.
    const formattedTitle = cal_title_words
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize first letter
      .join(" "); // Join with spaces

    return formattedTitle;
  };

  // Ensure data?.payload?.all_sub is an array before attempting to map over it

  // 1. Access the tech_lang_keys string
  const langKeysString = data?.payload?.calculator?.tech_lang_keys;
  // 2. Parse the JSON string into a JavaScript object
  let langObject = {};
  try {
    langObject = JSON.parse(langKeysString);
  } catch (error) {
    console.error("Error parsing tech_lang_keys:", error);
    // Handle error, e.g., set default values or show a message
  }

  const [fromValue, setFromValue] = useState("");
  const [toValue, setToValue] = useState("");
  const [fromUnit, setFromUnit] = useState("");
  const [toUnit, setToUnit] = useState("");
  const [result, setResult] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [lastChanged, setLastChanged] = useState("from");

  const searchValue = params?.["unit-conveter"] || "";

  const fromUnitText = (() => {
    const opt = document.querySelector(`#calFrom option[value="${fromUnit}"]`);
    return opt ? opt.textContent : "";
  })();

  const toUnitText = (() => {
    const opt = document.querySelector(`#calto option[value="${toUnit}"]`);
    return opt ? opt.textContent : "";
  })();

  const results = (final_res) => {
    var gniTotalDigits = 12;
    var valStr = "" + final_res;
    if (
      valStr.indexOf("N") >= 0 ||
      (final_res === 2 * final_res && final_res === 1 + final_res)
    )
      return "Error ";
    var i = valStr.indexOf("e");
    if (i >= 0) {
      var expStr = valStr.substring(i + 1, valStr.length);
      if (i > 11) i = 11;
      valStr = valStr.substring(0, i);
      if (valStr.indexOf(".") < 0) {
        valStr += ".";
      } else {
        let j = valStr.length - 1;
        while (j >= 0 && valStr.charAt(j) === "0") --j;
        valStr = valStr.substring(0, j + 1);
      }
      valStr += "E" + expStr;
    } else {
      var valNeg = false;
      if (final_res < 0) {
        final_res = -final_res;
        valNeg = true;
      }
      var valInt = Math.floor(final_res);
      var valFrac = final_res - valInt;
      var prec = gniTotalDigits - ("" + valInt).length - 1;
      var mult = " 1000000000000000000".substring(1, prec + 2);
      mult = mult === "" || mult === " " ? 1 : parseInt(mult);
      var frac = Math.floor(valFrac * mult + 0.5);
      valInt = Math.floor(Math.floor(final_res * mult + 0.5) / mult);
      valStr = (valNeg ? "-" : "") + valInt;
      var fracStr = "00000000000000" + frac;
      fracStr = fracStr.substring(fracStr.length - prec, fracStr.length);
      let i2 = fracStr.length - 1;
      while (i2 >= 0 && fracStr.charAt(i2) === "0") --i2;
      fracStr = fracStr.substring(0, i2 + 1);
      if (i2 >= 0) valStr += "." + fracStr;
    }
    return valStr;
  };

  const calculation_solution = (value, from_base, to_base) => {
    const range =
      "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ+/".split(
        ""
      );
    const from_range = range.slice(0, from_base);
    const to_range = range.slice(0, to_base);
    const dec_value = value
      .split("")
      .reverse()
      .reduce((carry, digit, index) => {
        if (from_range.indexOf(digit) === -1)
          alert(`Invalid digit "${digit}" for base ${from_base}`);
        return carry + from_range.indexOf(digit) * Math.pow(from_base, index);
      }, 0);
    let new_value = "";
    let val = dec_value;
    while (val > 0) {
      new_value = to_range[val % to_base] + new_value;
      val = Math.floor(val / to_base);
    }
    return new_value || "0";
  };

  const calculateConversion = (value, fromU, toU) => {
    if (!value || !fromU || !toU) return "";

    let from = parseFloat(value);
    if (isNaN(from)) return "";

    let ans;

    if (searchValue === "temperature-converter") {
      if (fromU === "1") from = from;
      else if (fromU === "2") from -= 273.15;
      else if (fromU === "3") from = (from - 32) * (5 / 9);
      else if (fromU === "4") from = (from - 491.67) * (5 / 9);
      else if (fromU === "5") from = from * 1.25;
      else if (fromU === "6") from = from * 273.16 - 273.15;

      if (toU === "1") ans = from;
      else if (toU === "2") ans = from + 273.15;
      else if (toU === "3") ans = from * (9 / 5) + 32;
      else if (toU === "4") ans = from * (9 / 5) + 491.67;
      else if (toU === "5") ans = from * 0.8;
      else if (toU === "6") ans = (from + 273.15) / 273.16;

      return results(ans);
    } else if (searchValue === "number-converter") {
      return calculation_solution(
        value.toLowerCase(),
        parseInt(fromU),
        parseInt(toU)
      ).toUpperCase();
    } else {
      if (
        (typeof fromU === "string" || typeof toU === "string") &&
        (fromU.indexOf(":") > 0 || toU.indexOf(":") > 0)
      ) {
        let tempF = fromU.split(":");
        let tempT = toU.split(":");
        if (fromU.indexOf(":") > 0 && toU.indexOf(":") > 0) {
          ans = (from * tempT[1]) / tempF[1];
        } else {
          ans =
            (1 / from) *
            (fromU.indexOf(":") > 0 ? tempF[1] : fromU) *
            (toU.indexOf(":") > 0 ? tempT[1] : toU);
        }
      } else {
        ans = toU / (fromU / from);
      }
      return results(ans);
    }
  };

  // Input Handlers
  // const handleFromChange = (e) => setFromValue(e.target.value);
  // const handleToChange = (e) => setToValue(e.target.value);

  const handleFromChange = (e) => {
    setFromValue(e.target.value);
    setLastChanged("from");
  };

  const handleToChange = (e) => {
    setToValue(e.target.value);
    setLastChanged("to");
  };

  const handleFromUnitChange = (e) => setFromUnit(e.target.value);
  const handleToUnitChange = (e) => setToUnit(e.target.value);

  useEffect(() => {
    if (fromUnit && toUnit) {
      if (lastChanged === "from" && fromValue) {
        const res = calculateConversion(fromValue, fromUnit, toUnit);
        setResult(res);
        setToValue(res);
        setShowResult(true);
      } else if (lastChanged === "to" && toValue) {
        const res = calculateConversion(toValue, toUnit, fromUnit);
        setResult(res);
        setFromValue(res);
        setShowResult(true);
      } else {
        setResult("");
        setShowResult(false);
      }
    }
  }, [fromValue, toValue, fromUnit, toUnit, lastChanged]);

  const copyResult = () => {
    navigator.clipboard.writeText(result).then(() => {
      alert("Copied: " + result);
    });
  };

  // Parse language keys safely
  let lang = {};
  try {
    lang = JSON.parse(data?.payload?.tech_lang_keys || "{}");
  } catch {
    lang = {};
  }

  // helmet
  const currentUrl = typeof window !== "undefined" ? window.location.href : "";
  const canonicalUrl = `${window.location.origin}${window.location.pathname}`;
  const metaTitle = data?.payload?.calculator?.tech_meta_title;
  const metaDescription = data?.payload?.calculator?.tech_meta_des;
  const ogImage = `https://calculator-logical.com/images/ogview/pages/calculator-logical.png`;

  return (
    <>
      <Helmet>
        <title>{metaTitle || "My App"}</title>
        <meta name="description" content={metaDescription || "Description."} />
        <meta property="og:site_name" content="Calculator Logical" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:url" content={currentUrl} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@calculator-logical.com" />
        <meta name="twitter:title" content={metaTitle} />
        <meta name="twitter:description" content={metaDescription} />
        <meta name="twitter:image" content={ogImage} />
        <link
          rel="canonical"
          href={`https://calculator-logical.com${window.location.pathname}`}
        />
      </Helmet>

      <ConverterWrap
        isLoading={loading}
        data={data || {}}
        links={[
          { name: "Unit Converter", path: "/unit-converter" },
          {
            name: data?.payload?.calculator?.tech_cal_cat,
            path: "/" + data?.payload?.calculator?.tech_cal_cat,
          },
          {
            name: data?.payload?.calculator?.tech_calculator_title,
            path: location.pathname,
          },
        ]}
      >
        <div className="grid grid-cols-12 gap-0 bg-white">
          <div className="col-span-2 hidden md:block"></div>
          <div className="col-span-12 md:col-span-12 ">
            {/* Length Converter */}
            <div className="grid grid-cols-12 gap-4 p-5 bg-[#F4F4F4] shadow-md">
              <input type="hidden" id="check" value={searchValue} />
              <p className="text-center text-sm md:text-base text-gray-700 mb-4 font-medium col-span-12">
                Please enter a value in either field and select units from both
                dropdowns to perform the conversion.
              </p>

              <div className="col-span-1 hidden md:block"></div>
              <div className="col-span-12 md:col-span-5  ">
                <div className="grid grid-cols-12">
                  <div className="col-span-12 ">
                    <label htmlFor="from" className="text-blue label">
                      {langObject.from || "From"}:
                    </label>

                    <div className="w-full pt-2 converter_input">
                      <input
                        type="number"
                        name="from"
                        id="from"
                        value={fromValue}
                        onChange={handleFromChange}
                        className="input"
                        aria-label="input"
                        placeholder="00"
                      />
                    </div>
                  </div>

                  <div className="col-span-12 ">
                    <label htmlFor="calFrom" className="label">
                      &nbsp;
                    </label>
                    <div className="w-full bg-white rounded p-2 bordered">
                      <select
                        name="calFrom"
                        id="calFrom"
                        size="7"
                        className="unit-select  custom-scroll w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500
                       max-h-60 overflow-y-auto sm:max-h-72 md:max-h-80"
                        value={fromUnit}
                        onChange={handleFromUnitChange}
                      >
                        {/* The LengthConverter component needs to pass back the unit data */}
                        {params["unit-conveter"] === "length-converter" && (
                          <LengthConverter
                            lang={JSON.parse(
                              data?.payload?.calculator?.tech_lang_keys || "{}"
                            )}
                          />
                        )}
                        {params["unit-conveter"] === "volume-converter" && (
                          <VolumeConverter
                            lang={JSON.parse(
                              data?.payload?.calculator?.tech_lang_keys || "{}"
                            )}
                          />
                        )}
                        {params["unit-conveter"] ===
                          "temperature-converter" && (
                          <TemperatureConverter
                            lang={JSON.parse(
                              data?.payload?.calculator?.tech_lang_keys || "{}"
                            )}
                          />
                        )}
                        {params["unit-conveter"] ===
                          "weight-and-mass-converter" && (
                          <WeightAndMassConverter
                            lang={JSON.parse(
                              data?.payload?.calculator?.tech_lang_keys || "{}"
                            )}
                          />
                        )}
                        {params["unit-conveter"] === "area-converter" && (
                          <AreaConverter
                            lang={JSON.parse(
                              data?.payload?.calculator?.tech_lang_keys || "{}"
                            )}
                          />
                        )}
                        {params["unit-conveter"] === "pressure-converter" && (
                          <PressureConverter
                            lang={JSON.parse(
                              data?.payload?.calculator?.tech_lang_keys || "{}"
                            )}
                          />
                        )}
                        {params["unit-conveter"] === "volume-dry-converter" && (
                          <VolumeDryConverter
                            lang={JSON.parse(
                              data?.payload?.calculator?.tech_lang_keys || "{}"
                            )}
                          />
                        )}
                        {params["unit-conveter"] === "time-converter" && (
                          <TimeConverter
                            lang={JSON.parse(
                              data?.payload?.calculator?.tech_lang_keys || "{}"
                            )}
                          />
                        )}
                        {params["unit-conveter"] === "energy-converter" && (
                          <EnergyConverter
                            lang={JSON.parse(
                              data?.payload?.calculator?.tech_lang_keys || "{}"
                            )}
                          />
                        )}
                        {params["unit-conveter"] === "power-converter" && (
                          <PowerConverter
                            lang={JSON.parse(
                              data?.payload?.calculator?.tech_lang_keys || "{}"
                            )}
                          />
                        )}
                        {params["unit-conveter"] === "force-converter" && (
                          <ForceConverter
                            lang={JSON.parse(
                              data?.payload?.calculator?.tech_lang_keys || "{}"
                            )}
                          />
                        )}
                        {params["unit-conveter"] === "speed-converter" && (
                          <SpeedConverter
                            lang={JSON.parse(
                              data?.payload?.calculator?.tech_lang_keys || "{}"
                            )}
                          />
                        )}
                        {params["unit-conveter"] === "angle-converter" && (
                          <AngleConverter
                            lang={JSON.parse(
                              data?.payload?.calculator?.tech_lang_keys || "{}"
                            )}
                          />
                        )}
                        {params["unit-conveter"] ===
                          "fuel-consumption-converter" && (
                          <FuelConsumptionConverter
                            lang={JSON.parse(
                              data?.payload?.calculator?.tech_lang_keys || "{}"
                            )}
                          />
                        )}
                        {params["unit-conveter"] ===
                          "data-storage-converter" && (
                          <DataStorageConverte
                            lang={JSON.parse(
                              data?.payload?.calculator?.tech_lang_keys || "{}"
                            )}
                          />
                        )}
                        {params["unit-conveter"] === "number-converter" && (
                          <NumbersConverter
                            lang={JSON.parse(
                              data?.payload?.calculator?.tech_lang_keys || "{}"
                            )}
                          />
                        )}
                        {params["unit-conveter"] ===
                          "acceleration-converter" && (
                          <AccelerationConverter
                            lang={JSON.parse(
                              data?.payload?.calculator?.tech_lang_keys || "{}"
                            )}
                          />
                        )}
                        {params["unit-conveter"] === "density-converter" && (
                          <DensityConverter
                            lang={JSON.parse(
                              data?.payload?.calculator?.tech_lang_keys || "{}"
                            )}
                          />
                        )}
                        {params["unit-conveter"] ===
                          "velocity-angular-converter" && (
                          <VelocityAngularConverter
                            lang={JSON.parse(
                              data?.payload?.calculator?.tech_lang_keys || "{}"
                            )}
                          />
                        )}
                        {params["unit-conveter"] ===
                          "acceleration-angular-converter" && (
                          <AccelerationAngularConverter
                            lang={JSON.parse(
                              data?.payload?.calculator?.tech_lang_keys || "{}"
                            )}
                          />
                        )}
                        {params["unit-conveter"] ===
                          "specific-volume-converter" && (
                          <SpecificVolumeConverter
                            lang={JSON.parse(
                              data?.payload?.calculator?.tech_lang_keys || "{}"
                            )}
                          />
                        )}
                        {params["unit-conveter"] ===
                          "moment-of-inertia-converter" && (
                          <MomentOfInertiaConverter
                            lang={JSON.parse(
                              data?.payload?.calculator?.tech_lang_keys || "{}"
                            )}
                          />
                        )}
                        {params["unit-conveter"] ===
                          "moment-of-force-converter" && (
                          <MomentOfForceConverter
                            lang={JSON.parse(
                              data?.payload?.calculator?.tech_lang_keys || "{}"
                            )}
                          />
                        )}
                        {params["unit-conveter"] === "torque-converter" && (
                          <TorqueConverter
                            lang={JSON.parse(
                              data?.payload?.calculator?.tech_lang_keys || "{}"
                            )}
                          />
                        )}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-span-12 md:col-span-5  ">
                <div className="grid grid-cols-12">
                  <div className="col-span-12">
                    <label htmlFor="to" className="text-blue label">
                      {langObject.to || "To"}:
                    </label>

                    <div className="w-full pt-2 converter_input">
                      <input
                        type="number"
                        name="to"
                        id="to"
                        value={toValue}
                        onChange={handleToChange}
                        className="input"
                        aria-label="input"
                        placeholder="00"
                      />
                    </div>
                  </div>

                  <div className="col-span-12">
                    <label htmlFor="calto" className="label">
                      &nbsp;
                    </label>
                    <div className="w-full bg-white rounded p-2 bordered">
                      <select
                        name="calto"
                        id="calto"
                        size="7"
                        className="unit-select custom-scroll w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500
                                   max-h-60 overflow-y-auto sm:max-h-72 md:max-h-80 lg:max-h-[350px] unit-select"
                        value={toUnit}
                        onChange={handleToUnitChange}
                      >
                        {params["unit-conveter"] === "length-converter" && (
                          <LengthConverter
                            lang={JSON.parse(
                              data?.payload?.calculator?.tech_lang_keys || "{}"
                            )}
                          />
                        )}
                        {params["unit-conveter"] === "volume-converter" && (
                          <VolumeConverter
                            lang={JSON.parse(
                              data?.payload?.calculator?.tech_lang_keys || "{}"
                            )}
                          />
                        )}
                        {params["unit-conveter"] ===
                          "temperature-converter" && (
                          <TemperatureConverter
                            lang={JSON.parse(
                              data?.payload?.calculator?.tech_lang_keys || "{}"
                            )}
                          />
                        )}
                        {params["unit-conveter"] ===
                          "weight-and-mass-converter" && (
                          <WeightAndMassConverter
                            lang={JSON.parse(
                              data?.payload?.calculator?.tech_lang_keys || "{}"
                            )}
                          />
                        )}
                        {params["unit-conveter"] === "area-converter" && (
                          <AreaConverter
                            lang={JSON.parse(
                              data?.payload?.calculator?.tech_lang_keys || "{}"
                            )}
                          />
                        )}
                        {params["unit-conveter"] === "pressure-converter" && (
                          <PressureConverter
                            lang={JSON.parse(
                              data?.payload?.calculator?.tech_lang_keys || "{}"
                            )}
                          />
                        )}
                        {params["unit-conveter"] === "volume-dry-converter" && (
                          <VolumeDryConverter
                            lang={JSON.parse(
                              data?.payload?.calculator?.tech_lang_keys || "{}"
                            )}
                          />
                        )}
                        {params["unit-conveter"] === "time-converter" && (
                          <TimeConverter
                            lang={JSON.parse(
                              data?.payload?.calculator?.tech_lang_keys || "{}"
                            )}
                          />
                        )}
                        {params["unit-conveter"] === "energy-converter" && (
                          <EnergyConverter
                            lang={JSON.parse(
                              data?.payload?.calculator?.tech_lang_keys || "{}"
                            )}
                          />
                        )}
                        {params["unit-conveter"] === "power-converter" && (
                          <PowerConverter
                            lang={JSON.parse(
                              data?.payload?.calculator?.tech_lang_keys || "{}"
                            )}
                          />
                        )}
                        {params["unit-conveter"] === "force-converter" && (
                          <ForceConverter
                            lang={JSON.parse(
                              data?.payload?.calculator?.tech_lang_keys || "{}"
                            )}
                          />
                        )}
                        {params["unit-conveter"] === "speed-converter" && (
                          <SpeedConverter
                            lang={JSON.parse(
                              data?.payload?.calculator?.tech_lang_keys || "{}"
                            )}
                          />
                        )}
                        {params["unit-conveter"] === "angle-converter" && (
                          <AngleConverter
                            lang={JSON.parse(
                              data?.payload?.calculator?.tech_lang_keys || "{}"
                            )}
                          />
                        )}
                        {params["unit-conveter"] ===
                          "fuel-consumption-converter" && (
                          <FuelConsumptionConverter
                            lang={JSON.parse(
                              data?.payload?.calculator?.tech_lang_keys || "{}"
                            )}
                          />
                        )}
                        {params["unit-conveter"] ===
                          "data-storage-converter" && (
                          <DataStorageConverte
                            lang={JSON.parse(
                              data?.payload?.calculator?.tech_lang_keys || "{}"
                            )}
                          />
                        )}
                        {params["unit-conveter"] === "number-converter" && (
                          <NumbersConverter
                            lang={JSON.parse(
                              data?.payload?.calculator?.tech_lang_keys || "{}"
                            )}
                          />
                        )}
                        {params["unit-conveter"] ===
                          "acceleration-converter" && (
                          <AccelerationConverter
                            lang={JSON.parse(
                              data?.payload?.calculator?.tech_lang_keys || "{}"
                            )}
                          />
                        )}
                        {params["unit-conveter"] === "density-converter" && (
                          <DensityConverter
                            lang={JSON.parse(
                              data?.payload?.calculator?.tech_lang_keys || "{}"
                            )}
                          />
                        )}
                        {params["unit-conveter"] ===
                          "velocity-angular-converter" && (
                          <VelocityAngularConverter
                            lang={JSON.parse(
                              data?.payload?.calculator?.tech_lang_keys || "{}"
                            )}
                          />
                        )}
                        {params["unit-conveter"] ===
                          "acceleration-angular-converter" && (
                          <AccelerationAngularConverter
                            lang={JSON.parse(
                              data?.payload?.calculator?.tech_lang_keys || "{}"
                            )}
                          />
                        )}
                        {params["unit-conveter"] ===
                          "specific-volume-converter" && (
                          <SpecificVolumeConverter
                            lang={JSON.parse(
                              data?.payload?.calculator?.tech_lang_keys || "{}"
                            )}
                          />
                        )}
                        {params["unit-conveter"] ===
                          "moment-of-inertia-converter" && (
                          <MomentOfInertiaConverter
                            lang={JSON.parse(
                              data?.payload?.calculator?.tech_lang_keys || "{}"
                            )}
                          />
                        )}
                        {params["unit-conveter"] ===
                          "moment-of-force-converter" && (
                          <MomentOfForceConverter
                            lang={JSON.parse(
                              data?.payload?.calculator?.tech_lang_keys || "{}"
                            )}
                          />
                        )}
                        {params["unit-conveter"] === "torque-converter" && (
                          <TorqueConverter
                            lang={JSON.parse(
                              data?.payload?.calculator?.tech_lang_keys || "{}"
                            )}
                          />
                        )}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-span-1 hidden md:block"></div>
              <div
                className={`col-span-12 md:col-span-12 mt-4 mx-auto ${
                  showResult ? "" : "hidden"
                }`}
              >
                <div className={`flex items-center `}>
                  <strong className={`text-blue-600 text-lg font-bold me-2 `}>
                    Result:
                  </strong>
                  <div className="flex items-center bg-white border border-gray-300 rounded-lg px-3 py-2 w-fit">
                    <div className="result font-bold text-xl text-gray-900">
                      <div className="result font-bold text-xl text-gray-900">
                        {result}
                        <span className="ml-2 text-gray-600">{toUnitText}</span>
                      </div>
                    </div>
                    <button
                      onClick={copyResult}
                      className="ml-3 text-gray-500 hover:text-gray-700"
                    >
                      <img
                        src="/images/copy.png"
                        alt="Copy Result"
                        title="Copy Result"
                        width="20"
                        height="20"
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            {/* Length Converter */}

            <div className="col-span-2 ">
              <div className="grid grid-cols-12  gap-2 bg-white shadow my-2 p-2 contentAll">
                <p className="p-2 text-[18px] mt-5 col-span-12">
                  <strong>
                    {/* Access lang['1'] and lang['2'] directly from the lang prop */}
                    {langObject["1"] || "Volume"}{" "}
                    {langObject["2"] || "Converters"}
                  </strong>
                </p>

                {!Array.isArray(data?.payload?.all_sub) ||
                  data?.payload?.all_sub?.map((value, index) => {
                    // PHP: $cal_title=explode('/', $value->cal_link);
                    // From your JSON, it's `tech_calculator_link` not `cal_link`
                    const calLink = value.tech_calculator_link;

                    // Ensure calLink exists to prevent errors
                    if (!calLink) {
                      return null;
                    }
                    const formattedDisplayTitle = formatLinkTitle(calLink);

                    return (
                      <div
                        key={index}
                        className="col-span-12 md:col-span-6 px-2 text-[14px]"
                      >
                        {/* PHP: <a href="{{ url($value->cal_link) }}/" ...> */}
                        {/* Use standard <a> tag for external or full page navigation.
                    If using React Router, use <Link to={`/${calLink}/`}> instead. */}
                        <a
                          href={`/${calLink}/`}
                          className="p-1"
                          title={formattedDisplayTitle}
                        >
                          {formattedDisplayTitle}
                        </a>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      </ConverterWrap>
    </>
  );
};

export default Converter;

"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useParams, usePathname } from "next/navigation";
import { useGetSingleConverterDataMutation } from "../../../redux/services/converter/converterApi";
import ConverterWrap from "../../../components/pages/Converter/component/ConverterWrap";
import AccelerationAngularConverter from "../../../components/pages/Converter/Pages/AccelerationAngularConverter";
import AccelerationConverter from "../../../components/pages/Converter/Pages/AccelerationConverter";
import AngleConverter from "../../../components/pages/Converter/Pages/AngleConverter";
import AreaConverter from "../../../components/pages/Converter/Pages/AreaConverter";
import DataStorageConverte from "../../../components/pages/Converter/Pages/DataStorageConverte";
import DensityConverter from "../../../components/pages/Converter/Pages/DensityConverter";
import EnergyConverter from "../../../components/pages/Converter/Pages/EnergyConverter";
import ForceConverter from "../../../components/pages/Converter/Pages/ForceConverter";
import FuelConsumptionConverter from "../../../components/pages/Converter/Pages/FuelConsumptionConverter";
import LengthConverter from "../../../components/pages/Converter/Pages/LengthConverter";
import MomentOfForceConverter from "../../../components/pages/Converter/Pages/MomentOfForceConverter";
import MomentOfInertiaConverter from "../../../components/pages/Converter/Pages/MomentOfInertiaConverter";
import NumbersConverter from "../../../components/pages/Converter/Pages/NumbersConverter";
import PowerConverter from "../../../components/pages/Converter/Pages/PowerConverter";
import PressureConverter from "../../../components/pages/Converter/Pages/PressureConverter";
import SpecificVolumeConverter from "../../../components/pages/Converter/Pages/SpecificVolumeConverter";
import SpeedConverter from "../../../components/pages/Converter/Pages/SpeedConverter";
import TemperatureConverter from "../../../components/pages/Converter/Pages/TemperatureConverter";
import TimeConverter from "../../../components/pages/Converter/Pages/TimeConverter";
import TorqueConverter from "../../../components/pages/Converter/Pages/TorqueConverter";
import VelocityAngularConverter from "../../../components/pages/Converter/Pages/VelocityAngularConverter";
import VolumeConverter from "../../../components/pages/Converter/Pages/VolumeConverter";
import VolumeDryConverter from "../../../components/pages/Converter/Pages/VolumeDryConverter";
import WeightAndMassConverter from "../../../components/pages/Converter/Pages/WeightAndMassConverter";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";

const Converter = () => {
  const params = useParams();
  const pathname = usePathname();
  const unitConverter = params?.slug;

  const [getSingleConverterDetails, { data, error, isLoading }] =
    useGetSingleConverterDataMutation();

  const [loading, setLoading] = useState(true);
  const [currentUrl, setCurrentUrl] = useState("");
  const handleFetchDetails = useCallback(async () => {
    if (!unitConverter) return;

    try {
      await getSingleConverterDetails({
        tech_calculator_link: unitConverter,
      });
      setLoading(false);
    } catch (err) {
      console.error("Error fetching calculator details:", err);
      setLoading(false);
    }
  }, [getSingleConverterDetails, unitConverter]);

  useEffect(() => {
    handleFetchDetails();
  }, [handleFetchDetails]);

  // Helper function to format a raw link string into a human-readable title
  const formatLinkTitle = (link) => {
    if (!link) return "";

    const cal_title_parts = link.split("/");
    const relevantPart =
      cal_title_parts.length > 1 ? cal_title_parts[1] : cal_title_parts[0];
    const cal_title_words = relevantPart.split("-");

    const formattedTitle = cal_title_words
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    return formattedTitle;
  };

  // Parse language keys
  const langKeysString = data?.payload?.calculator?.tech_lang_keys;
  let langObject = {};
  try {
    langObject = langKeysString ? JSON.parse(langKeysString) : {};
  } catch (error) {
    console.error("Error parsing tech_lang_keys:", error);
    langObject = {};
  }

  const [fromValue, setFromValue] = useState("");
  const [toValue, setToValue] = useState("");
  const [fromUnit, setFromUnit] = useState("");
  const [toUnit, setToUnit] = useState("");
  const [result, setResult] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [lastChanged, setLastChanged] = useState("from");

  const searchValue = unitConverter || "";

  // Helper functions to get unit text
  const getFromUnitText = () => {
    if (typeof window !== "undefined") {
      const opt = document.querySelector(
        `#calFrom option[value="${fromUnit}"]`
      );
      return opt ? opt.textContent : "";
    }
    return "";
  };

  const getToUnitText = () => {
    if (typeof window !== "undefined") {
      const opt = document.querySelector(`#calto option[value="${toUnit}"]`);
      return opt ? opt.textContent : "";
    }
    return "";
  };

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
    if (typeof window !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(result).then(() => {
        alert("Copied: " + result);
      });
    }
  };

  // Parse language keys safely
  let lang = {};
  try {
    lang = JSON.parse(data?.payload?.tech_lang_keys || "{}");
  } catch {
    lang = {};
  }

  // Meta data
  const metaTitle =
    data?.payload?.calculator?.tech_meta_title || "Unit Converter";
  const metaDescription =
    data?.payload?.calculator?.tech_meta_des || "Convert units easily";
  const ogImage =
    "https://calculator-logical.com/images/ogview/pages/calculator-logical.png";

  // ✅ SSR safe window usage
  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentUrl(window.location.href);
    }
  }, []);
  // Don't render until we have the query parameter
  if (!unitConverter) {
    return <div>Loading...</div>;
  }

  const fromUnitText = getFromUnitText();
  const toUnitText = getToUnitText();

  // Dynamic Meta Tags Update (Client-side)
  useEffect(() => {
    if (data?.payload?.calculator && typeof window !== "undefined") {
      const pageUrl = window.location.href;

      // Update page title
      document.title = metaTitle;

      // Update meta description
      updateMetaTag("name", "description", metaDescription);

      // Update canonical URL
      let linkCanonical = document.querySelector("link[rel='canonical']");
      if (!linkCanonical) {
        linkCanonical = document.createElement("link");
        linkCanonical.setAttribute("rel", "canonical");
        document.head.appendChild(linkCanonical);
      }
      linkCanonical.setAttribute("href", pageUrl);

      // Update Open Graph tags
      updateMetaTag("property", "og:title", metaTitle);
      updateMetaTag("property", "og:description", metaDescription);
      updateMetaTag("property", "og:type", "website");
      updateMetaTag("property", "og:url", pageUrl);
      updateMetaTag("property", "og:image:width", "1200");
      updateMetaTag("property", "og:image:height", "630");
      updateMetaTag("property", "og:image", ogImage);
      updateMetaTag("property", "og:site_name", "Calculator Logical");

      // Update Twitter tags
      updateMetaTag("name", "twitter:card", "summary");
      updateMetaTag("name", "twitter:site", "@calculator-logical.com");
      updateMetaTag("name", "twitter:title", metaTitle);
      updateMetaTag("name", "twitter:description", metaDescription);
      updateMetaTag("name", "twitter:image", ogImage);
    }
  }, [data, metaTitle, metaDescription, ogImage]);

  const updateMetaTag = (attribute, value, content) => {
    if (typeof document === "undefined") return;

    let meta = document.querySelector(`meta[${attribute}="${value}"]`);
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute(attribute, value);
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", content);
  };

  // console.log(data?.payload?.calculator?.tech_meta_title,'tech_meta_title');
  // console.log(data?.payload?.calculator?.tech_meta_des,'tech_meta_des');
  return (
    <>
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
            path: pathname,
          },
        ]}
      >
        <div className="grid grid-cols-12 gap-0 bg-white">
          <div className="col-span-2 hidden md:block"></div>
          <div className="col-span-12 md:col-span-12">
            {/* Converter Interface */}
            <div className="grid grid-cols-12 gap-4 p-5 bg-[#F4F4F4] shadow-md">
              <input type="hidden" id="check" value={searchValue} />
              <p className="text-center text-sm md:text-base text-gray-700 mb-4 font-medium col-span-12">
                Please enter a value in either field and select units from both
                dropdowns to perform the conversion.
              </p>

              <div className="col-span-1 hidden md:block"></div>

              {/* From Section */}
              <div className="col-span-12 md:col-span-5">
                <div className="grid grid-cols-12">
                  <div className="col-span-12">
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

                  <div className="col-span-12">
                    <label htmlFor="calFrom" className="label">
                      &nbsp;
                    </label>
                    <div className="w-full bg-white rounded p-2 bordered">
                      <select
                        name="calFrom"
                        id="calFrom"
                        size="7"
                        className="unit-select custom-scroll w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 max-h-60 overflow-y-auto sm:max-h-72 md:max-h-80"
                        value={fromUnit}
                        onChange={handleFromUnitChange}
                      >
                        {/* Render converter components based on unit type */}
                        {unitConverter === "length-converter" && (
                          <LengthConverter
                            lang={JSON.parse(
                              data?.payload?.calculator?.tech_lang_keys || "{}"
                            )}
                          />
                        )}
                        {unitConverter === "volume-converter" && (
                          <VolumeConverter
                            lang={JSON.parse(
                              data?.payload?.calculator?.tech_lang_keys || "{}"
                            )}
                          />
                        )}
                        {unitConverter === "temperature-converter" && (
                          <TemperatureConverter
                            lang={JSON.parse(
                              data?.payload?.calculator?.tech_lang_keys || "{}"
                            )}
                          />
                        )}
                        {unitConverter === "weight-and-mass-converter" && (
                          <WeightAndMassConverter
                            lang={JSON.parse(
                              data?.payload?.calculator?.tech_lang_keys || "{}"
                            )}
                          />
                        )}
                        {unitConverter === "area-converter" && (
                          <AreaConverter
                            lang={JSON.parse(
                              data?.payload?.calculator?.tech_lang_keys || "{}"
                            )}
                          />
                        )}
                        {unitConverter === "pressure-converter" && (
                          <PressureConverter
                            lang={JSON.parse(
                              data?.payload?.calculator?.tech_lang_keys || "{}"
                            )}
                          />
                        )}
                        {unitConverter === "volume-dry-converter" && (
                          <VolumeDryConverter
                            lang={JSON.parse(
                              data?.payload?.calculator?.tech_lang_keys || "{}"
                            )}
                          />
                        )}
                        {unitConverter === "time-converter" && (
                          <TimeConverter
                            lang={JSON.parse(
                              data?.payload?.calculator?.tech_lang_keys || "{}"
                            )}
                          />
                        )}
                        {unitConverter === "energy-converter" && (
                          <EnergyConverter
                            lang={JSON.parse(
                              data?.payload?.calculator?.tech_lang_keys || "{}"
                            )}
                          />
                        )}
                        {unitConverter === "power-converter" && (
                          <PowerConverter
                            lang={JSON.parse(
                              data?.payload?.calculator?.tech_lang_keys || "{}"
                            )}
                          />
                        )}
                        {unitConverter === "force-converter" && (
                          <ForceConverter
                            lang={JSON.parse(
                              data?.payload?.calculator?.tech_lang_keys || "{}"
                            )}
                          />
                        )}
                        {unitConverter === "speed-converter" && (
                          <SpeedConverter
                            lang={JSON.parse(
                              data?.payload?.calculator?.tech_lang_keys || "{}"
                            )}
                          />
                        )}
                        {unitConverter === "angle-converter" && (
                          <AngleConverter
                            lang={JSON.parse(
                              data?.payload?.calculator?.tech_lang_keys || "{}"
                            )}
                          />
                        )}
                        {unitConverter === "fuel-consumption-converter" && (
                          <FuelConsumptionConverter
                            lang={JSON.parse(
                              data?.payload?.calculator?.tech_lang_keys || "{}"
                            )}
                          />
                        )}
                        {unitConverter === "data-storage-converter" && (
                          <DataStorageConverte
                            lang={JSON.parse(
                              data?.payload?.calculator?.tech_lang_keys || "{}"
                            )}
                          />
                        )}
                        {unitConverter === "number-converter" && (
                          <NumbersConverter
                            lang={JSON.parse(
                              data?.payload?.calculator?.tech_lang_keys || "{}"
                            )}
                          />
                        )}
                        {unitConverter === "acceleration-converter" && (
                          <AccelerationConverter
                            lang={JSON.parse(
                              data?.payload?.calculator?.tech_lang_keys || "{}"
                            )}
                          />
                        )}
                        {unitConverter === "density-converter" && (
                          <DensityConverter
                            lang={JSON.parse(
                              data?.payload?.calculator?.tech_lang_keys || "{}"
                            )}
                          />
                        )}
                        {unitConverter === "velocity-angular-converter" && (
                          <VelocityAngularConverter
                            lang={JSON.parse(
                              data?.payload?.calculator?.tech_lang_keys || "{}"
                            )}
                          />
                        )}
                        {unitConverter === "acceleration-angular-converter" && (
                          <AccelerationAngularConverter
                            lang={JSON.parse(
                              data?.payload?.calculator?.tech_lang_keys || "{}"
                            )}
                          />
                        )}
                        {unitConverter === "specific-volume-converter" && (
                          <SpecificVolumeConverter
                            lang={JSON.parse(
                              data?.payload?.calculator?.tech_lang_keys || "{}"
                            )}
                          />
                        )}
                        {unitConverter === "moment-of-inertia-converter" && (
                          <MomentOfInertiaConverter
                            lang={JSON.parse(
                              data?.payload?.calculator?.tech_lang_keys || "{}"
                            )}
                          />
                        )}
                        {unitConverter === "moment-of-force-converter" && (
                          <MomentOfForceConverter
                            lang={JSON.parse(
                              data?.payload?.calculator?.tech_lang_keys || "{}"
                            )}
                          />
                        )}
                        {unitConverter === "torque-converter" && (
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

              {/* To Section */}
              <div className="col-span-12 md:col-span-5">
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
                        className="unit-select custom-scroll w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 max-h-60 overflow-y-auto sm:max-h-72 md:max-h-80 lg:max-h-[350px] unit-select"
                        value={toUnit}
                        onChange={handleToUnitChange}
                      >
                        {/* Same converter components for "to" section */}
                        {unitConverter === "length-converter" && (
                          <LengthConverter
                            lang={JSON.parse(
                              data?.payload?.calculator?.tech_lang_keys || "{}"
                            )}
                          />
                        )}
                        {unitConverter === "volume-converter" && (
                          <VolumeConverter
                            lang={JSON.parse(
                              data?.payload?.calculator?.tech_lang_keys || "{}"
                            )}
                          />
                        )}
                        {unitConverter === "temperature-converter" && (
                          <TemperatureConverter
                            lang={JSON.parse(
                              data?.payload?.calculator?.tech_lang_keys || "{}"
                            )}
                          />
                        )}
                        {unitConverter === "weight-and-mass-converter" && (
                          <WeightAndMassConverter
                            lang={JSON.parse(
                              data?.payload?.calculator?.tech_lang_keys || "{}"
                            )}
                          />
                        )}
                        {unitConverter === "area-converter" && (
                          <AreaConverter
                            lang={JSON.parse(
                              data?.payload?.calculator?.tech_lang_keys || "{}"
                            )}
                          />
                        )}
                        {unitConverter === "pressure-converter" && (
                          <PressureConverter
                            lang={JSON.parse(
                              data?.payload?.calculator?.tech_lang_keys || "{}"
                            )}
                          />
                        )}
                        {unitConverter === "volume-dry-converter" && (
                          <VolumeDryConverter
                            lang={JSON.parse(
                              data?.payload?.calculator?.tech_lang_keys || "{}"
                            )}
                          />
                        )}
                        {unitConverter === "time-converter" && (
                          <TimeConverter
                            lang={JSON.parse(
                              data?.payload?.calculator?.tech_lang_keys || "{}"
                            )}
                          />
                        )}
                        {unitConverter === "energy-converter" && (
                          <EnergyConverter
                            lang={JSON.parse(
                              data?.payload?.calculator?.tech_lang_keys || "{}"
                            )}
                          />
                        )}
                        {unitConverter === "power-converter" && (
                          <PowerConverter
                            lang={JSON.parse(
                              data?.payload?.calculator?.tech_lang_keys || "{}"
                            )}
                          />
                        )}
                        {unitConverter === "force-converter" && (
                          <ForceConverter
                            lang={JSON.parse(
                              data?.payload?.calculator?.tech_lang_keys || "{}"
                            )}
                          />
                        )}
                        {unitConverter === "speed-converter" && (
                          <SpeedConverter
                            lang={JSON.parse(
                              data?.payload?.calculator?.tech_lang_keys || "{}"
                            )}
                          />
                        )}
                        {unitConverter === "angle-converter" && (
                          <AngleConverter
                            lang={JSON.parse(
                              data?.payload?.calculator?.tech_lang_keys || "{}"
                            )}
                          />
                        )}
                        {unitConverter === "fuel-consumption-converter" && (
                          <FuelConsumptionConverter
                            lang={JSON.parse(
                              data?.payload?.calculator?.tech_lang_keys || "{}"
                            )}
                          />
                        )}
                        {unitConverter === "data-storage-converter" && (
                          <DataStorageConverte
                            lang={JSON.parse(
                              data?.payload?.calculator?.tech_lang_keys || "{}"
                            )}
                          />
                        )}
                        {unitConverter === "number-converter" && (
                          <NumbersConverter
                            lang={JSON.parse(
                              data?.payload?.calculator?.tech_lang_keys || "{}"
                            )}
                          />
                        )}
                        {unitConverter === "acceleration-converter" && (
                          <AccelerationConverter
                            lang={JSON.parse(
                              data?.payload?.calculator?.tech_lang_keys || "{}"
                            )}
                          />
                        )}
                        {unitConverter === "density-converter" && (
                          <DensityConverter
                            lang={JSON.parse(
                              data?.payload?.calculator?.tech_lang_keys || "{}"
                            )}
                          />
                        )}
                        {unitConverter === "velocity-angular-converter" && (
                          <VelocityAngularConverter
                            lang={JSON.parse(
                              data?.payload?.calculator?.tech_lang_keys || "{}"
                            )}
                          />
                        )}
                        {unitConverter === "acceleration-angular-converter" && (
                          <AccelerationAngularConverter
                            lang={JSON.parse(
                              data?.payload?.calculator?.tech_lang_keys || "{}"
                            )}
                          />
                        )}
                        {unitConverter === "specific-volume-converter" && (
                          <SpecificVolumeConverter
                            lang={JSON.parse(
                              data?.payload?.calculator?.tech_lang_keys || "{}"
                            )}
                          />
                        )}
                        {unitConverter === "moment-of-inertia-converter" && (
                          <MomentOfInertiaConverter
                            lang={JSON.parse(
                              data?.payload?.calculator?.tech_lang_keys || "{}"
                            )}
                          />
                        )}
                        {unitConverter === "moment-of-force-converter" && (
                          <MomentOfForceConverter
                            lang={JSON.parse(
                              data?.payload?.calculator?.tech_lang_keys || "{}"
                            )}
                          />
                        )}
                        {unitConverter === "torque-converter" && (
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

              {/* Result Section */}
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
            {/* End Converter Interface */}

            {/* Related Converters Section */}
            <div className="col-span-12">
              <div className="grid grid-cols-12 gap-2 bg-white shadow my-2 p-2 contentAll">
                <p className="p-2 text-[18px] mt-5 col-span-12">
                  <strong>
                    {langObject["1"] || "Volume"}{" "}
                    {langObject["2"] || "Converters"}
                  </strong>
                </p>

                {Array.isArray(data?.payload?.all_sub) &&
                  data.payload.all_sub.map((value, index) => {
                    const calLink = value.tech_calculator_link;

                    if (!calLink) {
                      return null;
                    }

                    const formattedDisplayTitle = formatLinkTitle(calLink);

                    return (
                      <div
                        key={index}
                        className="col-span-12 md:col-span-6 px-2 text-[14px]"
                      >
                        <a
                          href={`/${calLink}/`}
                          className="p-1 hover:text-blue-600 transition-colors"
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

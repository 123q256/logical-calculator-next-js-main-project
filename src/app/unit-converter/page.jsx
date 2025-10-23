"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Head from "next/head";
// ConverterList
import { toast } from "react-toastify";
import ConverterSearch from "../../components/pages/Converter/component/ConverterSearch";
import ConverterList from "../../components/pages/Converter/component/ConverterList";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
const UnitConvertor = () => {
  const categories = [
    { value: "length", label: "Length" },
    { value: "temperature", label: "Temperature" },
    { value: "area", label: "Area" },
    { value: "volume", label: "Volume" },
    { value: "weight", label: "Weight" },
    { value: "time", label: "Time" },
  ];

  const unitOptions = {
    length: [
      { value: 1, label: "Meter" },
      { value: 2, label: "Kilometer" },
      { value: 3, label: "Centimeter" },
      { value: 4, label: "Millimeter" },
      { value: 5, label: "Micrometer" },
      { value: 6, label: "Nanometer" },
      { value: 7, label: "Mile" },
      { value: 8, label: "Yard" },
      { value: 9, label: "Foot" },
      { value: 10, label: "Inch" },
      { value: 11, label: "Light Year" },
      { value: 12, label: "Nautical mile" },
    ],
    temperature: [
      { value: 1, label: "Celsius" },
      { value: 2, label: "Kelvin" },
      { value: 3, label: "Fahrenheit" },
    ],
    area: [
      { value: 1, label: "Square Meter" },
      { value: 2, label: "Square Kilometer" },
      { value: 3, label: "Square Centimeter" },
      { value: 4, label: "Square Millimeter" },
      { value: 5, label: "Square Micrometer" },
      { value: 6, label: "Hectare" },
      { value: 7, label: "Square Mile" },
      { value: 8, label: "Square Yard" },
      { value: 9, label: "Square Foot" },
      { value: 10, label: "Square Inch" },
      { value: 11, label: "Acre" },
    ],
    volume: [
      { value: 1, label: "Cubic Meter" },
      { value: 2, label: "Cubic Kilometer" },
      { value: 3, label: "Cubic Centimeter" },
      { value: 4, label: "Cubic Millimeter" },
      { value: 5, label: "Liter" },
      { value: 6, label: "Milliliter" },
      { value: 7, label: "US Gallon" },
      { value: 8, label: "US Quart" },
      { value: 9, label: "US Pint" },
      { value: 10, label: "US Cup" },
      { value: 11, label: "US Fluid Ounce" },
      { value: 12, label: "US Table Spoon" },
      { value: 13, label: "US Tea Spoon" },
      { value: 14, label: "Imperial Gallon" },
      { value: 15, label: "Imperial Quart" },
      { value: 16, label: "Imperial Pint" },
      { value: 17, label: "Imperial Fluid Ounce" },
      { value: 18, label: "Imperial Table Spoon" },
      { value: 19, label: "Imperial Tea Spoon" },
      { value: 20, label: "Cubic Mile" },
      { value: 21, label: "Cubic Yard" },
      { value: 22, label: "Cubic Foot" },
      { value: 23, label: "Cubic Inch" },
    ],
    weight: [
      { value: 1, label: "Kilogram" },
      { value: 2, label: "Gram" },
      { value: 3, label: "Milligram" },
      { value: 4, label: "Metric Ton" },
      { value: 5, label: "Long Ton" },
      { value: 6, label: "Short Ton" },
      { value: 7, label: "Pound" },
      { value: 8, label: "Ounce" },
      { value: 9, label: "Carrat" },
      { value: 10, label: "Atomic Mass Unit" },
    ],
    time: [
      { value: 1, label: "Second" },
      { value: 2, label: "Millisecond" },
      { value: 3, label: "Microsecond" },
      { value: 4, label: "Nanosecond" },
      { value: 5, label: "Picosecond" },
      { value: 6, label: "Minute" },
      { value: 7, label: "Hour" },
      { value: 8, label: "Day" },
      { value: 9, label: "Week" },
      { value: 10, label: "Month" },
      { value: 11, label: "Year" },
    ],
  };

  const [activeTab, setActiveTab] = useState("length");
  const [fromValue, setFromValue] = useState("");
  const [toValue, setToValue] = useState("");
  const [fromUnit, setFromUnit] = useState(1);
  const [toUnit, setToUnit] = useState(2);
  const [result, setResult] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [currentUrl, setCurrentUrl] = useState("");
  const copyResult = () => {
    navigator.clipboard.writeText(result.toString());
    toast.success("Result copied to clipboard!");
  };

  const formatResult = (final_res) => {
    const gniTotalDigits = 12;
    const gniPareSize = 12;
    let valStr = "" + final_res;

    if (
      valStr.indexOf("N") >= 0 ||
      (final_res == 2 * final_res && final_res == 1 + final_res)
    )
      return "Error ";

    let i = valStr.indexOf("e");
    if (i >= 0) {
      const expStr = valStr.substring(i + 1, valStr.length);
      if (i > 11) i = 11; // max 11 digits
      valStr = valStr.substring(0, i);

      if (valStr.indexOf(".") < 0) {
        valStr += ".";
      } else {
        let j = valStr.length - 1;
        while (j >= 0 && valStr.charAt(j) == "0") --j;
        valStr = valStr.substring(0, j + 1);
      }
      valStr += "E" + expStr;
    } else {
      let valNeg = false;
      if (final_res < 0) {
        final_res = -final_res;
        valNeg = true;
      }

      const valInt = Math.floor(final_res);
      const valFrac = final_res - valInt;
      const prec = gniTotalDigits - ("" + valInt).length - 1;

      let mult = " 1000000000000000000".substring(1, prec + 2);
      if (mult == "" || mult == " ") {
        mult = 1;
      } else {
        mult = parseInt(mult);
      }

      const frac = Math.floor(valFrac * mult + 0.5);
      const roundedInt = Math.floor(Math.floor(final_res * mult + 0.5) / mult);

      valStr = valNeg ? "-" + roundedInt : "" + roundedInt;
      let fracStr = "00000000000000" + frac;
      fracStr = fracStr.substring(fracStr.length - prec, fracStr.length);
      i = fracStr.length - 1;

      while (i >= 0 && fracStr.charAt(i) == "0") --i;
      fracStr = fracStr.substring(0, i + 1);
      if (i >= 0) valStr += "." + fracStr;
    }
    return valStr;
  };

  // Conversion functions
  const convertFromTo = (value, fromUnit, toUnit, category) => {
    let convertedValue = parseFloat(value);
    if (isNaN(convertedValue)) return NaN;

    // First convert to the base unit (meter for length, etc.)
    switch (category) {
      case "length":
        convertedValue = convertLength(convertedValue, fromUnit, 1); // Convert to meters first
        return convertLength(convertedValue, 1, toUnit); // Then convert to target unit

      case "temperature":
        return convertTemperature(convertedValue, fromUnit, toUnit);

      case "area":
        convertedValue = convertArea(convertedValue, fromUnit, 1); // Convert to square meters
        return convertArea(convertedValue, 1, toUnit);

      case "volume":
        convertedValue = convertVolume(convertedValue, fromUnit, 1); // Convert to cubic meters
        return convertVolume(convertedValue, 1, toUnit);

      case "weight":
        convertedValue = convertWeight(convertedValue, fromUnit, 1); // Convert to kilograms
        return convertWeight(convertedValue, 1, toUnit);

      case "time":
        convertedValue = convertTime(convertedValue, fromUnit, 1); // Convert to seconds
        return convertTime(convertedValue, 1, toUnit);

      default:
        return NaN;
    }
  };

  // Individual conversion functions
  const convertLength = (value, fromUnit, toUnit) => {
    // First convert to meters
    let inMeters;
    switch (fromUnit) {
      case 1:
        inMeters = value;
        break; // meter
      case 2:
        inMeters = value * 1000;
        break; // kilometer
      case 3:
        inMeters = value / 100;
        break; // centimeter
      case 4:
        inMeters = value / 1000;
        break; // millimeter
      case 5:
        inMeters = value / 1000000;
        break; // micrometer
      case 6:
        inMeters = value / 1000000000;
        break; // nanometer
      case 7:
        inMeters = value * 1609.35;
        break; // mile
      case 8:
        inMeters = value * 0.9144;
        break; // yard
      case 9:
        inMeters = value * 0.3048;
        break; // foot
      case 10:
        inMeters = value * 0.0254;
        break; // inch
      case 11:
        inMeters = value * 9.46066e15;
        break; // light year
      case 12:
        inMeters = value * 1852;
        break; // nautical mile
      default:
        return NaN;
    }

    // Then convert from meters to target unit
    switch (toUnit) {
      case 1:
        return inMeters; // meter
      case 2:
        return inMeters / 1000; // kilometer
      case 3:
        return inMeters * 100; // centimeter
      case 4:
        return inMeters * 1000; // millimeter
      case 5:
        return inMeters * 1e6; // micrometer
      case 6:
        return inMeters * 1e9; // nanometer
      case 7:
        return inMeters / 1609.35; // mile
      case 8:
        return inMeters / 0.9144; // yard
      case 9:
        return inMeters / 0.3048; // foot
      case 10:
        return inMeters / 0.0254; // inch
      case 11:
        return inMeters / 9.46066e15; // light year
      case 12:
        return inMeters / 1852; // nautical mile
      default:
        return NaN;
    }
  };

  const convertTemperature = (value, fromUnit, toUnit) => {
    // First convert to Celsius
    let inCelsius;
    switch (fromUnit) {
      case 1:
        inCelsius = value;
        break; // Celsius
      case 2:
        inCelsius = value - 273.15;
        break; // Kelvin
      case 3:
        inCelsius = ((value - 32) * 5) / 9;
        break; // Fahrenheit
      default:
        return NaN;
    }

    // Then convert from Celsius to target unit
    switch (toUnit) {
      case 1:
        return inCelsius; // Celsius
      case 2:
        return inCelsius + 273.15; // Kelvin
      case 3:
        return (inCelsius * 9) / 5 + 32; // Fahrenheit
      default:
        return NaN;
    }
  };

  const convertArea = (value, fromUnit, toUnit) => {
    // First convert to square meters
    let inSquareMeters;
    switch (fromUnit) {
      case 1:
        inSquareMeters = value;
        break; // Square Meter
      case 2:
        inSquareMeters = value * 1000000;
        break; // Square Kilometer
      case 3:
        inSquareMeters = value * 0.0001;
        break; // Square Centimeter
      case 4:
        inSquareMeters = value * 0.000001;
        break; // Square Millimeter
      case 5:
        inSquareMeters = value * 0.000000000001;
        break; // Square Micrometer
      case 6:
        inSquareMeters = value * 10000;
        break; // Hectare
      case 7:
        inSquareMeters = value * 2589990;
        break; // Square Mile
      case 8:
        inSquareMeters = value * 0.83612736;
        break; // Square Yard
      case 9:
        inSquareMeters = value * 0.09290304;
        break; // Square Foot
      case 10:
        inSquareMeters = value * 0.00064516;
        break; // Square Inch
      case 11:
        inSquareMeters = value * 4046.8564224;
        break; // Acre
      default:
        return NaN;
    }

    // Then convert from square meters to target unit
    switch (toUnit) {
      case 1:
        return inSquareMeters; // Square Meter
      case 2:
        return inSquareMeters / 1000000; // Square Kilometer
      case 3:
        return inSquareMeters / 0.0001; // Square Centimeter
      case 4:
        return inSquareMeters / 0.000001; // Square Millimeter
      case 5:
        return inSquareMeters / 0.000000000001; // Square Micrometer
      case 6:
        return inSquareMeters / 10000; // Hectare
      case 7:
        return inSquareMeters / 2589990; // Square Mile
      case 8:
        return inSquareMeters / 0.83612736; // Square Yard
      case 9:
        return inSquareMeters / 0.09290304; // Square Foot
      case 10:
        return inSquareMeters / 0.00064516; // Square Inch
      case 11:
        return inSquareMeters / 4046.8564224; // Acre
      default:
        return NaN;
    }
  };

  const convertVolume = (value, fromUnit, toUnit) => {
    // First convert to cubic meters
    let inCubicMeters;
    switch (fromUnit) {
      case 1:
        inCubicMeters = value;
        break; // Cubic Meter
      case 2:
        inCubicMeters = value * 1000000000;
        break; // Cubic Kilometer
      case 3:
        inCubicMeters = value * 0.000001;
        break; // Cubic Centimeter
      case 4:
        inCubicMeters = value * 1.0e-9;
        break; // Cubic Millimeter
      case 5:
        inCubicMeters = value * 0.001;
        break; // Liter
      case 6:
        inCubicMeters = value * 0.000001;
        break; // Milliliter
      case 7:
        inCubicMeters = value * 0.00378541;
        break; // US Gallon
      case 8:
        inCubicMeters = value * 0.0009463525;
        break; // US Quart
      case 9:
        inCubicMeters = value * 0.00047317625;
        break; // US Pint
      case 10:
        inCubicMeters = value * 0.000236588125;
        break; // US Cup
      case 11:
        inCubicMeters = value * 0.000029573515625;
        break; // US Fluid Ounce
      case 12:
        inCubicMeters = value * 0.0000147867578125;
        break; // US Table Spoon
      case 13:
        inCubicMeters = value * 4.9289192708333333333333333333333e-6;
        break; // US Tea Spoon
      case 14:
        inCubicMeters = value * 0.00454609;
        break; // Imperial Gallon
      case 15:
        inCubicMeters = value * 0.0011365225;
        break; // Imperial Quart
      case 16:
        inCubicMeters = value * 0.00056826125;
        break; // Imperial Pint
      case 17:
        inCubicMeters = value * 0.0000284130625;
        break; // Imperial Fluid Ounce
      case 18:
        inCubicMeters = value * 0.0000177581640625;
        break; // Imperial Table Spoon
      case 19:
        inCubicMeters = value * 5.9193880208333333333333333333333e-6;
        break; // Imperial Tea Spoon
      case 20:
        inCubicMeters = value * 4.16818e9;
        break; // Cubic Mile
      case 21:
        inCubicMeters = value * 0.764554857984;
        break; // Cubic Yard
      case 22:
        inCubicMeters = value * 0.028316846592;
        break; // Cubic Foot
      case 23:
        inCubicMeters = value * 0.000016387064;
        break; // Cubic Inch
      default:
        return NaN;
    }

    // Then convert from cubic meters to target unit
    switch (toUnit) {
      case 1:
        return inCubicMeters; // Cubic Meter
      case 2:
        return inCubicMeters / 1000000000; // Cubic Kilometer
      case 3:
        return inCubicMeters / 0.000001; // Cubic Centimeter
      case 4:
        return inCubicMeters / 1.0e-9; // Cubic Millimeter
      case 5:
        return inCubicMeters / 0.001; // Liter
      case 6:
        return inCubicMeters / 0.000001; // Milliliter
      case 7:
        return inCubicMeters / 0.00378541; // US Gallon
      case 8:
        return inCubicMeters / 0.0009463525; // US Quart
      case 9:
        return inCubicMeters / 0.00047317625; // US Pint
      case 10:
        return inCubicMeters / 0.000236588125; // US Cup
      case 11:
        return inCubicMeters / 0.000029573515625; // US Fluid Ounce
      case 12:
        return inCubicMeters / 0.0000147867578125; // US Table Spoon
      case 13:
        return inCubicMeters / 4.9289192708333333333333333333333e-6; // US Tea Spoon
      case 14:
        return inCubicMeters / 0.00454609; // Imperial Gallon
      case 15:
        return inCubicMeters / 0.0011365225; // Imperial Quart
      case 16:
        return inCubicMeters / 0.00056826125; // Imperial Pint
      case 17:
        return inCubicMeters / 0.0000284130625; // Imperial Fluid Ounce
      case 18:
        return inCubicMeters / 0.0000177581640625; // Imperial Table Spoon
      case 19:
        return inCubicMeters / 5.9193880208333333333333333333333e-6; // Imperial Tea Spoon
      case 20:
        return inCubicMeters / 4.16818e9; // Cubic Mile
      case 21:
        return inCubicMeters / 0.764554857984; // Cubic Yard
      case 22:
        return inCubicMeters / 0.028316846592; // Cubic Foot
      case 23:
        return inCubicMeters / 0.000016387064; // Cubic Inch
      default:
        return NaN;
    }
  };

  const convertWeight = (value, fromUnit, toUnit) => {
    // First convert to kilograms
    let inKilograms;
    switch (fromUnit) {
      case 1:
        inKilograms = value;
        break; // Kilogram
      case 2:
        inKilograms = value * 0.001;
        break; // Gram
      case 3:
        inKilograms = value * 0.000001;
        break; // Milligram
      case 4:
        inKilograms = value * 1000;
        break; // Metric Ton
      case 5:
        inKilograms = value * 1016.04608;
        break; // Long Ton
      case 6:
        inKilograms = value * 907.184;
        break; // Short Ton
      case 7:
        inKilograms = value * 0.453592;
        break; // Pound
      case 8:
        inKilograms = value * 0.0283495;
        break; // Ounce
      case 9:
        inKilograms = value * 0.0002;
        break; // Carrat
      case 10:
        inKilograms = value * 1.6605401999104288e-27;
        break; // Atomic Mass Unit
      default:
        return NaN;
    }

    // Then convert from kilograms to target unit
    switch (toUnit) {
      case 1:
        return inKilograms; // Kilogram
      case 2:
        return inKilograms / 0.001; // Gram
      case 3:
        return inKilograms / 0.000001; // Milligram
      case 4:
        return inKilograms / 1000; // Metric Ton
      case 5:
        return inKilograms / 1016.04608; // Long Ton
      case 6:
        return inKilograms / 907.184; // Short Ton
      case 7:
        return inKilograms / 0.453592; // Pound
      case 8:
        return inKilograms / 0.0283495; // Ounce
      case 9:
        return inKilograms / 0.0002; // Carrat
      case 10:
        return inKilograms / 1.6605401999104288e-27; // Atomic Mass Unit
      default:
        return NaN;
    }
  };

  const convertTime = (value, fromUnit, toUnit) => {
    // First convert to seconds
    let inSeconds;
    switch (fromUnit) {
      case 1:
        inSeconds = value;
        break; // Second
      case 2:
        inSeconds = value * 0.001;
        break; // Millisecond
      case 3:
        inSeconds = value * 0.000001;
        break; // Microsecond
      case 4:
        inSeconds = value * 0.000000001;
        break; // Nanosecond
      case 5:
        inSeconds = value * 0.000000000001;
        break; // Picosecond
      case 6:
        inSeconds = value * 60;
        break; // Minute
      case 7:
        inSeconds = value * 3600;
        break; // Hour
      case 8:
        inSeconds = value * 86400;
        break; // Day
      case 9:
        inSeconds = value * 604800;
        break; // Week
      case 10:
        inSeconds = value * 2629800;
        break; // Month (average)
      case 11:
        inSeconds = value * 31557600;
        break; // Year (average)
      default:
        return NaN;
    }

    // Then convert from seconds to target unit
    switch (toUnit) {
      case 1:
        return inSeconds; // Second
      case 2:
        return inSeconds / 0.001; // Millisecond
      case 3:
        return inSeconds / 0.000001; // Microsecond
      case 4:
        return inSeconds / 0.000000001; // Nanosecond
      case 5:
        return inSeconds / 0.000000000001; // Picosecond
      case 6:
        return inSeconds / 60; // Minute
      case 7:
        return inSeconds / 3600; // Hour
      case 8:
        return inSeconds / 86400; // Day
      case 9:
        return inSeconds / 604800; // Week
      case 10:
        return inSeconds / 2629800; // Month
      case 11:
        return inSeconds / 31557600; // Year
      default:
        return NaN;
    }
  };

  // Similar functions for area, volume, weight, and time...
  // Implement convertArea, convertVolume, convertWeight, convertTime following the same pattern

  // Calculate function
  const calculate = () => {
    if (fromValue === "") {
      setShowResult(false);
      return;
    }

    const result = convertFromTo(fromValue, fromUnit, toUnit, activeTab);
    if (isNaN(result)) {
      setShowResult(false);
    } else {
      setResult(formatResult(result));
      setShowResult(true);
    }
  };

  // Reverse calculate function
  const rev_cal = () => {
    if (toValue === "") {
      setShowResult(false);
      return;
    }

    const result = convertFromTo(toValue, toUnit, fromUnit, activeTab);
    if (isNaN(result)) {
      setShowResult(false);
    } else {
      setFromValue(formatResult(result));
      setResult(toValue);
      setShowResult(true);
    }
  };

  // Update calculations whenever inputs change
  useEffect(() => {
    calculate();
  }, [fromValue, fromUnit, toUnit, activeTab]);

  useEffect(() => {
    rev_cal();
  }, [toValue]);

  const metaTitle =
    "Conversion Calculator - Metric Units Measurement Converter";
  const metaDescription =
    "The unit conversion calculator for metric/imperial units converts between several units of measurement like length, weight, area, volume, and more.";
  const ogImage =
    "https://calculator-logical.com/images/ogview/pages/calculator-logical.png";

  // ✅ SSR safe window usage
  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentUrl(window.location.href);
    }
  }, []);

  // Dynamic Meta Tags Update (Client-side)
  useEffect(() => {
    if (typeof window !== "undefined") {
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
  }, [metaTitle, metaDescription, ogImage]);

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

  return (
    <>
      <Head>
        <title>{metaTitle || "My App"}</title>
        <meta name="description" content={metaDescription || "Description."} />
        <meta property="og:site_name" content="Calculator Logical" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:image" content={ogImage} />
        {currentUrl && <meta property="og:url" content={currentUrl} />}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@calculator-logical.com" />
        <meta name="twitter:title" content={metaTitle} />
        <meta name="twitter:description" content={metaDescription} />
        <meta name="twitter:image" content={ogImage} />
        {currentUrl && <link rel="canonical" href={currentUrl} />}
      </Head>

      <div className="container mx-auto w-full max-w-screen-xl bg-white text-black  ">
        <div className="grid grid-cols-12 gap-2 md:gap-4 mx-5">
          <div className="w-full  col-span-12 md:col-span-8 lg:col-span-9 ">
            <div className="w-full">
              <h1 className="text-2xl lg:text-2xl md:text-2xl font-semibold my-3 ">
                Unit Converter
              </h1>
            </div>
            <div className=" w-full p-3  rounded-[20px] bg-[#EDEDED] mt-3">
              <div className="grid grid-cols-12   bg-white p-3 rounded-lg">
                {/* Unit Converter */}
                <p className="text-center text-sm md:text-base text-gray-700 mb-2 font-medium col-span-12">
                  Please enter a value in either field and select units from
                  both dropdowns to perform the conversion.
                </p>

                <div className="col-span-12">
                  <div className="grid grid-cols-12 align-center bg-white font-s-12 text-center bordered border-gray-200 rounded-lg p-1">
                    {categories.map(({ value, label }) => (
                      <div
                        key={value}
                        className={`col-span-4 md:col-span-2 py-2 cursor-pointer rounded-[10px] pacetab ${
                          activeTab === value
                            ? "bg-[#2845F5] text-white"
                            : "text-gray-800"
                        }`}
                        onClick={() => {
                          setActiveTab(value);
                          setShowResult(false);
                        }}
                      >
                        {label}
                      </div>
                    ))}
                    <input
                      type="hidden"
                      id="calculator_name"
                      value={activeTab}
                    />
                  </div>
                </div>
                {/* From */}
                <div className="col-span-12 mt-4">
                  <div className="grid grid-cols-12 gap-2">
                    <div className="col-span-12 md:px-2">
                      <div className="grid grid-cols-12 gap-2 converter_input">
                        {/* from */}
                        <div className="col-span-6 md:col-span-6">
                          <label htmlFor="from" className="text-blue label">
                            From:
                          </label>
                          <div className="w-full pt-2">
                            <input
                              type="number"
                              name="from"
                              id="from"
                              value={fromValue}
                              onChange={(e) => setFromValue(e.target.value)}
                              onKeyUp={calculate}
                              className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-[#2845F5] rounded-lg focus:ring-opacity-40"
                              aria-label="input"
                              placeholder="00"
                            />
                          </div>
                        </div>
                        {/* to */}
                        <div className="col-span-6 md:col-span-6">
                          <label htmlFor="to" className="text-blue label">
                            To:
                          </label>
                          <div className="w-full pt-2">
                            <input
                              type="number"
                              name="to"
                              id="to"
                              value={result || ""}
                              // value={toValue}
                              onChange={(e) => setToValue(e.target.value)}
                              onKeyUp={rev_cal}
                              className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-[#99ea48] rounded-lg focus:ring-opacity-40"
                              aria-label="input"
                              placeholder="00"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-span-12 md:px-2">
                      <div className="grid grid-cols-12 gap-2">
                        <div
                          className={`col-span-6 unit_converters ${activeTab}`}
                        >
                          <label htmlFor="calFrom" className="label">
                            &nbsp;
                          </label>
                          <div className="w-full bg-white rounded-lg p-2 bordered border-gray-200">
                            <select
                              name="calFrom"
                              id="calFrom"
                              size={7}
                              className="unit-select custom-scroll w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500
                                  max-h-60 overflow-y-auto sm:max-h-72 md:max-h-80 lg:max-h-[350px]"
                              onChange={(e) => {
                                setFromUnit(parseInt(e.target.value));
                                calculate();
                              }}
                              value={fromUnit}
                            >
                              {unitOptions[activeTab].map((option) => (
                                <option
                                  key={option.value}
                                  className="p-1"
                                  value={option.value}
                                >
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <div
                          className={`col-span-6 unit_converters ${activeTab}`}
                        >
                          <label htmlFor="calto" className="label">
                            &nbsp;
                          </label>
                          <div className="w-full bg-white rounded-lg p-2 bordered border-gray-200">
                            <select
                              name="calto"
                              id="calto"
                              size={7}
                              className="unit-select custom-scroll w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500
      max-h-60 overflow-y-auto sm:max-h-72 md:max-h-80 lg:max-h-[350px]"
                              onChange={(e) => {
                                setToUnit(parseInt(e.target.value));
                                calculate();
                              }}
                              value={toUnit}
                            >
                              {unitOptions[activeTab].map((option) => (
                                <option
                                  key={option.value}
                                  className="p-1"
                                  value={option.value}
                                >
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      className={`col-span-12  mt-4 mx-auto res_ans ${
                        showResult ? "" : "hidden"
                      }`}
                    >
                      <div className="flex items-center">
                        <strong className="text-[#2845F5] text-[14px] md:text-lg font-bold me-2">
                          Result:
                        </strong>
                        <div className="flex items-center bg-white border border-gray-300 rounded-lg px-3 py-2 w-fit">
                          <div className="result font-bold text-[14px] md:text-lg text-gray-900">
                            {result}{" "}
                          </div>
                          <span className="ml-2 text-gray-600">
                            {" "}
                            {
                              unitOptions[activeTab].find(
                                (unit) => unit.value === toUnit
                              )?.label
                            }
                          </span>
                          <button
                            onClick={copyResult}
                            className="ml-3 text-gray-500 hover:text-gray-700"
                          >
                            {" "}
                            <img
                              loading="lazy"
                              src="/images/copy.png"
                              alt="Copy Result"
                              title="Copy Result"
                              width={20}
                              height={20}
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-span-12 mt-4">
              <div className="col-12 content my-2 contentAll">
                The conversion calculator is a clever tool that enables to carry
                out measurement conversions between the unique units of
                measurements inside exceptional measure structures. This unit
                dimension calculator offers you with a primary expertise of the
                systems that presently in use at some point of the sector.
                <h2 id="History-of-the-Metric-System">
                  {" "}
                  Records of the Metric system:
                </h2>
                In 1975, the government of French formally adopted the metric
                gadget of dimension. Gabriel Mouton (a church vicar in Lyons),
                France, is named as the founder of the metric machine. In 1670,
                Gabriel did a splendid process as he proposed a decimal gadget
                of measurement, which the French scientists might couple of
                years in addition refining. In 1790, the country wide meeting of
                France (French: Assemblée nationale) known as for an invariable
                trendy of measurements and weights having as its basis a unit of
                duration that depends in the world’s circumference. As a comfort
                the machine of measurements would be decimal based totally in
                conjunction with larger &amp; smaller multiples of each unit
                that arrived with the aid of dividing &amp; multiplying by way
                of 10 and its powers.
                <h3 id="How-To-Do-Measurement-Conversion-With-This-Metric-Conversion-Calculator">
                  How to Do dimension Conversion With This Metric Conversion
                  Calculator:
                </h3>
                Changing measurements turns into smooth with the help of this
                tool; this converter for gadgets will do unit converter
                corresponding to size trendy structures. permit’s take a glance
                the way it works: This specific version of unit conversion
                calculator full of a six conversion converters, these are:
                <ul>
                  <li>Length</li>
                  <li>Temperature</li>
                  <li>Area</li>
                  <li>Volume</li>
                  <li>Weight</li>
                  <li>Time</li>
                </ul>
                So, in case you want to perform size conversion with this
                measurement calculator, then surely stick to the mentioned
                steps:
                <ul>
                  <li>
                    All you need to make a click at the tab for that you want to
                    carry out measurements conversion
                  </li>
                  <li>
                    Very subsequent, you need to choose the unit from the left
                    drop down container for that you want to transform from and
                    input the value of this selected unit into the given field
                  </li>
                  <li>
                    Then, you have to pick the unit from the proper drop-down
                    box for that you need to get conversions
                  </li>
                  <li>
                    Once finished, the unit size converter calculator perform
                    brief real-time conversions
                  </li>
                </ul>
                <h2 id="Metric-Measurement-Conversions">
                  <strong>Metric dimension Conversions:</strong>
                </h2>
                A listing of metric unit conversions is supplied inside the
                given metric unit conversion table:
                <div className="col s12" style={{ overflow: "auto" }}>
                  <table
                    className="highlight striped font_size18 font_s16_m"
                    style={{ height: 3271 }}
                    width={755}
                  >
                    <caption className="">
                      Common equivalents and conversion elements for U.S.
                      customary and SI structures
                    </caption>
                    <thead className="">
                      <tr>
                        <th colSpan={2} scope="col">
                          Approximate commonplace equivalents
                        </th>
                      </tr>
                    </thead>
                    <tfoot className="">
                      <tr>
                        <td colSpan={2}>*Common term not used in SI.</td>
                      </tr>
                      <tr>
                        <td colSpan={2}>**Exact.</td>
                      </tr>
                      <tr>
                        <td colSpan={2}>
                          Source: National Bureau of Standards Wall Chart.
                        </td>
                      </tr>
                    </tfoot>
                    <tbody className="">
                      <tr>
                        <td scope="row">1 inch</td>
                        <td>= 25 millimetres</td>
                      </tr>
                      <tr>
                        <td scope="row">1 foot</td>
                        <td>= 0.3 metre</td>
                      </tr>
                      <tr>
                        <td scope="row">1 yard</td>
                        <td>= 0.9 metre</td>
                      </tr>
                      <tr>
                        <td scope="row">1 mile</td>
                        <td>= 1.6 kilometres</td>
                      </tr>
                      <tr>
                        <td scope="row">1 square inch</td>
                        <td>= 6.5 square centimetres</td>
                      </tr>
                      <tr>
                        <td scope="row">1 square foot</td>
                        <td>= 0.09 square metre</td>
                      </tr>
                      <tr>
                        <td scope="row">1 square yard</td>
                        <td>= 0.8 square metre</td>
                      </tr>
                      <tr>
                        <td scope="row">1 acre</td>
                        <td>= 0.4 hectare*</td>
                      </tr>
                      <tr>
                        <td scope="row">1 cubic inch</td>
                        <td>= 16 cubic centimetres</td>
                      </tr>
                      <tr>
                        <td scope="row">1 cubic foot</td>
                        <td>= 0.03 cubic metre</td>
                      </tr>
                      <tr>
                        <td scope="row">1 cubic yard</td>
                        <td>= 0.8 cubic metre</td>
                      </tr>
                      <tr>
                        <td scope="row">1 quart (liq)</td>
                        <td>= 1 litre*</td>
                      </tr>
                      <tr>
                        <td scope="row">1 gallon</td>
                        <td>= 0.004 cubic metre</td>
                      </tr>
                      <tr>
                        <td scope="row">1 ounce (avdp)</td>
                        <td>= 28 grams</td>
                      </tr>
                      <tr>
                        <td scope="row">1 pound (avdp)</td>
                        <td>= 0.45 kilogram</td>
                      </tr>
                      <tr>
                        <td scope="row">1 horsepower</td>
                        <td>= 0.75 kilowatt</td>
                      </tr>
                      <tr>
                        <td scope="row">1 millimetre</td>
                        <td>= 0.04 inch</td>
                      </tr>
                      <tr>
                        <td scope="row">1 metre</td>
                        <td>= 3.3 feet</td>
                      </tr>
                      <tr>
                        <td scope="row">1 metre</td>
                        <td>= 1.1 yards</td>
                      </tr>
                      <tr>
                        <td scope="row">1 kilometre</td>
                        <td>= 0.6 mile (statute)</td>
                      </tr>
                      <tr>
                        <td scope="row">1 square centimetre</td>
                        <td>= 0.16 square inch</td>
                      </tr>
                      <tr>
                        <td scope="row">1 square metre</td>
                        <td>= 11 square feet</td>
                      </tr>
                      <tr>
                        <td scope="row">1 square metre</td>
                        <td>= 1.2 square yards</td>
                      </tr>
                      <tr>
                        <td scope="row">1 hectare*</td>
                        <td>= 2.5 acres</td>
                      </tr>
                      <tr>
                        <td scope="row">1 cubic centimetre</td>
                        <td>= 0.06 cubic inch</td>
                      </tr>
                      <tr>
                        <td scope="row">1 cubic metre</td>
                        <td>= 35 cubic feet</td>
                      </tr>
                      <tr>
                        <td scope="row">1 cubic metre</td>
                        <td>= 1.3 cubic yards</td>
                      </tr>
                      <tr>
                        <td scope="row">1 litre*</td>
                        <td>= 1 quart (liq)</td>
                      </tr>
                      <tr>
                        <td scope="row">1 cubic metre</td>
                        <td>= 264 gallons</td>
                      </tr>
                      <tr>
                        <td scope="row">1 gram</td>
                        <td>= 0.035 ounce (avdp)</td>
                      </tr>
                      <tr>
                        <td scope="row">1 kilogram</td>
                        <td>= 2.2 pounds (avdp)</td>
                      </tr>
                      <tr>
                        <td scope="row">1 kilowatt</td>
                        <td>= 1.3 horsepower</td>
                      </tr>
                    </tbody>
                    <thead className="">
                      <tr>
                        <th colSpan={2} scope="col">
                          conversions accurate within 10 parts per million
                        </th>
                      </tr>
                    </thead>
                    <tbody className="">
                      <tr>
                        <td scope="row">inches × 25.4**</td>
                        <td>= millimetres</td>
                      </tr>
                      <tr>
                        <td scope="row">feet × 0.3048**</td>
                        <td>= metres</td>
                      </tr>
                      <tr>
                        <td scope="row">yards × 0.9144**</td>
                        <td>= metres</td>
                      </tr>
                      <tr>
                        <td scope="row">miles × 1.60934</td>
                        <td>= kilometres</td>
                      </tr>
                      <tr>
                        <td scope="row">square inches × 6.4516**</td>
                        <td>= square centimetres</td>
                      </tr>
                      <tr>
                        <td scope="row">square feet × 0.0929030</td>
                        <td>= square metres</td>
                      </tr>
                      <tr>
                        <td scope="row">square yards × 0.836127</td>
                        <td>= square metres</td>
                      </tr>
                      <tr>
                        <td scope="row">acres × 0.404686</td>
                        <td>= hectares</td>
                      </tr>
                      <tr>
                        <td scope="row">cubic inches × 16.3871</td>
                        <td>= cubic centimetres</td>
                      </tr>
                      <tr>
                        <td scope="row">cubic feet × 0.0283168</td>
                        <td>= cubic metres</td>
                      </tr>
                      <tr>
                        <td scope="row">cubic yards × 0.764555</td>
                        <td>= cubic metres</td>
                      </tr>
                      <tr>
                        <td scope="row">quarts (liq) × 0.946353</td>
                        <td>= litres</td>
                      </tr>
                      <tr>
                        <td scope="row">gallons × 0.00378541</td>
                        <td>= cubic metres</td>
                      </tr>
                      <tr>
                        <td scope="row">ounces (avdp) × 28.3495</td>
                        <td>= grams</td>
                      </tr>
                      <tr>
                        <td scope="row">pounds (avdp) × 0.453592</td>
                        <td>= kilograms</td>
                      </tr>
                      <tr>
                        <td scope="row">horsepower × 0.745700</td>
                        <td>= kilowatts</td>
                      </tr>
                      <tr>
                        <td scope="row">millimetres × 0.0393701</td>
                        <td>= inches</td>
                      </tr>
                      <tr>
                        <td scope="row">metres × 3.28084</td>
                        <td>= feet</td>
                      </tr>
                      <tr>
                        <td scope="row">metres × 1.09361</td>
                        <td>= yards</td>
                      </tr>
                      <tr>
                        <td scope="row">kilometres × 0.621371</td>
                        <td>= miles (statute)</td>
                      </tr>
                      <tr>
                        <td scope="row">square centimetres × 0.155000</td>
                        <td>= square inches</td>
                      </tr>
                      <tr>
                        <td scope="row">square metres × 10.7639</td>
                        <td>= square feet</td>
                      </tr>
                      <tr>
                        <td scope="row">square metres × 1.19599</td>
                        <td>= square yards</td>
                      </tr>
                      <tr>
                        <td scope="row">hectares × 2.47105</td>
                        <td>= acres</td>
                      </tr>
                      <tr>
                        <td scope="row">cubic centimetres × 0.0610237</td>
                        <td>= cubic inches</td>
                      </tr>
                      <tr>
                        <td scope="row">cubic metres × 35.3147</td>
                        <td>= cubic feet</td>
                      </tr>
                      <tr>
                        <td scope="row">cubic metres × 1.30795</td>
                        <td>= cubic yards</td>
                      </tr>
                      <tr>
                        <td scope="row">litres × 1.05669</td>
                        <td>= quarts (liq)</td>
                      </tr>
                      <tr>
                        <td scope="row">cubic metres × 264.172</td>
                        <td>= gallons</td>
                      </tr>
                      <tr>
                        <td scope="row">grams × 0.0352740</td>
                        <td>= ounces (avdp)</td>
                      </tr>
                      <tr>
                        <td scope="row">kilograms × 2.20462</td>
                        <td>= pounds (avdp)</td>
                      </tr>
                      <tr>
                        <td scope="row">kilowatts × 1.34102</td>
                        <td>= horsepower</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <h2 id="FAQs">
                  <strong>FAQ’s</strong>
                </h2>
                <h3 id="Why-Is-Measurement-Important-In-Our-Daily-Life">
                  Why Is size vital In Our every day life?
                </h3>
                No question, measurements are something that provides a popular
                for normal things and approaches. There are sure gadgets from
                weight, length, temperature, even time is a measurement devices
                and it does play a crucial position in our daily lives. also, we
                use a size of money or forex.
                <h3 id="How-Do-I-Convert-Metric-To-Standard">
                  How Do I Convert Metric to traditional?
                </h3>
                The perfect and best manner is to use the metric to standard
                conversion tables.
                <h3 id="What-Are-The-Main-Units-Of-Length-In-The-US">
                  <strong>
                    What Are the principle units Of length inside the US?
                  </strong>
                </h3>
                For measuring the duration units, the U.S. standard size device
                makes use of the foot, backyard, inch, an mile, these are the
                most effective four main standard duration measurements in that
                use in each day lives. when you consider that 1959, these had
                been stated on the idea of one backyard = 0.9144 m, which except
                for some programs in surveying.
                <h3 id="What-Is-Metric-To-English-Conversion">
                  what is Metric To English Conversion?
                </h3>
                All you want to stick to the metric to English conversion chart
                to perform these conversions.
                <h3 id="What-Are-Standard-Units-Of-Measurement">
                  <strong>What Are wellknown units Of size?</strong>
                </h3>
                A fashionable unit of dimension is stated to a quantifiable
                language that assists all people to apprehend the association of
                the object with the size. Inside the united statesmeasurements,
                it's miles expressed feet, inches, and pounds, while in metric
                gadget, centimeters, meters, and kilograms.
                <h2 id="References">
                  <strong>References:</strong>
                </h2>
                From the supply of From Wikipedia, the loose encyclopedia -{" "}
                <a
                  href="https://en.wikipedia.org/wiki/Conversion_of_units"
                  rel="nofollow"
                >
                  Conversion of units
                </a>{" "}
                – Tables of Conversion factors together with the Calculation
                concerning non-SI gadgets From the source of wikihow –
                mathematics and Conversions assistance -{" "}
                <a href="https://www.wikihow.com/Convert-Units" rel="nofollow">
                  How to Convert Units
                </a>{" "}
                – Co-authored by way of individuals
              </div>
            </div>
          </div>
          <div className="w-full col-span-12 md:col-span-4 lg:col-span-3 ">
            <style
              dangerouslySetInnerHTML={{
                __html:
                  "\n    .font-s-14{\n        font-size: 14px\n    }\n    .font-s-14:hover{\n        text-decoration: underline;\n    }\n\n    .unit-select {\n        height: auto;\n        padding: 5px;\n        border-radius: 0;\n        border: none;\n    }\n\n",
              }}
            />
            <ConverterSearch />
            <ConverterList />
          </div>
        </div>
      </div>
    </>
  );
};

export default UnitConvertor;

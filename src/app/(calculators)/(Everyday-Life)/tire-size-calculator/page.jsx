"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import {
  useGetSingleCalculatorDetailsMutation,
  useMidpointCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const TireSizeCalculator = () => {
  // data get

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
  // data get

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook   // data get
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useMidpointCalculatorMutation();
  // data get

  const [currentTire, setCurrentTire] = useState({
    width: "",
    aspectRatio: "",
    rimDiameter: "",
  });

  const [newTire, setNewTire] = useState({
    width: "",
    aspectRatio: "",
    rimDiameter: "",
  });

  const [results, setResults] = useState(null);
  const [unit, setUnit] = useState("metric"); // metric or imperial

  const calculateTireSpecs = (width, aspectRatio, rimDiameter) => {
    const sidewallHeight = (width * aspectRatio) / 100;
    const totalDiameter = 2 * sidewallHeight + rimDiameter * 25.4; // Convert rim to mm
    const circumference = Math.PI * totalDiameter;

    return {
      sidewallHeight: sidewallHeight,
      totalDiameter: totalDiameter,
      circumference: circumference,
    };
  };

  const handleCalculate = () => {
    if (
      !currentTire.width ||
      !currentTire.aspectRatio ||
      !currentTire.rimDiameter ||
      !newTire.width ||
      !newTire.aspectRatio ||
      !newTire.rimDiameter
    ) {
      alert("Please fill in all tire specifications");
      return;
    }

    const current = calculateTireSpecs(
      parseFloat(currentTire.width),
      parseFloat(currentTire.aspectRatio),
      parseFloat(currentTire.rimDiameter)
    );

    const newTireSpecs = calculateTireSpecs(
      parseFloat(newTire.width),
      parseFloat(newTire.aspectRatio),
      parseFloat(newTire.rimDiameter)
    );

    const diameterDifference =
      newTireSpecs.totalDiameter - current.totalDiameter;
    const circumferenceDifference =
      newTireSpecs.circumference - current.circumference;
    const speedometerError =
      (circumferenceDifference / current.circumference) * 100;

    setResults({
      current,
      new: newTireSpecs,
      diameterDifference,
      circumferenceDifference,
      speedometerError,
    });
  };

  const formatSize = (width, aspectRatio, rimDiameter) => {
    return `${width}/${aspectRatio}R${rimDiameter}`;
  };

  const commonTireSizes = [
    { width: 205, aspectRatio: 55, rimDiameter: 16 },
    { width: 225, aspectRatio: 60, rimDiameter: 16 },
    { width: 235, aspectRatio: 65, rimDiameter: 17 },
    { width: 245, aspectRatio: 70, rimDiameter: 17 },
    { width: 255, aspectRatio: 55, rimDiameter: 18 },
    { width: 275, aspectRatio: 60, rimDiameter: 18 },
  ];

  const handlePresetSize = (preset, target) => {
    if (target === "current") {
      setCurrentTire({
        width: preset.width.toString(),
        aspectRatio: preset.aspectRatio.toString(),
        rimDiameter: preset.rimDiameter.toString(),
      });
    } else {
      setNewTire({
        width: preset.width.toString(),
        aspectRatio: preset.aspectRatio.toString(),
        rimDiameter: preset.rimDiameter.toString(),
      });
    }
  };

  const handleReset = () => {
    // Current tire inputs reset karo
    setCurrentTire({
      width: "",
      aspectRatio: "",
      rimDiameter: "",
    });

    // New tire inputs reset karo
    setNewTire({
      width: "",
      aspectRatio: "",
      rimDiameter: "",
    });

    // Results clear karo
    setResults(null);

    // Form error clear karo
    setFormError("");

    // Agar result state bhi hai to usse bhi clear karo
    setResult(null);
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
      <div className="w-full mx-auto p-2 lg:p-8 md:p-8 input_form rounded-lg space-y-6 mb-3">
        {formError && (
          <p className="text-red-500 text-lg font-semibold w-full">
            {formError}
          </p>
        )}
        <div className=" from-slate-900 via-blue-900 to-slate-800 ">
          <div className=" mx-auto">
            <div className="grid grid-cols-12 gap-2">
              {/* Input Section */}
              <div className="space-y-6 col-span-12">
                {/* Current Tire */}
                <div className=" -sm rounded-xl  p-4 bordered ">
                  <h3 className="text-xl font-semibold text-black mb-4 flex items-center ga4">
                    Current Tire Size
                  </h3>

                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="block text-black text-sm font-medium mb-2">
                        Width (mm)
                      </label>
                      <input
                        type="number"
                        value={currentTire.width}
                        onChange={(e) =>
                          setCurrentTire({
                            ...currentTire,
                            width: e.target.value,
                          })
                        }
                        className="input"
                        placeholder="205"
                      />
                    </div>

                    <div>
                      <label className="block text-black text-sm font-medium mb-2">
                        Aspect Ratio (%)
                      </label>
                      <input
                        type="number"
                        value={currentTire.aspectRatio}
                        onChange={(e) =>
                          setCurrentTire({
                            ...currentTire,
                            aspectRatio: e.target.value,
                          })
                        }
                        className="input"
                        placeholder="55"
                      />
                    </div>

                    <div>
                      <label className="block text-black text-sm font-medium mb-2">
                        Rim Diameter (in)
                      </label>
                      <input
                        type="number"
                        value={currentTire.rimDiameter}
                        onChange={(e) =>
                          setCurrentTire({
                            ...currentTire,
                            rimDiameter: e.target.value,
                          })
                        }
                        className="input"
                        placeholder="16"
                      />
                    </div>
                  </div>

                  <div className="text-center text-black text-sm mb-3">
                    Current Size:{" "}
                    {formatSize(
                      currentTire.width || "___",
                      currentTire.aspectRatio || "__",
                      currentTire.rimDiameter || "__"
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4 ">
                    {commonTireSizes.slice(0, 3).map((preset, index) => (
                      <button
                        key={index}
                        onClick={() => handlePresetSize(preset, "current")}
                        className="px-3 py-1 text-xs  text-black bg-blue-600/50 rounded-full hover:bg-blue-600/50 transition-colors"
                      >
                        {formatSize(
                          preset.width,
                          preset.aspectRatio,
                          preset.rimDiameter
                        )}
                      </button>
                    ))}
                  </div>
                </div>
                {/* New Tire */}
                <div className=" -sm rounded-xl p-4 bordered ">
                  <h3 className="text-xl font-semibold text-black mb-4 flex items-center gap-2">
                    New Tire Size
                  </h3>

                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="block text-black text-sm font-medium mb-2">
                        Width (mm)
                      </label>
                      <input
                        type="number"
                        value={newTire.width}
                        onChange={(e) =>
                          setNewTire({ ...newTire, width: e.target.value })
                        }
                        className="input my-2"
                        placeholder="225"
                      />
                    </div>

                    <div>
                      <label className="block text-black text-sm font-medium mb-2">
                        Aspect Ratio (%)
                      </label>
                      <input
                        type="number"
                        value={newTire.aspectRatio}
                        onChange={(e) =>
                          setNewTire({
                            ...newTire,
                            aspectRatio: e.target.value,
                          })
                        }
                        className="input my-2"
                        placeholder="60"
                      />
                    </div>

                    <div>
                      <label className="block text-black text-sm font-medium mb-2">
                        Rim Diameter (in)
                      </label>
                      <input
                        type="number"
                        value={newTire.rimDiameter}
                        onChange={(e) =>
                          setNewTire({
                            ...newTire,
                            rimDiameter: e.target.value,
                          })
                        }
                        className="input my-2"
                        placeholder="17"
                      />
                    </div>
                  </div>

                  <div className="text-center text-black text-sm mb-3">
                    New Size:{" "}
                    {formatSize(
                      newTire.width || "___",
                      newTire.aspectRatio || "__",
                      newTire.rimDiameter || "__"
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {commonTireSizes.slice(3, 6).map((preset, index) => (
                      <button
                        key={index}
                        onClick={() => handlePresetSize(preset, "new")}
                        className="px-3 py-1 text-xs bg-green-600/30  rounded-full hover:bg-green-600/50 transition-colors"
                      >
                        {formatSize(
                          preset.width,
                          preset.aspectRatio,
                          preset.rimDiameter
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div className=" -sm rounded-xl p-8 bordered  text-center">
                  <h3 className="text-xl font-semibold text-black mb-2 mt-4">
                    Enter Tire Specifications
                  </h3>
                  <p className="text-black">
                    Fill in both current and new tire sizes to see the
                    comparison results.
                  </p>

                  <div className="mt-6 bg-blue-500/10 rounded-lg p-4">
                    <h4 className="text-black font-medium mb-2">
                      How to read tire size:
                    </h4>
                    <div className="text-black/80 text-sm">
                      <p className="mb-2">
                        Example:{" "}
                        <span className="font-mono bg-white/20 px-2 py-1 rounded">
                          225/60R16
                        </span>
                      </p>
                      <p>
                        • <span className="text-blue-800">225</span> = Width in
                        millimeters
                      </p>
                      <p>
                        • <span className="text-blue-800">60</span> = Aspect
                        ratio (sidewall height as % of width)
                      </p>
                      <p>
                        • <span className="text-blue-800">R16</span> = Rim
                        diameter in inches
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mb-6 mt-10 text-center space-x-2">
                  <Button type="submit" onClick={handleCalculate}>
                    {data?.payload?.tech_lang_keys["calculate"]}
                  </Button>

                  {/* Reset button sirf tab show karo jab results available hon */}
                  {results && (
                    <ResetButton type="button" onClick={handleReset}>
                      {data?.payload?.tech_lang_keys["locale"] === "en"
                        ? "RESET"
                        : data?.payload?.tech_lang_keys["reset"] || "RESET"}
                    </ResetButton>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {results ? (
        <>
          <div className="w-full result mx-auto p-4 lg:p-8 md:p-8 bg-white rounded-lg shadow-md space-y-6 result">
            <div>
              <ResultActions lang={data?.payload?.tech_lang_keys} />
              {/* Overall Comparison */}
              <div className=" -sm rounded-xl mt-4">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-500/20 rounded-lg p-4">
                      <h4 className="text-black font-medium mb-2">
                        Current Tire
                      </h4>
                      <div className="text-black text-sm space-y-1">
                        <div>
                          Diameter:{" "}
                          {(results.current.totalDiameter / 25.4).toFixed(2)}"
                        </div>
                        <div>
                          Circumference:{" "}
                          {(results.current.circumference / 25.4).toFixed(1)}"
                        </div>
                      </div>
                    </div>

                    <div className="bg-green-500/20 rounded-lg p-4">
                      <h4 className=" font-medium mb-2">New Tire</h4>
                      <div className="text-black text-sm space-y-1">
                        <div>
                          Diameter:{" "}
                          {(results.new.totalDiameter / 25.4).toFixed(2)}"
                        </div>
                        <div>
                          Circumference:{" "}
                          {(results.new.circumference / 25.4).toFixed(1)}"
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-lg p-4 mb-3">
                    <h4 className=" font-medium mb-2">Differences</h4>
                    <div className="text-black text-sm space-y-1">
                      <div className="flex justify-between">
                        <span>Diameter Change:</span>
                        <span
                          className={
                            results.diameterDifference > 0
                              ? "text-green-400"
                              : "text-red-400"
                          }
                        >
                          {results.diameterDifference > 0 ? "+" : ""}
                          {(results.diameterDifference / 25.4).toFixed(2)}"
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Speedometer Error:</span>
                        <span
                          className={
                            Math.abs(results.speedometerError) > 3
                              ? "text-red-400"
                              : "text-yellow-400"
                          }
                        >
                          {results.speedometerError > 0 ? "+" : ""}
                          {results.speedometerError.toFixed(2)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Detailed Specs */}
              <div className=" -sm rounded-xl bg-gray-100 p-2">
                <h3 className="text-xl font-semibold text-black mb-4">
                  Detailed Specifications
                </h3>

                <div className="overflow-x-auto p-2">
                  <table className="w-full text-sm text-black">
                    <thead>
                      <tr className="border-b ">
                        <th className="text-left py-2">Specification</th>
                        <th className="text-right py-2 text-black">Current</th>
                        <th className="text-right py-2 ">New</th>
                        <th className="text-right py-2 ">Difference</th>
                      </tr>
                    </thead>
                    <tbody className="space-y-2">
                      <tr className="border-b border-white/10">
                        <td className="py-2">Sidewall Height</td>
                        <td className="text-right text-black">
                          {(results.current.sidewallHeight / 25.4).toFixed(2)}"
                        </td>
                        <td className="text-right ">
                          {(results.new.sidewallHeight / 25.4).toFixed(2)}"
                        </td>
                        <td className="text-right ">
                          {(
                            (results.new.sidewallHeight -
                              results.current.sidewallHeight) /
                            25.4
                          ).toFixed(2)}
                          "
                        </td>
                      </tr>
                      <tr className="border-b border-white/10">
                        <td className="py-2">Total Diameter</td>
                        <td className="text-right text-black">
                          {(results.current.totalDiameter / 25.4).toFixed(2)}"
                        </td>
                        <td className="text-right ">
                          {(results.new.totalDiameter / 25.4).toFixed(2)}"
                        </td>
                        <td className="text-right ">
                          {(results.diameterDifference / 25.4).toFixed(2)}"
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2">Circumference</td>
                        <td className="text-right text-black">
                          {(results.current.circumference / 25.4).toFixed(1)}"
                        </td>
                        <td className="text-right ">
                          {(results.new.circumference / 25.4).toFixed(1)}"
                        </td>
                        <td className="text-right ">
                          {(results.circumferenceDifference / 25.4).toFixed(1)}"
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Advisory */}
              <div className=" bordered  rounded-xl mt-3 md:m-2">
                <div className="flex items-start gap-3 p-2">
                  <div className="">
                    <h4 className="font-medium mb-2">Advisory</h4>
                    <div className="text-sm space-y-1">
                      {Math.abs(results.speedometerError) > 3 && (
                        <p>
                          ⚠️ Speedometer error exceeds 3%. This may affect
                          accuracy and could be illegal in some areas.
                        </p>
                      )}
                      {Math.abs(results.diameterDifference / 25.4) > 1 && (
                        <p>
                          ⚠️ Large diameter difference may affect vehicle
                          handling and clearance.
                        </p>
                      )}
                      {Math.abs(results.speedometerError) <= 3 &&
                        Math.abs(results.diameterDifference / 25.4) <= 1 && (
                          <p>
                            ✅ Tire size change is within acceptable limits.
                          </p>
                        )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <></>
      )}

      <CalculatorFeedback calName={data?.payload?.tech_calculator_title} />
    </Calculator>
  );
};

export default TireSizeCalculator;

"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

import {
  useGetSingleCalculatorDetailsMutation,
  useMidpointCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

const MoleRatioCalculator = () => {
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
  const [getSingleCalculatorDetails, { data, isLoading }] =
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

  const [formError, setFormError] = useState("");

  // RTK mutation hook   // data get
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useMidpointCalculatorMutation();
  // data get

  const [formData, setFormData] = useState({
    moles_a: "10",
    moles_b: "12",
  });

  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [isCalculating, setIsCalculating] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const calculateMoleRatio = () => {
    const { moles_a, moles_b } = formData;

    if (!moles_a || !moles_b) {
      setError("Please enter both mole values");
      return;
    }

    const molA = parseFloat(moles_a);
    const molB = parseFloat(moles_b);

    if (molA <= 0 || molB <= 0) {
      setError("Mole values must be positive numbers");
      return;
    }

    setIsCalculating(true);

    // Simulate calculation delay for better UX
    setTimeout(() => {
      // Find the simplest whole number ratio
      const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));

      // Convert to integers by multiplying by 1000 to handle decimals
      const molA_scaled = Math.round(molA * 1000);
      const molB_scaled = Math.round(molB * 1000);

      const commonDivisor = gcd(molA_scaled, molB_scaled);

      const ratioA = molA_scaled / commonDivisor;
      const ratioB = molB_scaled / commonDivisor;

      // If the numbers are still too large, simplify further
      const simplifyRatio = (a, b) => {
        const divisor = gcd(a, b);
        return [a / divisor, b / divisor];
      };

      const [simpleA, simpleB] = simplifyRatio(ratioA, ratioB);

      setResult({
        originalA: molA,
        originalB: molB,
        ratioA: Math.round(simpleA * 100) / 100,
        ratioB: Math.round(simpleB * 100) / 100,
        decimalRatio: (molA / molB).toFixed(4),
        percentageA: ((molA / (molA + molB)) * 100).toFixed(2),
        percentageB: ((molB / (molA + molB)) * 100).toFixed(2),
      });

      setIsCalculating(false);
    }, 800);
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Add this line to prevent form submission
    calculateMoleRatio();
  };

  const handleReset = () => {
    setFormData({ moles_a: "", moles_b: "" });
    setResult(null);
    setError("");
  };

  const copyResult = () => {
    if (result) {
      const resultText = `Mole Ratio Calculation:
Substance A: ${result.originalA} moles
Substance B: ${result.originalB} moles
Simplest Ratio: ${result.ratioA} : ${result.ratioB}
Decimal Ratio: ${result.decimalRatio}
Percentage Composition: ${result.percentageA}% : ${result.percentageB}%`;

      navigator.clipboard.writeText(resultText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
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
            <div className="grid grid-cols-12 mt-3   gap-2 md:gap-4 lg:gap-4">
              <div className="col-span-12">
                <div className="space-y-6">
                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                      {error}
                    </div>
                  )}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Substance A (moles)
                      </label>
                      <input
                        type="number"
                        name="moles_a"
                        value={formData.moles_a}
                        onChange={handleInputChange}
                        step="any"
                        min="0"
                        placeholder="Enter moles of substance A"
                        className="input"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Substance B (moles)
                      </label>
                      <input
                        type="number"
                        name="moles_b"
                        value={formData.moles_b}
                        onChange={handleInputChange}
                        step="any"
                        min="0"
                        placeholder="Enter moles of substance B"
                        className="input"
                      />
                    </div>
                  </div>
                  <div className="mb-6 mt-10 text-center space-x-2">
                    <Button
                      type="submit"
                      isLoading={isCalculating}
                      onClick={handleSubmit}
                    >
                      {data?.payload?.tech_lang_keys["calculate"]}
                    </Button>
                    {result && (
                      <ResetButton type="button" onClick={handleReset}>
                        {data?.payload?.tech_lang_keys["locale"] == "en"
                          ? "RESET"
                          : data?.payload?.tech_lang_keys["reset"] || "RESET"}
                      </ResetButton>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className=" w-full mx-auto ">
            <div className="grid grid-cols-12 mt-3   gap-2 md:gap-4 lg:gap-4">
              {/* Information Section */}
              <div className="col-span-12 mt-1">
                <div className="mt-6 bg-sky bordered p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">
                    💡 Example
                  </h4>
                  <p className="text-blue-700">
                    If you have 2 moles of hydrogen (H₂) and 1 mole of oxygen
                    (O₂), the mole ratio would be 2:1, which corresponds to the
                    balanced equation: 2H₂ + O₂ → 2H₂O
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>

      {isCalculating ? (
        <div className="w-full mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg space-y-6 result">
          <div className="animate-pulse">
            <div className=" w-full h-[30px] bg-gray-300 animate-pulse rounded-[10px] mb-4"></div>
            <div className="w-[75%] h-[20px] bg-gray-300 animate-pulse rounded-[10px] mb-3"></div>
            <div className="w-[50%] h-[20px] bg-gray-300 animate-pulse rounded-[10px] mb-3"></div>
            <div className="w-[25%] h-[20px] bg-gray-300 animate-pulse rounded-[10px]"></div>
          </div>
        </div>
      ) : result ? (
        <>
          <div className="w-full mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg space-y-6 result">
            <div>
              <ResultActions lang={data?.payload?.tech_lang_keys} />
              <div className=" rounded-2xl ">
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 bordered mt-2 rounded-lg">
                    <h4 className="font-semibold text-gray-800 mb-2">
                      Simplest Whole Number Ratio
                    </h4>
                    <p className="text-2xl font-bold text-blue-600">
                      {result.ratioA} : {result.ratioB}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 ">
                    <div className="bg-gray-50 p-4 rounded-lg bordered">
                      <h5 className="font-medium text-gray-700">Substance A</h5>
                      <p className="text-lg font-semibold text-gray-900">
                        {result.originalA} moles
                      </p>
                      <p className="text-sm text-gray-600">
                        {result.percentageA}%
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg bordered">
                      <h5 className="font-medium text-gray-700">Substance B</h5>
                      <p className="text-lg font-semibold text-gray-900">
                        {result.originalB} moles
                      </p>
                      <p className="text-sm text-gray-600">
                        {result.percentageB}%
                      </p>
                    </div>
                  </div>

                  <div className="bg-yellow-50 p-4 rounded-lg bordered">
                    <h5 className="font-medium text-gray-700">
                      Decimal Ratio (A:B)
                    </h5>
                    <p className="text-lg font-semibold text-gray-900">
                      {result.decimalRatio}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <></>
      )}

      {result && (
        <CalculatorFeedback calName={data?.payload?.tech_calculator_title} />
      )}
    </Calculator>
  );
};

export default MoleRatioCalculator;

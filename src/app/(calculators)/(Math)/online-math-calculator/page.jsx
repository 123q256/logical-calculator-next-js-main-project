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

const MathCalculator = () => {
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

  const [display, setDisplay] = useState("0");
  const [previousValue, setPreviousValue] = useState(null);
  const [operation, setOperation] = useState(null);
  const [waitingForNewValue, setWaitingForNewValue] = useState(false);
  const [memory, setMemory] = useState(0);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [isScientific, setIsScientific] = useState(false);
  const [angleMode, setAngleMode] = useState("deg"); // 'deg' or 'rad'

  // Basic calculator functions
  const inputNumber = (num) => {
    if (waitingForNewValue) {
      setDisplay(String(num));
      setWaitingForNewValue(false);
    } else {
      setDisplay(display === "0" ? String(num) : display + num);
    }
  };

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook   // data get
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useMidpointCalculatorMutation();
  // data get

  const inputDecimal = () => {
    if (waitingForNewValue) {
      setDisplay("0.");
      setWaitingForNewValue(false);
    } else if (display.indexOf(".") === -1) {
      setDisplay(display + ".");
    }
  };

  const clear = () => {
    setDisplay("0");
    setPreviousValue(null);
    setOperation(null);
    setWaitingForNewValue(false);
  };

  const clearEntry = () => {
    setDisplay("0");
  };

  const performOperation = (nextOperation) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue || 0;
      const newValue = calculate(currentValue, inputValue, operation);

      setDisplay(String(newValue));
      setPreviousValue(newValue);

      // Add to history
      addToHistory(`${currentValue} ${operation} ${inputValue} = ${newValue}`);
    }

    setWaitingForNewValue(true);
    setOperation(nextOperation);
  };

  const calculate = (firstValue, secondValue, operation) => {
    switch (operation) {
      case "+":
        return firstValue + secondValue;
      case "-":
        return firstValue - secondValue;
      case "×":
        return firstValue * secondValue;
      case "÷":
        return secondValue !== 0 ? firstValue / secondValue : 0;
      case "^":
        return Math.pow(firstValue, secondValue);
      case "mod":
        return firstValue % secondValue;
      default:
        return secondValue;
    }
  };

  const performEquals = () => {
    if (operation && previousValue !== null) {
      performOperation(null);
    }
  };

  // Scientific functions
  const performScientificOperation = (func) => {
    const inputValue = parseFloat(display);
    let result;

    switch (func) {
      case "sin":
        result =
          angleMode === "deg"
            ? Math.sin((inputValue * Math.PI) / 180)
            : Math.sin(inputValue);
        break;
      case "cos":
        result =
          angleMode === "deg"
            ? Math.cos((inputValue * Math.PI) / 180)
            : Math.cos(inputValue);
        break;
      case "tan":
        result =
          angleMode === "deg"
            ? Math.tan((inputValue * Math.PI) / 180)
            : Math.tan(inputValue);
        break;
      case "asin":
        result =
          angleMode === "deg"
            ? (Math.asin(inputValue) * 180) / Math.PI
            : Math.asin(inputValue);
        break;
      case "acos":
        result =
          angleMode === "deg"
            ? (Math.acos(inputValue) * 180) / Math.PI
            : Math.acos(inputValue);
        break;
      case "atan":
        result =
          angleMode === "deg"
            ? (Math.atan(inputValue) * 180) / Math.PI
            : Math.atan(inputValue);
        break;
      case "log":
        result = Math.log10(inputValue);
        break;
      case "ln":
        result = Math.log(inputValue);
        break;
      case "sqrt":
        result = Math.sqrt(inputValue);
        break;
      case "square":
        result = inputValue * inputValue;
        break;
      case "cube":
        result = inputValue * inputValue * inputValue;
        break;
      case "factorial":
        result = factorial(inputValue);
        break;
      case "reciprocal":
        result = inputValue !== 0 ? 1 / inputValue : 0;
        break;
      case "negate":
        result = -inputValue;
        break;
      case "abs":
        result = Math.abs(inputValue);
        break;
      case "exp":
        result = Math.exp(inputValue);
        break;
      case "pi":
        result = Math.PI;
        break;
      case "e":
        result = Math.E;
        break;
      default:
        return;
    }

    if (isNaN(result) || !isFinite(result)) {
      setDisplay("Error");
    } else {
      setDisplay(String(result));
      addToHistory(`${func}(${inputValue}) = ${result}`);
    }
    setWaitingForNewValue(true);
  };

  const factorial = (n) => {
    if (n < 0 || n !== Math.floor(n)) return NaN;
    if (n === 0 || n === 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) {
      result *= i;
    }
    return result;
  };

  // Memory functions
  const memoryStore = () => {
    setMemory(parseFloat(display));
    addToHistory(`Memory stored: ${display}`);
  };

  const memoryRecall = () => {
    setDisplay(String(memory));
    setWaitingForNewValue(true);
  };

  const memoryClear = () => {
    setMemory(0);
    addToHistory("Memory cleared");
  };

  const memoryAdd = () => {
    setMemory(memory + parseFloat(display));
    addToHistory(`Memory + ${display} = ${memory + parseFloat(display)}`);
  };

  const memorySubtract = () => {
    setMemory(memory - parseFloat(display));
    addToHistory(`Memory - ${display} = ${memory - parseFloat(display)}`);
  };

  // History functions
  const addToHistory = (entry) => {
    setHistory((prev) => [entry, ...prev.slice(0, 9)]); // Keep last 10 entries
  };

  const clearHistory = () => {
    setHistory([]);
  };

  // Button component
  const CalcButton = ({ onClick, className = "", children, title = "" }) => (
    <button
      onClick={onClick}
      className={`h-12 rounded-lg font-semibold  text-lg transition-all duration-200 hover:scale-105 active:scale-95 ${className}`}
      title={title}
    >
      {children}
    </button>
  );

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
      <div className="w-full mx-auto p-2 lg:p-8 md:p-8 bg-white rounded-lg space-y-6 mb-3">
        {formError && (
          <p className="text-red-500 text-lg font-semibold w-full">
            {formError}
          </p>
        )}

        <div className=" w-full mx-auto ">
          <div className="grid grid-cols-12   gap-2 md:gap-4 lg:gap-4">
            <div className="col-span-12">
              <div className="grid grid-cols-12 gap-3">
                {/* Calculator Main */}
                <div className="col-span-12 md:col-span-8">
                  <div className="bg-gray-100 rounded-lg bordered shadow-md p-2 md:p-6">
                    {/* Display */}
                    <div className="mb-6">
                      <div className="bg-white text-black p-4 rounded-lg bordered">
                        <div className="text-right">
                          <div className="text-sm text-gray-400 h-5">
                            {operation &&
                              previousValue !== null &&
                              `${previousValue} ${operation}`}
                          </div>
                          <div className="text-3xl font-mono overflow-hidden">
                            {display}
                          </div>
                        </div>
                      </div>

                      {/* Mode toggles */}
                      <div className="flex justify-between items-center mt-2">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setIsScientific(!isScientific)}
                            className={`px-3 py-1 cursor-pointer rounded text-sm font-medium ${
                              isScientific
                                ? "bg-blue-500 text-white"
                                : "bg-gray-200 text-gray-700"
                            }`}
                          >
                            Scientific
                          </button>
                          <button
                            onClick={() =>
                              setAngleMode(angleMode === "deg" ? "rad" : "deg")
                            }
                            className="px-3 py-1 cursor-pointer rounded text-sm font-medium bg-gray-200 text-gray-700"
                          >
                            {angleMode.toUpperCase()}
                          </button>
                        </div>
                        <div className="text-sm text-gray-600">
                          Memory: {memory}
                        </div>
                      </div>
                    </div>
                    {/* Calculator Buttons */}
                    <div className="grid grid-cols-6 gap-[8px]">
                      {/* Row 1 - Memory & Clear */}
                      <CalcButton
                        onClick={memoryClear}
                        className="bg-[#99EA48] cursor-pointer text-black hover:bg-[#99EA48]"
                        title="Memory Clear"
                      >
                        MC
                      </CalcButton>
                      <CalcButton
                        onClick={memoryRecall}
                        className="bg-[#99EA48] cursor-pointer text-black hover:bg-[#99EA48]"
                        title="Memory Recall"
                      >
                        MR
                      </CalcButton>
                      <CalcButton
                        onClick={memoryAdd}
                        className="bg-[#99EA48] cursor-pointer text-black hover:bg-[#99EA48]"
                        title="Memory Add"
                      >
                        M+
                      </CalcButton>
                      <CalcButton
                        onClick={memorySubtract}
                        className="bg-[#99EA48] cursor-pointer text-black hover:bg-[#99EA48]"
                        title="Memory Subtract"
                      >
                        M-
                      </CalcButton>
                      <CalcButton
                        onClick={memoryStore}
                        className="bg-[#99EA48] cursor-pointer text-black hover:bg-[#99EA48]"
                        title="Memory Store"
                      >
                        MS
                      </CalcButton>
                      <CalcButton
                        onClick={clear}
                        className="bg-red-500 cursor-pointer text-white hover:bg-red-600"
                      >
                        C
                      </CalcButton>

                      {/* Scientific Functions Row 1 */}
                      {isScientific && (
                        <>
                          <CalcButton
                            onClick={() => performScientificOperation("sin")}
                            className="bg-[#99EA48] cursor-pointer text-black hover:bg-[#99EA48]"
                          >
                            sin
                          </CalcButton>
                          <CalcButton
                            onClick={() => performScientificOperation("cos")}
                            className="bg-[#99EA48] cursor-pointer text-black hover:bg-[#99EA48]"
                          >
                            cos
                          </CalcButton>
                          <CalcButton
                            onClick={() => performScientificOperation("tan")}
                            className="bg-[#99EA48] cursor-pointer text-black hover:bg-[#99EA48]"
                          >
                            tan
                          </CalcButton>
                          <CalcButton
                            onClick={() => performScientificOperation("log")}
                            className="bg-[#99EA48] cursor-pointer text-black hover:bg-[#99EA48]"
                          >
                            log
                          </CalcButton>
                          <CalcButton
                            onClick={() => performScientificOperation("ln")}
                            className="bg-[#99EA48] cursor-pointer text-black hover:bg-[#99EA48]"
                          >
                            ln
                          </CalcButton>
                          <CalcButton
                            onClick={() => performOperation("^")}
                            className="bg-blue-500 cursor-pointer text-white hover:bg-blue-600"
                          >
                            x^y
                          </CalcButton>

                          {/* Scientific Functions Row 2 */}
                          <CalcButton
                            onClick={() => performScientificOperation("asin")}
                            className="bg-[#99EA48] cursor-pointer text-black hover:bg-[#99EA48]"
                          >
                            sin⁻¹
                          </CalcButton>
                          <CalcButton
                            onClick={() => performScientificOperation("acos")}
                            className="bg-[#99EA48] cursor-pointer text-black hover:bg-[#99EA48]"
                          >
                            cos⁻¹
                          </CalcButton>
                          <CalcButton
                            onClick={() => performScientificOperation("atan")}
                            className="bg-[#99EA48] cursor-pointer text-black hover:bg-[#99EA48]"
                          >
                            tan⁻¹
                          </CalcButton>
                          <CalcButton
                            onClick={() => performScientificOperation("sqrt")}
                            className="bg-[#99EA48] cursor-pointer text-black hover:bg-[#99EA48]"
                          >
                            √x
                          </CalcButton>
                          <CalcButton
                            onClick={() => performScientificOperation("square")}
                            className="bg-[#99EA48] cursor-pointer text-black hover:bg-[#99EA48]"
                          >
                            x²
                          </CalcButton>
                          <CalcButton
                            onClick={() => performScientificOperation("cube")}
                            className="bg-[#99EA48] cursor-pointer text-black hover:bg-[#99EA48]"
                          >
                            x³
                          </CalcButton>

                          {/* Scientific Functions Row 3 */}
                          <CalcButton
                            onClick={() =>
                              performScientificOperation("factorial")
                            }
                            className="bg-[#99EA48] cursor-pointer text-black hover:bg-[#99EA48]"
                          >
                            x!
                          </CalcButton>
                          <CalcButton
                            onClick={() => performScientificOperation("exp")}
                            className="bg-[#99EA48] cursor-pointer text-black hover:bg-[#99EA48]"
                          >
                            eˣ
                          </CalcButton>
                          <CalcButton
                            onClick={() =>
                              performScientificOperation("reciprocal")
                            }
                            className="bg-[#99EA48] cursor-pointer text-black hover:bg-[#99EA48]"
                          >
                            1/x
                          </CalcButton>
                          <CalcButton
                            onClick={() => performScientificOperation("abs")}
                            className="bg-[#99EA48] cursor-pointer text-black hover:bg-[#99EA48]"
                          >
                            |x|
                          </CalcButton>
                          <CalcButton
                            onClick={() => performScientificOperation("pi")}
                            className="bg-[#99EA48] cursor-pointer text-black hover:bg-[#99EA48]"
                          >
                            π
                          </CalcButton>
                          <CalcButton
                            onClick={() => performScientificOperation("e")}
                            className="bg-[#99EA48] cursor-pointer text-black hover:bg-[#99EA48]"
                          >
                            e
                          </CalcButton>
                        </>
                      )}

                      {/* Basic Calculator Buttons */}
                      <CalcButton
                        onClick={clearEntry}
                        className="bg-gray-500 cursor-pointer text-white hover:bg-gray-600"
                      >
                        CE
                      </CalcButton>
                      <CalcButton
                        onClick={() => performOperation("mod")}
                        className="bg-blue-500 cursor-pointer text-white hover:bg-blue-600"
                      >
                        mod
                      </CalcButton>
                      <CalcButton
                        onClick={() => performScientificOperation("negate")}
                        className="bg-gray-500 cursor-pointer text-white hover:bg-gray-600"
                      >
                        ±
                      </CalcButton>
                      <CalcButton
                        onClick={() => performOperation("÷")}
                        className="bg-blue-500 cursor-pointer text-white hover:bg-blue-600"
                      >
                        ÷
                      </CalcButton>
                      <CalcButton
                        onClick={() => performScientificOperation("sqrt")}
                        className="bg-[#99EA48] cursor-pointer text-black hover:bg-[#99EA48]"
                      >
                        √
                      </CalcButton>
                      <CalcButton
                        onClick={() => setDisplay(display.slice(0, -1) || "0")}
                        className="bg-gray-500 cursor-pointer text-white hover:bg-gray-600"
                      >
                        ⌫
                      </CalcButton>

                      {/* Numbers and Operations */}
                      <CalcButton
                        onClick={() => inputNumber(7)}
                        className="bg-gray-200 cursor-pointer hover:bg-gray-300"
                      >
                        7
                      </CalcButton>
                      <CalcButton
                        onClick={() => inputNumber(8)}
                        className="bg-gray-200 cursor-pointer hover:bg-gray-300"
                      >
                        8
                      </CalcButton>
                      <CalcButton
                        onClick={() => inputNumber(9)}
                        className="bg-gray-200 cursor-pointer hover:bg-gray-300"
                      >
                        9
                      </CalcButton>
                      <CalcButton
                        onClick={() => performOperation("×")}
                        className="bg-blue-500 cursor-pointer text-white hover:bg-blue-600"
                      >
                        ×
                      </CalcButton>
                      <CalcButton
                        onClick={() => performScientificOperation("square")}
                        className="bg-[#99EA48] cursor-pointer text-black hover:bg-[#99EA48]"
                      >
                        x²
                      </CalcButton>
                      <CalcButton
                        onClick={() => performOperation("^")}
                        className="bg-blue-500 cursor-pointer text-white hover:bg-blue-600"
                      >
                        xʸ
                      </CalcButton>

                      <CalcButton
                        onClick={() => inputNumber(4)}
                        className="bg-gray-200 cursor-pointer hover:bg-gray-300"
                      >
                        4
                      </CalcButton>
                      <CalcButton
                        onClick={() => inputNumber(5)}
                        className="bg-gray-200 cursor-pointer hover:bg-gray-300"
                      >
                        5
                      </CalcButton>
                      <CalcButton
                        onClick={() => inputNumber(6)}
                        className="bg-gray-200 cursor-pointer hover:bg-gray-300"
                      >
                        6
                      </CalcButton>
                      <CalcButton
                        onClick={() => performOperation("-")}
                        className="bg-blue-500 cursor-pointer text-white hover:bg-blue-600"
                      >
                        -
                      </CalcButton>
                      <CalcButton
                        onClick={() => performScientificOperation("sin")}
                        className="bg-[#99EA48] cursor-pointer text-black hover:bg-[#99EA48]"
                      >
                        sin
                      </CalcButton>
                      <CalcButton
                        onClick={() => performScientificOperation("cos")}
                        className="bg-[#99EA48] cursor-pointer text-black hover:bg-[#99EA48]"
                      >
                        cos
                      </CalcButton>

                      <CalcButton
                        onClick={() => inputNumber(1)}
                        className="bg-gray-200 cursor-pointer hover:bg-gray-300"
                      >
                        1
                      </CalcButton>
                      <CalcButton
                        onClick={() => inputNumber(2)}
                        className="bg-gray-200 cursor-pointer hover:bg-gray-300"
                      >
                        2
                      </CalcButton>
                      <CalcButton
                        onClick={() => inputNumber(3)}
                        className="bg-gray-200 cursor-pointer hover:bg-gray-300"
                      >
                        3
                      </CalcButton>
                      <CalcButton
                        onClick={() => performOperation("+")}
                        className="bg-blue-500 cursor-pointer text-white hover:bg-blue-600"
                      >
                        +
                      </CalcButton>
                      <CalcButton
                        onClick={() => performScientificOperation("tan")}
                        className="bg-[#99EA48] cursor-pointer text-black hover:bg-[#99EA48]"
                      >
                        tan
                      </CalcButton>
                      <CalcButton
                        onClick={() => performScientificOperation("log")}
                        className="bg-[#99EA48] cursor-pointer text-black hover:bg-[#99EA48]"
                      >
                        log
                      </CalcButton>

                      <CalcButton
                        onClick={() => inputNumber(0)}
                        className="bg-gray-200 cursor-pointer hover:bg-gray-300 col-span-2"
                      >
                        0
                      </CalcButton>
                      <CalcButton
                        onClick={inputDecimal}
                        className="bg-gray-200 cursor-pointer hover:bg-gray-300"
                      >
                        .
                      </CalcButton>
                      <CalcButton
                        onClick={performEquals}
                        className="bg-green-500 cursor-pointer text-white hover:bg-green-600"
                      >
                        =
                      </CalcButton>
                      <CalcButton
                        onClick={() => performScientificOperation("ln")}
                        className="bg-[#99EA48] cursor-pointer text-black hover:bg-[#99EA48]"
                      >
                        ln
                      </CalcButton>
                      <CalcButton
                        onClick={() => performScientificOperation("factorial")}
                        className="bg-[#99EA48] cursor-pointer text-black hover:bg-[#99EA48]"
                      >
                        x!
                      </CalcButton>
                    </div>
                    {/* Constants and Special Functions */}
                    <div className="mt-4">
                      <h4 className="text-lg font-semibold mb-2 text-gray-800">
                        Constants & Special Functions
                      </h4>
                      <div className="grid grid-cols-6 gap-2">
                        <CalcButton
                          onClick={() => performScientificOperation("pi")}
                          className="bg-indigo-500 cursor-pointer text-white hover:bg-indigo-600"
                        >
                          π
                        </CalcButton>
                        <CalcButton
                          onClick={() => performScientificOperation("e")}
                          className="bg-indigo-500 cursor-pointer text-white hover:bg-indigo-600"
                        >
                          e
                        </CalcButton>
                        <CalcButton
                          onClick={() => performScientificOperation("abs")}
                          className="bg-indigo-500 cursor-pointer text-white hover:bg-indigo-600"
                        >
                          |x|
                        </CalcButton>
                        <CalcButton
                          onClick={() =>
                            performScientificOperation("reciprocal")
                          }
                          className="bg-indigo-500 cursor-pointer text-white hover:bg-indigo-600"
                        >
                          1/x
                        </CalcButton>
                        <CalcButton
                          onClick={() => performScientificOperation("exp")}
                          className="bg-indigo-500 cursor-pointer text-white hover:bg-indigo-600"
                        >
                          eˣ
                        </CalcButton>
                        <CalcButton
                          onClick={() => performScientificOperation("cube")}
                          className="bg-indigo-500 cursor-pointer text-white hover:bg-indigo-600"
                        >
                          x³
                        </CalcButton>
                      </div>
                    </div>
                  </div>
                </div>
                {/* History Panel */}
                <div className="col-span-12 md:col-span-4">
                  <div className="bg-white rounded-lg shadow-md bordered p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-semibold text-gray-800">
                        History
                      </h3>
                      <button
                        onClick={() => setShowHistory(!showHistory)}
                        className="text-blue-500 cursor-pointer hover:text-blue-600"
                      >
                        {showHistory ? "Hide" : "Show"}
                      </button>
                    </div>

                    {showHistory && (
                      <div className="space-y-2">
                        {history.length === 0 ? (
                          <p className="text-gray-500 text-sm">
                            No calculations yet
                          </p>
                        ) : (
                          <>
                            <div className="max-h-64 overflow-y-auto space-y-1">
                              {history.map((entry, index) => (
                                <div
                                  key={index}
                                  className="p-2 bg-gray-50 rounded text-xs"
                                >
                                  {entry}
                                </div>
                              ))}
                            </div>
                            <button
                              onClick={clearHistory}
                              className="w-full py-2 px-4 bg-red-500 text-white rounded-md hover:bg-red-600 text-sm"
                            >
                              Clear History
                            </button>
                          </>
                        )}
                      </div>
                    )}

                    {/* Memory Display */}
                    <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-semibold text-gray-800 mb-2">
                        Memory
                      </h4>
                      <div className="text-lg font-mono text-blue-800">
                        {memory}
                      </div>
                    </div>

                    {/* Quick Reference */}
                    <div className="mt-6">
                      <h4 className="text-lg font-semibold mb-2 text-gray-800">
                        Quick Reference
                      </h4>
                      <div className="space-y-2 text-sm text-gray-600">
                        <div>
                          <strong>Memory:</strong> MC, MR, M+, M-, MS
                        </div>
                        <div>
                          <strong>Trig:</strong> sin, cos, tan (+ inverse)
                        </div>
                        <div>
                          <strong>Log:</strong> log (base 10), ln (natural)
                        </div>
                        <div>
                          <strong>Power:</strong> x², x³, xʸ, √x
                        </div>
                        <div>
                          <strong>Special:</strong> |x|, 1/x, x!, eˣ
                        </div>
                        <div>
                          <strong>Mode:</strong> {angleMode.toUpperCase()}{" "}
                          (degrees/radians)
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Features Info */}
              <div className="bg-white  rounded-lg  p-2 mt-6">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">
                  Calculator Features
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">
                      Basic Operations
                    </h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Addition, Subtraction</li>
                      <li>• Multiplication, Division</li>
                      <li>• Exponentiation (x^y)</li>
                      <li>• Modulo operations</li>
                      <li>• Decimal calculations</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">
                      Scientific Functions
                    </h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Trigonometric functions</li>
                      <li>• Logarithmic functions</li>
                      <li>• Power and root functions</li>
                      <li>• Factorial calculations</li>
                      <li>• Constants (π, e)</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">
                      Advanced Features
                    </h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Memory operations</li>
                      <li>• Calculation history</li>
                      <li>• Degree/Radian modes</li>
                      <li>• Scientific mode toggle</li>
                      <li>• Error handling</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <CalculatorFeedback calName={data?.payload?.tech_calculator_title} />
    </Calculator>
  );
};

export default MathCalculator;

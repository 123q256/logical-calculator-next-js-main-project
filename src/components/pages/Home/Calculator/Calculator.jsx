"use client";

import React, { useState, useEffect } from "react";
import { evaluate } from "mathjs";

const Calculator = () => {
  const [calculatorType, setCalculatorType] = useState("scientific");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [memory, setMemory] = useState(0);
  const [degreeRad, setDegreeRad] = useState("degree");

  const toggleCalculator = () => {
    setCalculatorType(
      calculatorType === "scientific" ? "simple" : "scientific"
    );
  };

  const setDegorRad = (type) => {
    setDegreeRad(type);
  };

  // Fix: Add proper factorial function
  const factorial = (n) => {
    if (n < 0) return NaN;
    if (n === 0 || n === 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) {
      result *= i;
    }
    return result;
  };

  const calculator = (value) => {
    if (value === "C") {
      setInput("");
      setOutput("");
      return;
    }

    if (value === "bk") {
      setInput(input.slice(0, -1));
      return;
    }

    if (value === "=") {
      try {
        let expression = input;

        // Fix: Handle empty input
        if (!expression.trim()) {
          setOutput("0");
          return;
        }

        // Fix: Replace operators first
        expression = expression
          .replace(/×/g, "*")
          .replace(/÷/g, "/")
          .replace(/±/g, "-");

        // Fix: Handle constants & functions with proper order
        expression = expression
          .replace(/π/g, "pi")
          .replace(/e\^/g, "exp(")
          .replace(/10\^/g, "10^")
          .replace(/\^/g, "^")
          .replace(/Math\.cbrt\(/g, "cbrt(")
          .replace(/sqrt\(/g, "sqrt(")
          .replace(/ln\(/g, "log(")
          .replace(/log\(/g, "log10(");

        // Fix: Handle trigonometric functions with proper parentheses
        if (degreeRad === "degree") {
          expression = expression
            .replace(/sin\(/g, "sin(")
            .replace(/cos\(/g, "cos(")
            .replace(/tan\(/g, "tan(")
            .replace(/asin\(/g, "asin(")
            .replace(/acos\(/g, "acos(")
            .replace(/atan\(/g, "atan(");
        } else {
          expression = expression
            .replace(/sin\(/g, "sin(")
            .replace(/cos\(/g, "cos(")
            .replace(/tan\(/g, "tan(")
            .replace(/asin\(/g, "asin(")
            .replace(/acos\(/g, "acos(")
            .replace(/atan\(/g, "atan(");
        }

        // Fix: Handle factorial with regex
        expression = expression.replace(/(\d+(?:\.\d+)?)!/g, (match, num) => {
          const n = parseFloat(num);
          if (n % 1 !== 0) return "NaN";
          return factorial(n).toString();
        });

        // Fix: Handle percentage
        expression = expression.replace(/(\d+(?:\.\d+)?)%/g, "($1/100)");

        // Fix: Handle power operations
        expression = expression.replace(/\^2/g, "^2");
        expression = expression.replace(/\^3/g, "^3");
        expression = expression.replace(/\^y/g, "^");

        // Fix: Handle ans replacement
        if (output && output !== "Error") {
          expression = expression.replace(/ans/g, output);
        }

        console.log("Evaluating:", expression);

        // Use mathjs evaluate with scope for degree conversion
        const scope = {};
        if (degreeRad === "degree") {
          // Convert degrees to radians for trigonometric functions
          scope.sin = (x) => Math.sin((x * Math.PI) / 180);
          scope.cos = (x) => Math.cos((x * Math.PI) / 180);
          scope.tan = (x) => Math.tan((x * Math.PI) / 180);
          scope.asin = (x) => (Math.asin(x) * 180) / Math.PI;
          scope.acos = (x) => (Math.acos(x) * 180) / Math.PI;
          scope.atan = (x) => (Math.atan(x) * 180) / Math.PI;
        } else {
          scope.sin = Math.sin;
          scope.cos = Math.cos;
          scope.tan = Math.tan;
          scope.asin = Math.asin;
          scope.acos = Math.acos;
          scope.atan = Math.atan;
        }

        // Add other math functions to scope
        scope.sqrt = Math.sqrt;
        scope.cbrt = Math.cbrt;
        scope.log = Math.log;
        scope.log10 = Math.log10;
        scope.exp = Math.exp;
        scope.pi = Math.PI;

        const result = evaluate(expression, scope);
        
        // Fix: Better result formatting
        if (isNaN(result) || !isFinite(result)) {
          setOutput("Error");
        } else {
          // Format the result to avoid long decimals
          const formattedResult = parseFloat(result.toFixed(10));
          setOutput(formattedResult.toString());
        }
      } catch (error) {
        console.error("Calculation error:", error);
        setOutput("Error");
      }
      return;
    }

    // Fix: Memory functions implementation
    if (value === "M+") {
      const currentValue = output ? parseFloat(output) : 0;
      if (!isNaN(currentValue)) {
        setMemory(memory + currentValue);
      }
      return;
    }

    if (value === "M-") {
      const currentValue = output ? parseFloat(output) : 0;
      if (!isNaN(currentValue)) {
        setMemory(memory - currentValue);
      }
      return;
    }

    if (value === "MR") {
      setInput(input + memory.toString());
      return;
    }

    if (value === "ans") {
      if (output && output !== "Error") {
        setInput(input + output);
      }
      return;
    }

    if (value === "+/-") {
      if (input) {
        setInput(input.startsWith("-") ? input.slice(1) : "-" + input);
      } else if (output && output !== "Error") {
        setOutput(output.startsWith("-") ? output.slice(1) : "-" + output);
      }
      return;
    }

    if (value === "RND") {
      setInput(input + Math.random().toFixed(6));
      return;
    }

    if (value === "EXP") {
      setInput(input + "e");
      return;
    }

    // Fix: Handle number inputs properly (they were coming as numbers, not strings)
    if (typeof value === "number") {
      setInput(input + value.toString());
      return;
    }

    setInput(input + value);
  };

  // Fix: Update display elements
  useEffect(() => {
    const showInput = document.getElementById("showInput");
    const showOutput = document.getElementById("showOutput");
    
    if (showInput) {
      showInput.innerHTML = input || "&nbsp;";
    }
    
    if (showOutput) {
      showOutput.innerHTML = output || "&nbsp;";
    }
  }, [input, output]);

  return (
    <div className="max-w-[830px] mx-auto lg:py-5 md:py-5 lg:mt-auto md:mt-auto mt-6 relative px-5">
      <div className="bordercalculator xl:p-4 lg:p-4 p-3 bg-white xl:rounded-[25px] lg:rounded-[20px] rounded-[16px] w-full">
        <div className="flex lg:flex-row flex-col gap-x-5 lg:gap-y-[22px] md:gap-y-[22px] w-full">
          <div className="lg:w-[50%] w-full">
            <p className="text-[16px] leading-[20.85px] font-[700] px-3">
              Input
            </p>
            <div
              id="showInput"
              className="bg-[#FAFAFA] min-h-[40px] max-h-[100px] border border-[#E3E3E3] rounded-[12px] px-3 pt-2 my-3 overflow-auto"
            >
              &nbsp;
            </div>
          </div>
          <div className="lg:w-[50%] w-full">
            <p className="text-[16px] leading-[20.85px] font-[700] px-3">
              Answer
            </p>
            <div className="bg-[#FAFAFA] flex items-center justify-end min-h-[40px] max-h-[100px] border border-[#E3E3E3] rounded-[12px] px-3 pt-2 my-3 overflow-auto">
              <p
                id="showOutput"
                className={`text-right text-[28px] leading-[36.46px] font-[500] ${
                  output === "Error" ? "text-red-500" : "text-[#818181]"
                }`}
              >
                &nbsp;
              </p>
            </div>
          </div>
          <div className="w-full text-center lg:hidden md:hidden block">
            {calculatorType === "scientific" ? (
              <button
                onClick={toggleCalculator}
                className="bg-[#2845F5] w-full mb-3 mt-1 lg:hidden text-[#fff] hover:bg-[#1A1A1A] hover:text-white duration-200 font-[600] text-[14px] rounded-[25px] px-4 py-3"
              >
                Simple Calculator
              </button>
            ) : (
              <button
                onClick={toggleCalculator}
                className="bg-[#2845F5] w-full mb-3 mt-1 lg:hidden text-[#fff] hover:bg-[#1A1A1A] hover:text-white duration-200 font-[600] text-[14px] rounded-[25px] px-4 py-3"
              >
                Scientific Calculator
              </button>
            )}
          </div>
        </div>

        {/* Memory Display */}
        <div className="mb-3 px-3">
          <p className="text-sm text-gray-600">
            Memory: {memory}
          </p>
        </div>

        <div className="grid lg:grid-cols-10 gap-x-2 gap-y-2">
          <div
            className={`col-span-5 ${
              calculatorType === "simple" ? "block" : "lg:block md:block hidden"
            }`}
          >
            <div className="grid grid-cols-5 gap-x-2 gap-y-2">
              {/* Scientific buttons remain the same but with fixed handlers */}
              <div
                onClick={() => calculator("sin(")}
                className="bg-[#F4F4F4] cursor-pointer hover:bg-black duration text-black hover:text-white rounded-[7px] flex justify-center items-center lg:w-[55px] w-auto md:h-[43px] h-[37px]"
              >
                <p className="text-[18px] font-[500]">sin</p>
              </div>
              <div
                onClick={() => calculator("cos(")}
                className="bg-[#F4F4F4] cursor-pointer hover:bg-black duration text-black hover:text-white rounded-[7px] flex justify-center items-center lg:w-[55px] w-auto md:h-[43px] h-[37px]"
              >
                <p className="text-[18px] font-[500]">cos</p>
              </div>
              <div
                onClick={() => calculator("tan(")}
                className="bg-[#F4F4F4] cursor-pointer hover:bg-black duration text-black hover:text-white rounded-[7px] flex justify-center items-center lg:w-[55px] w-auto md:h-[43px] h-[37px]"
              >
                <p className="text-[18px] font-[500]">tan</p>
              </div>
              <div className="bg-[#F4F4F4] cursor-pointer hover:bg-black duration text-black hover:text-white rounded-[7px] flex justify-center items-center lg:w-[55px] w-auto md:h-[43px] h-[37px]">
                <label htmlFor="scirdsettingd" className="cursor-pointer">
                  <p className="flex items-center gap-x-1 text-[12px] font-[500] hover:text-white">
                    <input
                      id="scirdsettingd"
                      className="with-gap"
                      type="radio"
                      name="scirdsetting"
                      onChange={() => setDegorRad("degree")}
                      checked={degreeRad === "degree"}
                    />
                    Deg
                  </p>
                </label>
              </div>
              <div className="bg-[#F4F4F4] cursor-pointer hover:bg-black duration text-black hover:text-white rounded-[7px] flex justify-center items-center lg:w-[55px] w-auto md:h-[43px] h-[37px]">
                <label htmlFor="scirdsettingr" className="cursor-pointer">
                  <p className="flex items-center gap-x-1 text-[12px] font-[500] hover:text-white">
                    <input
                      id="scirdsettingr"
                      className="with-gap"
                      type="radio"
                      name="scirdsetting"
                      onChange={() => setDegorRad("radians")}
                      checked={degreeRad === "radians"}
                    />
                    Rad
                  </p>
                </label>
              </div>

              {/* Rest of scientific buttons... */}
              <div
                onClick={() => calculator("asin(")}
                className="bg-[#F4F4F4] hover:bg-black duration text-black hover:text-white rounded-[7px] flex justify-center items-center lg:w-[55px] w-auto md:h-[43px] h-[37px]"
              >
                <p className="text-[16px] font-[500] cursor-pointer">
                  sin⁻¹
                </p>
              </div>
              <div
                onClick={() => calculator("acos(")}
                className="bg-[#F4F4F4] hover:bg-black duration text-black hover:text-white rounded-[7px] flex justify-center items-center lg:w-[55px] w-auto md:h-[43px] h-[37px]"
              >
                <p className="text-[16px] font-[500] cursor-pointer">
                  cos⁻¹
                </p>
              </div>
              <div
                onClick={() => calculator("atan(")}
                className="bg-[#F4F4F4] hover:bg-black duration text-black hover:text-white rounded-[7px] flex justify-center items-center lg:w-[55px] w-auto md:h-[43px] h-[37px]"
              >
                <p className="text-[16px] font-[500] cursor-pointer">
                  tan⁻¹
                </p>
              </div>
              <div
                onClick={() => calculator("π")}
                className="bg-[#F4F4F4] cursor-pointer hover:bg-black duration text-black hover:text-white rounded-[7px] flex justify-center items-center lg:w-[55px] w-auto md:h-[43px] h-[37px]"
              >
                <p className="text-[18px] font-[500]">π</p>
              </div>
              <div
                onClick={() => calculator("e")}
                className="bg-[#F4F4F4] cursor-pointer hover:bg-black duration text-black hover:text-white rounded-[7px] flex justify-center items-center lg:w-[55px] w-auto md:h-[43px] h-[37px]"
              >
                <p className="text-[18px] font-[500]">e</p>
              </div>

              <div
                onClick={() => calculator("^")}
                className="bg-[#F4F4F4] cursor-pointer hover:bg-black duration text-black hover:text-white rounded-[7px] flex justify-center items-center lg:w-[55px] w-auto md:h-[43px] h-[37px]"
              >
                <p className="text-[16px] font-[500]">xʸ</p>
              </div>
              <div
                onClick={() => calculator("^2")}
                className="bg-[#F4F4F4] cursor-pointer hover:bg-black duration text-black hover:text-white rounded-[7px] flex justify-center items-center lg:w-[55px] w-auto md:h-[43px] h-[37px]"
              >
                <p className="text-[16px] font-[500]">x²</p>
              </div>
              <div
                onClick={() => calculator("^3")}
                className="bg-[#F4F4F4] cursor-pointer hover:bg-black duration text-black hover:text-white rounded-[7px] flex justify-center items-center lg:w-[55px] w-auto md:h-[43px] h-[37px]"
              >
                <p className="text-[16px] font-[500]">x³</p>
              </div>
              <div
                onClick={() => calculator("e^")}
                className="bg-[#F4F4F4] hover:bg-black duration text-black hover:text-white rounded-[7px] flex justify-center items-center lg:w-[55px] w-auto md:h-[43px] h-[37px]"
              >
                <p className="text-[16px] font-[500] cursor-pointer">eˣ</p>
              </div>
              <div
                onClick={() => calculator("10^")}
                className="bg-[#F4F4F4] cursor-pointer hover:bg-black duration text-black hover:text-white rounded-[7px] flex justify-center items-center lg:w-[55px] w-auto md:h-[43px] h-[37px]"
              >
                <p className="text-[16px] font-[500] cursor-pointer">10ˣ</p>
              </div>

              <div
                onClick={() => calculator("**(1/")}
                className="bg-[#F4F4F4] cursor-pointer hover:bg-black duration text-black hover:text-white rounded-[7px] flex justify-center items-center lg:w-[55px] w-auto md:h-[43px] h-[37px]"
              >
                <p className="text-[16px] font-[500]">ʸ√x</p>
              </div>
              <div
                onClick={() => calculator("Math.cbrt(")}
                className="bg-[#F4F4F4] cursor-pointer hover:bg-black duration text-black hover:text-white rounded-[7px] flex justify-center items-center lg:w-[55px] w-auto md:h-[43px] h-[37px]"
              >
                <p className="text-[16px] font-[500]">³√x</p>
              </div>
              <div
                onClick={() => calculator("sqrt(")}
                className="bg-[#F4F4F4] cursor-pointer hover:bg-black duration text-black hover:text-white rounded-[7px] flex justify-center items-center lg:w-[55px] w-auto md:h-[43px] h-[37px]"
              >
                <p className="text-[18px] font-[500]">√x</p>
              </div>
              <div
                onClick={() => calculator("ln(")}
                className="bg-[#F4F4F4] cursor-pointer hover:bg-black duration text-black hover:text-white rounded-[7px] flex justify-center items-center lg:w-[55px] w-auto md:h-[43px] h-[37px]"
              >
                <p className="text-[18px] font-[500]">ln</p>
              </div>
              <div
                onClick={() => calculator("log(")}
                className="bg-[#F4F4F4] cursor-pointer hover:bg-black duration text-black hover:text-white rounded-[7px] flex justify-center items-center lg:w-[55px] w-auto md:h-[43px] h-[37px]"
              >
                <p className="text-[18px] font-[500]">log</p>
              </div>

              <div
                onClick={() => calculator("(")}
                className="bg-[#F4F4F4] cursor-pointer hover:bg-black duration text-black hover:text-white rounded-[7px] flex justify-center items-center lg:w-[55px] w-auto md:h-[43px] h-[37px]"
              >
                <p className="text-[18px] font-[500]">(</p>
              </div>
              <div
                onClick={() => calculator(")")}
                className="bg-[#F4F4F4] cursor-pointer hover:bg-black duration text-black hover:text-white rounded-[7px] flex justify-center items-center lg:w-[55px] w-auto md:h-[43px] h-[37px]"
              >
                <p className="text-[18px] font-[500]">)</p>
              </div>
              <div
                onClick={() => calculator("1/")}
                className="bg-[#F4F4F4] cursor-pointer hover:bg-black duration text-black hover:text-white rounded-[7px] flex justify-center items-center lg:w-[55px] w-auto md:h-[43px] h-[37px]"
              >
                <p className="text-[18px] font-[500]">1/x</p>
              </div>
              <div
                onClick={() => calculator("!")}
                className="bg-[#F4F4F4] cursor-pointer hover:bg-black duration text-black hover:text-white rounded-[7px] flex justify-center items-center lg:w-[55px] w-auto md:h-[43px] h-[37px]"
              >
                <p className="text-[18px] font-[500]">n!</p>
              </div>
              <div
                onClick={() => calculator("%")}
                className="bg-[#F4F4F4] cursor-pointer hover:bg-black duration text-black hover:text-white rounded-[7px] flex justify-center items-center lg:w-[55px] w-auto md:h-[43px] h-[37px]"
              >
                <p className="text-[18px] font-[500]">%</p>
              </div>
            </div>
          </div>

          {/* Basic Calculator Section - Fixed number inputs */}
          <div className="col-span-5">
            <div className="grid grid-cols-5 gap-x-2 gap-y-2">
              {[
                "1", "2", "3", "-", "bk",
                "4", "5", "6", "+", "ans", 
                "7", "8", "9", "/", "M+",
                "0", ".", "=", "*", "M-",
                "+/-", "RND", "C", "EXP", "MR"
              ].map((btn, index) => (
                <div
                  key={index}
                  onClick={() => calculator(btn)}
                  className={`${
                    ["bk", "ans", "=", "C", "EXP"].includes(btn) 
                      ? "bg-[#2845F5] hover:bg-black text-white" 
                      : "bg-[#F4F4F4] hover:bg-black text-black hover:text-white"
                  } cursor-pointer duration rounded-[7px] flex justify-center items-center lg:w-[55px] w-auto md:h-[43px] h-[37px]`}
                >
                  <p className="text-[18px] font-[500]">
                    {btn === "bk" ? (
                      <svg width={34} height={22} viewBox="0 0 34 22" fill="none">
                        <path d="M16.75 15.428L19.972 10.964L16.75 6.5H19.072L21.376 9.758L23.68 6.5H26.002L22.78 10.964L26.002 15.428H23.68L21.376 12.17L19.072 15.428H16.75Z" fill="white"/>
                        <path d="M10.7855 2.37868C11.3481 1.81607 12.1112 1.5 12.9069 1.5H29.25C30.9069 1.5 32.25 2.84315 32.25 4.5V17.5C32.25 19.1569 30.9069 20.5 29.25 20.5H12.9069C12.1112 20.5 11.3481 20.1839 10.7855 19.6213L4.28553 13.1213C3.11396 11.9497 3.11396 10.0503 4.28553 8.87868L10.7855 2.37868Z" stroke="white" strokeWidth={2}/>
                      </svg>
                    ) : btn}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calculator;
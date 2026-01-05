"use client";

import React, { useState, useEffect } from "react";
import { evaluate } from "mathjs";

const Calculator = () => {
  const [calculatorType, setCalculatorType] = useState("scientific"); // 'scientific' or 'simple'
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [memory, setMemory] = useState(0);
  const [degreeRad, setDegreeRad] = useState("degree");
  const [history, setHistory] = useState([]); // Calculation history

  const toggleCalculator = () => {
    setCalculatorType(
      calculatorType === "scientific" ? "simple" : "scientific"
    );
  };

  const setDegorRad = (type) => {
    setDegreeRad(type);
  };

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
    // Clear
    if (value === "C") {
      setInput("");
      setOutput("");
      return;
    }

    // Backspace
    if (value === "bk") {
      setInput((prev) => prev.slice(0, -1));
      return;
    }

    // Calculate
    if (value === "=") {
      if (!input.trim()) {
        setOutput("0");
        return;
      }

      try {
        let expression = input;

        // Auto-close parentheses
        const openParens = (expression.match(/\(/g) || []).length;
        const closeParens = (expression.match(/\)/g) || []).length;
        if (openParens > closeParens) {
          expression += ")".repeat(openParens - closeParens);
        }

        // Replace visual operators with math operators
        expression = expression
          .replace(/×/g, "*")
          .replace(/÷/g, "/")
          .replace(/±/g, "-");

        // Constants & Functions
        expression = expression
          .replace(/π/g, "pi")
          .replace(/e\^/g, "exp(")
          .replace(/10\^/g, "10^")
          .replace(/\^/g, "^")
          .replace(/Math\.cbrt\(/g, "cbrt(")
          .replace(/sqrt\(/g, "sqrt(")
          .replace(/ln\(/g, "log(")
          .replace(/log\(/g, "log10("); // log(x) in UI usually means base 10

        // Trigonometry function names are same in mathjs, but need consistent parens
        // We already add '(' in the UI button click, so regular expressions just ensure mapping
        const trigFuncs = ["sin", "cos", "tan", "asin", "acos", "atan"];
        trigFuncs.forEach((func) => {
          // Ensure we don't double replace if already clean
          // But user input comes as "sin(" usually
        });

        // Factorial handling (simple regex for number!)
        expression = expression.replace(/(\d+(?:\.\d+)?)!/g, (match, num) => {
          const n = parseFloat(num);
          // Factorial only defines for integers usually, but Gamma function exists for floats.
          // keeping it simple for now: regex match
          return factorial(n).toString();
        });

        // Percentage
        expression = expression.replace(/(\d+(?:\.\d+)?)%/g, "($1/100)");

        // Power replacement
        expression = expression.replace(/\^2/g, "^2");
        expression = expression.replace(/\^3/g, "^3");

        // Handle "ans"
        if (expression.includes("ans")) {
          if (output && output !== "Error") {
            expression = expression.replace(/ans/g, `(${output})`);
          } else {
            expression = expression.replace(/ans/g, "0");
          }
        }

        // Scope for mathjs
        const scope = {
          sqrt: Math.sqrt,
          cbrt: Math.cbrt,
          log: Math.log,       // ln
          log10: Math.log10,   // log base 10
          exp: Math.exp,
          pi: Math.PI,
          e: Math.E
        };

        if (degreeRad === "degree") {
          // Wrap trig functions to handle degree conversion
          scope.sin = (x) => Math.sin((x * Math.PI) / 180);
          scope.cos = (x) => Math.cos((x * Math.PI) / 180);
          scope.tan = (x) => Math.tan((x * Math.PI) / 180);
          scope.asin = (x) => (Math.asin(x) * 180) / Math.PI;
          scope.acos = (x) => (Math.acos(x) * 180) / Math.PI;
          scope.atan = (x) => (Math.atan(x) * 180) / Math.PI;
        } else {
          // Default radian
          scope.sin = Math.sin;
          scope.cos = Math.cos;
          scope.tan = Math.tan;
          scope.asin = Math.asin;
          scope.acos = Math.acos;
          scope.atan = Math.atan;
        }

        const result = evaluate(expression, scope);

        if (isNaN(result) || !isFinite(result)) {
          setOutput("Error");
        } else {
          // precision handling
          // round to 10 decimals to avoid floating point artifacts like 3.00000000004
          const formatted = parseFloat(result.toFixed(10));
          setOutput(formatted.toString());

          // Add to history (optional feature, but good for "complete")
          setHistory(prev => [{ input, output: formatted.toString() }, ...prev].slice(0, 5));
        }

      } catch (err) {
        // console.error(err); // Prevent dev overlay
        setOutput("Error");
      }
      return;
    }

    // Memory
    if (value === "M+") {
      const val = parseFloat(output || input || "0"); // try output first, then input
      if (!isNaN(val)) setMemory((m) => m + val);
      return;
    }
    if (value === "M-") {
      const val = parseFloat(output || input || "0");
      if (!isNaN(val)) setMemory((m) => m - val);
      return;
    }
    if (value === "MR") {
      setInput((prev) => prev + memory.toString());
      return;
    }

    // Special Buttons
    if (value === "ans") {
      setInput((prev) => prev + "ans");
      return;
    }
    if (value === "+/-") {
      // Toggle sign of last number in input? Or just wrap whole thing?
      // Simple approach: if output exists and input empty, set input to -output
      if (!input && output) {
        setInput(output.startsWith("-") ? output.slice(1) : "-" + output);
      } else {
        // Just modify input string? It's complex to parse.
        // Simplest: append * -1 or just let user type -
        // Let's toggle start of string for simple cases
        if (input.startsWith("-")) setInput(input.slice(1));
        else setInput("-" + input);
      }
      return;
    }
    if (value === "RND") {
      setInput((prev) => prev + Math.random().toFixed(4));
      return;
    }
    if (value === "EXP") {
      setInput((prev) => prev + "e"); // e notation usually, or *10^
      return;
    }

    // Default: Append
    setInput((prev) => prev + value.toString());
  };

  return (
    <div className="max-w-[830px] mx-auto lg:py-5 md:py-5 lg:mt-auto md:mt-auto mt-6 relative px-5">
      <div className="bordercalculator xl:p-4 lg:p-4 p-3 bg-white xl:rounded-[25px] lg:rounded-[20px] rounded-[16px] w-full shadow-sm">
        <div className="flex lg:flex-row flex-col gap-x-5 lg:gap-y-[22px] md:gap-y-[22px] w-full">

          {/* Input Screen */}
          <div className="lg:w-[50%] w-full">
            <p className="text-[16px] leading-[20.85px] font-[700] px-3 mb-2">
              Input
            </p>
            <div
              className={`bg-[#FAFAFA] min-h-[50px] max-h-[100px] border border-[#E3E3E3] rounded-[12px] px-4 py-3 my-1 overflow-auto text-lg font-medium whitespace-pre-wrap break-all ${!input ? 'text-gray-400' : 'text-black'}`}
            >
              {input || "0"}
            </div>
          </div>

          {/* Answer Screen */}
          <div className="lg:w-[50%] w-full">
            <p className="text-[16px] leading-[20.85px] font-[700] px-3 mb-2">
              Answer
            </p>
            <div className="bg-[#FAFAFA] min-h-[50px] max-h-[100px] border border-[#E3E3E3] rounded-[12px] px-4 py-3 my-1 overflow-auto flex items-center justify-end">
              <p className={`text-right text-[28px] leading-[36.46px] font-[600] ${output === "Error" ? "text-red-500" : "text-[#818181]"}`}>
                {output || "0"}
              </p>
            </div>
          </div>

          {/* Mobile Toggle */}
          {/* <div className="w-full text-center lg:hidden md:hidden block mt-2">
            <button
              onClick={toggleCalculator}
              className="bg-[#2845F5] w-full text-[#fff] hover:bg-[#1A1A1A] duration-200 font-[600] text-[14px] rounded-[25px] px-4 py-3"
            >
              {calculatorType === "scientific" ? "Simple Calculator" : "Scientific Calculator"}
            </button>
          </div> */}
        </div>

        {/* Memory Indicator */}
        <div className="mt-4 mb-2 px-3 text-sm text-gray-500 font-medium">
          Memory: <span className="text-black">{memory}</span>
        </div>

        {/* Keypad Grid */}
        <div className="grid lg:grid-cols-10 md:grid-cols-10 grid-cols-5 gap-2 mt-2">

          {/* Left Side: Scientific Functions */}
          <div className={`col-span-10 lg:col-span-5 md:col-span-5 grid grid-cols-5 gap-2 ${calculatorType === 'simple' ? 'hidden lg:grid md:grid' : ''}`}>
            {/* Row 1 */}
            <Btn label="sin" onClick={() => calculator("sin(")} />
            <Btn label="cos" onClick={() => calculator("cos(")} />
            <Btn label="tan" onClick={() => calculator("tan(")} />

            {/* Deg/Rad Toggle */}
            <div className="bg-[#F4F4F4] rounded-[7px] flex items-center justify-center col-span-2 px-1">
              <div className="flex items-center gap-x-2 text-[12px] font-[600]">
                <label className="flex items-center cursor-pointer gap-1">
                  <input
                    type="radio"
                    name="drmode"
                    checked={degreeRad === "degree"}
                    onChange={() => setDegorRad("degree")}
                    className="accent-blue-600 w-3 h-3"
                  /> Deg
                </label>
                <label className="flex items-center cursor-pointer gap-1">
                  <input
                    type="radio"
                    name="drmode"
                    checked={degreeRad === "radians"}
                    onChange={() => setDegorRad("radians")}
                    className="accent-blue-600 w-3 h-3"
                  /> Rad
                </label>
              </div>
            </div>

            {/* Row 2 */}
            <Btn label="sin⁻¹" onClick={() => calculator("asin(")} size="text-[14px]" />
            <Btn label="cos⁻¹" onClick={() => calculator("acos(")} size="text-[14px]" />
            <Btn label="tan⁻¹" onClick={() => calculator("atan(")} size="text-[14px]" />
            <Btn label="π" onClick={() => calculator("π")} />
            <Btn label="e" onClick={() => calculator("e")} />

            {/* Row 3 */}
            <Btn label="xʸ" onClick={() => calculator("^")} />
            <Btn label="x²" onClick={() => calculator("^2")} />
            <Btn label="x³" onClick={() => calculator("^3")} />
            <Btn label="eˣ" onClick={() => calculator("e^")} />
            <Btn label="10ˣ" onClick={() => calculator("10^")} />

            {/* Row 4 */}
            <Btn label="ʸ√x" onClick={() => calculator("**(1/")} size="text-[14px]" />
            <Btn label="³√x" onClick={() => calculator("Math.cbrt(")} size="text-[14px]" />
            <Btn label="√x" onClick={() => calculator("sqrt(")} size="text-[16px]" />
            <Btn label="ln" onClick={() => calculator("ln(")} />
            <Btn label="log" onClick={() => calculator("log(")} />

            {/* Row 5 */}
            <Btn label="(" onClick={() => calculator("(")} />
            <Btn label=")" onClick={() => calculator(")")} />
            <Btn label="1/x" onClick={() => calculator("1/")} size="text-[14px]" />
            <Btn label="n!" onClick={() => calculator("!")} />
            <Btn label="%" onClick={() => calculator("%")} />
          </div>

          {/* Right Side: Numpad & Operations */}
          <div className="col-span-10 lg:col-span-5 md:col-span-5 grid grid-cols-5 gap-2">

            <Btn label="1" onClick={() => calculator("1")} />
            <Btn label="2" onClick={() => calculator("2")} />
            <Btn label="3" onClick={() => calculator("3")} />
            <Btn label="-" onClick={() => calculator("-")} />
            <Btn label="⌫" onClick={() => calculator("bk")} blue icon />

            <Btn label="4" onClick={() => calculator("4")} />
            <Btn label="5" onClick={() => calculator("5")} />
            <Btn label="6" onClick={() => calculator("6")} />
            <Btn label="+" onClick={() => calculator("+")} />
            <Btn label="ans" onClick={() => calculator("ans")} blue />

            <Btn label="7" onClick={() => calculator("7")} />
            <Btn label="8" onClick={() => calculator("8")} />
            <Btn label="9" onClick={() => calculator("9")} />
            <Btn label="/" onClick={() => calculator("/")} />
            <Btn label="M+" onClick={() => calculator("M+")} />

            <Btn label="0" onClick={() => calculator("0")} />
            <Btn label="." onClick={() => calculator(".")} />
            <Btn label="=" onClick={() => calculator("=")} blue />
            <Btn label="*" onClick={() => calculator("*")} />
            <Btn label="M-" onClick={() => calculator("M-")} />

            <Btn label="+/-" onClick={() => calculator("+/-")} size="text-[14px]" />
            <Btn label="RND" onClick={() => calculator("RND")} size="text-[12px]" />
            <Btn label="C" onClick={() => calculator("C")} blue />
            <Btn label="EXP" onClick={() => calculator("EXP")} blue size="text-[12px]" />
            <Btn label="MR" onClick={() => calculator("MR")} />

          </div>
        </div>

      </div>
    </div>
  );
};

// Reusable Button Component for cleaner JSX
const Btn = ({ label, onClick, blue = false, size = "text-[18px]", icon = false }) => {
  return (
    <div
      onClick={onClick}
      className={`${blue
        ? "bg-[#2845F5] hover:bg-black text-white"
        : "bg-[#F4F4F4] hover:bg-black text-black hover:text-white"
        } cursor-pointer duration-200 rounded-[8px] flex justify-center items-center h-[45px] select-none active:scale-95 transition-all`}
    >
      {icon ? (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M21 5H9L3 12L9 19H21C21.5304 19 22.0391 18.7893 22.4142 18.4142C22.7893 18.0391 23 17.5304 23 17V7C23 6.46957 22.7893 5.96086 22.4142 5.58579C22.0391 5.21071 21.5304 5 21 5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M18 9L12 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M12 9L18 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : (
        <p className={`${size} font-[600]`}>{label}</p>
      )}
    </div>
  );
};

export default Calculator;
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

        // handle constants & functions
        expression = expression
          .replace(/π/g, "Math.PI")
          .replace(/e/g, "Math.E")
          .replace(/\^/g, "**")
          .replace(/sqrt\(/g, "Math.sqrt(")
          .replace(/ln\(/g, "Math.log(")
          .replace(/log\(/g, "Math.log10(")
          .replace(/sin\(/g, `Math.sin(${degreeRad==="degree"?"(Math.PI/180)*":""}`)
          .replace(/cos\(/g, `Math.cos(${degreeRad==="degree"?"(Math.PI/180)*":""}`)
          .replace(/tan\(/g, `Math.tan(${degreeRad==="degree"?"(Math.PI/180)*":""}`)
          .replace(/ans/g, output);

        const result = evaluate(expression);
        setOutput(result.toString());
      } catch {
        setOutput("Error");
      }
      return;
    }

    // memory functions
    if (["M+", "M-", "MR"].includes(value)) {
      if (value === "MR") setInput(input + memory);
      else setInput(input + value);
      return;
    }

    if (value === "ans") {
      setInput(input + output);
      return;
    }

    if (value === "+/-") {
      setInput(input + "±");
      return;
    }

    setInput(input + value);
  };

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
              className="bg-[#FAFAFA] min-h-[40px] max-h-[100px] border border-[#E3E3E3] rounded-[12px] px-3 pt-2 my-3"
            >
              &nbsp;
            </div>
          </div>
          <div className="lg:w-[50%] w-full">
            <p className="text-[16px] leading-[20.85px] font-[700] px-3">
              Answer
            </p>
            <div className="bg-[#FAFAFA] flex items-center justify-end min-h-[40px] max-h-[100px] border border-[#E3E3E3] rounded-[12px] px-3 pt-2 my-3">
              <p
                id="showOutput"
                className="text-[#818181] text-right text-[28px] leading-[36.46px] font-[500]"
              ></p>
            </div>
          </div>
          <div className="w-full text-center lg:hidden md:hidden block">
            {calculatorType === "scientific" ? (
              <button
                onClick={toggleCalculator}
                id="scientific_calculator"
                value="scientific"
                className="bg-[#2845F5] w-full mb-3 mt-1 lg:hidden text-[#fff] hover:bg-[#1A1A1A] hover:text-white duration-200 font-[600] text-[14px] rounded-[25px] px-4 py-3"
              >
                Simple Calculator
              </button>
            ) : (
              <button
                onClick={toggleCalculator}
                id="simple_calculator"
                value="simple"
                className="bg-[#2845F5] w-full mb-3 mt-1 lg:hidden text-[#fff] hover:bg-[#1A1A1A] hover:text-white duration-200 font-[600] text-[14px] rounded-[25px] px-4 py-3"
              >
                Scientific Calculator
              </button>
            )}
          </div>
        </div>
        <div className="grid lg:grid-cols-10 gap-x-2 gap-y-2">
          <div
            className={`col-span-5 ${
              calculatorType === "simple" ? "block" : "hidden"
            } lg:block md:block`}
          >
            <div className="grid grid-cols-5 gap-x-2 gap-y-2">
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
                      defaultValue="deg"
                      onClick={() => setDegorRad("degree")}
                      defaultChecked
                      aria-label="input field"
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
                      defaultValue="deg"
                      onClick={() => setDegorRad("radians")}
                      aria-label="input field"
                    />
                    Rad
                  </p>
                </label>
              </div>
              <div
                onClick={() => calculator("asin(")}
                className="bg-[#F4F4F4] hover:bg-black duration text-black hover:text-white rounded-[7px] flex justify-center items-center lg:w-[55px] w-auto md:h-[43px] h-[37px]"
              >
                <p className="text-[18px] font-[500] cursor-pointer">
                  <span>
                    sin<sup>-1</sup>
                  </span>
                </p>
              </div>
              <div
                onClick={() => calculator("acos(")}
                className="bg-[#F4F4F4] hover:bg-black duration text-black hover:text-white rounded-[7px] flex justify-center items-center lg:w-[55px] w-auto md:h-[43px] h-[37px]"
              >
                <p className="text-[18px] font-[500] cursor-pointer">
                  <span>
                    cos<sup>-1</sup>
                  </span>
                </p>
              </div>
              <div
                onClick={() => calculator("atan(")}
                className="bg-[#F4F4F4] hover:bg-black duration text-black hover:text-white rounded-[7px] flex justify-center items-center lg:w-[55px] w-auto md:h-[43px] h-[37px]"
              >
                <p className="text-[18px] font-[500] cursor-pointer">
                  <span>
                    tan<sup>-1</sup>
                  </span>
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
              <div className="bg-[#F4F4F4] cursor-pointer hover:bg-black duration text-black hover:text-white rounded-[7px] flex justify-center items-center lg:w-[55px] w-auto md:h-[43px] h-[37px]">
                <p
                  onClick={() => calculator("^y")}
                  className="text-[18px] font-[500]"
                >
                  <span>
                    x<sup>y</sup>
                  </span>
                </p>
              </div>
              <div
                onClick={() => calculator("^3")}
                className="bg-[#F4F4F4] cursor-pointer hover:bg-black duration text-black hover:text-white rounded-[7px] flex justify-center items-center lg:w-[55px] w-auto md:h-[43px] h-[37px]"
              >
                <p className="text-[18px] font-[500] cursor-pointer">
                  <span>
                    x<sup>3</sup>
                  </span>
                </p>
              </div>
              <div
                onClick={() => calculator("^2")}
                className="bg-[#F4F4F4] cursor-pointer hover:bg-black duration text-black hover:text-white rounded-[7px] flex justify-center items-center lg:w-[55px] w-auto md:h-[43px] h-[37px]"
              >
                <p className="text-[18px] font-[500] cursor-pointer">
                  <span>
                    x<sup>2</sup>
                  </span>
                </p>
              </div>
              <div
                onClick={() => calculator("e^")}
                className="bg-[#F4F4F4] hover:bg-black duration text-black hover:text-white rounded-[7px] flex justify-center items-center lg:w-[55px] w-auto md:h-[43px] h-[37px]"
              >
                <p className="text-[18px] font-[500] cursor-pointer">
                  <span>
                    e<sup>x</sup>
                  </span>
                </p>
              </div>
              <div
                onClick={() => calculator("10^")}
                className="bg-[#F4F4F4] cursor-pointer hover:bg-black duration text-black hover:text-white rounded-[7px] flex justify-center items-center lg:w-[55px] w-auto md:h-[43px] h-[37px]"
              >
                <p className="text-[18px] font-[500] cursor-pointer">
                  <span>
                    10<sup>x</sup>
                  </span>
                </p>
              </div>
              <div
                onClick={() => calculator("**(1/")}
                className="bg-[#F4F4F4] cursor-pointer hover:bg-black duration text-black hover:text-white rounded-[7px] flex justify-center items-center lg:w-[55px] w-auto md:h-[43px] h-[37px]"
              >
                <p className="text-[18px] font-[500]">
                  <span>
                    <sup>y</sup>√x
                  </span>
                </p>
              </div>
              <div
                onClick={() => calculator("Math.cbrt(")}
                className="bg-[#F4F4F4] cursor-pointer hover:bg-black duration text-black hover:text-white rounded-[7px] flex justify-center items-center lg:w-[55px] w-auto md:h-[43px] h-[37px]"
              >
                <p className="text-[18px] font-[500]">
                  <span>
                    <sup>3</sup>√x
                  </span>
                </p>
              </div>
              <div
                onClick={() => calculator("sqrt(")}
                className="bg-[#F4F4F4] cursor-pointer hover:bg-black duration text-black hover:text-white rounded-[7px] flex justify-center items-center lg:w-[55px] w-auto md:h-[43px] h-[37px]"
              >
                <p className="text-[18px] font-[500]">
                  <span className="grey_color">√x</span>
                </p>
              </div>
              <div
                onClick={() => calculator("ln(")}
                className="bg-[#F4F4F4] cursor-pointer hover:bg-black duration text-black hover:text-white rounded-[7px] flex justify-center items-center lg:w-[55px] w-auto md:h-[43px] h-[37px]"
              >
                <p className="text-[18px] font-[500]">In</p>
              </div>
              <div
                onClick={() => calculator("log(")}
                className="bg-[#F4F4F4] cursor-pointer hover:bg-black duration text-black hover:text-white rounded-[7px] flex justify-center items-center lg:w-[55px] w-auto md:h-[43px] h-[37px]"
              >
                <p className="text-[18px] font-[500]">Log</p>
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
                onClick={() => calculator("1/x")}
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

          <div className="col-span-5">
            <div className="grid grid-cols-5 gap-x-2 gap-y-2">
              <div
                onClick={() => calculator(1)}
                className="bg-[#F4F4F4] hover:bg-black duration cursor-pointer text-black hover:text-white rounded-[7px] flex justify-center items-center lg:w-[55px] w-auto md:h-[43px] h-[37px]"
              >
                <p className="text-[18px] font-[500] cursor-pointer">1</p>
              </div>
              <div
                onClick={() => calculator(2)}
                className="bg-[#F4F4F4] hover:bg-black duration cursor-pointer text-black hover:text-white rounded-[7px] flex justify-center items-center lg:w-[55px] w-auto md:h-[43px] h-[37px]"
              >
                <p className="text-[18px] font-[500] cursor-pointer">2</p>
              </div>
              <div
                onClick={() => calculator(3)}
                className="bg-[#F4F4F4] hover:bg-black duration cursor-pointer text-black hover:text-white rounded-[7px] flex justify-center items-center lg:w-[55px] w-auto md:h-[43px] h-[37px]"
              >
                <p className="text-[18px] font-[500] cursor-pointer">3</p>
              </div>
              <div
                onClick={() => calculator("-")}
                className="bg-[#F4F4F4] hover:bg-black duration text-black hover:text-white rounded-[7px] flex justify-center items-center lg:w-[55px] w-auto md:h-[43px] h-[37px]"
              >
                <p className="text-[18px] font-[500] cursor-pointer">-</p>
              </div>
              <div
                onClick={() => calculator("bk")}
                className="bg-[#2845F5] hover:bg-black duration text-white hover:text-white rounded-[7px] flex justify-center items-center lg:w-[55px] w-auto md:h-[43px] h-[37px]"
              >
                <p className="text-[18px] font-[500] cursor-pointer">
                  <svg
                    width={34}
                    height={22}
                    viewBox="0 0 34 22"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M16.75 15.428L19.972 10.964L16.75 6.5H19.072L21.376 9.758L23.68 6.5H26.002L22.78 10.964L26.002 15.428H23.68L21.376 12.17L19.072 15.428H16.75Z"
                      fill="white"
                    />
                    <path
                      d="M10.7855 2.37868C11.3481 1.81607 12.1112 1.5 12.9069 1.5H29.25C30.9069 1.5 32.25 2.84315 32.25 4.5V17.5C32.25 19.1569 30.9069 20.5 29.25 20.5H12.9069C12.1112 20.5 11.3481 20.1839 10.7855 19.6213L4.28553 13.1213C3.11396 11.9497 3.11396 10.0503 4.28553 8.87868L10.7855 2.37868Z"
                      stroke="white"
                      strokeWidth={2}
                    />
                  </svg>
                </p>
              </div>
              <div
                onClick={() => calculator(4)}
                className="bg-[#F4F4F4] cursor-pointer hover:bg-black duration text-black hover:text-white rounded-[7px] flex justify-center items-center lg:w-[55px] w-auto md:h-[43px] h-[37px]"
              >
                <p className="text-[18px] font-[500]">4</p>
              </div>
              <div
                onClick={() => calculator(5)}
                className="bg-[#F4F4F4] cursor-pointer hover:bg-black duration text-black hover:text-white rounded-[7px] flex justify-center items-center lg:w-[55px] w-auto md:h-[43px] h-[37px]"
              >
                <p className="text-[18px] font-[500]">5</p>
              </div>
              <div
                onClick={() => calculator(6)}
                className="bg-[#F4F4F4] cursor-pointer hover:bg-black duration text-black hover:text-white rounded-[7px] flex justify-center items-center lg:w-[55px] w-auto md:h-[43px] h-[37px]"
              >
                <p className="text-[18px] font-[500]">6</p>
              </div>
              <div
                onClick={() => calculator("+")}
                className="bg-[#F4F4F4] cursor-pointer hover:bg-black duration text-black hover:text-white rounded-[7px] flex justify-center items-center lg:w-[55px] w-auto md:h-[43px] h-[37px]"
              >
                <p className="text-[18px] font-[500]">+</p>
              </div>
              <div
                onClick={() => calculator("ans")}
                className="bg-[#2845F5] cursor-pointer hover:bg-black duration text-white hover:text-white rounded-[7px] flex justify-center items-center lg:w-[55px] w-auto md:h-[43px] h-[37px]"
              >
                <p className="text-[18px] font-[500]">Ans</p>
              </div>
              <div
                onClick={() => calculator(7)}
                className="bg-[#F4F4F4] cursor-pointer hover:bg-black duration text-black hover:text-white rounded-[7px] flex justify-center items-center lg:w-[55px] w-auto md:h-[43px] h-[37px]"
              >
                <p className="text-[18px] font-[500]">7</p>
              </div>
              <div
                onClick={() => calculator(8)}
                className="bg-[#F4F4F4] cursor-pointer hover:bg-black duration text-black hover:text-white rounded-[7px] flex justify-center items-center lg:w-[55px] w-auto md:h-[43px] h-[37px]"
              >
                <p className="text-[18px] font-[500]">8</p>
              </div>
              <div
                onClick={() => calculator(9)}
                className="bg-[#F4F4F4] cursor-pointer hover:bg-black duration text-black hover:text-white rounded-[7px] flex justify-center items-center lg:w-[55px] w-auto md:h-[43px] h-[37px]"
              >
                <p className="text-[18px] font-[500]">9</p>
              </div>
              <div
                onClick={() => calculator("/")}
                className="bg-[#F4F4F4] cursor-pointer hover:bg-black duration text-black hover:text-white rounded-[7px] flex justify-center items-center lg:w-[55px] w-auto md:h-[43px] h-[37px]"
              >
                <p className="text-[18px] font-[500]">÷</p>
              </div>
              <div
                onClick={() => calculator("M+")}
                className="bg-[#F4F4F4] cursor-pointer hover:bg-black duration text-black hover:text-white rounded-[7px] flex justify-center items-center lg:w-[55px] w-auto md:h-[43px] h-[37px]"
              >
                <p className="text-[18px] font-[500]">M+</p>
              </div>
              <div
                onClick={() => calculator(0)}
                className="bg-[#F4F4F4] cursor-pointer hover:bg-black duration text-black hover:text-white rounded-[7px] flex justify-center items-center lg:w-[55px] w-auto md:h-[43px] h-[37px]"
              >
                <p className="text-[18px] font-[500]">0</p>
              </div>
              <div
                onClick={() => calculator(".")}
                className="bg-[#F4F4F4] cursor-pointer hover:bg-black duration text-black hover:text-white rounded-[7px] flex justify-center items-center lg:w-[55px] w-auto md:h-[43px] h-[37px]"
              >
                <p className="text-[18px] font-[500]">.</p>
              </div>
              <div
                onClick={() => calculator("=")}
                className="bg-[#2845F5] cursor-pointer hover:bg-black duration text-white hover:text-white rounded-[7px] flex justify-center items-center lg:w-[55px] w-auto md:h-[43px] h-[37px]"
              >
                <p className="text-[18px] font-[500]">=</p>
              </div>
              <div
                onClick={() => calculator("*")}
                className="bg-[#F4F4F4] cursor-pointer hover:bg-black duration text-black hover:text-white rounded-[7px] flex justify-center items-center lg:w-[55px] w-auto md:h-[43px] h-[37px]"
              >
                <p className="text-[18px] font-[500]">x</p>
              </div>
              <div
                onClick={() => calculator("M-")}
                className="bg-[#F4F4F4] cursor-pointer hover:bg-black duration text-black hover:text-white rounded-[7px] flex justify-center items-center lg:w-[55px] w-auto md:h-[43px] h-[37px]"
              >
                <p className="text-[18px] font-[500]">M-</p>
              </div>
              <div
                onClick={() => calculator("+/-")}
                className="bg-[#F4F4F4] cursor-pointer hover:bg-black duration text-black hover:text-white rounded-[7px] flex justify-center items-center lg:w-[55px] w-auto md:h-[43px] h-[37px]"
              >
                <p className="text-[18px] font-[500]">
                  <span className="grey_color">±</span>
                </p>
              </div>
              <div
                onClick={() => calculator("RND")}
                className="bg-[#F4F4F4] cursor-pointer hover:bg-black duration text-black hover:text-white rounded-[7px] flex justify-center items-center lg:w-[55px] w-auto md:h-[43px] h-[37px]"
              >
                <p className="text-[18px] font-[500]">RND</p>
              </div>
              <div
                onClick={() => calculator("C")}
                className="bg-[#2845F5] cursor-pointer hover:bg-black duration text-white hover:text-white rounded-[7px] flex justify-center items-center lg:w-[55px] w-auto md:h-[43px] h-[37px]"
              >
                <p className="text-[18px] font-[500]">AC</p>
              </div>
              <div
                onClick={() => calculator("EXP")}
                className="bg-[#2845F5] cursor-pointer hover:bg-black duration text-white hover:text-white rounded-[7px] flex justify-center items-center lg:w-[55px] w-auto md:h-[43px] h-[37px]"
              >
                <p className="text-[18px] font-[500]">EXP</p>
              </div>
              <div className="bg-[#F4F4F4] cursor-pointer hover:bg-black duration text-black hover:text-white rounded-[7px] flex justify-center items-center lg:w-[55px] w-auto md:h-[43px] h-[37px]">
                <p
                  onClick={() => calculator("MR")}
                  id="scimrc"
                  className="text-[18px] font-[500]"
                >
                  MR
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calculator;

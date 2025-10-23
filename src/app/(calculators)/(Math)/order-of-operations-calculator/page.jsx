"use client";
import React, { useEffect, useState, useRef } from "react";

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

const OrderOfOperationsCalculator = () => {
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
  const [getSingleCalculatorDetails, { data }] =
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

  const [expression, setExpression] = useState("(10+5^2)((5*-2)+9-3^3)/2");
  const [result, setResult] = useState(null);
  const [steps, setSteps] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const stepNumber = useRef(1);

  // Token class
  class Token {
    constructor(str, stIndex, enIndex) {
      this.str = str;
      this.stIndex = stIndex;
      this.enIndex = enIndex;
    }

    get value() {
      return this.str;
    }
    get startIndex() {
      return this.stIndex;
    }
    get endIndex() {
      return this.enIndex;
    }
  }

  // Helper functions
  const isOperator = (operator) => "-+*/√^%".indexOf(operator) !== -1;

  const isNum = (number) => {
    if (number === "-") return false;
    for (let x = 0; x < number.length; x++) {
      if ("1234567890.-".indexOf(number.charAt(x)) === -1) return false;
    }
    return true;
  };

  const isNegativeSign = (minus, charBefore, charAfter) => {
    return (
      minus === "-" &&
      ((isOperator(charBefore) && charBefore !== "%") || charBefore === "(") &&
      isNum(charAfter)
    );
  };

  const round = (number) => {
    if (number instanceof Number) return number.toFixed(5);
    let strNumber = String(parseFloat(number).toFixed(5));
    for (let i = strNumber.length - 1; i >= 0; i--) {
      if (strNumber.charAt(i) === "0") strNumber = strNumber.substring(0, i);
      else if (strNumber.charAt(i) === ".") {
        strNumber = strNumber.substring(0, i);
        break;
      } else break;
    }
    return Number(strNumber);
  };

  // Tokenize function
  const tokenize = (input) => {
    const tokens = [];
    for (let x = 0; x < input.length; x++) {
      let char = input.charAt(x);
      if (
        (isOperator(char) || char === "(" || char === ")") &&
        !isNegativeSign(
          char,
          x === 0 ? "" : input.charAt(x - 1),
          x === input.length - 1 ? "" : input.charAt(x + 1)
        )
      ) {
        if (char === "%") {
          tokens.push(new Token("/", x, x));
          tokens.push(new Token("100", x, x));
          continue;
        } else if (
          char === "(" &&
          x !== 0 &&
          (isNum(input.charAt(x - 1)) ||
            !isNaN(Number(tokens[tokens.length - 1].value)) ||
            input.charAt(x - 1) === ")")
        ) {
          tokens.push(new Token("*", x, x));
          tokens.push(new Token(char, x, x));
          continue;
        }
        tokens.push(new Token(char, x, x));
        continue;
      }
      if (
        isNum(char) ||
        isNegativeSign(
          char,
          x === 0 ? "" : input.charAt(x - 1),
          x === input.length - 1 ? "" : input.charAt(x + 1)
        )
      ) {
        let substring = char;
        let z = x + 1;
        for (let y = x + 1; y < input.length; z = ++y) {
          if (isNum(input.charAt(y)) && input.charAt(y) !== "-") {
            substring += input.charAt(y);
          } else {
            break;
          }
        }
        tokens.push(new Token(substring, x, z - 1));
        x = z - 1;
        continue;
      }
    }

    for (let i = 0, j = 1, k = 2; k < tokens.length; i++, j++, k++) {
      if (tokens[i].value === "(" && tokens[k].value === ")") {
        tokens.splice(
          i,
          3,
          new Token(tokens[j].value, tokens[i].startIndex, tokens[k].endIndex)
        );
      }
    }
    return tokens;
  };

  const addStep = (stepText, highlight = "") => {
    setSteps((prev) => [
      ...prev,
      { step: stepNumber.current++, text: stepText, highlight },
    ]);
  };

  const checkNumbers = (opIndex, tokens, input) => {
    const num1 = tokens[opIndex - 1].value;
    const num2 = tokens[opIndex + 1].value;
    const number1 = Number(num1);
    const number2 = Number(num2);

    if (isNaN(number1) || isNaN(number2)) {
      throw new Error(`Invalid numbers: ${num1}, ${num2}`);
    }
    return true;
  };

  const parentheses = (input) => {
    let tokens = tokenize(input);
    if (isOperator(tokens[tokens.length - 1].value)) {
      throw new Error("Operators must be followed by a number");
    }

    while (
      tokens.filter((token) => token.value === "(" || token.value === ")")
        .length > 0
    ) {
      let openParenthesisIndex = -1;
      let closedParenthesisIndex = -1;
      let openParenthesisTokenIndex = -1;
      let closedParenthesisTokenIndex = -1;

      for (let y = 0; y < tokens.length && closedParenthesisIndex === -1; y++) {
        if (tokens[y].value === ")") {
          closedParenthesisIndex = tokens[y].endIndex;
          closedParenthesisTokenIndex = y;
        }
      }

      for (let x = 0; x < tokens.length && openParenthesisIndex === -1; x++) {
        if (
          tokens[x].value === "(" &&
          tokens[x].startIndex > closedParenthesisIndex &&
          closedParenthesisIndex !== -1
        )
          break;
        else if (tokens[x].value === "(") {
          openParenthesisIndex = tokens[x].startIndex;
          openParenthesisTokenIndex = x;
        }
      }

      if (openParenthesisIndex === -1)
        throw new Error("Unbalanced Closed Parenthesis");
      if (closedParenthesisIndex === -1)
        throw new Error("Unbalanced Open Parenthesis");

      const prefix = input.substring(0, openParenthesisIndex + 1);
      const suffix = input.substring(closedParenthesisIndex);
      let insideParentheses = input.substring(
        openParenthesisIndex + 1,
        closedParenthesisIndex
      );

      addStep(
        `Solve parentheses: ${prefix}${insideParentheses}${suffix}`,
        insideParentheses
      );

      insideParentheses = exponents(insideParentheses);
      insideParentheses = multiplication(insideParentheses);
      insideParentheses = addition(insideParentheses);

      input =
        input.substring(0, openParenthesisIndex + 1) +
        insideParentheses +
        input.substring(closedParenthesisIndex);
      tokens = tokenize(input);
    }
    return input;
  };

  const exponents = (input) => {
    let tokens = tokenize(input);
    for (let x = 0; x < tokens.length; x++) {
      if (tokens[x].value === "^" && checkNumbers(x, tokens, input)) {
        const result =
          Number(tokens[x - 1].value) ** Number(tokens[x + 1].value);
        addStep(
          `${tokens[x - 1].value} ^ ${tokens[x + 1].value} = ${result}`,
          `${tokens[x - 1].value}^${tokens[x + 1].value}`
        );
        input =
          input.substring(0, tokens[x - 1].startIndex) +
          result +
          input.substring(tokens[x + 1].endIndex + 1);
        tokens = tokenize(input);
        x = -1;
        continue;
      }
    }
    return input;
  };

  const multiplication = (input) => {
    let tokens = tokenize(input);
    for (let x = 0; x < tokens.length; x++) {
      if (tokens[x].value === "*" && checkNumbers(x, tokens, input)) {
        const result =
          Number(tokens[x - 1].value) * Number(tokens[x + 1].value);
        addStep(
          `${tokens[x - 1].value} × ${tokens[x + 1].value} = ${result}`,
          `${tokens[x - 1].value}*${tokens[x + 1].value}`
        );
        input =
          input.substring(0, tokens[x - 1].startIndex) +
          result +
          input.substring(tokens[x + 1].endIndex + 1);
        tokens = tokenize(input);
        x = -1;
        continue;
      } else if (tokens[x].value === "/" && checkNumbers(x, tokens, input)) {
        const result =
          Number(tokens[x - 1].value) / Number(tokens[x + 1].value);
        addStep(
          `${tokens[x - 1].value} ÷ ${tokens[x + 1].value} = ${result}`,
          `${tokens[x - 1].value}/${tokens[x + 1].value}`
        );
        input =
          input.substring(0, tokens[x - 1].startIndex) +
          result +
          input.substring(tokens[x + 1].endIndex + 1);
        tokens = tokenize(input);
        x = -1;
        continue;
      }
    }
    return input;
  };

  const addition = (input) => {
    let tokens = tokenize(input);
    for (let x = 0; x < tokens.length; x++) {
      if (tokens[x].value === "+" && checkNumbers(x, tokens, input)) {
        const result =
          Number(tokens[x - 1].value) + Number(tokens[x + 1].value);
        addStep(
          `${tokens[x - 1].value} + ${tokens[x + 1].value} = ${result}`,
          `${tokens[x - 1].value}+${tokens[x + 1].value}`
        );
        input =
          input.substring(0, tokens[x - 1].startIndex) +
          result +
          input.substring(tokens[x + 1].endIndex + 1);
        tokens = tokenize(input);
        x = -1;
        continue;
      } else if (tokens[x].value === "-" && checkNumbers(x, tokens, input)) {
        const result =
          Number(tokens[x - 1].value) - Number(tokens[x + 1].value);
        addStep(
          `${tokens[x - 1].value} - ${tokens[x + 1].value} = ${result}`,
          `${tokens[x - 1].value}-${tokens[x + 1].value}`
        );
        input =
          input.substring(0, tokens[x - 1].startIndex) +
          result +
          input.substring(tokens[x + 1].endIndex + 1);
        tokens = tokenize(input);
        x = -1;
        continue;
      }
    }
    return tokens.length === 1 ? tokens[0].value : input;
  };

  const calculate = (input) => {
    stepNumber.current = 1;
    setSteps([]);

    try {
      input = input.replace(/\s+/g, "");
      if (!/\d/.test(input) && input !== "") {
        throw new Error("Input must contain numbers");
      }
      if (input === "") {
        throw new Error("Please enter an expression");
      }

      addStep(`Original expression: ${input}`);

      input = parentheses(input);
      input = exponents(input);
      input = multiplication(input);
      input = addition(input);

      return round(parseFloat(input));
    } catch (err) {
      throw err;
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError("");
    setResult(null);

    try {
      const calculatedResult = calculate(expression);
      setResult(calculatedResult);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setExpression("(10+5^2)((5*-2)+9-3^3)/2");
    setResult(null);
    setSteps([]);
    setError("");
    stepNumber.current = 1;
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
      <div className="w-full mx-auto p-4 lg:p-8 md:p-8 input_form rounded-lg  space-y-6 mb-3">
        {formError && (
          <p className="text-red-500 text-lg font-semibold w-full">
            {formError}
          </p>
        )}

        <div className="lg:w-[80%] md:w-[80%] w-full mx-auto ">
          <div className="grid grid-cols-12 mt-3   gap-2 md:gap-4 lg:gap-4">
            <div className="col-span-12">
              <div className="w-full  mx-auto p-6 rounded-lg ">
                <div className="space-y-4">
                  {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                      {error}
                    </div>
                  )}

                  <div>
                    <label
                      htmlFor="expression"
                      className="block text-lg font-medium text-gray-700 mb-2"
                    >
                      Mathematical Expression:{" "}
                      <i className="text-sm text-gray-500">
                        ( + - * / ^ . ( ) [ ] {} )
                      </i>
                    </label>
                    <input
                      type="text"
                      id="expression"
                      value={expression}
                      onChange={(e) => setExpression(e.target.value)}
                      className="w-full input "
                      placeholder="Enter mathematical expression"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="mb-6 mt-10 text-center space-x-2">
                  <Button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 px-8 rounded-lg transition duration-200"
                  >
                    {isLoading ? "Calculating..." : "Calculate"}
                  </Button>

                  {result !== null && (
                    <ResetButton
                      onClick={handleReset}
                      className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-8 rounded-lg transition duration-200"
                    >
                      Reset
                    </ResetButton>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:w-[100%] w-full mx-auto ">
        <div className="col-span-12">
          {isLoading && (
            <div className="w-full mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg space-y-6 result">
              <div className="animate-pulse">
                <div className=" w-full h-[30px] bg-gray-300 animate-pulse rounded-[10px] mb-4"></div>
                <div className="w-[75%] h-[20px] bg-gray-300 animate-pulse rounded-[10px] mb-3"></div>
                <div className="w-[50%] h-[20px] bg-gray-300 animate-pulse rounded-[10px] mb-3"></div>
                <div className="w-[25%] h-[20px] bg-gray-300 animate-pulse rounded-[10px]"></div>
              </div>
            </div>
          )}
          {result !== null && !isLoading && (
            <div className="w-full mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg space-y-6 result">
              <div>
                <ResultActions lang={data?.payload?.tech_lang_keys} />

                <div className="  rounded-lg md:p-6 p-1">
                  <h2 className="text-2xl font-bold text-green-800 mb-4">
                    Solution
                  </h2>

                  <div className="mb-6">
                    <p className="text-lg mb-2">
                      <strong>Original Expression:</strong>
                    </p>
                    <p className="md:text-[25px] bg-sky bordered rounded-lg p-3">
                      {expression}
                    </p>
                  </div>

                  <div className="mb-6">
                    <p className="text-lg mb-4">
                      <strong>Step-by-step Solution:</strong>
                    </p>
                    <div className="space-y-3">
                      {steps.map((step, index) => (
                        <div
                          key={index}
                          className="bg-white bordered border-gray-200 rounded-lg p-3"
                        >
                          <p className="font-semibold text-blue-600">
                            Step {step.step}:
                          </p>
                          <p className="md:text-[18px]">
                            {step.highlight ? (
                              <span>
                                {step.text.split(step.highlight)[0]}
                                <span className="bg-yellow-200 px-1 rounded">
                                  {step.highlight}
                                </span>
                                {step.text.split(step.highlight)[1]}
                              </span>
                            ) : (
                              step.text
                            )}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-blue-100 border border-blue-300 rounded-lg p-6">
                    <h3 className="text-xl font-bold text-blue-800 mb-2">
                      Final Answer:
                    </h3>
                    <p className="text-3xl font-bold text-blue-600">{result}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <CalculatorFeedback calName={data?.payload?.tech_calculator_title} />
    </Calculator>
  );
};

export default OrderOfOperationsCalculator;

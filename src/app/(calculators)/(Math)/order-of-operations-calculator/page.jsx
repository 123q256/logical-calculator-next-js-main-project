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
  useOrderOfOperationsCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";
import "../../../../components/styles/CssOrderOfOperationsCalculator.css";

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

const OrderOfOperationsCalculator = () => {
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

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useOrderOfOperationsCalculatorMutation();

  const [formData, setFormData] = useState({
    tech_expression: "(10+5^2)((5*-2)+9-3^3)/2",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");
  const [isCalculating, setIsCalculating] = useState(false);
  const [steps, setSteps] = useState([]);

  // Calculator Logic Functions
  let stepNumber = 1;
  let stepsArray = [];

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

  const tokenize = (input) => {
    const tokens = [];
    for (let x = 0; x < input.length; x++) {
      let char = input.charAt(x);
      if (char === "[" || char === "{") char = "(";
      if (char === "]" || char === "}") char = ")";

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
            !isNaN(Number(tokens[tokens.length - 1]?.value)) ||
            input.charAt(x - 1) === ")")
        ) {
          tokens.push(new Token("*", x, x));
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
          } else break;
        }
        tokens.push(new Token(substring, x, z - 1));
        x = z - 1;
      }
    }

    for (let i = 0, j = 1, k = 2; k < tokens.length; i++, j++, k++)
      if (tokens[i].value === "(" && tokens[k].value === ")")
        tokens.splice(
          i,
          3,
          new Token(tokens[j].value, tokens[i].startIndex, tokens[k].endIndex)
        );
    return tokens;
  };

  const displayValidInput = (
    input,
    startTokenIndex,
    endTokenIndex,
    prefix = "",
    suffix = ""
  ) => {
    let tokens = tokenize(input);
    tokens.forEach((token, i) => {
      if (!isNaN(parseFloat(token.value))) {
        input = input.replace(tokens[i].value, String(round(token.value)));
      }
    });
    tokens = tokenize(input);
    const startIndex = tokens[startTokenIndex].startIndex;
    const endIndex = tokens[endTokenIndex].endIndex;

    const fullExpr = `${prefix}${input.substring(
      0,
      startIndex
    )}${input.substring(startIndex, endIndex + 1)}${input.substring(
      endIndex + 1
    )}${suffix}`;
    const highlightStart =
      prefix.length + input.substring(0, startIndex).length;
    const highlightEnd = highlightStart + (endIndex - startIndex + 1);

    stepsArray.push({
      stepNum: stepNumber++,
      text: fullExpr,
      highlightStart,
      highlightEnd,
    });
  };

  const checkNumbers = (opIndex, tokens) => {
    const num1 = Number(tokens[opIndex - 1].value);
    const num2 = Number(tokens[opIndex + 1].value);
    if (isNaN(num1) || isNaN(num2)) throw new Error("Invalid number");
    return true;
  };

  const exponents = (input, prefix = "", suffix = "") => {
    let tokens = tokenize(input);
    for (let x = 0; x < tokens.length; x++) {
      if (tokens[x].value === "^" && checkNumbers(x, tokens)) {
        displayValidInput(input, x - 1, x + 1, prefix, suffix);
        input =
          input.substring(0, tokens[x - 1].startIndex) +
          Number(tokens[x - 1].value) ** Number(tokens[x + 1].value) +
          input.substring(tokens[x + 1].endIndex + 1);
        tokens = tokenize(input);
        x = -1;
      }
    }
    return input;
  };

  const multiplication = (input, prefix = "", suffix = "") => {
    let tokens = tokenize(input);
    for (let x = 0; x < tokens.length; x++) {
      if (tokens[x].value === "*" && checkNumbers(x, tokens)) {
        displayValidInput(input, x - 1, x + 1, prefix, suffix);
        input =
          input.substring(0, tokens[x - 1].startIndex) +
          Number(tokens[x - 1].value) * Number(tokens[x + 1].value) +
          input.substring(tokens[x + 1].endIndex + 1);
        tokens = tokenize(input);
        x = -1;
      } else if (tokens[x].value === "/" && checkNumbers(x, tokens)) {
        displayValidInput(input, x - 1, x + 1, prefix, suffix);
        input =
          input.substring(0, tokens[x - 1].startIndex) +
          Number(tokens[x - 1].value) / Number(tokens[x + 1].value) +
          input.substring(tokens[x + 1].endIndex + 1);
        tokens = tokenize(input);
        x = -1;
      }
    }
    return input;
  };

  const addition = (input, prefix = "", suffix = "") => {
    let tokens = tokenize(input);
    for (let x = 0; x < tokens.length; x++) {
      if (tokens[x].value === "+" && checkNumbers(x, tokens)) {
        displayValidInput(input, x - 1, x + 1, prefix, suffix);
        input =
          input.substring(0, tokens[x - 1].startIndex) +
          (Number(tokens[x - 1].value) + Number(tokens[x + 1].value)) +
          input.substring(tokens[x + 1].endIndex + 1);
        tokens = tokenize(input);
        x = -1;
      } else if (tokens[x].value === "-" && checkNumbers(x, tokens)) {
        displayValidInput(input, x - 1, x + 1, prefix, suffix);
        input =
          input.substring(0, tokens[x - 1].startIndex) +
          (Number(tokens[x - 1].value) - Number(tokens[x + 1].value)) +
          input.substring(tokens[x + 1].endIndex + 1);
        tokens = tokenize(input);
        x = -1;
      }
    }
    return tokens.length === 1 ? tokens[0].value : input;
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
      let openParenthesisTokenIndex = -1;
      let closedParenthesisIndex = -1;
      let closedParenthesisTokenIndex = -1;

      for (let y = 0; y < tokens.length && closedParenthesisIndex === -1; y++)
        if (tokens[y].value === ")") {
          closedParenthesisIndex = tokens[y].endIndex;
          closedParenthesisTokenIndex = y;
        }

      for (let x = 0; x < tokens.length && openParenthesisIndex === -1; x++)
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

      if (openParenthesisIndex === -1)
        throw new Error("Unbalanced Closed Parenthesis");
      if (closedParenthesisIndex === -1)
        throw new Error("Unbalanced Open Parenthesis");

      displayValidInput(
        input,
        openParenthesisTokenIndex,
        closedParenthesisTokenIndex,
        ""
      );

      const prefix = input.substring(0, openParenthesisIndex + 1);
      const suffix = input.substring(closedParenthesisIndex);
      let insideParentheses = input.substring(
        openParenthesisIndex + 1,
        closedParenthesisIndex
      );

      insideParentheses = exponents(insideParentheses, prefix, suffix);
      insideParentheses = multiplication(insideParentheses, prefix, suffix);
      insideParentheses = addition(insideParentheses, prefix, suffix);

      input =
        input.substring(0, openParenthesisIndex + 1) +
        insideParentheses +
        input.substring(closedParenthesisIndex);
      tokens = tokenize(input);
    }
    return input;
  };

  const calculate = (input) => {
    input = parentheses(input);
    input = exponents(input);
    input = multiplication(input);
    input = addition(input);
    return input;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setSteps([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_expression) {
      setFormError("Please fill in field");
      return;
    }

    setFormError("");
    setIsCalculating(true);
    stepNumber = 1;
    stepsArray = [];

    try {
      let input = formData.tech_expression.replace(/\s+/g, "");

      if (!/\d/.test(input) && input !== "") {
        throw new Error("Input must contain numbers");
      }

      const finalResult = calculate(input);
      const roundedResult = round(parseFloat(finalResult));

      setResult({
        tech_expression: formData.tech_expression,
        tech_final_answer: roundedResult,
      });
      setSteps([...stepsArray]);
      toast.success("Calculate Successfully");
    } catch (err) {
      setFormError(err.message || "Invalid expression");
      toast.error(err.message || "Invalid expression");
      setResult(null);
      setSteps([]);
    } finally {
      setIsCalculating(false);
    }
  };

  const handleReset = () => {
    setFormData({ tech_expression: "(10+5^2)((5*-2)+9-3^3)/2" });
    setResult(null);
    setSteps([]);
    setFormError("");
  };

  const renderStepWithHighlight = (step) => {
    const { text, highlightStart, highlightEnd } = step;
    const before = text.substring(0, highlightStart);
    const highlight = text.substring(highlightStart, highlightEnd);
    const after = text.substring(highlightEnd);

    return (
      <>
        {before}
        <span className="text-[#2845F5] font-semibold">{highlight}</span>
        {after}
      </>
    );
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
      <form className="row" onSubmit={handleSubmit}>
        <div className="w-full mx-auto p-4 lg:p-8 md:p-8 input_form rounded-lg space-y-6 mb-3">
          {formError && (
            <p className="text-red-500 text-lg font-semibold w-full">
              {formError}
            </p>
          )}

          <div className="lg:w-[60%] md:w-[60%] w-full mx-auto ">
            <div className="grid grid-cols-12 gap-2 md:gap-4">
              <div className="col-span-12">
                <label htmlFor="tech_expression" className="label">
                  {data?.payload?.tech_lang_keys["1"]} : (
                  {data?.payload?.tech_lang_keys["3"]} + - * / ^ r . ( ) [ ] {})
                </label>
                <input
                  type="text"
                  name="tech_expression"
                  id="tech_expression"
                  className="input my-2"
                  placeholder="(10+5^2)((5*-2)+9-3^3)/2"
                  aria-label="input"
                  value={formData.tech_expression}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
          <div className="mb-6 mt-10 text-center space-x-2">
            <Button type="submit" isLoading={roundToTheNearestLoading}>
              {data?.payload?.tech_lang_keys["calculate"] ?? "Calculate"}
            </Button>
            {result && (
              <ResetButton type="button" onClick={handleReset}>
                {data?.payload?.tech_lang_keys["locale"] === "en"
                  ? "RESET"
                  : data?.payload?.tech_lang_keys["reset"] || "RESET"}
              </ResetButton>
            )}
          </div>
        </div>

        <div className="lg:w-[100%] w-full mx-auto ">
          <div className="col-span-12">
            {isLoading && (
              <div className="result_calculator rounded-lg p-6">
                <div className="animate-pulse space-y-4">
                  <div className="h-6 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                </div>
              </div>
            )}

            {result !== null && !isLoading && (
              <div className="w-full result mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg space-y-6 result">
                <ResultActions lang={data?.payload?.tech_lang_keys} />
                <div className="rounded-lg  flex items-center justify-center">
                  <div className="w-full bg-light-blue result p-3 rounded-lg ">
                    <div className="flex justify-center">
                      <div className="w-full   text-lg">
                        <p className="mt-2 text-2xl font-bold text-[#2845F5]">
                          Result: {result?.tech_final_answer}
                        </p>
                        <p className="mt-4">
                          <strong>Solution</strong>
                        </p>
                        <p className="mt-2">Your Input:</p>
                        <p className="mt-1 font-mono">
                          {result?.tech_expression}
                        </p>
                        <p className="mt-4 font-semibold">
                          The steps and solution are shown below:
                        </p>
                        <div className="mt-3 space-y-2" id="stepsAndSolution">
                          {steps.map((step, index) => (
                            <p key={index} className="mt-2">
                              <strong>Step {step.stepNum}</strong> :{" "}
                              {renderStepWithHighlight(step)}
                            </p>
                          ))}
                        </div>
                        <div className="mt-6 pt-4 border-t-2 border-blue-300">
                          <p className="text-xl">
                            <strong>Answer : </strong>
                            <span className="text-[#2845F5] font-bold text-2xl">
                              {result?.tech_final_answer}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </form>
      {result && (
        <CalculatorFeedback calName={data?.payload?.tech_calculator_title} />
      )}
    </Calculator>
  );
};

export default OrderOfOperationsCalculator;

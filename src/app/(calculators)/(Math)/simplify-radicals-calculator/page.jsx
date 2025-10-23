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

// Helper Functions
function isInteger(num) {
  return Number.isInteger(num);
}

function compareNumbers(x, y) {
  return x - y;
}

function primesimplify(num) {
  var root = Math.sqrt(num),
    result = arguments[1] || [],
    x = 2;

  if (num % x) {
    x = 3;
    while (num % x && (x = x + 2) < root) {}
  }
  x = x <= root ? x : num;
  result.push(x);

  return x === num ? result : primesimplify(num / x, result);
}

function forpower(primeFactors) {
  var i,
    array = [],
    power = 1,
    isShorter = false,
    exponents = [];
  for (i = 0; i < primeFactors.length; i++) {
    if (
      i != primeFactors.length - 1 &&
      primeFactors[i] == primeFactors[i + 1]
    ) {
      power++;
    } else {
      if (power != 1) {
        array.push(primeFactors[i] + "^" + power);
        isShorter = true;
      } else {
        array.push(primeFactors[i]);
      }
      exponents.push(power);
      power = 1;
    }
  }
  return [array, isShorter, exponents];
}

function getSimplification(x, root) {
  var simplification = [];
  var primeFactors = primesimplify(x);
  var to_power;
  var valuesPulled = [];
  var i, j;
  var numberInFront = 1,
    numberUnder = 1;
  var newRoot, newUnder;
  var to_powerUnderAfter;
  var factorizationRoot, factorizationUnder;
  var simplifyRoot = [],
    divideRootBy = 1;

  if (primeFactors.length === 1) {
    simplification.push("prime");
  } else {
    simplification.push(primeFactors.join(" * "));
    to_power = forpower(primeFactors);

    if (to_power[1]) {
      simplification.push(to_power[0].join(" * "));

      for (i = 0; i < to_power[2].length; i++) {
        for (j = 0; j < Math.floor(to_power[2][i] / root); j++) {
          valuesPulled.push(to_power[0][i][0]);
        }
      }

      for (i = 0; i < valuesPulled.length; i++) {
        numberInFront *= valuesPulled[i];
      }
      numberUnder = Math.round(x / Math.pow(numberInFront, root), 5);

      factorizationRoot = primesimplify(root);
      factorizationUnder = primesimplify(numberUnder);
      to_powerUnderAfter = forpower(factorizationUnder);

      for (i = 0; i < factorizationRoot.length; i++) {
        for (j = 0; j < to_powerUnderAfter[2].length; j++) {
          if (to_powerUnderAfter[2][j] % factorizationRoot[i] == 0) {
            simplifyRoot.push(1);
          } else {
            simplifyRoot.push(0);
          }
        }
        if (!simplifyRoot.includes(0)) {
          divideRootBy *= factorizationRoot[i];
          for (j = 0; j < to_powerUnderAfter[2].length; j++) {
            to_powerUnderAfter[2][j] /= factorizationRoot[i];
          }
        }
        simplifyRoot = [];
      }

      newRoot = Math.round(root / divideRootBy, 5);
      newUnder = Math.round(Math.pow(numberUnder, 1 / divideRootBy), 5);

      if (numberInFront != 1 || newRoot !== root) {
        simplification.push([]);
        simplification[2].push(numberInFront);
        simplification[2].push(to_powerUnderAfter[0].join(" * "));
        if (newRoot !== root) {
          simplification.push([]);
          simplification[3].push(numberInFront);
          simplification[3].push(newRoot);
          simplification[3].push(newUnder);
        }
      }
    }
  }
  return simplification;
}

function simplify_gcf(a, b) {
  a = Math.abs(a);
  b = Math.abs(b);
  if (b > a) {
    var temp = a;
    a = b;
    b = temp;
  }
  for (;;) {
    if (b == 0) {
      return a;
    }
    a = a % b;
    if (a == 0) {
      return b;
    }
    b = b % a;
  }
}

function simply_lcm(a, b) {
  return Math.abs((a * b) / simplify_gcf(a, b));
}

const SimplifyRadicalsCalculator = () => {
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

  // RTK mutation hook   // data get
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useMidpointCalculatorMutation();
  // data get

  const [formData, setFormData] = useState({
    tech_expression_unit: "2",
    tech_num1: "5",
    tech_num2: "7",
    tech_num3: "2",
    tech_num4: "7",
    tech_num5: "7",
    tech_num6: "2",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const calculateRadicals = () => {
    const a = parseFloat(formData.tech_num1) || 1;
    const b = parseFloat(formData.tech_num2) || 0;
    const c = parseFloat(formData.tech_num4) || 1;
    const d = parseFloat(formData.tech_num5) || 0;
    const n = parseFloat(formData.tech_num3) || 2;
    const m = parseFloat(formData.tech_num6) || 2;
    const option = parseInt(formData.tech_expression_unit);

    let results = [];
    let newRoot = n;
    let simplification_first, simplification_second;
    let numberwrite = n;
    let mWrite = m;
    let num1Write, cWrite;
    let operation = "";
    let expresssion_first, expression_second;

    if (n == 2) numberwrite = "";
    if (m == 2) mWrite = "";

    if (isNaN(a) || a == 1) {
      num1Write = "";
    } else {
      num1Write = a + " × ";
    }

    if (isNaN(c) || c == 1) {
      cWrite = "";
    } else {
      cWrite = c + " × ";
    }

    expresssion_first = [a, n, b];
    expression_second = [c, m, d];

    if (!isNaN(b)) {
      if (isInteger(Math.pow(b, 1 / n)) && option == 1) {
        results.push(
          `${num1Write}${numberwrite ? numberwrite : ""}√${b} = ${
            a * Math.pow(b, 1 / n)
          }`
        );
        return results;
      } else {
        if (!isNaN(n)) {
          simplification_first = getSimplification(b, n);
        }
      }
    }

    if (!isNaN(d)) {
      if (!isNaN(m)) {
        simplification_second = getSimplification(d, m);
      }
    }

    // Option 1: Single radical simplification
    if (option == 1) {
      let fline = `${num1Write}${numberwrite ? numberwrite : ""}√${b}`;

      if (simplification_first && simplification_first.length > 2) {
        fline += ` = ${num1Write}${numberwrite ? numberwrite : ""}√(${
          simplification_first[1]
        }) =`;
        results.push(fline);

        let sline = `= ${num1Write}${simplification_first[2][0]} × ${
          numberwrite ? numberwrite : ""
        }√(${simplification_first[2][1]})`;
        results.push(sline);

        expresssion_first[0] = a * simplification_first[2][0];
        expresssion_first[2] = b / Math.pow(simplification_first[2][0], n);

        if (expresssion_first[0] == 1) {
          expresssion_first[0] = "";
        } else {
          expresssion_first[0] += " × ";
        }
        if (expresssion_first[1] == 2) {
          expresssion_first[1] = "";
        }

        let lline = `= ${expresssion_first[0]}${
          expresssion_first[1] ? expresssion_first[1] : ""
        }√${expresssion_first[2]}`;
        if (lline !== sline) {
          results.push(lline);
        }
      } else {
        results.push(fline);
        results.push("Cannot be simplified further.");
      }
    }

    // Option 2: Addition
    else if (option == 2) {
      if (c >= 0) {
        operation = " + ";
      } else {
        operation = " ";
      }

      if (isInteger(Math.pow(b, 1 / n)) && isInteger(Math.pow(d, 1 / m))) {
        results.push(
          `${num1Write}${
            numberwrite ? numberwrite : ""
          }√${b}${operation}${cWrite}${mWrite ? mWrite : ""}√${d} = ${
            a * Math.pow(b, 1 / n)
          } + ${c * Math.pow(d, 1 / m)} = ${
            a * Math.pow(b, 1 / n) + c * Math.pow(d, 1 / m)
          }`
        );
      } else if (b == d && n == m) {
        results.push(
          `${num1Write}${
            numberwrite ? numberwrite : ""
          }√${b}${operation}${cWrite}${mWrite ? mWrite : ""}√${d} = ${a + c}${
            numberwrite ? numberwrite : ""
          }√${b}`
        );
      } else {
        results.push(
          `${num1Write}${
            numberwrite ? numberwrite : ""
          }√${b}${operation}${cWrite}${mWrite ? mWrite : ""}√${d}`
        );
        results.push("Cannot be simplified further.");
      }
    }

    // Option 3: Multiplication
    else if (option == 3) {
      if (isInteger(Math.pow(b, 1 / n)) && isInteger(Math.pow(d, 1 / m))) {
        results.push(
          `${num1Write}${numberwrite ? numberwrite : ""}√${b} × ${cWrite}${
            mWrite ? mWrite : ""
          }√${d} = ${num1Write}${Math.pow(b, 1 / n)} × ${cWrite}${Math.pow(
            d,
            1 / m
          )} = ${a * Math.pow(b, 1 / n) * c * Math.pow(d, 1 / m)}`
        );
      } else {
        newRoot = simply_lcm(n, m);
        let newRootDisplay = newRoot == 2 ? "" : newRoot;
        let number_in_front = a * c;
        let number_in_front_display =
          number_in_front == 1 ? "" : number_in_front + " × ";

        results.push(
          `${num1Write}${numberwrite ? numberwrite : ""}√${b} × ${cWrite}${
            mWrite ? mWrite : ""
          }√${d} = ${number_in_front_display}${newRootDisplay}√(${Math.pow(
            b,
            simply_lcm(n, m) / n
          )} × ${Math.pow(
            d,
            simply_lcm(n, m) / m
          )}) = ${number_in_front_display}${newRootDisplay}√${
            Math.pow(b, simply_lcm(n, m) / n) *
            Math.pow(d, simply_lcm(n, m) / m)
          }`
        );
      }
    }

    // Option 4: Division
    else if (option == 4) {
      if (n == m && b == d) {
        results.push(
          `(${num1Write}${numberwrite ? numberwrite : ""}√${b}) / (${cWrite}${
            mWrite ? mWrite : ""
          }√${d}) = ${a / c}`
        );
      } else if (
        isInteger(Math.pow(b, 1 / n)) &&
        isInteger(Math.pow(d, 1 / m))
      ) {
        results.push(
          `(${num1Write}${numberwrite ? numberwrite : ""}√${b}) / (${cWrite}${
            mWrite ? mWrite : ""
          }√${d}) = (${num1Write}${Math.pow(b, 1 / n)}) / (${cWrite}${Math.pow(
            d,
            1 / m
          )}) = ${Math.round(
            (a * Math.pow(b, 1 / n)) / (c * Math.pow(d, 1 / m)),
            3
          )}`
        );
      } else {
        results.push(
          `(${num1Write}${numberwrite ? numberwrite : ""}√${b}) / (${cWrite}${
            mWrite ? mWrite : ""
          }√${d})`
        );
        results.push("Result requires further calculation steps.");
      }
    }

    return results;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!formData.tech_expression_unit) {
      setFormError("Please fill in input.");
      setIsLoading(false);
      return;
    }

    setFormError("");

    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const calculationResults = calculateRadicals();
      setResult({
        steps: calculationResults,
        tech_expression_unit: formData.tech_expression_unit,
        tech_num1: formData.tech_num1,
        tech_num2: formData.tech_num2,
        tech_num3: formData.tech_num3,
        tech_num4: formData.tech_num4,
        tech_num5: formData.tech_num5,
        tech_num6: formData.tech_num6,
      });
    } catch (err) {
      setFormError("Calculation error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      tech_expression_unit: "2",
      tech_num1: "5",
      tech_num2: "7",
      tech_num3: "2",
      tech_num4: "7",
      tech_num5: "7",
      tech_num6: "2",
    });
    setResult(null);
    setFormError(null);
  };

  const renderMathExpression = () => {
    const option = formData.tech_expression_unit;
    if (option === "1") {
      return "a ⁿ√b";
    } else if (option === "2") {
      return "a ⁿ√b + c ᵐ√d = ?";
    } else if (option === "3") {
      return "a ⁿ√b × c ᵐ√d = ?";
    } else if (option === "4") {
      return "(a ⁿ√b) / (c ᵐ√d) = ?";
    }
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
        <div className="rounded-lg  ">
          <div className="space-y-6">
            {formError && (
              <p className="text-red-500 text-lg font-semibold text-center bg-red-50 p-3 rounded">
                {formError}
              </p>
            )}

            <div className="max-w-lg mx-auto space-y-6">
              <div>
                <label
                  htmlFor="tech_expression_unit"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Expression Type:
                </label>
                <select
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  name="tech_expression_unit"
                  id="tech_expression_unit"
                  value={formData.tech_expression_unit}
                  onChange={handleChange}
                >
                  <option value="1">Single Radical</option>
                  <option value="2">Addition</option>
                  <option value="3">Multiplication</option>
                  <option value="4">Division</option>
                </select>
              </div>

              <div className="text-center p-4 bg-sky bordered rounded-lg">
                <p className="text-xl font-mono text-blue-800">
                  {renderMathExpression()}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="tech_num1"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    a (Optional):
                  </label>
                  <input
                    type="number"
                    step="any"
                    name="tech_num1"
                    id="tech_num1"
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="5"
                    value={formData.tech_num1}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label
                    htmlFor="tech_num2"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    b :
                  </label>
                  <input
                    type="number"
                    step="any"
                    name="tech_num2"
                    id="tech_num2"
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="7"
                    value={formData.tech_num2}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label
                    htmlFor="tech_num3"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    n :
                  </label>
                  <input
                    type="number"
                    step="any"
                    name="tech_num3"
                    id="tech_num3"
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="2"
                    value={formData.tech_num3}
                    onChange={handleChange}
                  />
                </div>

                {(formData.tech_expression_unit === "2" ||
                  formData.tech_expression_unit === "3" ||
                  formData.tech_expression_unit === "4") && (
                  <>
                    <div>
                      <label
                        htmlFor="tech_num4"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        c (Optional):
                      </label>
                      <input
                        type="number"
                        step="any"
                        name="tech_num4"
                        id="tech_num4"
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="7"
                        value={formData.tech_num4}
                        onChange={handleChange}
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="tech_num5"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        d :
                      </label>
                      <input
                        type="number"
                        step="any"
                        name="tech_num5"
                        id="tech_num5"
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="7"
                        value={formData.tech_num5}
                        onChange={handleChange}
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="tech_num6"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        m :
                      </label>
                      <input
                        type="number"
                        step="any"
                        name="tech_num6"
                        id="tech_num6"
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="2"
                        value={formData.tech_num6}
                        onChange={handleChange}
                      />
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="text-center space-x-4">
              <Button
                onClick={handleSubmit}
                disabled={isLoading}
                className="bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? "Calculating..." : "Calculate"}
              </Button>

              {result && (
                <ResetButton
                  onClick={handleReset}
                  className="bg-gray-600 text-white px-8 py-3 rounded-md hover:bg-gray-700 transition-colors"
                >
                  Reset
                </ResetButton>
              )}
            </div>
          </div>
        </div>
      </div>
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
      {result && !isLoading && (
        <div className="w-full mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg space-y-6 result">
          <div>
            <ResultActions lang={data?.payload?.tech_lang_keys} />

            <div className=" rounded-lg  md:p-8 p-2">
              <h2 className="text-2xl font-bold mb-6 text-black">
                Solution Steps:
              </h2>
              <div className="space-y-4">
                {result.steps.map((step, index) => (
                  <div
                    key={index}
                    className="p-4 bg-[#2845F5] rounded-lg flex justify-center"
                  >
                    <p className="md:text-[25px] font-bold text-white">
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <CalculatorFeedback calName={data?.payload?.tech_calculator_title} />
    </Calculator>
  );
};

export default SimplifyRadicalsCalculator;

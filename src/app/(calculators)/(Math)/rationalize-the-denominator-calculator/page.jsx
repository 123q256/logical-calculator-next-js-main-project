"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";

import { useGetSingleCalculatorDetailsMutation ,useRationalizeTheDenominatorCalculatorMutation } from "../../../../redux/services/calculator/calculatorApi";
import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency";
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const RationalizeTheDenominatorCalculator = () => {
  const pathname = usePathname();
  const parts = pathname.split("/").filter(Boolean);
  
  let url = "";
  
  if (parts.length === 1) {
    url = parts[0];
  } else {
    url = parts[0] + "/" + parts[1];
  }

  const [getSingleCalculatorDetails, { data, error, isLoading }] =
    useGetSingleCalculatorDetailsMutation();
  
  const handleFetchDetails = async () => {
    try {
      await getSingleCalculatorDetails({ tech_calculator_link: url });
    } catch (err) {
      console.error("Error fetching calculator details:", err);
    }
  };

  useEffect(() => {
    handleFetchDetails();
  }, [url]);

  const [formData, setFormData] = useState({
    tech_type: "first",
    tech_operations: "1",
    tech_a: "15",
    tech_b: "13",
    tech_n: "11",
    tech_c: "7",
    tech_d: "5",
    tech_m: "4",
    tech_x: "7",
    tech_y: "13",
    tech_k: "5",
    tech_u: "5",
    tech_n1: "x^3-2x+1",
    tech_d1: "x^2-1",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");
  const [calculationResult, setCalculationResult] = useState({
    steps: [],
    finalAnswer: ""
  });

  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useRationalizeTheDenominatorCalculatorMutation();

  // Utility Functions
  const roundPrice = (rnum, rlength) => {
    const str = rnum.toString();
    const myarr = str.split(".");
    if (myarr.length === 1) {
      return rnum;
    } else if (myarr.length === 2) {
      const newnumber = Math.ceil(rnum * Math.pow(10, rlength - 1)) / Math.pow(10, rlength - 1);
      return parseFloat(newnumber.toFixed(rlength));
    }
    return rnum;
  };

  const isInteger = (_n) => {
    return _n % 1 === 0;
  };

  const find_gcf = (a, b) => {
    a = Math.abs(a);
    b = Math.abs(b);
    if (b > a) {
      const temp = a;
      a = b;
      b = temp;
    }
    for (;;) {
      if (b === 0) {
        return a;
      }
      a = a % b;
      if (a === 0) {
        return b;
      }
      b = b % a;
    }
  };

  const find_lcm = (a, b) => {
    return Math.abs((a * b) / find_gcf(a, b));
  };

  // Fixed primeFactorization function
const primeFactorization = (num, result = []) => {
  const root = Math.sqrt(num);
  let x = 2;

  if (num % x) {
    x = 3;
    while ((num % x) && ((x = x + 2) < root)) {}
  }
  x = (x <= root) ? x : num;
  result.push(x);

  return (x === num) ? result : primeFactorization(num / x, result);
};

const toPower = (primeFactors) => {
  let array = [];
  let power = 1;
  let isShorter = false;
  let exponents = [];
  
  for (let i = 0; i < primeFactors.length; i++) {
    if (i !== primeFactors.length - 1 && primeFactors[i] === primeFactors[i + 1]) {
      power++;
    } else {
      if (power !== 1) {
        array.push(primeFactors[i]);
        isShorter = true;
      } else {
        array.push(primeFactors[i]);
      }
      exponents.push(power);
      power = 1;
    }
  }
  return [array, isShorter, exponents];
};

  const getSimplification = (x, root) => {
    let simplification = [];
    const primeFactors = primeFactorization(x);
    let to_power;
    let valuesPulled = [];
    let numberInFront = 1,
      numberUnder = 1;
    let newRoot, newUnder;
    let to_powerUnderAfter;
    let factorizationRoot, factorizationUnder;
    let simplifyRoot = [],
      divideRootBy = 1;
    let index = 1;

    if (primeFactors.length === 1) {
      simplification.push('prime');
    } else {
      simplification.push(primeFactors.join(' * '));
      to_power = toPower(primeFactors);
      index += 1;

      if (to_power[1]) {
        simplification.push(to_power[0].join(' * '));

        for (let i = 0; i < to_power[2].length; i++) {
          for (let j = 0; j < Math.floor(to_power[2][i] / root); j++) {
            valuesPulled.push(to_power[0][i]);
          }
        }

        for (let i = 0; i < valuesPulled.length; i++) {
          numberInFront *= valuesPulled[i];
        }
        numberUnder = roundPrice(x / Math.pow(numberInFront, root), 4);

        factorizationRoot = primeFactorization(root);
        factorizationUnder = primeFactorization(numberUnder);
        to_powerUnderAfter = toPower(factorizationUnder);

        for (let i = 0; i < factorizationRoot.length; i++) {
          for (let j = 0; j < to_powerUnderAfter[2].length; j++) {
            if (to_powerUnderAfter[2][j] % factorizationRoot[i] === 0) {
              simplifyRoot.push(1);
            } else {
              simplifyRoot.push(0);
            }
          }
          if (!simplifyRoot.includes(0)) {
            divideRootBy *= factorizationRoot[i];
            for (let j = 0; j < to_powerUnderAfter[2].length; j++) {
              to_powerUnderAfter[2][j] /= factorizationRoot[i];
            }
          }
          simplifyRoot = [];
        }

        newRoot = roundPrice(root / divideRootBy, 4);
        newUnder = roundPrice(Math.pow(numberUnder, 1 / divideRootBy), 4);

        if (numberInFront !== 1 || newRoot !== root) {
          index += 1;
          simplification.push([]);
          simplification[2].push(numberInFront);
          simplification[2].push(to_powerUnderAfter[0].join(' * '));
          if (newRoot !== root) {
            index += 1;
            simplification.push([]);
            simplification[3].push(numberInFront);
            simplification[3].push(newRoot);
            simplification[3].push(newUnder);
          }
        }
      }
    }
    return [simplification, index];
  };

  const getSimplified = (x, root) => {
    const a = x;
    const n = root;
    const simplificationAll = getSimplification(a, n);
    const simplification = simplificationAll[0];

    if (simplificationAll[1] > 3) {
      return simplification[3];
    } else if (simplificationAll[1] > 2) {
      return [simplification[2][0], root, roundPrice(x / Math.pow(simplification[2][0], root), 4)];
    } else {
      return [1, root, x];
    }
  };

  // Main Calculation Function for all 4 expressions
  const performCalculation = () => {
    if (formData.tech_type !== "first") return;

    const expression = parseInt(formData.tech_operations);
    let a = parseFloat(formData.tech_a);
    let b = parseFloat(formData.tech_b);
    let c = parseFloat(formData.tech_c);
    let d = parseFloat(formData.tech_d);
    let n = parseFloat(formData.tech_n);
    let m = parseFloat(formData.tech_m);
    let x = parseFloat(formData.tech_x);
    let y = parseFloat(formData.tech_y);
    let k = parseFloat(formData.tech_k);
    let u = parseFloat(formData.tech_u);
    let z = parseFloat(formData.tech_u); // Using u as z for expression 3

    const steps = [];
    let finalAnswer = "";

    // Handle default values and formatting
    if (isNaN(a) || a === 1) a = 1;
    if (isNaN(x) || x === 1) x = 1;
    if (isNaN(c) || c === 1) c = 1;
    if (isNaN(z) || z === 1) z = 1;

    // Formatting variables
    let aWrite = a === 1 ? '' : a === -1 ? '-' : `${a}`;
    let xWrite = x === 1 ? '' : x === -1 ? '-' : `${x}`;
    let cWrite = c === 1 ? '' : c === -1 ? '-' : `${c}`;
    let zWrite = z === 1 ? '' : z === -1 ? '-' : `${z}`;
    
    let nWrite = n === 2 ? '' : n.toString();
    let mWrite = m === 2 ? '' : m.toString();
    let kWrite = k === 2 ? '' : k.toString();

    let bWrite = b === 1 ? '' : `\\sqrt[${nWrite}]{${b}}`;
    let dWrite = d === 1 ? '' : `\\sqrt[${mWrite}]{${d}}`;
    let yWrite = y === 1 ? '' : `\\sqrt[${kWrite}]{${y}}`;
    let uWrite = u === 1 ? '' : `\\sqrt{${u}}`;

    let signUp = c >= 0 ? ' + ' : ' - ';
    let signDown = z >= 0 ? ' + ' : ' - ';

    // EXPRESSION 1: a√[n]{b} / x√[k]{y}
    if (expression === 1) {
      if (!isNaN(b) && !isNaN(n) && !isNaN(y) && !isNaN(k)) {
        steps.push(`\\frac{${aWrite}${bWrite}}{${xWrite}${yWrite}}`);
        
        if (isInteger(roundPrice(Math.pow(y, 1 / k), 4))) {
          if (isInteger(roundPrice(Math.pow(b, 1 / n), 4))) {
            const bVal = roundPrice(Math.pow(b, 1 / n), 4);
            const yVal = roundPrice(Math.pow(y, 1 / k), 4);
            const result = roundPrice((a * bVal) / (x * yVal), 4);
            finalAnswer = result.toString();
          } else {
            const yVal = roundPrice(Math.pow(y, 1 / k), 4);
            const newA = roundPrice(a / (x * yVal), 4);
            const aWriteNew = newA === 1 ? '' : `${newA}`;
            finalAnswer = `${aWriteNew}${bWrite}`;
          }
        } else {
          // Rationalization needed
          const reducedMultiplier = k === 2 ? `\\sqrt{${y}}` : `\\sqrt[${k}]{${y}^{${k-1}}}`;
          steps.push(`\\frac{${aWrite}${bWrite}}{${xWrite}${yWrite}} \\times \\frac{${reducedMultiplier}}{${reducedMultiplier}}`);
          
          const newRoot = find_lcm(n, k);
          const newRootWrite = newRoot === 2 ? '' : newRoot.toString();
          const simplified = getSimplified(b, n);
          finalAnswer = `${simplified[0]}\\sqrt[${simplified[1]}]{${simplified[2]}}`;
        }
      }
    }

    // EXPRESSION 2: (a√[n]{b} + c√[m]{d}) / x√[k]{y}
    else if (expression === 2) {
      if (!isNaN(b) && !isNaN(n) && !isNaN(d) && !isNaN(m) && !isNaN(y) && !isNaN(k)) {
        steps.push(`\\frac{${aWrite}${bWrite}${signUp}${cWrite}${dWrite}}{${xWrite}${yWrite}}`);
        
        if (isInteger(roundPrice(Math.pow(y, 1 / k), 4))) {
          if (isInteger(roundPrice(Math.pow(b, 1 / n), 4)) && isInteger(roundPrice(Math.pow(d, 1 / m), 4))) {
            const bVal = roundPrice(Math.pow(b, 1 / n), 4);
            const dVal = roundPrice(Math.pow(d, 1 / m), 4);
            const yVal = roundPrice(Math.pow(y, 1 / k), 4);
            const result = roundPrice((a * bVal + c * dVal) / (x * yVal), 4);
            finalAnswer = result.toString();
          } else if (isInteger(roundPrice(Math.pow(b, 1 / n), 4))) {
            const bVal = roundPrice(Math.pow(b, 1 / n), 4);
            const yVal = roundPrice(Math.pow(y, 1 / k), 4);
            const result1 = roundPrice((a * bVal) / (x * yVal), 4);
            const cNew = roundPrice(c / (x * yVal), 4);
            finalAnswer = `${result1}${signUp}${cNew}${dWrite}`;
          } else if (isInteger(roundPrice(Math.pow(d, 1 / m), 4))) {
            const dVal = roundPrice(Math.pow(d, 1 / m), 4);
            const yVal = roundPrice(Math.pow(y, 1 / k), 4);
            const result2 = roundPrice((c * dVal) / (x * yVal), 4);
            const aNew = roundPrice(a / (x * yVal), 4);
            finalAnswer = `${aNew}${bWrite}${signUp}${result2}`;
          } else {
            const yVal = roundPrice(Math.pow(y, 1 / k), 4);
            const aNew = roundPrice(a / (x * yVal), 4);
            const cNew = roundPrice(c / (x * yVal), 4);
            finalAnswer = `${aNew}${bWrite}${signUp}${cNew}${dWrite}`;
          }
        } else {
          // Rationalization needed
          const reducedMultiplier = k === 2 ? `\\sqrt{${y}}` : `\\sqrt[${k}]{${y}^{${k-1}}}`;
          steps.push(`\\frac{${aWrite}${bWrite}${signUp}${cWrite}${dWrite}}{${xWrite}${yWrite}} \\times \\frac{${reducedMultiplier}}{${reducedMultiplier}}`);
          
          const newRoot1st = find_lcm(n, k);
          const newRoot2nd = find_lcm(m, k);
          const simplified1st = getSimplified(b, n);
          const simplified2nd = getSimplified(d, m);
          
          finalAnswer = `${simplified1st[0]}\\sqrt[${simplified1st[1]}]{${simplified1st[2]}}${signUp}${simplified2nd[0]}\\sqrt[${simplified2nd[1]}]{${simplified2nd[2]}}`;
        }
      }
    }

    // EXPRESSION 3: a√b / (x√y + z√u)
    else if (expression === 3) {
      if (!isNaN(b) && !isNaN(y) && !isNaN(u)) {
        steps.push(`\\frac{${aWrite}\\sqrt{${b}}}{${xWrite}\\sqrt{${y}}${signDown}${zWrite}\\sqrt{${u}}}`);
        
        if (isInteger(roundPrice(Math.pow(y, 1 / 2), 4)) && isInteger(roundPrice(Math.pow(u, 1 / 2), 4))) {
          const yVal = roundPrice(Math.pow(y, 1 / 2), 4);
          const uVal = roundPrice(Math.pow(u, 1 / 2), 4);
          
          if (isInteger(roundPrice(Math.pow(b, 1 / 2), 4))) {
            const bVal = roundPrice(Math.pow(b, 1 / 2), 4);
            const result = roundPrice((a * bVal) / (x * yVal + z * uVal), 4);
            finalAnswer = result.toString();
          } else {
            const result = roundPrice(a / (x * yVal + z * uVal), 4);
            finalAnswer = `${result}\\sqrt{${b}}`;
          }
        } else if (y === u) {
          // Special case when y = u
          const denominator = x + z;
          steps.push(`\\frac{${aWrite}\\sqrt{${b}}}{${denominator}\\sqrt{${y}}}`);
          const result = roundPrice(a / denominator, 4);
          finalAnswer = `${result}\\sqrt{${b}}`;
        } else {
          // Rationalization using conjugate
          const conjugate = `${xWrite}\\sqrt{${y}}${signDown === ' + ' ? ' - ' : ' + '}${Math.abs(z)}\\sqrt{${u}}`;
          steps.push(`\\frac{${aWrite}\\sqrt{${b}}}{${xWrite}\\sqrt{${y}}${signDown}${zWrite}\\sqrt{${u}}} \\times \\frac{${conjugate}}{${conjugate}}`);
          
          const numerator = a * x * b;
          const denominator = x * x * y - z * z * u;
          const result = roundPrice(numerator / denominator, 4);
          finalAnswer = `${result}\\sqrt{${b}}`;
        }
      }
    }

    // EXPRESSION 4: (a√b + c√d) / (x√y + z√u)
    else if (expression === 4) {
      if (!isNaN(b) && !isNaN(d) && !isNaN(y) && !isNaN(u)) {
        steps.push(`\\frac{${aWrite}\\sqrt{${b}}${signUp}${cWrite}\\sqrt{${d}}}{${xWrite}\\sqrt{${y}}${signDown}${zWrite}\\sqrt{${u}}}`);
        
        if (isInteger(roundPrice(Math.pow(y, 1 / 2), 4)) && isInteger(roundPrice(Math.pow(u, 1 / 2), 4))) {
          const yVal = roundPrice(Math.pow(y, 1 / 2), 4);
          const uVal = roundPrice(Math.pow(u, 1 / 2), 4);
          
          if (isInteger(roundPrice(Math.pow(b, 1 / 2), 4)) && isInteger(roundPrice(Math.pow(d, 1 / 2), 4))) {
            const bVal = roundPrice(Math.pow(b, 1 / 2), 4);
            const dVal = roundPrice(Math.pow(d, 1 / 2), 4);
            const result = roundPrice((a * bVal + c * dVal) / (x * yVal + z * uVal), 4);
            finalAnswer = result.toString();
          } else if (isInteger(roundPrice(Math.pow(b, 1 / 2), 4))) {
            const bVal = roundPrice(Math.pow(b, 1 / 2), 4);
            const result1 = roundPrice((a * bVal) / (x * yVal + z * uVal), 4);
            const result2 = roundPrice(c / (x * yVal + z * uVal), 4);
            finalAnswer = `${result1}${signUp}${result2}\\sqrt{${d}}`;
          } else if (isInteger(roundPrice(Math.pow(d, 1 / 2), 4))) {
            const dVal = roundPrice(Math.pow(d, 1 / 2), 4);
            const result1 = roundPrice(a / (x * yVal + z * uVal), 4);
            const result2 = roundPrice((c * dVal) / (x * yVal + z * uVal), 4);
            finalAnswer = `${result1}\\sqrt{${b}}${signUp}${result2}`;
          } else {
            const result1 = roundPrice(a / (x * yVal + z * uVal), 4);
            const result2 = roundPrice(c / (x * yVal + z * uVal), 4);
            finalAnswer = `${result1}\\sqrt{${b}}${signUp}${result2}\\sqrt{${d}}`;
          }
        } else if (y === u) {
          // Special case when y = u
          const denominator = x + z;
          steps.push(`\\frac{${aWrite}\\sqrt{${b}}${signUp}${cWrite}\\sqrt{${d}}}{${denominator}\\sqrt{${y}}}`);
          const result1 = roundPrice(a / denominator, 4);
          const result2 = roundPrice(c / denominator, 4);
          finalAnswer = `${result1}\\sqrt{${b}}${signUp}${result2}\\sqrt{${d}}`;
        } else if (b === d) {
          // Special case when b = d
          const numeratorCoeff = a + c;
          steps.push(`\\frac{${numeratorCoeff}\\sqrt{${b}}}{${xWrite}\\sqrt{${y}}${signDown}${zWrite}\\sqrt{${u}}}`);
          // Continue with expression 3 logic
          const conjugate = `${xWrite}\\sqrt{${y}}${signDown === ' + ' ? ' - ' : ' + '}${Math.abs(z)}\\sqrt{${u}}`;
          steps.push(`\\frac{${numeratorCoeff}\\sqrt{${b}}}{${xWrite}\\sqrt{${y}}${signDown}${zWrite}\\sqrt{${u}}} \\times \\frac{${conjugate}}{${conjugate}}`);
          
          const numerator = numeratorCoeff * x * b;
          const denominator = x * x * y - z * z * u;
          const result = roundPrice(numerator / denominator, 4);
          finalAnswer = `${result}\\sqrt{${b}}`;
        } else {
          // General rationalization using conjugate
          const conjugate = `${xWrite}\\sqrt{${y}}${signDown === ' + ' ? ' - ' : ' + '}${Math.abs(z)}\\sqrt{${u}}`;
          steps.push(`\\frac{${aWrite}\\sqrt{${b}}${signUp}${cWrite}\\sqrt{${d}}}{${xWrite}\\sqrt{${y}}${signDown}${zWrite}\\sqrt{${u}}} \\times \\frac{${conjugate}}{${conjugate}}`);
          
          // Simplified result
          const denominator = x * x * y - z * z * u;
          const result1 = roundPrice((a * x * b - a * z * Math.sqrt(b * u)) / denominator, 4);
          const result2 = roundPrice((c * x * Math.sqrt(b * d) - c * z * d) / denominator, 4);
          finalAnswer = `${result1}${signUp}${result2}`;
        }
      }
    }

    setCalculationResult({
      steps: steps,
      finalAnswer: finalAnswer
    });
  };

  useEffect(() => {
    if (formData.tech_type === "first") {
      performCalculation();
    }
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_type) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_type: formData.tech_type,
        tech_operations: formData.tech_operations,
        tech_a: formData.tech_a,
        tech_b: formData.tech_b,
        tech_n: formData.tech_n,
        tech_c: formData.tech_c,
        tech_d: formData.tech_d,
        tech_m: formData.tech_m,
        tech_x: formData.tech_x,
        tech_y: formData.tech_y,
        tech_k: formData.tech_k,
        tech_u: formData.tech_u,
        tech_n1: formData.tech_n1,
        tech_d1: formData.tech_d1,
      }).unwrap();
           setResult(response?.payload); // Assuming the response has 'lovePercentage'
            toast.success("Successfully Calculated");
          } catch (err) {
            setFormError(err.data.payload.error);
            toast.error(err.data.payload.error);
          }
  };

  const handleReset = () => {
    setFormData({
      tech_type: "first",
      tech_operations: "1",
      tech_a: "15",
      tech_b: "13",
      tech_n: "11",
      tech_c: "7",
      tech_d: "5",
      tech_m: "4",
      tech_x: "7",
      tech_y: "13",
      tech_k: "5",
      tech_u: "5",
      tech_n1: "x^3-2x+1",
      tech_d1: "x^2-1",
    });
    setResult(null);
    setFormError(null);
    setCalculationResult({ steps: [], finalAnswer: "" });
  };

  const [currency, setCurrency] = useState({
    code: "USD",
    symbol: "$",
    name: "US Dollar",
  });

  useEffect(() => {
    const fetchCurrency = async () => {
      const result = await getUserCurrency();
      if (result) {
        setCurrency(result);
      }
    };
    fetchCurrency();
  }, []);

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
          path: pathname,
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
            <div className="grid grid-cols-12 mt-3 gap-2 md:gap-4 lg:gap-4">
              <div className="col-span-12 flex items-center justify-evenly">
                <p className="font-s-14 text-blue"><strong>{data?.payload?.tech_lang_keys[1]}:</strong></p>
                <p id="fInput">
                  <label className="pe-2 cursor-pointer" htmlFor="first">
                    <input
                      type="radio"
                      name="tech_type"
                      value="first"
                      id="first"
                      className="mr-2 border cursor-pointer"
                      onChange={handleChange}
                      checked={formData.tech_type === 'first'}
                    />
                    <span>{data?.payload?.tech_lang_keys['2']}</span>
                  </label>
                </p>
                <p id="sInput">
                  <label className="pe-2 cursor-pointer" htmlFor="second">
                    <input
                      type="radio"
                      name="tech_type"
                      value="second"
                      id="second"
                      className="mr-2 border cursor-pointer"
                      onChange={handleChange}
                      checked={formData.tech_type === 'second'}
                    />
                    <span>{data?.payload?.tech_lang_keys['3']}</span>
                  </label>
                </p>
              </div>
              
              {formData.tech_type === 'first' && (
                <>
                  <div className="col-span-12" id="simpleMethod">
                    <div className="grid grid-cols-12 gap-2 md:gap-4 lg:gap-4">
                      <div className="col-span-12 px-2">
                        <label htmlFor="tech_operations" className="label">
                          {data?.payload?.tech_lang_keys["4"]}:
                        </label>
                        <div className="mt-2">
                          <select
                            className="input"
                            aria-label="select"
                            name="tech_operations"
                            id="tech_operations"
                            value={formData.tech_operations}
                            onChange={handleChange}
                          >
                            <option value="1">{data?.payload?.tech_lang_keys["5"]}/ {data?.payload?.tech_lang_keys["5"]}</option>
                            <option value="2">{data?.payload?.tech_lang_keys["6"]}/ {data?.payload?.tech_lang_keys["5"]}</option>
                            <option value="3">{data?.payload?.tech_lang_keys["5"]}/ {data?.payload?.tech_lang_keys["6"]}</option>
                            <option value="4">{data?.payload?.tech_lang_keys["6"]} /{data?.payload?.tech_lang_keys["6"]}</option>
                          </select>
                        </div>
                      </div>
                      
                      <div className="col-span-12 px-2 ">
                        {(!formData.tech_operations || formData.tech_operations === "1") && (
                          <p className="col-span-12 text-[25px] mt-0 mt-lg-2 text-center">
                            <InlineMath math={`\\frac{a\\sqrt[n]{b}}{x\\sqrt[k]{y}} = ?`} />
                          </p>
                        )}
                        {formData.tech_operations === "2" && (
                          <p className="col-span-12 text-[25px] mt-0 mt-lg-2 text-center">
                            <InlineMath math={`\\frac{a\\sqrt[n]{b} + c\\sqrt[m]{d}}{x\\sqrt[k]{y}} = ?`} />
                          </p>
                        )}
                        {formData.tech_operations === "3" && (
                          <p className="col-span-12 text-[25px] mt-0 mt-lg-2 text-center">
                            <InlineMath math={`\\frac{a\\sqrt{b}}{x\\sqrt{y} + z\\sqrt{u}} = ?`} />
                          </p>
                        )}
                        {formData.tech_operations === "4" && (
                          <p className="col-span-12 text-[25px] mt-0 mt-lg-2 text-center">
                            <InlineMath math={`\\frac{a\\sqrt{b} + c\\sqrt{d}}{x\\sqrt{y} + z\\sqrt{u}} = ?`} />
                          </p>
                        )}
                      </div>

                      <p className="col-span-12"><strong>{data?.payload?.tech_lang_keys[7]}</strong></p>
                      
                      <div className="col-span-4" id="aInput">
                        <label htmlFor="tech_a" className="label">a:</label>
                        <div className="relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_a"
                            id="tech_a"
                            className="input my-2"
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_a}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      
                      <div className="col-span-4" id="bInput">
                        <label htmlFor="tech_b" className="label">b:</label>
                        <div className="relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_b"
                            id="tech_b"
                            className="input my-2"
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_b}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      
                      {(formData.tech_operations === "1" || formData.tech_operations === "2") && (
                        <div className="col-span-4" id="nInput">
                          <label htmlFor="tech_n" className="label">n:</label>
                          <div className="relative">
                            <input
                              type="number"
                              step="any"
                              name="tech_n"
                              id="tech_n"
                              className="input my-2"
                              aria-label="input"
                              placeholder="00"
                              value={formData.tech_n}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                      )}
                      
                      {(formData.tech_operations === "2" || formData.tech_operations === "4") && (
                        <div className="col-span-4" id="cInput">
                          <label htmlFor="tech_c" className="label">c:</label>
                          <div className="relative">
                            <input
                              type="number"
                              step="any"
                              name="tech_c"
                              id="tech_c"
                              className="input my-2"
                              aria-label="input"
                              placeholder="00"
                              value={formData.tech_c}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                      )}
                      
                      {(formData.tech_operations === "2" || formData.tech_operations === "4") && (
                        <div className="col-span-4" id="dInput">
                          <label htmlFor="tech_d" className="label">d:</label>
                          <div className="relative">
                            <input
                              type="number"
                              step="any"
                              name="tech_d"
                              id="tech_d"
                              className="input my-2"
                              aria-label="input"
                              placeholder="00"
                              value={formData.tech_d}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                      )}
                      
                      {formData.tech_operations === "2" && (
                        <div className="col-span-4" id="mInput">
                          <label htmlFor="tech_m" className="label">m:</label>
                          <div className="relative">
                            <input
                              type="number"
                              step="any"
                              name="tech_m"
                              id="tech_m"
                              className="input my-2"
                              aria-label="input"
                              placeholder="00"
                              value={formData.tech_m}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                      )}
                      
                      <p className="col-span-12"><strong>{data?.payload?.tech_lang_keys[8]}</strong></p>
                      
                      <div className="col-span-4" id="xInput">
                        <label htmlFor="tech_x" className="label">x:</label>
                        <div className="relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_x"
                            id="tech_x"
                            className="input my-2"
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_x}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      
                      <div className="col-span-4" id="yInput">
                        <label htmlFor="tech_y" className="label">y:</label>
                        <div className="relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_y"
                            id="tech_y"
                            className="input my-2"
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_y}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      
                      <div className="col-span-4" id="kInput">
                        <label htmlFor="tech_k" className="label">k:</label>
                        <div className="relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_k"
                            id="tech_k"
                            className="input my-2"
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_k}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      
                      {(formData.tech_operations === "3" || formData.tech_operations === "4") && (
                        <div className="col-span-4" id="uInput">
                          <label htmlFor="tech_u" className="label">u:</label>
                          <div className="relative">
                            <input
                              type="number"
                              step="any"
                              name="tech_u"
                              id="tech_u"
                              className="input my-2"
                              aria-label="input"
                              placeholder="00"
                              value={formData.tech_u}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
              
              {formData.tech_type === 'second' && (
                <>
                  <div className="col-span-12 mt-0 mt-lg-2" id="advanceMethod">
                    <label htmlFor="tech_n1" className="label">
                      {data?.payload?.tech_lang_keys["9"]}:
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        step="any"
                        name="tech_n1"
                        id="tech_n1"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_n1}
                        onChange={handleChange}
                      />
                    </div>
                    <hr className="my-2"/>
                    <label htmlFor="tech_d1" className="label">
                      {data?.payload?.tech_lang_keys["10"]}:
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        step="any"
                        name="tech_d1"
                        id="tech_d1"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_d1}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="mb-6 mt-10 text-center space-x-2">
            <Button type="submit" isLoading={roundToTheNearestLoading}>
              {data?.payload?.tech_lang_keys["calculate"]}
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

        {roundToTheNearestLoading ? (
          <div className="w-full mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg  space-y-6 result">
            <div className="animate-pulse">
              <div className=" w-full h-[30px] bg-gray-300 animate-pulse rounded-[10px] mb-4"></div>
              <div className="w-[75%] h-[20px] bg-gray-300 animate-pulse rounded-[10px] mb-3"></div>
              <div className="w-[50%] h-[20px] bg-gray-300 animate-pulse rounded-[10px] mb-3"></div>
              <div className="w-[25%] h-[20px] bg-gray-300 animate-pulse rounded-[10px]"></div>
            </div>
         </div>
        ) : (
          result && (
            <>
              <div className="w-full result mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg space-y-6">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />
                  
                  <div className="rounded-lg flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="w-full text-[16px]">
                        {formData?.tech_type === "first" ? (
                          <>
                            <div className="mt-3 text-[16px] md:text-[18px] font-bold">
                              <InlineMath math={calculationResult.finalAnswer || ""} />
                            </div>
                            <p className="mt-3">
                              <strong>{data?.payload?.tech_lang_keys[12]}:</strong>
                            </p>
                            <div className="w-full all_result text-[16px] md:text-[18px] ">
                              {calculationResult.steps.map((step, index) => (
                                <div key={index} className="mt-3">
                                  <InlineMath math={step} />
                                </div>
                              ))}
                            </div>
                            <div className="mt-3">
                              = &nbsp;&nbsp;&nbsp;&nbsp;
                              <InlineMath math={calculationResult.finalAnswer || ""} />
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="mt-3 text-[16px] md:text-[18px] font-bold">
                              <InlineMath math={result?.tech_main_ans || ""} />
                            </div>
                            <div className="mt-3 text-[16px] md:text-[18px]">
                              <strong>{data?.payload?.tech_lang_keys[12]}:</strong>
                            </div>
                            <div className="mt-3 text-[16px] md:text-[18px]">
                              <InlineMath math={`= ${result?.tech_enter || ""}`} />
                            </div>
                            <div className="mt-3 text-[16px] md:text-[18px]">
                              <InlineMath
                                math={`= \\dfrac{${result?.tech_up || ""}}{${result?.tech_down || ""}}`}
                              />
                            </div>
                            <div className="mt-3 text-[16px] md:text-[18px]">
                              <InlineMath math={`= ${result?.tech_main_ans || ""}`} />
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )
        )}
      </form>
      
      {result && (
        <CalculatorFeedback calName={data?.payload?.tech_calculator_title} />
      )}
    </Calculator>
  );
};

export default RationalizeTheDenominatorCalculator;
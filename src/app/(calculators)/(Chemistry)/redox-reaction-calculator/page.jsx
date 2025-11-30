"use client";
import React, { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency";
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";
import {
  useGetSingleCalculatorDetailsMutation,
  useRedoxReactionCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";
import "../../../../components/styles/CssLimitingReactantCalculator.css";

const RedoxReactionCalculator = () => {
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

  const [currentPath, setCurrentPath] = useState("");
  useEffect(() => {
    setCurrentPath(window.location.pathname);
  }, []);

  const [formData, setFormData] = useState({
    tech_eq: "Mg + HCl = MgCl2 + H2",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");
  const resultRef = useRef(null);

  const [
    RedoxCalculator,
    { isLoading: calculateLoading, isError, error: calculateError },
  ] = useRedoxReactionCalculatorMutation();

  // Load redox balancing JavaScript
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Inject the redox reaction balancing script
      const script = document.createElement("script");
      script.innerHTML = `
        var ions = true;
        
        function redox_reaction() {
          try {
            const inputElem = document.getElementById("input_equ");
            const resultElem = document.getElementById("result");
            const messageElem = document.getElementById("message");
            const codevalidElem = document.getElementById("codevalid");
            
            if (!inputElem || !resultElem) return;
            
            // Clear previous results
            resultElem.innerHTML = "";
            messageElem.innerHTML = "";
            codevalidElem.innerHTML = "&nbsp;";
            
            const equation = inputElem.value.trim();
            if (!equation) {
              messageElem.textContent = "Please enter an equation";
              return;
            }
            
            try {
              const parsed = parse();
              const matrix = createMatrix(parsed);
              solve(matrix);
              const coefficients = extractCoefficients(matrix);
              checkAnswer(parsed, coefficients);
              resultElem.appendChild(parsed.toHtml(coefficients));
            } catch (err) {
              if (typeof err === "string") {
                messageElem.textContent = "Equation error: " + err;
              } else if (err.message) {
                messageElem.textContent = "Equation error: " + err.message;
              } else {
                messageElem.textContent = "Error balancing equation";
              }
            }
          } catch (err) {
            console.error("Redox reaction error:", err);
          }
        }
        
        function parse() {
          const inputElem = document.getElementById("input_equ");
          return parseEquation(new Tokenizer(inputElem.value));
        }
        
        function createMatrix(e) {
          const elements = e.getElements();
          const matrix = new Matrix(elements.length + 1, e.getLeftSide().length + e.getRightSide().length + 1);
          
          for (let i = 0; i < elements.length; i++) {
            let col = 0;
            const leftSide = e.getLeftSide();
            for (let j = 0; j < leftSide.length; j++, col++) {
              matrix.set(i, col, leftSide[j].countElement(elements[i]));
            }
            const rightSide = e.getRightSide();
            for (let j = 0; j < rightSide.length; j++, col++) {
              matrix.set(i, col, -rightSide[j].countElement(elements[i]));
            }
          }
          return matrix;
        }
        
        function solve(matrix) {
          matrix.gaussJordanEliminate();
          let pivotCol = 0;
          for (; pivotCol < matrix.rowCount() - 1 && countNonzeroCoeffs(matrix, pivotCol) <= 1; pivotCol++);
          if (pivotCol == matrix.rowCount() - 1) throw "Element combination incorrect";
          matrix.set(matrix.rowCount() - 1, pivotCol, 1);
          matrix.set(matrix.rowCount() - 1, matrix.columnCount() - 1, 1);
          matrix.gaussJordanEliminate();
        }
        
        function countNonzeroCoeffs(matrix, row) {
          let count = 0;
          for (let col = 0; col < matrix.columnCount(); col++) {
            if (matrix.get(row, col) != 0) count++;
          }
          return count;
        }
        
        function extractCoefficients(matrix) {
          const rows = matrix.rowCount();
          const cols = matrix.columnCount();
          if (cols - 1 > rows || matrix.get(cols - 2, cols - 2) == 0) {
            throw "No unique solution";
          }
          
          let lcm = 1;
          for (let i = 0; i < cols - 1; i++) {
            lcm = checkedMultiply(lcm / gcd(lcm, matrix.get(i, i)), matrix.get(i, i));
          }
          
          const coeffs = [];
          let allZero = true;
          for (let i = 0; i < cols - 1; i++) {
            const coeff = checkedMultiply(lcm / matrix.get(i, i), matrix.get(i, cols - 1));
            coeffs.push(coeff);
            allZero = allZero && coeff == 0;
          }
          if (allZero) throw "All zero solution";
          return coeffs;
        }
        
        function checkAnswer(equation, coeffs) {
          if (coeffs.length != equation.getLeftSide().length + equation.getRightSide().length) {
            throw "Mismatched length";
          }
          
          const elements = equation.getElements();
          for (let i = 0; i < elements.length; i++) {
            let sum = 0;
            let index = 0;
            const leftSide = equation.getLeftSide();
            for (let j = 0; j < leftSide.length; j++, index++) {
              sum = checkedAdd(sum, checkedMultiply(leftSide[j].countElement(elements[i]), coeffs[index]));
            }
            const rightSide = equation.getRightSide();
            for (let j = 0; j < rightSide.length; j++, index++) {
              sum = checkedAdd(sum, checkedMultiply(rightSide[j].countElement(elements[i]), -coeffs[index]));
            }
            if (sum != 0) throw "Balance failed";
          }
        }
        
        function Equation(left, right) {
          this.getLeftSide = () => [...left];
          this.getRightSide = () => [...right];
          this.getElements = function() {
            const set = new Set();
            left.forEach(term => term.getElements(set));
            right.forEach(term => term.getElements(set));
            return Array.from(set);
          };
          this.toHtml = function(coeffs) {
            const span = document.createElement("span");
            let first = true;
            
            for (let i = 0; i < left.length; i++) {
              const coeff = coeffs ? coeffs[i] : 1;
              if (coeff != 0) {
                if (!first) span.appendChild(document.createTextNode(" + "));
                first = false;
                if (coeff != 1) {
                  const coeffSpan = document.createElement("span");
                  coeffSpan.style = "font-weight:bold;color:#0004FD;display:inline-table;";
                  coeffSpan.textContent = coeff;
                  span.appendChild(coeffSpan);
                }
                span.appendChild(document.createTextNode(" "));
                span.appendChild(left[i].toHtml());
              }
            }
            
            const arrow = document.createElement("span");
            arrow.style = "font-weight:bold;color:#000;font-size:30px;vertical-align:-6px;display:inline-table;";
            arrow.textContent = " → ";
            span.appendChild(arrow);
            
            first = true;
            for (let i = 0; i < right.length; i++) {
              const coeff = coeffs ? coeffs[left.length + i] : 1;
              if (coeff != 0) {
                if (!first) span.appendChild(document.createTextNode(" + "));
                first = false;
                if (coeff != 1) {
                  const coeffSpan = document.createElement("span");
                  coeffSpan.style = "font-weight:bold;color:#0004FD;display:inline-table;";
                  coeffSpan.textContent = coeff;
                  span.appendChild(coeffSpan);
                }
                span.appendChild(document.createTextNode(" "));
                span.appendChild(right[i].toHtml());
              }
            }
            return span;
          };
        }
        
        function Term(items, charge) {
          this.getItems = () => [...items];
          this.getElements = function(set) {
            set.add("e");
            items.forEach(item => item.getElements(set));
          };
          this.countElement = function(elem) {
            if (elem == "e") return -charge;
            let count = 0;
            items.forEach(item => count = checkedAdd(count, item.countElement(elem)));
            return count;
          };
          this.toHtml = function() {
            const span = document.createElement("span");
            span.style = "font-weight:bold;color:#00821A;display:inline-table;";
            
            if (items.length == 0 && charge == -1) {
              span.textContent = "e";
              const sup = document.createElement("sup");
              sup.style = "font-weight:bold;color:red;display:inline-table;";
              sup.textContent = " −";
              span.appendChild(sup);
            } else {
              items.forEach(item => span.appendChild(item.toHtml()));
              if (charge != 0) {
                const sup = document.createElement("sup");
                sup.style = "font-weight:bold;color:red;display:inline-table;";
                const chargeText = Math.abs(charge) == 1 ? "" : Math.abs(charge);
                sup.textContent = " " + chargeText + (charge > 0 ? "+" : "−");
                span.appendChild(sup);
              }
            }
            return span;
          };
        }
        
        function Group(items, count) {
          this.getItems = () => [...items];
          this.getCount = () => count;
          this.getElements = function(set) {
            items.forEach(item => item.getElements(set));
          };
          this.countElement = function(elem) {
            let sum = 0;
            items.forEach(item => sum = checkedAdd(sum, checkedMultiply(item.countElement(elem), count)));
            return sum;
          };
          this.toHtml = function() {
            const span = document.createElement("span");
            span.style = "font-weight:bold;color:#00821A;display:inline-table;";
            span.textContent = "(";
            items.forEach(item => span.appendChild(item.toHtml()));
            span.appendChild(document.createTextNode(")"));
            if (count != 1) {
              const sub = document.createElement("sub");
              sub.style = "font-weight:bold;color:#7E178C;display:inline-table;";
              sub.textContent = count;
              span.appendChild(sub);
            }
            return span;
          };
        }
        
        function Element(name, count) {
          this.getName = () => name;
          this.getCount = () => count;
          this.getElements = (set) => set.add(name);
          this.countElement = (elem) => elem == name ? count : 0;
          this.toHtml = function() {
            const span = document.createElement("span");
            span.style = "font-weight:bold;color:#00821A;display:inline-table;";
            span.textContent = name;
            if (count != 1) {
              const sub = document.createElement("sub");
              sub.style = "font-weight:bold;color:#346EE2;display:inline-table;";
              sub.textContent = count;
              span.appendChild(sub);
            }
            return span;
          };
        }
        
        function parseEquation(tokenizer) {
          const left = [];
          const right = [];
          
          left.push(parseTerm(tokenizer));
          while (true) {
            const token = tokenizer.peek();
            if (token == "=") break;
            if (token == null) throw {message: "Plus or equal sign expected", start: tokenizer.position()};
            if (token != "+") throw {message: "Plus expected", start: tokenizer.position()};
            tokenizer.take();
            left.push(parseTerm(tokenizer));
          }
          
          tokenizer.take(); // consume "="
          
          right.push(parseTerm(tokenizer));
          while (true) {
            const token = tokenizer.peek();
            if (token == null) break;
            if (token != "+") throw {message: "Plus expected", start: tokenizer.position()};
            tokenizer.take();
            right.push(parseTerm(tokenizer));
          }
          
          return new Equation(left, right);
        }
        
        function parseTerm(tokenizer) {
          const items = [];
          while (true) {
            const token = tokenizer.peek();
            if (token == null) break;
            if (token == "(") {
              items.push(parseGroup(tokenizer));
            } else if (/^[A-Za-z][a-z]*$/.test(token)) {
              items.push(parseElement(tokenizer));
            } else {
              break;
            }
          }
          
          let charge = 0;
          let token = tokenizer.peek();
          if (token == "^") {
            tokenizer.take();
            token = tokenizer.peek();
            if (/^[0-9]+$/.test(token)) {
              charge = parseInt(token, 10);
              tokenizer.take();
              token = tokenizer.peek();
            } else {
              charge = 1;
            }
            if (token == "+") {
              // positive charge
            } else if (token == "-") {
              charge = -charge;
            } else {
              throw {message: "Sign expected", start: tokenizer.position()};
            }
            tokenizer.take();
          }
          
          if (items.length == 0 && charge != -1) {
            throw {message: "Invalid term", start: 0};
          }
          
          return new Term(items, charge);
        }
        
        function parseGroup(tokenizer) {
          tokenizer.take(); // consume "("
          const items = [];
          while (true) {
            const token = tokenizer.peek();
            if (token == null) throw {message: "Closing parenthesis expected", start: tokenizer.position()};
            if (token == ")") break;
            if (token == "(") {
              items.push(parseGroup(tokenizer));
            } else if (/^[A-Za-z][a-z]*$/.test(token)) {
              items.push(parseElement(tokenizer));
            } else {
              throw {message: "Element or group expected", start: tokenizer.position()};
            }
          }
          tokenizer.take(); // consume ")"
          return new Group(items, parseCount(tokenizer));
        }
        
        function parseElement(tokenizer) {
          const name = tokenizer.take();
          return new Element(name, parseCount(tokenizer));
        }
        
        function parseCount(tokenizer) {
          const token = tokenizer.peek();
          if (token != null && /^[0-9]+$/.test(token)) {
            return parseInt(tokenizer.take(), 10);
          }
          return 1;
        }
        
        function Tokenizer(str) {
          let pos = 0;
          this.position = () => pos;
          this.peek = function() {
            if (pos == str.length) return null;
            const match = /^([A-Za-z][a-z]*|[0-9]+| +|[+\\-^=()])/.exec(str.substring(pos));
            if (!match) throw {message: "Invalid symbol", start: pos};
            let token = match[0];
            if (/^ +$/.test(token)) {
              pos += token.length;
              return this.peek();
            }
            return token;
          };
          this.take = function() {
            const token = this.peek();
            pos += token.length;
            return token;
          };
        }
        
        function Matrix(rows, cols) {
          const data = Array(rows).fill(0).map(() => Array(cols).fill(0));
          
          this.rowCount = () => rows;
          this.columnCount = () => cols;
          this.get = (r, c) => data[r][c];
          this.set = (r, c, val) => data[r][c] = val;
          
          this.gaussJordanEliminate = function() {
            for (let r = 0; r < rows; r++) {
              data[r] = simplifyRow(data[r]);
            }
            
            let numPivots = 0;
            for (let c = 0; c < cols; c++) {
              let pivotRow = numPivots;
              while (pivotRow < rows && data[pivotRow][c] == 0) pivotRow++;
              if (pivotRow == rows) continue;
              
              const pivotVal = data[pivotRow][c];
              [data[numPivots], data[pivotRow]] = [data[pivotRow], data[numPivots]];
              
              for (let r = numPivots + 1; r < rows; r++) {
                const g = gcd(pivotVal, data[r][c]);
                data[r] = simplifyRow(addRows(
                  multiplyRow(data[r], pivotVal / g),
                  multiplyRow(data[c], -data[r][c] / g)
                ));
              }
              numPivots++;
            }
            
            for (let r = rows - 1; r >= 0; r--) {
              let pivotCol = 0;
              while (pivotCol < cols && data[r][pivotCol] == 0) pivotCol++;
              if (pivotCol == cols) continue;
              
              const pivotVal = data[r][pivotCol];
              for (let r2 = r - 1; r2 >= 0; r2--) {
                const g = gcd(pivotVal, data[r2][pivotCol]);
                data[r2] = simplifyRow(addRows(
                  multiplyRow(data[r2], pivotVal / g),
                  multiplyRow(data[r], -data[r2][pivotCol] / g)
                ));
              }
            }
          };
          
          function addRows(row1, row2) {
            return row1.map((val, i) => checkedAdd(val, row2[i]));
          }
          
          function multiplyRow(row, factor) {
            return row.map(val => checkedMultiply(val, factor));
          }
          
          function simplifyRow(row) {
            let sign = 0;
            for (let val of row) {
              if (val > 0) { sign = 1; break; }
              if (val < 0) { sign = -1; break; }
            }
            if (sign == 0) return row;
            
            let g = 0;
            for (let val of row) g = gcd(val, g);
            g *= sign;
            return row.map(val => val / g);
          }
        }
        
        function gcd(a, b) {
          a = Math.abs(a);
          b = Math.abs(b);
          while (b != 0) {
            const temp = b;
            b = a % b;
            a = temp;
          }
          return a;
        }
        
        function checkedAdd(a, b) {
          const result = a + b;
          if (!Number.isFinite(result)) throw "Arithmetic overflow";
          return result;
        }
        
        function checkedMultiply(a, b) {
          const result = a * b;
          if (!Number.isFinite(result)) throw "Arithmetic overflow";
          return result;
        }
        
        window.redox_reaction = redox_reaction;
      `;
      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
      };
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_eq) {
      setFormError("Please fill in field");
      return;
    }
    setFormError("");

    try {
      const response = await RedoxCalculator({
        tech_eq: formData.tech_eq,
      }).unwrap();
      setResult(response?.payload);

      // Call redox_reaction function after result is set
      setTimeout(() => {
        if (window.redox_reaction) {
          window.redox_reaction();
        }
      }, 100);

      toast.success("Calculate Successfully");
    } catch (err) {
      setFormError(err.data?.payload?.error || "An error occurred");
      toast.error(err.data?.payload?.error || "An error occurred");
    }
  };

  const handleReset = () => {
    setFormData({
      tech_eq: "Mg + HCl = MgCl2 + H2",
    });
    setResult(null);
    setFormError(null);
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

  const exampleEquations = [
    "Cr2O7^2- + H^+ + e^- = Cr^3+ + H2O",
    "S^2- + I2 = I^- + S",
    "Mg + HCl = MgCl2 + H2",
    "C6H12O6 + O2 = CO2 + H2O",
    "H2 + O2 = H2O",
    "Al + Fe2O4 = Fe + Al2O3",
    "Fe + O2 = Fe2O3",
    "NH3 + O2 = NO + H2O",
  ];

  const loadExample = () => {
    const randomIndex = Math.floor(Math.random() * exampleEquations.length);
    const randomEquation = exampleEquations[randomIndex];
    setFormData({
      ...formData,
      tech_eq: randomEquation,
    });
    setFormError("");
    setResult(null);
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

          <div className="lg:w-[60%] md:w-[60%] w-full mx-auto ">
            <div className="grid grid-cols-12 gap-2 md:gap-4">
              <div className="col-span-12 flex justify-between">
                <button
                  type="button"
                  className="flex border cursor-pointer rounded-lg p-2 items-center bg-[#2845F5] text-[#fff]  hover:text-white "
                  onClick={loadExample}
                  aria-label="Load Example"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-arrow-up-right size-5 me-1"
                  >
                    <path d="M7 7h10v10"></path>
                    <path d="M7 17 17 7"></path>
                  </svg>
                  {data?.payload?.tech_lang_keys?.["2"] || "Load Example"}
                </button>
              </div>
              <div className="col-span-12">
                <div className="col-span-12 md:col-span-4 lg:col-span-4 flex justify-between">
                  <label htmlFor="tech_eq" className="label mt-4">
                    {data?.payload?.tech_lang_keys?.["1"] || "Enter Equation"}:
                  </label>
                </div>
                <div className="w-full py-2 relative">
                  <input
                    type="text"
                    step="any"
                    name="tech_eq"
                    id="input_equ"
                    className="input w-full p-2 border rounded"
                    aria-label="input"
                    placeholder="Fe + O2 = Fe2O3"
                    value={formData.tech_eq}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="w-full mx-auto">
            <div className="grid grid-cols-12 gap-2 md:gap-4">
              <div className="col-span-12 w-full overflow-auto px-2 mt-5">
                <table className="w-full t_set text-center" cellPadding="7">
                  <tbody className="m-1">
                    <tr>
                      <td
                        className="check t3 cursor-pointer hover:bg-gray-200"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            tech_eq: formData.tech_eq + "H",
                          })
                        }
                      >
                        H
                      </td>
                      <td colSpan="16"></td>
                      <td
                        className="check t6 cursor-pointer hover:bg-gray-200"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            tech_eq: formData.tech_eq + "He",
                          })
                        }
                      >
                        He
                      </td>
                    </tr>
                    <tr>
                      <td
                        className="check t4 cursor-pointer hover:bg-gray-200"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            tech_eq: formData.tech_eq + "Li",
                          })
                        }
                      >
                        Li
                      </td>
                      <td
                        className="check t5 cursor-pointer hover:bg-gray-200"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            tech_eq: formData.tech_eq + "Be",
                          })
                        }
                      >
                        Be
                      </td>
                      <td colSpan="10"></td>
                      <td
                        className="check t9 cursor-pointer hover:bg-gray-200"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            tech_eq: formData.tech_eq + "B",
                          })
                        }
                      >
                        B
                      </td>
                      <td
                        className="check t3 cursor-pointer hover:bg-gray-200"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            tech_eq: formData.tech_eq + "C",
                          })
                        }
                      >
                        C
                      </td>
                      <td
                        className="check t3 cursor-pointer hover:bg-gray-200"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            tech_eq: formData.tech_eq + "N",
                          })
                        }
                      >
                        N
                      </td>
                      <td
                        className="check t3 cursor-pointer hover:bg-gray-200"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            tech_eq: formData.tech_eq + "O",
                          })
                        }
                      >
                        O
                      </td>
                      <td
                        className="check t3 cursor-pointer hover:bg-gray-200"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            tech_eq: formData.tech_eq + "F",
                          })
                        }
                      >
                        F
                      </td>
                      <td
                        className="check t6 cursor-pointer hover:bg-gray-200"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            tech_eq: formData.tech_eq + "Ne",
                          })
                        }
                      >
                        Ne
                      </td>
                    </tr>
                    <tr>
                      <td
                        className="check t4 cursor-pointer hover:bg-gray-200"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            tech_eq: formData.tech_eq + "Na",
                          })
                        }
                      >
                        Na
                      </td>
                      <td
                        className="check t5 cursor-pointer hover:bg-gray-200"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            tech_eq: formData.tech_eq + "Mg",
                          })
                        }
                      >
                        Mg
                      </td>
                      <td colSpan="10"></td>
                      <td
                        className="check t2 cursor-pointer hover:bg-gray-200"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            tech_eq: formData.tech_eq + "Al",
                          })
                        }
                      >
                        Al
                      </td>
                      <td
                        className="check t9 cursor-pointer hover:bg-gray-200"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            tech_eq: formData.tech_eq + "Si",
                          })
                        }
                      >
                        Si
                      </td>
                      <td
                        className="check t3 cursor-pointer hover:bg-gray-200"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            tech_eq: formData.tech_eq + "P",
                          })
                        }
                      >
                        P
                      </td>
                      <td
                        className="check t3 cursor-pointer hover:bg-gray-200"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            tech_eq: formData.tech_eq + "S",
                          })
                        }
                      >
                        S
                      </td>
                      <td
                        className="check t3 cursor-pointer hover:bg-gray-200"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            tech_eq: formData.tech_eq + "Cl",
                          })
                        }
                      >
                        Cl
                      </td>
                      <td
                        className="check t6 cursor-pointer hover:bg-gray-200"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            tech_eq: formData.tech_eq + "Ar",
                          })
                        }
                      >
                        Ar
                      </td>
                    </tr>
                    <tr>
                      <td
                        className="check t4 cursor-pointer hover:bg-gray-200"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            tech_eq: formData.tech_eq + "K",
                          })
                        }
                      >
                        K
                      </td>
                      <td
                        className="check t5 cursor-pointer hover:bg-gray-200"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            tech_eq: formData.tech_eq + "Ca",
                          })
                        }
                      >
                        Ca
                      </td>
                      <td
                        className="check t1 cursor-pointer hover:bg-gray-200"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            tech_eq: formData.tech_eq + "Sc",
                          })
                        }
                      >
                        Sc
                      </td>
                      <td
                        className="check t1 cursor-pointer hover:bg-gray-200"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            tech_eq: formData.tech_eq + "Ti",
                          })
                        }
                      >
                        Ti
                      </td>
                      <td
                        className="check t1 cursor-pointer hover:bg-gray-200"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            tech_eq: formData.tech_eq + "V",
                          })
                        }
                      >
                        V
                      </td>
                      <td
                        className="check t1 cursor-pointer hover:bg-gray-200"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            tech_eq: formData.tech_eq + "Cr",
                          })
                        }
                      >
                        Cr
                      </td>
                      <td
                        className="check t1 cursor-pointer hover:bg-gray-200"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            tech_eq: formData.tech_eq + "Mn",
                          })
                        }
                      >
                        Mn
                      </td>
                      <td
                        className="check t1 cursor-pointer hover:bg-gray-200"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            tech_eq: formData.tech_eq + "Fe",
                          })
                        }
                      >
                        Fe
                      </td>
                      <td
                        className="check t1 cursor-pointer hover:bg-gray-200"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            tech_eq: formData.tech_eq + "Co",
                          })
                        }
                      >
                        Co
                      </td>
                      <td
                        className="check t1 cursor-pointer hover:bg-gray-200"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            tech_eq: formData.tech_eq + "Ni",
                          })
                        }
                      >
                        Ni
                      </td>
                      <td
                        className="check t1 cursor-pointer hover:bg-gray-200"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            tech_eq: formData.tech_eq + "Cu",
                          })
                        }
                      >
                        Cu
                      </td>
                      <td
                        className="check t1 cursor-pointer hover:bg-gray-200"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            tech_eq: formData.tech_eq + "Zn",
                          })
                        }
                      >
                        Zn
                      </td>
                      <td
                        className="check t2 cursor-pointer hover:bg-gray-200"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            tech_eq: formData.tech_eq + "Ga",
                          })
                        }
                      >
                        Ga
                      </td>
                      <td
                        className="check t9 cursor-pointer hover:bg-gray-200"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            tech_eq: formData.tech_eq + "Ge",
                          })
                        }
                      >
                        Ge
                      </td>
                      <td
                        className="check t9 cursor-pointer hover:bg-gray-200"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            tech_eq: formData.tech_eq + "As",
                          })
                        }
                      >
                        As
                      </td>
                      <td
                        className="check t3 cursor-pointer hover:bg-gray-200"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            tech_eq: formData.tech_eq + "Se",
                          })
                        }
                      >
                        Se
                      </td>
                      <td
                        className="check t3 cursor-pointer hover:bg-gray-200"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            tech_eq: formData.tech_eq + "Br",
                          })
                        }
                      >
                        Br
                      </td>
                      <td
                        className="check t6 cursor-pointer hover:bg-gray-200"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            tech_eq: formData.tech_eq + "Kr",
                          })
                        }
                      >
                        Kr
                      </td>
                    </tr>
                    <tr>
                      <td className="check t4">Rb</td>
                      <td className="check t5">Sr</td>
                      <td className="check t1">Y</td>
                      <td className="check t1">Zr</td>
                      <td className="check t1">Nb</td>
                      <td className="check t1">Mo</td>
                      <td className="check t1">Tc</td>
                      <td className="check t1">Ru</td>
                      <td className="check t1">Rh</td>
                      <td className="check t1">Pd</td>
                      <td className="check t1">Ag</td>
                      <td className="check t1">Cd</td>
                      <td className="check t2">In</td>
                      <td className="check t2">Sn</td>
                      <td className="check t9">Sb</td>
                      <td className="check t9">Te</td>
                      <td className="check t3">I</td>
                      <td className="check t6">Xe</td>
                    </tr>
                    <tr>
                      <td className="check t4">Cs</td>
                      <td className="check t5">Ba</td>
                      <td className="check t7">La</td>
                      <td className="check t1">Hf</td>
                      <td className="check t1">Ta</td>
                      <td className="check t1">W</td>
                      <td className="check t1">Re</td>
                      <td className="check t1">Os</td>
                      <td className="check t1">Ir</td>
                      <td className="check t1">Pt</td>
                      <td className="check t1">Au</td>
                      <td className="check t1">Hg</td>
                      <td className="check t2">TI</td>
                      <td className="check t2">Pb</td>
                      <td className="check t2">Bi</td>
                      <td className="check t9">Po</td>
                      <td className="check t9">At</td>
                      <td className="check t6">Rn</td>
                    </tr>
                    <tr>
                      <td className="check t4">Fr</td>
                      <td className="check t5">Ra</td>
                      <td className="check t8">Ac</td>
                      <td className="check t1">Rf</td>
                      <td className="check t1">Db</td>
                      <td className="check t1">Sg</td>
                      <td className="check t1">Bh</td>
                      <td className="check t1">Hs</td>
                      <td className="check t10">Mt</td>
                      <td className="check t10">Ds</td>
                      <td className="check t10">Rg</td>
                      <td className="check t10">Cn</td>
                      <td className="check t10">Nh</td>
                      <td className="check t10">FI</td>
                      <td className="check t10">Mc</td>
                      <td className="check t10">Lv</td>
                      <td className="check t10">Ts</td>
                      <td className="check t10">Og</td>
                    </tr>
                    <tr>
                      <td colSpan="18"></td>
                    </tr>
                    <tr>
                      <td colSpan="4" className="text-start">
                        <strong>
                          {data?.payload?.tech_lang_keys?.["3"] ||
                            "Lanthanides"}
                        </strong>
                      </td>
                      <td className="check t7">Ce</td>
                      <td className="check t7">Pr</td>
                      <td className="check t7">Nd</td>
                      <td className="check t7">Pm</td>
                      <td className="check t7">Sm</td>
                      <td className="check t7">Eu</td>
                      <td className="check t7">Gd</td>
                      <td className="check t7">Tb</td>
                      <td className="check t7">Dy</td>
                      <td className="check t7">Ho</td>
                      <td className="check t7">Er</td>
                      <td className="check t7">Tm</td>
                      <td className="check t7">Yb</td>
                      <td className="check t7">Lu</td>
                    </tr>
                    <tr>
                      <td colSpan="4" className="text-start">
                        <strong>
                          {data?.payload?.tech_lang_keys?.["4"] || "Actinides"}
                        </strong>
                      </td>
                      <td className="check t8">Th</td>
                      <td className="check t8">Pa</td>
                      <td className="check t8">U</td>
                      <td className="check t8">Np</td>
                      <td className="check t8">Pu</td>
                      <td className="check t8">Am</td>
                      <td className="check t8">Cm</td>
                      <td className="check t8">Bk</td>
                      <td className="check t8">Cf</td>
                      <td className="check t8">Es</td>
                      <td className="check t8">Fm</td>
                      <td className="check t8">Md</td>
                      <td className="check t8">No</td>
                      <td className="check t8">Lr</td>
                    </tr>
                  </tbody>
                </table>
                <div className="col-10 mt-4">
                  <table className="w-full text-center t_set" cellPadding="7">
                    <tbody>
                      <tr>
                        <td
                          id="spc"
                          className="text-white radius-20 bt_set cursor-pointer hover:opacity-80"
                          onClick={() =>
                            setFormData({
                              ...formData,
                              tech_eq: formData.tech_eq + " ",
                            })
                          }
                        >
                          {data?.payload?.tech_lang_keys?.["5"] || "Space"}
                        </td>
                        <td
                          className="check t6 cursor-pointer hover:bg-gray-200"
                          onClick={() =>
                            setFormData({
                              ...formData,
                              tech_eq: formData.tech_eq + "1",
                            })
                          }
                        >
                          1
                        </td>
                        <td
                          className="check t6 cursor-pointer hover:bg-gray-200"
                          onClick={() =>
                            setFormData({
                              ...formData,
                              tech_eq: formData.tech_eq + "2",
                            })
                          }
                        >
                          2
                        </td>
                        <td
                          className="check t6 cursor-pointer hover:bg-gray-200"
                          onClick={() =>
                            setFormData({
                              ...formData,
                              tech_eq: formData.tech_eq + "3",
                            })
                          }
                        >
                          3
                        </td>
                        <td
                          className="check t6 cursor-pointer hover:bg-gray-200"
                          onClick={() =>
                            setFormData({
                              ...formData,
                              tech_eq: formData.tech_eq + "4",
                            })
                          }
                        >
                          4
                        </td>
                        <td
                          className="check t6 cursor-pointer hover:bg-gray-200"
                          onClick={() =>
                            setFormData({
                              ...formData,
                              tech_eq: formData.tech_eq + "5",
                            })
                          }
                        >
                          5
                        </td>
                        <td
                          className="check t6 cursor-pointer hover:bg-gray-200"
                          onClick={() =>
                            setFormData({
                              ...formData,
                              tech_eq: formData.tech_eq + "6",
                            })
                          }
                        >
                          6
                        </td>
                        <td
                          className="check t6 cursor-pointer hover:bg-gray-200"
                          onClick={() =>
                            setFormData({
                              ...formData,
                              tech_eq: formData.tech_eq + "7",
                            })
                          }
                        >
                          7
                        </td>
                        <td
                          className="check t6 cursor-pointer hover:bg-gray-200"
                          onClick={() =>
                            setFormData({
                              ...formData,
                              tech_eq: formData.tech_eq + "8",
                            })
                          }
                        >
                          8
                        </td>
                        <td
                          className="check t6 cursor-pointer hover:bg-gray-200"
                          onClick={() =>
                            setFormData({
                              ...formData,
                              tech_eq: formData.tech_eq + "9",
                            })
                          }
                        >
                          9
                        </td>
                        <td
                          className="check t6 cursor-pointer hover:bg-gray-200"
                          onClick={() =>
                            setFormData({
                              ...formData,
                              tech_eq: formData.tech_eq + "0",
                            })
                          }
                        >
                          0
                        </td>
                        <td
                          className="check t6 cursor-pointer hover:bg-gray-200"
                          onClick={() =>
                            setFormData({
                              ...formData,
                              tech_eq: formData.tech_eq + "+",
                            })
                          }
                        >
                          +
                        </td>
                        <td
                          className="check t6 cursor-pointer hover:bg-gray-200"
                          onClick={() =>
                            setFormData({
                              ...formData,
                              tech_eq: formData.tech_eq + "=",
                            })
                          }
                        >
                          =
                        </td>
                        <td
                          id="clr"
                          className="text-white radius-20 bt_set cursor-pointer hover:opacity-80"
                          onClick={() =>
                            setFormData({ ...formData, tech_eq: "" })
                          }
                        >
                          {data?.payload?.tech_lang_keys?.["6"] || "Clear"}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6 mt-10 text-center space-x-2">
            <Button type="submit" isLoading={calculateLoading}>
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
              <div className="w-full result mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg  space-y-6 result">
                <ResultActions lang={data?.payload?.tech_lang_keys} />

                <div className="rounded-lg  flex items-center justify-center">
                  <div className="w-full bg-light-blue result p-3 rounded-lg mt-3">
                    <div className="flex justify-center">
                      <div className="w-full lg:w-auto text-center text-lg">
                        <div className="w-full text-center">
                          <input
                            type="hidden"
                            id="input_equ"
                            value="{ result?.tech_eq }"
                          />
                          <p>
                            <strong>{data?.payload?.tech_lang_keys[7]}</strong>
                          </p>
                          <p className="md:text-[20px] lg:text-[20px] ">
                            {result?.tech_eq}{" "}
                          </p>
                          <b>
                            <span id="message" className="text-red"></span>
                          </b>
                          <code id="codevalid"></code>
                          <p className="">
                            <strong>{data?.payload?.tech_lang_keys[8]}:</strong>
                          </p>
                          <div
                            className="md:text-[20px] lg:text-[20px]"
                            id="result"
                          ></div>
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

export default RedoxReactionCalculator;

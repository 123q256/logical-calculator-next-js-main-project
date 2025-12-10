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
  useLimitingReactantCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";
import "../../../../components/styles/CssLimitingReactantCalculator.css";

const LimitingReactantCalculator = () => {
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
    tech_eq: "Fe + O2 = Fe2O3",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  const [
    CatAgeCalculator,
    { isLoading: calculateDogLoading, isError, error: calculateLoveError },
  ] = useLimitingReactantCalculatorMutation();

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
      const response = await CatAgeCalculator({
        tech_eq: formData.tech_eq,
      }).unwrap();
      
      
      setResult(response?.payload);
      toast.success("Calculate Successfully");
    } catch (err) {
      // console.error("API Error:", err);
      setFormError(err?.data?.payload?.error || "Calculation error");
      toast.error(err?.data?.payload?.error || "Calculation error");
    }
  };

  const handleReset = () => {
    setFormData({
      tech_eq: "Fe + O2 = Fe2O3",
    });
    setResult(null);
    setFormError(null);
    
    // Clear result display
    const reDiv = document.getElementById('re');
    const equDiv = document.getElementById('equ');
    const msgDiv = document.getElementById('message');
    const tableDiv = document.querySelector('.table');
    
    if (reDiv) reDiv.textContent = '';
    if (equDiv) equDiv.innerHTML = '';
    if (msgDiv) msgDiv.textContent = '';
    if (tableDiv) tableDiv.innerHTML = '';
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
    "CH4 + O2 = CO2 + H2O",
    "Mg + HCl = MgCl2 + H2",
    "H2 + O2 = H2O",
    "Al + Fe2O4 = Fe + Al2O3",
    "Fe + O2 = Fe2O3",
    "NH3 + O2 = NO + H2O"
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

  // COMPLETE JAVASCRIPT CALCULATION LOGIC
  useEffect(() => {
    if (result) {
      
      // Check for both teach_ and tech_ prefixes, and handle number or string
      const option = result.teach_option || result.tech_option;
      
      if (option === 2 || option === "2") {
        // Add small delay to ensure DOM is ready
        setTimeout(() => {
          processEquation(result);
        }, 100);
      } else {
      }
    }
  }, [result, data]);

  const processEquation = (resultData) => {
    try {
  
      // Use teach_ prefix (as per API response)
      const chemEq = resultData.teach_chemical_equation || resultData.tech_chemical_equation;
      
      if (!chemEq) {
        console.error("Chemical equation not found");
        const msgDiv = document.getElementById('message');
        if (msgDiv) msgDiv.textContent = "Chemical equation not found";
        return;
      }
      // Element symbols and atomic weights
      const symb = ['H', 'He', 'Li', 'Be', 'B', 'C', 'N', 'O', 'F', 'Ne', 'Na', 'Mg', 'Al', 'Si', 'P', 'S', 'Cl', 'Ar', 'K', 'Ca', 'Sc', 'Ti', 'V', 'Cr', 'Mn', 'Fe', 'Co', 'Ni', 'Cu', 'Zn', 'Ga', 'Ge', 'As', 'Se', 'Br', 'Kr', 'Rb', 'Sr', 'Y', 'Zr', 'Nb', 'Mo', 'Tc', 'Ru', 'Rh', 'Pd', 'Ag', 'Cd', 'In', 'Sn', 'Sb', 'Te', 'I', 'Xe', 'Cs', 'Ba', 'La', 'Ce', 'Pr', 'Nd', 'Pm', 'Sm', 'Eu', 'Gd', 'Tb', 'Dy', 'Ho', 'Er', 'Tm', 'Yb', 'Lu', 'Hf', 'Ta', 'W', 'Re', 'Os', 'Ir', 'Pt', 'Au', 'Hg', 'Tl', 'Pb', 'Bi', 'Po', 'At', 'Rn', 'Fr', 'Ra', 'Ac', 'Th', 'Pa', 'U', 'Np', 'Pu', 'Am', 'Cm', 'Bk', 'Cf', 'Es', 'Fm', 'Md', 'No', 'Lr', 'Rf', 'Db', 'Sg', 'Bh', 'Hs', 'Mt', 'Ds', 'Rg', 'Cn'];
      const aweight = [1.00794, 4.002602, 6.941, 9.012182, 10.811, 12.0107, 14.0067, 15.9994, 18.9984032, 20.1797, 22.9897693, 24.305, 26.9815386, 28.0855, 30.973762, 32.065, 35.453, 39.948, 39.0983, 40.078, 44.955912, 47.867, 50.9415, 51.9961, 54.938045, 55.845, 58.933195, 58.6934, 63.546, 65.38, 69.723, 72.63, 74.9216, 78.96, 79.904, 83.798, 85.4678, 87.62, 88.90585, 91.224, 92.90638, 95.96, 98, 101.07, 102.9055, 106.42, 107.8682, 112.411, 114.818, 118.71, 121.76, 127.6, 126.90447, 131.293, 132.9054519, 137.327, 138.90547, 140.116, 140.90765, 144.242, 145, 150.36, 151.964, 157.25, 158.92535, 162.5, 164.93032, 167.259, 168.93421, 173.054, 174.9668, 178.49, 180.94788, 183.84, 186.207, 190.23, 192.217, 195.084, 196.966569, 200.59, 204.3833, 207.2, 208.9804, 209, 210, 222, 223, 226, 227, 232.03806, 231.03588, 238.02891, 237, 244, 243, 247, 247, 251, 252, 257, 258, 259, 262, 267, 268, 271, 272, 270, 276, 281];

      let reactant = [];
      let product = [];
      let reactratio = [];
      let prodratio = [];
      let reactarr = [];
      let prodarr = [];
      let colorCodes = {};

      const MINUS = "\u2212";
      
      // Helper functions
      const shuffle = (o) => {
        for(let j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
        return o;
      };

      const checkedParseInt = (str) => {
        const result = parseInt(str, 10);
        if (isNaN(result)) throw "Not a number";
        return result;
      };

      const checkedAdd = (x, y) => x + y;
      const checkedMultiply = (x, y) => x * y;

      const gcd = (x, y) => {
        x = Math.abs(x);
        y = Math.abs(y);
        while (y !== 0) {
          const z = x % y;
          x = y;
          y = z;
        }
        return x;
      };

      const indexOf = (array, item) => {
        for (let i = 0; i < array.length; i++) {
          if (array[i] === item) return i;
        }
        return -1;
      };

      const copyArray = (array) => array.slice(0);

      // Set implementation
      function Set() {
        const items = [];
        this.add = function(obj) { 
          if (indexOf(items, obj) === -1) items.push(obj); 
        };
        this.toArray = function() { return copyArray(items); };
      }

      // Element class
      function Element(name, count) {
        this.getName = () => name;
        this.getCount = () => count;
        this.getElements = (result) => { result.add(name); };
        this.countElement = (n) => n === name ? count : 0;
        this.toHtml = () => {
          const node = document.createElement("span");
          node.setAttribute("style", "color:#" + (colorCodes[name] || "000000") + ";padding-left:0.5%;padding-right:0.5%");
          node.appendChild(document.createTextNode(name));
          if (count !== 1) {
            const sub = document.createElement("sub");
            sub.appendChild(document.createTextNode(count.toString()));
            node.appendChild(sub);
          }
          return node;
        };
      }

      // Group class
      function Group(items, count) {
        this.getElements = (result) => {
          for (let i = 0; i < items.length; i++)
            items[i].getElements(result);
        };
        this.countElement = (name) => {
          let sum = 0;
          for (let i = 0; i < items.length; i++)
            sum = checkedAdd(sum, checkedMultiply(items[i].countElement(name), count));
          return sum;
        };
        this.toHtml = () => {
          const node = document.createElement("span");
          node.appendChild(document.createTextNode("("));
          for (let i = 0; i < items.length; i++)
            node.appendChild(items[i].toHtml());
          node.appendChild(document.createTextNode(")"));
          if (count !== 1) {
            const sub = document.createElement("sub");
            sub.appendChild(document.createTextNode(count.toString()));
            node.appendChild(sub);
          }
          return node;
        };
      }

      // Term class
      function checkTerm(items, charge) {
        this.getElements = (result) => {
          result.add("e");
          for (let i = 0; i < items.length; i++)
            items[i].getElements(result);
        };
        this.countElement = (name) => {
          if (name === "e") return -charge;
          let sum = 0;
          for (let i = 0; i < items.length; i++)
            sum = checkedAdd(sum, items[i].countElement(name));
          return sum;
        };
        this.toHtml = () => {
          const node = document.createElement("span");
          for (let i = 0; i < items.length; i++)
            node.appendChild(items[i].toHtml());
          return node;
        };
      }

      // Equation class
      function EquationFun(lside, rside) {
        this.getLeftSide = () => copyArray(lside);
        this.getRightSide = () => copyArray(rside);
        this.getElements = () => {
          const result = new Set();
          for (let i = 0; i < lside.length; i++)
            lside[i].getElements(result);
          for (let i = 0; i < rside.length; i++)
            rside[i].getElements(result);
          return result.toArray();
        };
        this.toHtml = (coefficients) => {
          const node = document.createElement("span");
          let initial = true;
          
          for (let i = 0; i < lside.length; i++) {
            const coef = coefficients !== undefined ? coefficients[i] : 1;
            if (coef !== 0) {
              if (!initial) node.appendChild(document.createTextNode(" + "));
              initial = false;
              
              if (coef !== 1) {
                const disp = document.createElement("span");
                disp.setAttribute("style", "font-weight:bold;color:blue;padding-left:0.5%;padding-right:0.5%;");
                disp.appendChild(document.createTextNode(coef.toString()));
                node.appendChild(disp);
              }
              reactratio.push(coef);
              reactant.push(lside[i].toHtml().innerText);
              node.appendChild(lside[i].toHtml());
            }
          }
          
          const arrow = document.createElement("span");
          arrow.setAttribute("style", "font-weight:bold;color:green;font-size:30px;");
          arrow.appendChild(document.createTextNode(" → "));
          node.appendChild(arrow);
          
          initial = true;
          for (let i = 0; i < rside.length; i++) {
            const coef = coefficients !== undefined ? coefficients[lside.length + i] : 1;
            if (coef !== 0) {
              if (!initial) node.appendChild(document.createTextNode(" + "));
              initial = false;
              
              if (coef !== 1) {
                const disp = document.createElement("span");
                disp.setAttribute("style", "font-weight:bold;color:blue;padding-left:0.5%;padding-right:0.5%;");
                disp.appendChild(document.createTextNode(coef.toString()));
                node.appendChild(disp);
              }
              prodratio.push(coef);
              product.push(rside[i].toHtml().innerText);
              node.appendChild(rside[i].toHtml());
            }
          }
          return node;
        };
      }

      // Matrix class
      function Matrix(rows, cols) {
        const cells = [];
        for (let i = 0; i < rows; i++) {
          const row = [];
          for (let j = 0; j < cols; j++) row.push(0);
          cells.push(row);
        }

        this.rowCount = () => rows;
        this.columnCount = () => cols;
        this.get = (r, c) => cells[r][c];
        this.set = (r, c, val) => { cells[r][c] = val; };

        const swapRows = (i, j) => {
          const temp = cells[i];
          cells[i] = cells[j];
          cells[j] = temp;
        };

        const simplifyRow = (x) => {
          let sign = 0;
          for (let i = 0; i < x.length; i++) {
            if (x[i] > 0) { sign = 1; break; }
            else if (x[i] < 0) { sign = -1; break; }
          }
          const y = copyArray(x);
          if (sign === 0) return y;
          
          let result = 0;
          for (let i = 0; i < x.length; i++)
            result = gcd(x[i], result);
          const g = result * sign;
          
          for (let i = 0; i < y.length; i++)
            y[i] /= g;
          return y;
        };

        this.GJ_Eliminate = () => {
          for (let i = 0; i < rows; i++)
            cells[i] = simplifyRow(cells[i]);

          let numPivots = 0;
          for (let i = 0; i < cols; i++) {
            let pivotRow = numPivots;
            while (pivotRow < rows && cells[pivotRow][i] === 0) pivotRow++;
            if (pivotRow === rows) continue;
            
            const pivot = cells[pivotRow][i];
            swapRows(numPivots, pivotRow);
            numPivots++;

            for (let j = numPivots; j < rows; j++) {
              const g = gcd(pivot, cells[j][i]);
              const newRow = [];
              for (let k = 0; k < cols; k++) {
                newRow[k] = cells[j][k] * (pivot / g) + cells[i][k] * (-cells[j][i] / g);
              }
              cells[j] = simplifyRow(newRow);
            }
          }

          for (let i = rows - 1; i >= 0; i--) {
            let pivotCol = 0;
            while (pivotCol < cols && cells[i][pivotCol] === 0) pivotCol++;
            if (pivotCol === cols) continue;
            
            const pivot = cells[i][pivotCol];
            for (let j = i - 1; j >= 0; j--) {
              const g = gcd(pivot, cells[j][pivotCol]);
              const newRow = [];
              for (let k = 0; k < cols; k++) {
                newRow[k] = cells[j][k] * (pivot / g) + cells[i][k] * (-cells[j][pivotCol] / g);
              }
              cells[j] = simplifyRow(newRow);
            }
          }
        };
      }

      // Tokenizer
      function Tokenizer(str) {
        let pos = 0;
        this.peek = () => {
          if (pos === str.length) return null;
          const match = /^([A-Za-z][a-z]*|[0-9]+| +|[+\-^=()])/.exec(str.substring(pos));
          if (!match) throw { errormsg: "Invalid symbol", start: pos };
          let token = match[0];
          if (/^ +$/.test(token)) {
            pos += token.length;
            return this.peek();
          }
          return token;
        };
        this.take = () => {
          const result = this.peek();
          pos += result.length;
          return result;
        };
        this.position = () => pos;
      }

      // Parse functions
      const parseCount = (tokstr) => {
        const next = tokstr.peek();
        if (next && /^[0-9]+$/.test(next))
          return checkedParseInt(tokstr.take());
        return 1;
      };

      const parseElement = (tokstr) => {
        const name = tokstr.take();
        return new Element(name, parseCount(tokstr));
      };

      const parseGroup = (tokstr) => {
        tokstr.take(); // consume '('
        const items = [];
        while (true) {
          const next = tokstr.peek();
          if (!next) throw { errormsg: "Expected closing parenthesis" };
          if (next === "(") items.push(parseGroup(tokstr));
          else if (/^[A-Za-z][a-z]*$/.test(next)) items.push(parseElement(tokstr));
          else if (next === ")") break;
          else throw { errormsg: "Unexpected token" };
        }
        tokstr.take(); // consume ')'
        return new Group(items, parseCount(tokstr));
      };

      const parseTerm = (tokstr) => {
        const items = [];
        while (true) {
          const next = tokstr.peek();
          if (!next) break;
          if (next === "(") items.push(parseGroup(tokstr));
          else if (/^[A-Za-z][a-z]*$/.test(next)) items.push(parseElement(tokstr));
          else break;
        }
        return new checkTerm(items, 0);
      };

      const parseEquation = (tokstr) => {
        const lside = [];
        const rside = [];

        lside.push(parseTerm(tokstr));
        while (true) {
          const next = tokstr.peek();
          if (next === "=") break;
          if (!next || next !== "+") throw { errormsg: "Expected + or =" };
          tokstr.take();
          lside.push(parseTerm(tokstr));
        }

        tokstr.take(); // consume '='

        rside.push(parseTerm(tokstr));
        while (true) {
          const next = tokstr.peek();
          if (!next) break;
          if (next !== "+") throw { errormsg: "Expected +" };
          tokstr.take();
          rside.push(parseTerm(tokstr));
        }

        return new EquationFun(lside, rside);
      };

      const createMatrix = (eqn) => {
        const elements = eqn.getElements();
        const rows = elements.length + 1;
        const cols = eqn.getLeftSide().length + eqn.getRightSide().length + 1;
        const matrix = new Matrix(rows, cols);

        for (let i = 0; i < elements.length; i++) {
          let j = 0;
          const lside = eqn.getLeftSide();
          for (let k = 0; k < lside.length; j++, k++)
            matrix.set(i, j, lside[k].countElement(elements[i]));
          const rside = eqn.getRightSide();
          for (let k = 0; k < rside.length; j++, k++)
            matrix.set(i, j, -rside[k].countElement(elements[i]));
        }
        return matrix;
      };

      const solveEquation = (matrix) => {
        matrix.GJ_Eliminate();
        let i;
        for (i = 0; i < matrix.rowCount() - 1; i++) {
          let count = 0;
          for (let j = 0; j < matrix.columnCount(); j++) {
            if (matrix.get(i, j) !== 0) count++;
          }
          if (count > 1) break;
        }
        if (i === matrix.rowCount() - 1) throw "No solution";
        
        matrix.set(matrix.rowCount() - 1, i, 1);
        matrix.set(matrix.rowCount() - 1, matrix.columnCount() - 1, 1);
        matrix.GJ_Eliminate();
      };

      const extractCoefficients = (matrix) => {
        const rows = matrix.rowCount();
        const cols = matrix.columnCount();
        
        let lcm = 1;
        for (let i = 0; i < cols - 1; i++)
          lcm = checkedMultiply(lcm / gcd(lcm, matrix.get(i, i)), matrix.get(i, i));

        const coefficients = [];
        for (let i = 0; i < cols - 1; i++) {
          const coef = checkedMultiply(lcm / matrix.get(i, i), matrix.get(i, matrix.columnCount() - 1));
          coefficients.push(coef);
        }
        return coefficients;
      };

      // Parse and balance equation
      const input = chemEq;
      
      const token = new Tokenizer(input);
      const eqn = parseEquation(token);

      const colorsCode = ["9933ff", "3399ff", "ff9933", "ff3333", "990099", "004c99", "4c9900", "999900", "994c00"];
      shuffle(colorsCode);

      const matrix = createMatrix(eqn);
      solveEquation(matrix);
      const coefficients = extractCoefficients(matrix);

      const elements = eqn.getElements();
      for (let i = 0; i < elements.length; i++) {
        if (i !== 0) colorCodes[elements[i]] = colorsCode[i];
      }

      // Display balanced equation
      const reDiv = document.getElementById('re');
      const equDiv = document.getElementById('equ');
      
      if (reDiv) {
        reDiv.textContent = 'Balanced Equation';
        reDiv.style.fontSize = '20px';
        reDiv.style.fontWeight = 'bold';
      }
      if (equDiv) {
        equDiv.innerHTML = '';
        const eqNode = eqn.toHtml(coefficients);
        equDiv.appendChild(eqNode);
        equDiv.style.fontSize = '24px';
        equDiv.style.margin = '10px 0';
      } else {
        console.error("equDiv element not found!");
      }

      // Calculate molecular weights
      const rlen = reactant.length;
      const plen = product.length;

      for (let k = 0; k < rlen; k++) {
        let t_mass = 0;
        const ans = reactant[k].split(/(?=[A-Z])/);
        
        for (let i = 0; i < ans.length; i++) {
          const matches = ans[i].match(/\d+/g);
          const count = matches ? parseInt(matches[0]) : 1;
          const element = ans[i].split(/(?=[0-9])/)[0];
          
          for (let j = 0; j < symb.length; j++) {
            if (element === symb[j]) {
              t_mass += aweight[j] * count;
              break;
            }
          }
        }
        reactarr[k] = t_mass;
      }

      for (let k = 0; k < plen; k++) {
        let t_mass = 0;
        const ans = product[k].split(/(?=[A-Z])/);
        
        for (let i = 0; i < ans.length; i++) {
          const matches = ans[i].match(/\d+/g);
          const count = matches ? parseInt(matches[0]) : 1;
          const element = ans[i].split(/(?=[0-9])/)[0];
          
          for (let j = 0; j < symb.length; j++) {
            if (element === symb[j]) {
              t_mass += aweight[j] * count;
              break;
            }
          }
        }
        prodarr[k] = t_mass;
      }

      // Build table
      let val = "<table class='w-full border-collapse' cellspacing='0'>";
      val += "<tr><th class='border-b-2 p-2'>" + (data?.payload?.tech_lang_keys?.['6'] || 'Element') + "</th>";
      val += "<th class='border-b-2 p-2'>" + (data?.payload?.tech_lang_keys?.['7'] || 'Coefficient') + "</th>";
      val += "<th class='border-b-2 p-2'>" + (data?.payload?.tech_lang_keys?.['8'] || 'Molar Mass') + "</th>";
      val += "<th class='border-b-2 p-2'>" + (data?.payload?.tech_lang_keys?.['9'] || 'Moles') + "(mol)</th>";
      val += "<th class='border-b-2 p-2'>" + (data?.payload?.tech_lang_keys?.['10'] || 'Weight') + "(g)</th></tr>";
      val += "<tr><th class='border-b-2 p-2 bg-gray-100' colspan='5'>" + (data?.payload?.tech_lang_keys?.['11'] || 'Reactants') + "</th></tr>";

      for (let i = 1; i <= rlen; i++) {
        val += "<tr>";
        val += "<td class='border-b p-2'>" + reactant[i - 1] + "</td>";
        val += "<td class='border-b p-2'>" + reactratio[i - 1] + "</td>";
        val += "<td class='border-b p-2'>" + reactarr[i - 1].toFixed(2) + "</td>";
        val += "<td class='border-b p-2'><input type='number' step='any' class='w-full p-1 border rounded reactant-mole' id='mr" + i + "' data-idx='" + i + "' data-mass='" + reactarr[i - 1] + "' data-ratio='" + reactratio[i - 1] + "' placeholder='Enter moles' /></td>";
        val += "<td class='border-b p-2'><input type='number' step='any' class='w-full p-1 border rounded reactant-weight' id='wr" + i + "' data-idx='" + i + "' data-mass='" + reactarr[i - 1] + "' data-ratio='" + reactratio[i - 1] + "' placeholder='Enter weight' /></td>";
        val += "</tr>";
      }

      val += "<tr><th class='border-b-2 p-2 bg-gray-100' colspan='5'>" + (data?.payload?.tech_lang_keys?.['12'] || 'Products') + "</th></tr>";

      for (let j = 1; j <= plen; j++) {
        val += "<tr>";
        val += "<td class='border-b p-2'>" + product[j - 1] + "</td>";
        val += "<td class='border-b p-2'>" + prodratio[j - 1] + "</td>";
        val += "<td class='border-b p-2'>" + prodarr[j - 1].toFixed(2) + "</td>";
        val += "<td class='border-b p-2'><input type='text' class='w-full p-1 border rounded bg-gray-100' id='mp" + j + "' readonly /></td>";
        val += "<td class='border-b p-2'><input type='text' class='w-full p-1 border rounded bg-gray-100' id='wp" + j + "' readonly /></td>";
        val += "</tr>";
      }

      val += "</table>";
      val += "<div class='p-2 mx-auto mt-4'><input class='w-full p-2 border-2 rounded bg-yellow-50 text-center font-bold text-lg' id='opp' type='text' readonly placeholder='Limiting reactant will appear here' /></div>";

      const tableDiv = document.querySelector('.table');
      
      if (tableDiv) {
        tableDiv.innerHTML = val;
        
        // Verify table was inserted
        const insertedTable = tableDiv.querySelector('table');

        // Attach event listeners for calculation
        const mole = [];
        const wt = [];
        const op = [];
        const weight = [];

        const calculateLimiting = () => {
          const n = rlen;
          const s = plen;

          // Clear previous mole values
          for (let z = 0; z < n; z++) {
            mole[z] = undefined;
          }

          // Get input values and validate
          let hasValidInput = false;
          for (let z = 1; z <= n; z++) {
            const wrInput = document.getElementById("wr" + z);
            const mrInput = document.getElementById("mr" + z);
            
            if (wrInput && wrInput.value && wrInput.value.trim() !== "") {
              const weightValue = parseFloat(wrInput.value);
              if (!isNaN(weightValue) && weightValue > 0) {
                const mass = parseFloat(wrInput.dataset.mass);
                mole[z - 1] = weightValue / mass;
                if (mrInput) mrInput.value = mole[z - 1].toFixed(4);
                hasValidInput = true;
              } else {
                // Clear corresponding mole field if weight is invalid
                if (mrInput) mrInput.value = '';
              }
            } else if (mrInput && mrInput.value && mrInput.value.trim() !== "") {
              const moleValue = parseFloat(mrInput.value);
              if (!isNaN(moleValue) && moleValue > 0) {
                const mass = parseFloat(mrInput.dataset.mass);
                wt[z - 1] = moleValue * mass;
                if (wrInput) wrInput.value = wt[z - 1].toFixed(4);
                mole[z - 1] = moleValue;
                hasValidInput = true;
              } else {
                // Clear corresponding weight field if mole is invalid
                if (wrInput) wrInput.value = '';
              }
            } else {
              // Both fields are empty, clear any previous values
              if (mrInput) mrInput.value = '';
              if (wrInput) wrInput.value = '';
            }
          }

          // If no valid input, clear products and return
          if (!hasValidInput) {
            for (let m = 1; m <= s; m++) {
              const mpInput = document.getElementById("mp" + m);
              const wpInput = document.getElementById("wp" + m);
              if (mpInput) mpInput.value = '';
              if (wpInput) wpInput.value = '';
            }
            const oppInput = document.getElementById("opp");
            if (oppInput) oppInput.value = '';
            return;
          }

          // Filter out undefined/invalid moles
          const validMoles = mole.filter(m => m !== undefined && !isNaN(m) && m > 0);
          
          if (validMoles.length === 0) {
            // Clear products if no valid moles
            for (let m = 1; m <= s; m++) {
              const mpInput = document.getElementById("mp" + m);
              const wpInput = document.getElementById("wp" + m);
              if (mpInput) mpInput.value = '';
              if (wpInput) wpInput.value = '';
            }
            const oppInput = document.getElementById("opp");
            if (oppInput) oppInput.value = '';
            return;
          }

          // Find minimum mole (limiting reactant)
          const minimum = Math.min(...validMoles);
          let ac, lr;

          for (let k = 1; k <= n; k++) {
            if (mole[k - 1] !== undefined && minimum === mole[k - 1]) {
              ac = reactratio[k - 1];
              lr = reactant[k - 1];
              const oppInput = document.getElementById("opp");
              if (oppInput) {
                oppInput.value = (data?.payload?.tech_lang_keys?.['13'] || 'Limiting Reactant: ') + lr;
              }
              break;
            }
          }

          // Calculate products only if we have a limiting reactant
          if (ac && lr) {
            for (let m = 1; m <= s; m++) {
              const bc = prodratio[m - 1];
              op[m - 1] = (bc / ac) * minimum;
              const molar = prodarr[m - 1];
              weight[m - 1] = molar * op[m - 1];

              const mpInput = document.getElementById("mp" + m);
              const wpInput = document.getElementById("wp" + m);
              
              if (mpInput) mpInput.value = op[m - 1].toFixed(4);
              if (wpInput) wpInput.value = weight[m - 1].toFixed(4);
            }
          }
        };

        // Use event delegation on table div for better performance and reliability
        tableDiv.addEventListener('input', function(e) {
          if (e.target.classList.contains('reactant-mole') || e.target.classList.contains('reactant-weight')) {
            calculateLimiting();
          }
        });
        
        tableDiv.addEventListener('change', function(e) {
          if (e.target.classList.contains('reactant-mole') || e.target.classList.contains('reactant-weight')) {
            calculateLimiting();
          }
        });
        
      } else {
        console.error("Table div not found!");
      }

    } catch (error) {
      console.error('Error processing equation:', error);
      const msgDiv = document.getElementById('message');
      if (msgDiv) msgDiv.textContent = error.errormsg || error.toString();
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
                  className="flex border rounded-lg p-1 items-center hover:bg-gray-100" 
                  onClick={loadExample}  
                  aria-label="Load Example"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-up-right size-5 me-1">
                    <path d="M7 7h10v10"></path>
                    <path d="M7 17 17 7"></path>
                  </svg>
                  {data?.payload?.tech_lang_keys?.['2'] || 'Load Example'}
                </button>
              </div>
              <div className="col-span-12">
                <div className="col-span-12 md:col-span-4 lg:col-span-4 flex justify-between">
                  <label htmlFor="tech_eq" className="label mt-4">
                    {data?.payload?.tech_lang_keys?.['1'] || 'Enter Equation'}:
                  </label>
                </div>
                <div className="w-full py-2 relative">
                  <input
                    type="text"
                    step="any"
                    name="tech_eq"
                    id="tech_eq"
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
                      <td className="check t3 cursor-pointer hover:bg-gray-200" onClick={() => setFormData({...formData, tech_eq: formData.tech_eq + 'H'})}>H</td>
                      <td colSpan="16"></td>
                      <td className="check t6 cursor-pointer hover:bg-gray-200" onClick={() => setFormData({...formData, tech_eq: formData.tech_eq + 'He'})}>He</td>
                    </tr>
                    <tr>
                      <td className="check t4 cursor-pointer hover:bg-gray-200" onClick={() => setFormData({...formData, tech_eq: formData.tech_eq + 'Li'})}>Li</td>
                      <td className="check t5 cursor-pointer hover:bg-gray-200" onClick={() => setFormData({...formData, tech_eq: formData.tech_eq + 'Be'})}>Be</td>
                      <td colSpan="10"></td>
                      <td className="check t9 cursor-pointer hover:bg-gray-200" onClick={() => setFormData({...formData, tech_eq: formData.tech_eq + 'B'})}>B</td>
                      <td className="check t3 cursor-pointer hover:bg-gray-200" onClick={() => setFormData({...formData, tech_eq: formData.tech_eq + 'C'})}>C</td>
                      <td className="check t3 cursor-pointer hover:bg-gray-200" onClick={() => setFormData({...formData, tech_eq: formData.tech_eq + 'N'})}>N</td>
                      <td className="check t3 cursor-pointer hover:bg-gray-200" onClick={() => setFormData({...formData, tech_eq: formData.tech_eq + 'O'})}>O</td>
                      <td className="check t3 cursor-pointer hover:bg-gray-200" onClick={() => setFormData({...formData, tech_eq: formData.tech_eq + 'F'})}>F</td>
                      <td className="check t6 cursor-pointer hover:bg-gray-200" onClick={() => setFormData({...formData, tech_eq: formData.tech_eq + 'Ne'})}>Ne</td>
                    </tr>
                    <tr>
                      <td className="check t4 cursor-pointer hover:bg-gray-200" onClick={() => setFormData({...formData, tech_eq: formData.tech_eq + 'Na'})}>Na</td>
                      <td className="check t5 cursor-pointer hover:bg-gray-200" onClick={() => setFormData({...formData, tech_eq: formData.tech_eq + 'Mg'})}>Mg</td>
                      <td colSpan="10"></td>
                      <td className="check t2 cursor-pointer hover:bg-gray-200" onClick={() => setFormData({...formData, tech_eq: formData.tech_eq + 'Al'})}>Al</td>
                      <td className="check t9 cursor-pointer hover:bg-gray-200" onClick={() => setFormData({...formData, tech_eq: formData.tech_eq + 'Si'})}>Si</td>
                      <td className="check t3 cursor-pointer hover:bg-gray-200" onClick={() => setFormData({...formData, tech_eq: formData.tech_eq + 'P'})}>P</td>
                      <td className="check t3 cursor-pointer hover:bg-gray-200" onClick={() => setFormData({...formData, tech_eq: formData.tech_eq + 'S'})}>S</td>
                      <td className="check t3 cursor-pointer hover:bg-gray-200" onClick={() => setFormData({...formData, tech_eq: formData.tech_eq + 'Cl'})}>Cl</td>
                      <td className="check t6 cursor-pointer hover:bg-gray-200" onClick={() => setFormData({...formData, tech_eq: formData.tech_eq + 'Ar'})}>Ar</td>
                    </tr>
                    <tr>
                      <td className="check t4 cursor-pointer hover:bg-gray-200" onClick={() => setFormData({...formData, tech_eq: formData.tech_eq + 'K'})}>K</td>
                      <td className="check t5 cursor-pointer hover:bg-gray-200" onClick={() => setFormData({...formData, tech_eq: formData.tech_eq + 'Ca'})}>Ca</td>
                      <td className="check t1 cursor-pointer hover:bg-gray-200" onClick={() => setFormData({...formData, tech_eq: formData.tech_eq + 'Sc'})}>Sc</td>
                      <td className="check t1 cursor-pointer hover:bg-gray-200" onClick={() => setFormData({...formData, tech_eq: formData.tech_eq + 'Ti'})}>Ti</td>
                      <td className="check t1 cursor-pointer hover:bg-gray-200" onClick={() => setFormData({...formData, tech_eq: formData.tech_eq + 'V'})}>V</td>
                      <td className="check t1 cursor-pointer hover:bg-gray-200" onClick={() => setFormData({...formData, tech_eq: formData.tech_eq + 'Cr'})}>Cr</td>
                      <td className="check t1 cursor-pointer hover:bg-gray-200" onClick={() => setFormData({...formData, tech_eq: formData.tech_eq + 'Mn'})}>Mn</td>
                      <td className="check t1 cursor-pointer hover:bg-gray-200" onClick={() => setFormData({...formData, tech_eq: formData.tech_eq + 'Fe'})}>Fe</td>
                      <td className="check t1 cursor-pointer hover:bg-gray-200" onClick={() => setFormData({...formData, tech_eq: formData.tech_eq + 'Co'})}>Co</td>
                      <td className="check t1 cursor-pointer hover:bg-gray-200" onClick={() => setFormData({...formData, tech_eq: formData.tech_eq + 'Ni'})}>Ni</td>
                      <td className="check t1 cursor-pointer hover:bg-gray-200" onClick={() => setFormData({...formData, tech_eq: formData.tech_eq + 'Cu'})}>Cu</td>
                      <td className="check t1 cursor-pointer hover:bg-gray-200" onClick={() => setFormData({...formData, tech_eq: formData.tech_eq + 'Zn'})}>Zn</td>
                      <td className="check t2 cursor-pointer hover:bg-gray-200" onClick={() => setFormData({...formData, tech_eq: formData.tech_eq + 'Ga'})}>Ga</td>
                      <td className="check t9 cursor-pointer hover:bg-gray-200" onClick={() => setFormData({...formData, tech_eq: formData.tech_eq + 'Ge'})}>Ge</td>
                      <td className="check t9 cursor-pointer hover:bg-gray-200" onClick={() => setFormData({...formData, tech_eq: formData.tech_eq + 'As'})}>As</td>
                      <td className="check t3 cursor-pointer hover:bg-gray-200" onClick={() => setFormData({...formData, tech_eq: formData.tech_eq + 'Se'})}>Se</td>
                      <td className="check t3 cursor-pointer hover:bg-gray-200" onClick={() => setFormData({...formData, tech_eq: formData.tech_eq + 'Br'})}>Br</td>
                      <td className="check t6 cursor-pointer hover:bg-gray-200" onClick={() => setFormData({...formData, tech_eq: formData.tech_eq + 'Kr'})}>Kr</td>
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
                      <td colSpan="4" className="text-start"><strong>{data?.payload?.tech_lang_keys?.['3'] || 'Lanthanides'}</strong></td>
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
                      <td colSpan="4" className="text-start"><strong>{data?.payload?.tech_lang_keys?.['4'] || 'Actinides'}</strong></td>
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
                        <td id="spc" className="text-white radius-20 bt_set cursor-pointer hover:opacity-80" onClick={() => setFormData({...formData, tech_eq: formData.tech_eq + ' '})}>{data?.payload?.tech_lang_keys?.['5'] || 'Space'}</td>
                        <td className="check t6 cursor-pointer hover:bg-gray-200" onClick={() => setFormData({...formData, tech_eq: formData.tech_eq + '1'})}>1</td>
                        <td className="check t6 cursor-pointer hover:bg-gray-200" onClick={() => setFormData({...formData, tech_eq: formData.tech_eq + '2'})}>2</td>
                        <td className="check t6 cursor-pointer hover:bg-gray-200" onClick={() => setFormData({...formData, tech_eq: formData.tech_eq + '3'})}>3</td>
                        <td className="check t6 cursor-pointer hover:bg-gray-200" onClick={() => setFormData({...formData, tech_eq: formData.tech_eq + '4'})}>4</td>
                        <td className="check t6 cursor-pointer hover:bg-gray-200" onClick={() => setFormData({...formData, tech_eq: formData.tech_eq + '5'})}>5</td>
                        <td className="check t6 cursor-pointer hover:bg-gray-200" onClick={() => setFormData({...formData, tech_eq: formData.tech_eq + '6'})}>6</td>
                        <td className="check t6 cursor-pointer hover:bg-gray-200" onClick={() => setFormData({...formData, tech_eq: formData.tech_eq + '7'})}>7</td>
                        <td className="check t6 cursor-pointer hover:bg-gray-200" onClick={() => setFormData({...formData, tech_eq: formData.tech_eq + '8'})}>8</td>
                        <td className="check t6 cursor-pointer hover:bg-gray-200" onClick={() => setFormData({...formData, tech_eq: formData.tech_eq + '9'})}>9</td>
                        <td className="check t6 cursor-pointer hover:bg-gray-200" onClick={() => setFormData({...formData, tech_eq: formData.tech_eq + '0'})}>0</td>
                        <td className="check t6 cursor-pointer hover:bg-gray-200" onClick={() => setFormData({...formData, tech_eq: formData.tech_eq + '+'})}>+</td>
                        <td className="check t6 cursor-pointer hover:bg-gray-200" onClick={() => setFormData({...formData, tech_eq: formData.tech_eq + '='})}>=</td>
                        <td id="clr" className="text-white radius-20 bt_set cursor-pointer hover:opacity-80" onClick={() => setFormData({...formData, tech_eq: ''})}>{data?.payload?.tech_lang_keys?.['6'] || 'Clear'}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6 mt-10 text-center space-x-2">
            <Button type="submit" isLoading={calculateDogLoading}>
              {data?.payload?.tech_lang_keys?.["calculate"] ?? "Calculate"}
            </Button>
            {result && (
              <ResetButton type="button" onClick={handleReset}>
                {data?.payload?.tech_lang_keys?.["locale"] === "en" ? "RESET" : data?.payload?.tech_lang_keys?.["reset"] || "RESET"}
              </ResetButton>
            )}
          </div>
        </div>

        <div className="lg:w-[100%] w-full  mx-auto">
          <div className="col-span-12">
            {calculateDogLoading && (
              <div className="result_calculator rounded-lg p-6">
                <div className="animate-pulse space-y-4">
                  <div className="h-6 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                </div>
              </div>
            )}
            
            {result !== null && !calculateDogLoading && (
              <div className="w-full result mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg space-y-6">
                <ResultActions lang={data?.payload?.tech_lang_keys} />
                
                <div className="rounded-lg flex items-center justify-center">
                  <div className="w-full result p-3 rounded-lg mt-3">
                    <div className="flex justify-center">
                      <div className="w-full text-center text-lg">
                        <div className="mb-4">
                          <h3 className="text-xl font-bold mb-2">Your Input</h3>
                          <p className="text-lg">{result?.teach_inp || result?.tech_inp || formData.tech_eq}</p>
                        </div>
                        
                        <div className='result overflow-auto ' id='resid'>
                          <div className='text-center mt-3 mb-3'>
                            <strong id='re' className="text-xl"></strong>
                          </div>
                          <div id='eqre' className="text-center text-2xl mb-4 ">
                            <span id='equ'></span>
                          </div>
                          <div className="text-center mb-2 ">
                            <span id='message' className="text-red-500 font-semibold"></span>
                          </div>
                          <code id='result'></code>
                          <div className='table mt-4 overflow-auto result_custom_inputs'></div>
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

export default LimitingReactantCalculator;
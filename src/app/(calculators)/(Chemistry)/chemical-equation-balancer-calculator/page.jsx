"use client";

import React, { useEffect, useState } from "react";
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
  useChemicalEquationBalancerCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

const ChemicalEquationBalancer = () => {
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
    tech_eq: "CH4 + O2 = CO2 + H2O",
    tech_type: "stoichiometry",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");
  const [balancedData, setBalancedData] = useState(null);

  const [
    CatAgeCalculator,
    { isLoading: calculateDogLoading, isError, error: calculateLoveError },
  ] = useChemicalEquationBalancerCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setBalancedData(null);
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
      setFormError(err.data.payload.error);
      toast.error(err.data.payload.error);
    }
  };

  const handleReset = () => {
    setFormData({
      tech_eq: "CH4 + O2 = CO2 + H2O",
      tech_type: "stoichiometry",
    });
    setResult(null);
    setFormError(null);
    setBalancedData(null);
    
    // Clear DOM elements
    const equElem = document.getElementById("equ");
    const reElem = document.getElementById("re");
    const tableElem = document.getElementById("tabledata");
    if (equElem) equElem.innerHTML = "";
    if (reElem) reElem.textContent = "";
    if (tableElem) tableElem.innerHTML = "";
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

  // Execute calculation when result is available
  useEffect(() => {
    if (result && result.tech_option === 2 && result.tech_chemical_equation) {
      // Clear previous results first
      const equElem = document.getElementById("equ");
      const reElem = document.getElementById("re");
      const tableElem = document.getElementById("tabledata");
      if (equElem) equElem.innerHTML = "";
      if (reElem) reElem.textContent = "";
      if (tableElem) tableElem.innerHTML = "";
      
      setTimeout(() => {
        runChemicalCalculation(result, formData.tech_type);
      }, 100);
    }
  }, [result]);

  const exampleEquations = [
    "CH4 + O2 = CO2 + H2O",
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
    setBalancedData(null);
  };

  const loadExampleFromList = (equation) => {
    setFormData({
      ...formData,
      tech_eq: equation,
    });
    setFormError("");
    setResult(null);
    setBalancedData(null);
  };

  // Complete Chemical Calculation Function
  const runChemicalCalculation = (resultData, calcType) => {
    try {
      var ions = true;
      var colorCodes = {};
      var reactant = [];
      var product = [];
      var reactratio = [];
      var prodratio = [];
      var reactarr = [];
      var prodarr = [];
      
      var symb = ['H', 'He', 'Li', 'Be', 'B', 'C', 'N', 'O', 'F', 'Ne', 'Na', 'Mg', 'Al', 'Si', 'P', 'S', 'Cl', 'Ar', 'K', 'Ca', 'Sc', 'Ti', 'V', 'Cr', 'Mn', 'Fe', 'Co', 'Ni', 'Cu', 'Zn', 'Ga', 'Ge', 'As', 'Se', 'Br', 'Kr', 'Rb', 'Sr', 'Y', 'Zr', 'Nb', 'Mo', 'Tc', 'Ru', 'Rh', 'Pd', 'Ag', 'Cd', 'In', 'Sn', 'Sb', 'Te', 'I', 'Xe', 'Cs', 'Ba', 'La', 'Ce', 'Pr', 'Nd', 'Pm', 'Sm', 'Eu', 'Gd', 'Tb', 'Dy', 'Ho', 'Er', 'Tm', 'Yb', 'Lu', 'Hf', 'Ta', 'W', 'Re', 'Os', 'Ir', 'Pt', 'Au', 'Hg', 'Tl', 'Pb', 'Bi', 'Po', 'At', 'Rn', 'Fr', 'Ra', 'Ac', 'Th', 'Pa', 'U', 'Np', 'Pu', 'Am', 'Cm', 'Bk', 'Cf', 'Es', 'Fm', 'Md', 'No', 'Lr', 'Rf', 'Db', 'Sg', 'Bh', 'Hs', 'Mt', 'Ds', 'Rg', 'Cn', 'Uut', 'Uuq', 'Uup', 'Uuh', 'Uus', 'Uuo'];
      
      var aweight = [1.00794, 4.002602, 6.941, 9.012182, 10.811, 12.0107, 14.0067, 15.9994, 18.9984032, 20.1797, 22.9897693, 24.305, 26.9815386, 28.0855, 30.973762, 32.065, 35.453, 39.948, 39.0983, 40.078, 44.955912, 47.867, 50.9415, 51.9961, 54.938045, 55.845, 58.933195, 58.6934, 63.546, 65.38, 69.723, 72.63, 74.9216, 78.96, 79.904, 83.798, 85.4678, 87.62, 88.90585, 91.224, 92.90638, 95.96, 98, 101.07, 102.9055, 106.42, 107.8682, 112.411, 114.818, 118.71, 121.76, 127.6, 126.90447, 131.293, 132.9054519, 137.327, 138.90547, 140.116, 140.90765, 144.242, 145, 150.36, 151.964, 157.25, 158.92535, 162.5, 164.93032, 167.259, 168.93421, 173.054, 174.9668, 178.49, 180.94788, 183.84, 186.207, 190.23, 192.217, 195.084, 196.966569, 200.59, 204.3833, 207.2, 208.9804, 209, 210, 222, 223, 226, 227, 232.03806, 231.03588, 238.02891, 237, 244, 243, 247, 247, 251, 252, 257, 258, 259, 262, 267, 268, 271, 272, 270, 276, 281, 280, 285, 284, 289, 288, 293, 294, 294];
      
      var balancedElem = document.getElementById("equ");
      var reElem = document.getElementById("re");
      
      if (!balancedElem || !reElem) return;

      // Helper functions
      function shuffle(o){ 
        for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
        return o;
      }
      
      function setError(str) {
        var msgElem = document.getElementById("message");
        if (msgElem) msgElem.textContent = str;
      }
      
      function Tnizer(stri) {
        var posi = 0;
        this.position = function() { return posi; }
        this.peek = function() {
          if (posi == stri.length) return null;
          var match = /^([A-Za-z][a-z]*|[0-9]+| +|[+\-^=()])/.exec(stri.substring(posi));
          if (match == null) throw {errormsg: "Invalid symbol ", start: posi};
          var token = match[0];
          if (/^ +$/.test(token)) {
            posi += token.length;
            token = this.peek();
          }
          return token;
        }
        this.take = function() {
          var result = this.peek();
          posi += result.length;
          return result;
        }
      }

      function pEquation(tokstr) {
        var lside = [];
        var rside = [];
        lside.push(parseTerm(tokstr));
        while (true) {
          var nextstr = tokstr.peek();
          if (nextstr == "=") break;
          if (nextstr == null) throw {errormsg: "Plus or equal sign expected", start: tokstr.position()};
          if (nextstr != "+") throw {errormsg: "Plus expected", start: tokstr.position()};
          tokstr.take();  
          lside.push(parseTerm(tokstr));
        }
        if (tokstr.take() != "=") throw "Assertion error";
        rside.push(parseTerm(tokstr));
        while (true) {
          var nextstr = tokstr.peek();
          if (nextstr == null) break;
          if (nextstr != "+") throw {errormsg: "Plus expected", start: tokstr.position()};
          tokstr.take();  
          rside.push(parseTerm(tokstr));
        }
        return new EquationFun(lside, rside);
      }

      function parseTerm(tokstr) {
        var startPosition = tokstr.position();  
        var items_array = [];
        while (true) {
          var nextstr = tokstr.peek();
          if (nextstr == null) break;
          else if (nextstr == "(") items_array.push(parseGroup(tokstr));
          else if (/^[A-Za-z][a-z]*$/.test(nextstr)) items_array.push(parseElement(tokstr));
          else break;
        }
        var charge = 0;
        var nextstr = tokstr.peek();
        if (nextstr != null && nextstr == "^") {
          tokstr.take();  
          nextstr = tokstr.peek();
          if (nextstr == null) throw {errormsg: "Number or sign expected", start: tokstr.position()};
          else if (/^[0-9]+$/.test(nextstr)) {
            charge = checkedParseInt(nextstr, 10);
            tokstr.take();  
            nextstr = tokstr.peek();
          } else charge = 1;
          if (nextstr == null) throw {errormsg: "Sign expected", start: tokstr.position()};
          else if (nextstr == "+");  
          else if (nextstr == "-") charge = -charge;
          else throw {errormsg: "Sign expected", start: tokstr.position()};
          tokstr.take();  
        }
        var elements = new Set();
        for (var i = 0; i < items_array.length; i++)
          items_array[i].getElements(elements);
        elements = elements.toArray();  
        if (items_array.length == 0) {
          throw {errormsg: "Invalid term ", start: startPosition, end: tokstr.position()};
        } else if (indexOf(elements, "e") != -1) {  
          if (items_array.length > 1 || charge != 0 && charge != -1)
            throw {errormsg: "Invalid term ", start: startPosition, end: tokstr.position()};
          items_array = [];
          charge = -1;
        } else {  
          for (var i = 0; i < elements.length; i++) {
            if (/^[a-z]+$/.test(elements[i]))
              throw {errormsg: "Invalid element "+elements[i],start: startPosition, end: tokstr.position()};
          }
        }
        return new checkTerm(items_array, charge);
      }

      function createMatrix(eqn) {
        var elements = eqn.getElements(); 
        var m_rows = elements.length + 1;
        var M_cols = eqn.getLeftSide().length + eqn.getRightSide().length + 1;
        var matrix = new Matrix(m_rows, M_cols);
        for (var i = 0; i < elements.length; i++) {
          var j = 0;
          for (var k = 0, lside = eqn.getLeftSide() ; k < lside.length; j++, k++)
            matrix.set(i, j,  lside[k].countElement(elements[i]));
          for (var k = 0, rside = eqn.getRightSide(); k < rside.length; j++, k++)
            matrix.set(i, j, -rside[k].countElement(elements[i]));
        }
        return matrix;
      }

      function solveEq(matrix) {
        matrix.GJ_Eliminate();
        var i;
        for (i = 0; i < matrix.rowCount() - 1; i++) {
          if (CNZeroCoeffs(matrix, i) > 1) break;
        }
        if (i == matrix.rowCount() - 1) throw "Element combination incorrect"; 
        matrix.set(matrix.rowCount() - 1, i, 1);
        matrix.set(matrix.rowCount() - 1, matrix.columnCount() - 1, 1);
        matrix.GJ_Eliminate();
      }

      function CNZeroCoeffs(matrix, row) {
        var count = 0;
        for (var i = 0; i < matrix.columnCount(); i++) {
          if (matrix.get(row, i) != 0) count++;
        }
        return count;
      }

      function splitCoeffic(matrix) {
        var m_rows = matrix.rowCount();
        var M_cols = matrix.columnCount();
        if (M_cols - 1 > m_rows || matrix.get(M_cols - 2, M_cols - 2) == 0)
          throw "No unique solution";
        var lcm = 1;
        for (var i = 0; i < M_cols - 1; i++)
          lcm = checkedMultiply(lcm / gcd(lcm, matrix.get(i, i)), matrix.get(i, i));
        var coefficients = [];
        var allzero = true;
        for (var i = 0; i < M_cols - 1; i++) {
          var coef = checkedMultiply(lcm / matrix.get(i, i), matrix.get(i, M_cols - 1));
          coefficients.push(coef);
          allzero &= coef == 0;
        }
        if (allzero) throw "Assertion error: All zero solution";
        return coefficients;
      }

      function checkAnswer(eqn, coefficients) {
        if (coefficients.length != eqn.getLeftSide().length + eqn.getRightSide().length)
          throw "Assertion error: Mismatched length";
        var allzero = true;
        for (var i = 0; i < coefficients.length; i++) {
          var coef = coefficients[i];
          if (typeof coef != "number" || isNaN(coef) || Math.floor(coef) != coef)
            throw "Assertion error: Not an integer";
          allzero &= coef == 0;
        }
        if (allzero) throw "Assertion error: Solution of all zeros";
        var elements = eqn.getElements();
        for (var i = 0; i < elements.length; i++) {
          var sum = 0;
          var j = 0;
          for (var k = 0, lside = eqn.getLeftSide() ; k < lside.length; j++, k++)
            sum = checkedAdd(sum, checkedMultiply(lside[k].countElement(elements[i]),  coefficients[j]));
          for (var k = 0, rside = eqn.getRightSide(); k < rside.length; j++, k++)
            sum = checkedAdd(sum, checkedMultiply(rside[k].countElement(elements[i]), -coefficients[j]));
          if (sum != 0) throw "Assertion error: Balance failed";
        }
      }

      function EquationFun(lside, rside) {
        lside = copyArray(lside);
        rside = copyArray(rside);
        this.getLeftSide  = function() { return copyArray(lside); }
        this.getRightSide = function() { return copyArray(rside); }
        this.getElements = function() {
          var result = new Set();
          for (var i = 0; i < lside.length; i++) lside[i].getElements(result);
          for (var i = 0; i < rside.length; i++) rside[i].getElements(result);
          return result.toArray();
        }
        this.toHtml = function(coefficients) {
          if (coefficients !== undefined && coefficients.length != lside.length + rside.length)
            throw "Mismatched number of coefficients";
          var node = document.createElement("span");
          var initial = true;
          for (var i = 0; i < lside.length; i++) {
            var coef = coefficients !== undefined ? coefficients[i] : 1;
            if (coef != 0) {
              if (initial) initial = false;
              else node.appendChild(document.createTextNode(" + "));
              if (coef != 1) {
                var disp = document.createElement("span");
                disp.setAttribute("style","font-weight:bold;color:blue;padding-left:0.5%;padding-right:0.5%;");
                disp.appendChild(document.createTextNode(coef.toString().replace(/-/, "\u2212")));
                node.appendChild(disp);
              }
              reactratio.push(coef);
              reactant.push(lside[i].toHtml().innerText);
              node.appendChild(lside[i].toHtml());
            }
          }
          var disp = document.createElement("span");
          disp.setAttribute("style","font-weight:bold;color:green;font-size:30px;");
          disp.appendChild(document.createTextNode(" \u2192 "));
          node.appendChild(disp);
          initial = true;
          for (var i = 0; i < rside.length; i++) {
            var coef = coefficients !== undefined ? coefficients[lside.length + i] : 1;
            if (coef != 0) {
              if (initial) initial = false;
              else node.appendChild(document.createTextNode(" + "));
              if (coef != 1) {
                var disp = document.createElement("span");
                disp.setAttribute("style","font-weight:bold;color:blue;padding-left:0.5%;padding-right:0.5%;");
                disp.appendChild(document.createTextNode(coef.toString().replace(/-/, "\u2212")));
                node.appendChild(disp);
              }
              prodratio.push(coef);
              product.push(rside[i].toHtml().innerText);
              node.appendChild(rside[i].toHtml());
            }
          }
          return node;
        }
      }

      function checkTerm(items_array, charge) {
        if(charge!=0) ions = false;    
        if(ions==false && charge!=0) throw "Invalid term, Elements without Ions";
        if (items_array.length == 0 && charge != -1) throw "Invalid term ";
        items_array = copyArray(items_array);
        this.getItems = function() { return copyArray(items_array); }
        this.getElements = function(result) {
          result.add("e");
          for (var i = 0; i < items_array.length; i++) items_array[i].getElements(result);
        }
        this.countElement = function(name) {
          if (name == "e") {
            return -charge;
          } else {
            var sum = 0;
            for (var i = 0; i < items_array.length; i++)
              sum = checkedAdd(sum, items_array[i].countElement(name));
            return sum;
          }
        }
        this.toHtml = function() {
          var node = document.createElement("span");
          if (items_array.length == 0 && charge == -1) {
            node.appendChild(document.createTextNode("e"));
            var sup = document.createElement("sup");
            sup.appendChild(document.createTextNode("\u2212"));
            node.appendChild(sup);
          } else {
            for (var i = 0; i < items_array.length; i++)
              node.appendChild(items_array[i].toHtml());
            if (charge != 0) {
              var sup = document.createElement("sup");
              var s;
              if (Math.abs(charge) == 1) s = "";
              else s = Math.abs(charge).toString();
              if (charge > 0) s += "+";
              else s += "\u2212";
              sup.appendChild(document.createTextNode(s));
              node.appendChild(sup);
            }
          }
          return node;
        }
      }

      function Group(items_array, count) {
        if (count < 1) throw "Count must be a positive integer";
        items_array = copyArray(items_array);
        this.getItems = function() { return copyArray(items_array); }
        this.getCount = function() { return count; }
        this.getElements = function(result) {
          for (var i = 0; i < items_array.length; i++) items_array[i].getElements(result);
        }
        this.countElement = function(name) {
          var sum = 0;
          for (var i = 0; i < items_array.length; i++)
            sum = checkedAdd(sum, checkedMultiply(items_array[i].countElement(name), count));
          return sum;
        }
        this.toHtml = function() {
          var node = document.createElement("span");
          node.appendChild(document.createTextNode("("));
          for (var i = 0; i < items_array.length; i++)
            node.appendChild(items_array[i].toHtml());
          node.appendChild(document.createTextNode(")"));
          if (count != 1) {
            var sub = document.createElement("sub");
            sub.appendChild(document.createTextNode(count.toString()));
            node.appendChild(sub);
          }
          return node;
        }
      }

      function Element(name, count) {
        if (count < 1) throw "Count must be a positive integer";
        this.getName = function() { return name; }
        this.getCount = function() { return count; }
        this.getElements = function(result) { result.add(name); }
        this.countElement = function(n) { return n == name ? count : 0; }
        this.toHtml = function() {
          var node = document.createElement("span");
          node.setAttribute("style","color:#"+colorCodes[name]+";padding-left:0.5%;padding-right:0.5%");
          node.appendChild(document.createTextNode(name));
          if (count != 1) {
            var sub = document.createElement("sub");
            sub.appendChild(document.createTextNode(count.toString()));
            node.appendChild(sub);
          }
          return node;
        }
      }

      function parseGroup(tokstr) {
        if (tokstr.take() != "(") throw "Assertion error";
        var items_array = [];
        while (true) {
          var nextstr = tokstr.peek();
          if (nextstr == null) throw {errormsg: "Element, group, or closing parenthesis expected", start: tokstr.position()};
          else if (nextstr == "(") items_array.push(parseGroup(tokstr));
          else if (/^[A-Za-z][a-z]*$/.test(nextstr)) items_array.push(parseElement(tokstr));
          else if (nextstr == ")") break;
          else throw {errormsg: "Element, group, or closing parenthesis expected", start: tokstr.position()};
        }
        if (tokstr.take() != ")") throw "Assertion error";
        return new Group(items_array, parseCount(tokstr));
      }

      function parseElement(tokstr) {
        var name = tokstr.take();
        if (!/^[A-Za-z][a-z]*$/.test(name)) throw "Assertion error";
        return new Element(name, parseCount(tokstr));
      }

      function parseCount(tokstr) {
        var nextstr = tokstr.peek();
        if (nextstr != null && /^[0-9]+$/.test(nextstr))
          return checkedParseInt(tokstr.take(), 10);
        else
          return 1;
      }

      function Matrix(m_rows, M_cols) {
        var cells = [];
        for (var i = 0; i < m_rows; i++) {
          var row = [];
          for (var j = 0; j < M_cols; j++) row.push(0);
          cells.push(row);
        }
        this.rowCount = function() { return m_rows; }
        this.columnCount = function() { return M_cols; }
        this.get = function(r, c) {
          if (r < 0 || r >= m_rows || c < 0 || c >= M_cols) throw "Index out of bounds";
          return cells[r][c];
        }
        this.set = function(r, c, val) {
          if (r < 0 || r >= m_rows || c < 0 || c >= M_cols) throw "Index out of bounds";
          cells[r][c] = val;
        }
        function swapRows(i, j) {
          if (i < 0 || i >= m_rows || j < 0 || j >= m_rows) throw "Index out of bounds";
          var temp = cells[i];
          cells[i] = cells[j];
          cells[j] = temp;
        }
        function AdditionRows(x, y) {
          var z = copyArray(x);
          for (var i = 0; i < z.length; i++) z[i] = checkedAdd(x[i], y[i]);
          return z;
        }
        function multiplyRow(x, c) {
          var y = copyArray(x);
          for (var i = 0; i < y.length; i++) y[i] = checkedMultiply(x[i], c);
          return y;
        }
        function gcdRow(x) {
          var result = 0;
          for (var i = 0; i < x.length; i++) result = gcd(x[i], result);
          return result;
        }
        function simplifyRow(x) {
          var sign = 0;
          for (var i = 0; i < x.length; i++) {
            if (x[i] > 0) { sign = 1; break; }
            else if (x[i] < 0) { sign = -1; break; }
          }
          var y = copyArray(x);
          if (sign == 0) return y;
          var g = gcdRow(x) * sign;
          for (var i = 0; i < y.length; i++) y[i] /= g;
          return y;
        }
        this.GJ_Eliminate = function() {
          for (var i = 0; i < m_rows; i++) cells[i] = simplifyRow(cells[i]);
          var numPivots = 0;
          for (var i = 0; i < M_cols; i++) {
            var pivotRow = numPivots;
            while (pivotRow < m_rows && cells[pivotRow][i] == 0) pivotRow++;
            if (pivotRow == m_rows) continue;
            var pivot = cells[pivotRow][i];
            swapRows(numPivots, pivotRow);
            numPivots++;
            for (var j = numPivots; j < m_rows; j++) {
              var g = gcd(pivot, cells[j][i]);
              cells[j] = simplifyRow(AdditionRows(multiplyRow(cells[j], pivot / g), multiplyRow(cells[i], -cells[j][i] / g)));
            }
          }
          for (var i = m_rows - 1; i >= 0; i--) {
            var pivotCol = 0;
            while (pivotCol < M_cols && cells[i][pivotCol] == 0) pivotCol++;
            if (pivotCol == M_cols) continue;
            var pivot = cells[i][pivotCol];
            for (var j = i - 1; j >= 0; j--) {
              var g = gcd(pivot, cells[j][pivotCol]);
              cells[j] = simplifyRow(AdditionRows(multiplyRow(cells[j], pivot / g), multiplyRow(cells[i], -cells[j][pivotCol] / g)));
            }
          }
        }
      }

      function Set() {
        var items_array = [];
        this.add = function(obj) { if (indexOf(items_array, obj) == -1) items_array.push(obj); }
        this.contains = function(obj) { return items_array.indexOf(obj) != -1; }
        this.toArray = function() { return copyArray(items_array); }
      }

      var INT_MAX = 9007199254740992;

      function checkedParseInt(str) {
        var result = parseInt(str, 10);
        if (isNaN(result)) throw "Not a number";
        if (result <= -INT_MAX || result >= INT_MAX) throw "Arithmetic overflow";
        return result;
      }

      function checkedAdd(x, y) {
        var z = x + y;
        if (z <= -INT_MAX || z >= INT_MAX) throw "Arithmetic overflow";
        return z;
      }

      function checkedMultiply(x, y) {
        var z = x * y;
        if (z <= -INT_MAX || z >= INT_MAX) throw "Arithmetic overflow";
        return z;
      }

      function gcd(x, y) {
        if (typeof x != "number" || typeof y != "number" || isNaN(x) || isNaN(y))
          throw "Invalid argument ";
        x = Math.abs(x);
        y = Math.abs(y);
        while (y != 0) {
          var z = x % y;
          x = y;
          y = z;
        }
        return x;
      }

      function indexOf(array, item) {
        for (var i = 0; i < array.length; i++) {
          if (array[i] == item) return i;
        }
        return -1;
      }

      function copyArray(array) {
        return array.slice(0);
      }

      function convertReactant(reactantStr) {
        return reactantStr.replace(/\(([^)]+)\)(\d*)/g, (match, group1, group2) => {
          const multiplier = group2 ? parseInt(group2) : 1;
          const elements = group1.match(/[A-Z][a-z]?\d*/g);
          return elements.map(el => {
            let element = el.match(/([A-Z][a-z]?)(\d*)/);
            let baseElement = element[1];
            let count = element[2] ? parseInt(element[2]) : 1;
            let newCount = count * multiplier;
            return baseElement + (newCount > 1 ? newCount : '');
          }).join('');
        });
      }

      // Main execution
      reElem.textContent = "Balanced Equation";
      
      // Clear previous content
      balancedElem.innerHTML = "";
      
      var colorsCode = ["9933ff","3399ff","ff9933","ff3333","990099","004c99","4c9900","999900","994c00"];
      shuffle(colorsCode);
      
      var eqn;
      try {
        var input = resultData.tech_chemical_equation;
        var token = new Tnizer(input);
        eqn = pEquation(token);
      } catch (e) {
        setError("Equation error");
        return;
      }
      
      try {
        var matrix = createMatrix(eqn);
        solveEq(matrix);
        var coefficients = splitCoeffic(matrix);
        checkAnswer(eqn, coefficients);
        var eltLen = eqn.getElements().length;

        for(var colo=0; colo<eltLen; colo++){
          if (colo != 0) {
            colorCodes[eqn.getElements()[colo]] = colorsCode[colo];
          }
        }
        balancedElem.appendChild(eqn.toHtml(coefficients));
      } catch (e) {
        setError(e.toString());
        return;
      }

      var rlen = reactant.length;
      var plen = product.length;

      // Calculate molar masses
      for (var k=0; k<rlen; k++) {
        var mmass = 0, t_mass = 0;
        var converted = reactant[k].includes('(') || reactant[k].includes(')') 
          ? convertReactant(reactant[k]) 
          : reactant[k];
        var ans = converted.split(/(?=[A-Z])/);
        
        for(var i=0; i<ans.length; i++){
          var regex = /\d+/g;
          var matches = ans[i].match(regex);
          var index = matches ? matches[0] : 1;
          
          for(var j=0; j<symb.length; j++) {
            if(ans[i].split(/(?=[0-9])/)[0] == symb[j]){
              mmass = aweight[j] * index;
              t_mass += mmass;
            }
          }
        }
        reactarr[k] = t_mass;
      }

      for (var k=0; k<plen; k++) {
        var mmass = 0, t_mass = 0;
        var converted = product[k].includes('(') || product[k].includes(')') 
          ? convertReactant(product[k]) 
          : product[k];
        var ans = converted.split(/(?=[A-Z])/);
        
        for(var i=0; i<ans.length; i++){
          var regex = /\d+/g;
          var matches = ans[i].match(regex);
          var index = matches ? matches[0] : 1;
          
          for(var j=0; j<symb.length; j++) {
            if(ans[i].split(/(?=[0-9])/)[0] == symb[j]){
              mmass = aweight[j] * index;
              t_mass += mmass;
            }
          }
        }
        prodarr[k] = t_mass;
      }

      // Build table
      var val = "<table class='w-full border-collapse' cellspacing='0'>";
      val += "<tr><th class='border border-gray-300 p-2'>Compound</th><th class='border border-gray-300 p-2'>Coefficient</th><th class='border border-gray-300 p-2'>Molar Mass</th><th class='border border-gray-300 p-2'>Moles(g/mol)</th><th class='border border-gray-300 p-2'>Weight(g)</th></tr>";
      val += "<tr><th class='border border-gray-300 p-2 bg-gray-100' colspan=5>Reactants</th></tr>";
      
      for (var i = 1; i <= rlen; i++) {
        val += "<tr><td class='border border-gray-300 p-2'>" + reactant[i-1] + "</td><td class='border border-gray-300 p-2'>" + reactratio[i-1] + "</td><td class='border border-gray-300 p-2'>" + parseFloat(reactarr[i-1].toFixed(2)) + "</td><td class='border border-gray-300 p-2'><input type='text' class='input w-full p-1 border rounded molesInput' id='mr" + i + "' value='' data-coeff='" + reactratio[i-1] + "' data-mass='" + parseFloat(reactarr[i-1].toFixed(2)) + "'></td><td class='border border-gray-300 p-2'><input type='text' class='input w-full p-1 border rounded weightInput' id='wr" + i + "' value='' data-coeff='" + reactratio[i-1] + "' data-mass='" + parseFloat(reactarr[i-1].toFixed(2)) + "'></td></tr>";
      }
      
      val += "<tr><th class='border border-gray-300 p-2 bg-gray-100' colspan=5>Products</th></tr>";
      
      for (var j = 1; j <= plen; j++) {
        val += "<tr><td class='border border-gray-300 p-2'>" + product[j-1] + "</td><td class='border border-gray-300 p-2'>" + prodratio[j-1] + "</td><td class='border border-gray-300 p-2'>" + parseFloat(prodarr[j-1].toFixed(2)) + "</td><td class='border border-gray-300 p-2'><input type='text' class='input w-full p-1 border rounded molesInput' id='mp" + j + "' value='' data-coeff='" + prodratio[j-1] + "' data-mass='" + parseFloat(prodarr[j-1].toFixed(2)) + "'></td><td class='border border-gray-300 p-2'><input type='text' class='input w-full p-1 border rounded weightInput' id='wp" + j + "' data-coeff='" + prodratio[j-1] + "' data-mass='" + parseFloat(prodarr[j-1].toFixed(2)) + "'></td></tr>";
      }
      
      var tableElem = document.getElementById("tabledata");
      if (tableElem) {
        tableElem.innerHTML = val + "</table>";
      }

      // Store balanced data
      setBalancedData({
        reactants: reactant.map((r, i) => ({
          formula: r,
          coefficient: reactratio[i],
          molarMass: reactarr[i]
        })),
        products: product.map((p, i) => ({
          formula: p,
          coefficient: prodratio[i],
          molarMass: prodarr[i]
        }))
      });

      // Setup input handlers
      setTimeout(() => {
        const allInputs = document.querySelectorAll('.molesInput, .weightInput');
        allInputs.forEach(input => {
          input.addEventListener('keyup', function() {
            handleCalculation(this, calcType, rlen, plen);
          });
        });
      }, 100);

    } catch (err) {
      console.error("Calculation error:", err);
      setError(err.message || "Calculation failed");
    }
  };

  const handleCalculation = (element, typeValue, rlen, plen) => {
    var enter_class = element.classList;
    var enter_coeff = parseFloat(element.getAttribute('data-coeff'));
    var enter_mass = parseFloat(element.getAttribute('data-mass'));
    var enter_value = parseFloat(element.value);

    if (isNaN(enter_value)) return;

    function updateWeightInput(moleInput) {
      var mole_value = parseFloat(moleInput.value);
      var weightInput = moleInput.closest('tr').querySelector('.weightInput');
      if (weightInput) {
        weightInput.value = parseFloat((mole_value * enter_mass).toFixed(6));
      }
    }

    function updateMoleInput(weightInput) {
      var weight_value = parseFloat(weightInput.value);
      var moleInput = weightInput.closest('tr').querySelector('.molesInput');
      if (moleInput) {
        moleInput.value = parseFloat((weight_value / enter_mass).toFixed(6));
      }
    }

    if (enter_class.contains('molesInput')) {
      updateWeightInput(element);
    } else if (enter_class.contains('weightInput')) {
      updateMoleInput(element);
    }

    var enter_id = element.id;
    
    if (typeValue === "limiting") {
      if(enter_id == ("mr"+rlen) || enter_id == ("wr"+rlen)){
        if (enter_class.contains('molesInput')) {
          var mole_check = enter_value / enter_coeff;
          var weightInput = element.closest('tr').querySelector('.weightInput');
          if (weightInput) {
            weightInput.value = parseFloat((enter_value * enter_mass).toFixed(6));
          }
          updateLastInputs('.molesInput', mole_check, rlen);
        } else if (enter_class.contains('weightInput')) {
          var moleInput = element.closest('tr').querySelector('.molesInput');
          var mole_value = enter_value / enter_mass;
          if (moleInput) {
            moleInput.value = parseFloat(mole_value.toFixed(6));
          }
          var mole_check = mole_value / enter_coeff;
          updateLastInputs('.weightInput', mole_check, rlen);
        }
      }
    } else {
      if (enter_class.contains('molesInput')){
        var mole_check = enter_value / enter_coeff;
        document.querySelectorAll('.molesInput').forEach((moleInput) => {
          if (element !== moleInput) {
            var moles_coeff = parseFloat(moleInput.getAttribute('data-coeff'));
            var moles_mass = parseFloat(moleInput.getAttribute('data-mass'));
            var react_moles_ans = moles_coeff * mole_check;
            moleInput.value = parseFloat(react_moles_ans.toFixed(6));
            var correspondingWeightInput = moleInput.closest('tr').querySelector('.weightInput');
            if (correspondingWeightInput) {
              correspondingWeightInput.value = parseFloat((react_moles_ans * moles_mass).toFixed(6));
            }
          }
        });
      } else {
        var moleInput = element.closest('tr').querySelector('.molesInput');
        var mole_value = enter_value / enter_mass;
        if (moleInput) {
          moleInput.value = parseFloat(mole_value.toFixed(6));
        }
        var mole_check = mole_value / enter_coeff;
        document.querySelectorAll('.weightInput').forEach((weightInput) => {
          if (element !== weightInput) {
            var moles_coeff = parseFloat(weightInput.getAttribute('data-coeff'));
            var moles_mass = parseFloat(weightInput.getAttribute('data-mass'));
            var react_moles_ans = moles_coeff * mole_check;
            var correspondingMoleInput = weightInput.closest('tr').querySelector('.molesInput');
            if (correspondingMoleInput) {
              correspondingMoleInput.value = parseFloat(react_moles_ans.toFixed(6));
            }
            weightInput.value = parseFloat((react_moles_ans * moles_mass).toFixed(6));
          }
        });
      }
    }
  };

  function updateLastInputs(selector, mole_check, rlen) {
    var inputs = Array.from(document.querySelectorAll(selector));
    var lastInputs = inputs.slice(rlen);

    lastInputs.forEach((input) => {
      if (selector === '.molesInput') {
        var moles_coeff = parseFloat(input.getAttribute('data-coeff'));
        var react_moles_ans = moles_coeff * mole_check;
        input.value = parseFloat(react_moles_ans.toFixed(6));
        var correspondingWeightInput = input.closest('tr').querySelector('.weightInput');
        if (correspondingWeightInput) {
          correspondingWeightInput.value = parseFloat((react_moles_ans * parseFloat(input.getAttribute('data-mass'))).toFixed(6));
        }
      } else if (selector === '.weightInput') {
        var moles_coeff = parseFloat(input.getAttribute('data-coeff'));
        var react_moles_ans = moles_coeff * mole_check;
        var correspondingMoleInput = input.closest('tr').querySelector('.molesInput');
        if (correspondingMoleInput) {
          correspondingMoleInput.value = parseFloat(react_moles_ans.toFixed(6));
        }
        input.value = parseFloat((react_moles_ans * parseFloat(input.getAttribute('data-mass'))).toFixed(6));
      }
    });
  }

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
      <div className="row">
        <div className="w-full mx-auto p-4 lg:p-8 md:p-8 input_form rounded-lg space-y-6 mb-3">
          {formError && (
            <p className="text-red-500 text-lg font-semibold w-full">
              {formError}
            </p>
          )}

          <div className="lg:w-[90%]  w-full mx-auto">
            <div className="grid grid-cols-12 mt-3 gap-2 md:gap-4 lg:gap-4">
              <div className="col-span-12 flex justify-between">
                <button 
                  type="button" 
                  className="flex border rounded-lg p-1 items-center" 
                  id="exampleLoadBtn"   
                  onClick={loadExample}  
                  aria-label="Load Example"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-up-right size-5 me-1">
                    <path d="M7 7h10v10"></path>
                    <path d="M7 17 17 7"></path>
                  </svg>
                  {data?.payload?.tech_lang_keys?.['1'] || 'Load Example'}
                </button>
              </div>
              <div className="col-span-12 md:col-span-6">
                <div className="col-span-12 md:col-span-4 lg:col-span-4 flex justify-between">
                  <label htmlFor="tech_eq" className="label mt-4">
                    {data?.payload?.tech_lang_keys?.['2'] || 'Enter Equation'}:
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
              <div className="col-span-12 md:col-span-6">
                <h4>{data?.payload?.tech_lang_keys?.['examp'] || 'Examples'}</h4>
                <ul className="text-[14px] list-disc ps-4">
                  {exampleEquations.map((eq, idx) => (
                    <li key={idx} className="mt-2">
                      <span 
                        className="eq_link cursor-pointer text-blue-500 underline"
                        onClick={() => loadExampleFromList(eq)}
                      >
                        {eq}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="mb-6 mt-10 text-center space-x-2">
            <Button type="button" isLoading={calculateDogLoading} onClick={handleSubmit}>
              {data?.payload?.tech_lang_keys?.["calculate"] ?? "Calculate"}
            </Button>
            {result && (
              <ResetButton type="button" onClick={handleReset}>
                {data?.payload?.tech_lang_keys?.["locale"] === "en" ? "RESET" : data?.payload?.tech_lang_keys?.["reset"] || "RESET"}
              </ResetButton>
            )}
          </div>
        </div>

        <div className="lg:w-[100%] w-full mx-auto">
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
                  <div className="w-full mt-3">
                    <div className="w-full overflow-auto result_custom_inputs">
                      <p className="text-center text-[16px] md:text-[24px]"><strong>{data?.payload?.tech_lang_keys?.['5'] || 'Your Input'}</strong></p>
                      <p className="text-center my-1 text-[16px] md:text-[24px]">{result?.tech_inp}</p>
                      <div className='result' id='resid'>
                        <div className='text-center mt-3 mb-1 text-[16px] md:text-[24px]'><strong id='re'></strong></div>
                        <div id='eqre' className="text-center text-[16px] md:text-[24px]"><span id='equ'></span></div>
                        <div className="text-red-500"><span id='message'></span></div>

                        <div className="col-12 col-lg-9 mx-auto mt-2 lg:w-[60%] w-full">
                          <input
                            type="hidden"
                            name="tech_type"
                            id="type"
                            value={formData.tech_type}
                          />
                          <div className="flex flex-wrap items-center bg-green-100 border border-blue-500 text-center rounded-lg px-1">
                            <div className="lg:w-1/2 w-full px-2 py-1 ">
                              <div
                                className={` text-[#000000] px-3 py-2 cursor-pointer rounded-md transition-colors duration-300 hover:bg-blue-600 hover:text-white ${
                                  formData.tech_type === "stoichiometry" ? "bg-blue-600 text-white" : ""
                                }`}
                                id="stoichiometry"
                                onClick={() => {
                                  setFormData({ ...formData, tech_type: "stoichiometry" });
                                  // Re-run calculation with new type
                                  if (result) {
                                    const equElem = document.getElementById("equ");
                                    const tableElem = document.getElementById("tabledata");
                                    if (equElem) equElem.innerHTML = "";
                                    if (tableElem) tableElem.innerHTML = "";
                                    setTimeout(() => {
                                      runChemicalCalculation(result, "stoichiometry");
                                    }, 50);
                                  }
                                }}
                              >
                                Reaction Stoichiometry
                              </div>
                            </div>
                            <div className="lg:w-1/2 w-full px-2 py-1 ">
                              <div
                                className={` text-[#000000] px-3 py-2 cursor-pointer rounded-md transition-colors duration-300 hover:bg-blue-600 hover:text-white ${
                                  formData.tech_type === "limiting" ? "bg-blue-600 text-white" : ""
                                }`}
                                id="limiting"
                                onClick={() => {
                                  setFormData({ ...formData, tech_type: "limiting" });
                                  // Re-run calculation with new type
                                  if (result) {
                                    const equElem = document.getElementById("equ");
                                    const tableElem = document.getElementById("tabledata");
                                    if (equElem) equElem.innerHTML = "";
                                    if (tableElem) tableElem.innerHTML = "";
                                    setTimeout(() => {
                                      runChemicalCalculation(result, "limiting");
                                    }, 50);
                                  }
                                }}
                              >
                                Limiting Reagent
                              </div>
                            </div>
                          </div>
                        </div>
                       
                        <div className='w-full mt-3 overflow-auto result_custom_inputs'>
                          <table id='tabledata' className="w-full" cellSpacing="0"></table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {result && (
        <CalculatorFeedback calName={data?.payload?.tech_calculator_title} />
      )}
    </Calculator>
  );
};

export default ChemicalEquationBalancer;
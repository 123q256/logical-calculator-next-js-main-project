"use client";

import React, { useEffect, useState } from "react";

import { BlockMath } from "react-katex";
import "katex/dist/katex.min.css";

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
  useSimplifyRadicalsCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

const SimplifyRadicalsCalculator = () => {
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
    tech_expression_unit: "2",
    tech_num1: "",
    tech_num2: "",
    tech_num3: "2",
    tech_num4: "",
    tech_num5: "",
    tech_num6: "2",
    tech_submit: "calculate",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  const [
    CatAgeCalculator,
    { isLoading: calculateDogLoading, isError, error: calculateLoveError },
  ] = useSimplifyRadicalsCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_num2) {
      setFormError("Please enter value for 'b' (required field)");
      return;
    }

    setFormError("");
    try {
      const response = await CatAgeCalculator({
        tech_expression_unit: formData.tech_expression_unit,
        tech_num1: formData.tech_num1 || "1",
        tech_num2: formData.tech_num2,
        tech_num3: formData.tech_num3,
        tech_num4: formData.tech_num4 || "1",
        tech_num5: formData.tech_num5,
        tech_num6: formData.tech_num6,
        tech_submit: formData.tech_submit,
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
      tech_expression_unit: "2",
      tech_num1: "",
      tech_num2: "",
      tech_num3: "2",
      tech_num4: "",
      tech_num5: "",
      tech_num6: "2",
      tech_submit: "calculate",
    });
    setResult(null);
    setFormError(null);
  };

  // Result display component
  const RadicalResultDisplay = ({ result }) => {
    const [resultContent, setResultContent] = useState([]);

    useEffect(() => {
      if (result) {
        calculateAndDisplay();
      }
    }, [result]);

    // Helper functions
    const isInteger = (_n) => _n % 1 === 0;

    const primesimplify = (num, resultArr = []) => {
      let root = Math.sqrt(num);
      let x = 2;

      if (num % x) {
        x = 3;
        while (num % x && (x = x + 2) < root) {}
      }
      x = x <= root ? x : num;
      resultArr.push(x);
      return x === num ? resultArr : primesimplify(num / x, resultArr);
    };

    const forpower = (primeFactors) => {
      let array = [],
        power = 1,
        isShorter = false,
        exponents = [];
      for (let i = 0; i < primeFactors.length; i++) {
        if (
          i !== primeFactors.length - 1 &&
          primeFactors[i] === primeFactors[i + 1]
        ) {
          power++;
        } else {
          if (power !== 1) {
            array.push(primeFactors[i] + "<sup>" + power + "</sup>");
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
      let primeFactors = primesimplify(x);
      let to_power;
      let valuesPulled = [];
      let i, j;
      let numberInFront = 1,
        numberUnder = 1;
      let newRoot, newUnder;
      let to_powerUnderAfter;
      let factorizationRoot, factorizationUnder;
      let simplifyRoot = [],
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
          numberUnder = Math.round(x / Math.pow(numberInFront, root));

          factorizationRoot = primesimplify(root);
          factorizationUnder = primesimplify(numberUnder);
          to_powerUnderAfter = forpower(factorizationUnder);

          for (i = 0; i < factorizationRoot.length; i++) {
            for (j = 0; j < to_powerUnderAfter[2].length; j++) {
              if (to_powerUnderAfter[2][j] % factorizationRoot[i] === 0) {
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

          newRoot = Math.round(root / divideRootBy);
          newUnder = Math.round(Math.pow(numberUnder, 1 / divideRootBy));

          if (numberInFront !== 1 || newRoot !== root) {
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
    };

    const simplify_gcf = (a, b) => {
      a = Math.abs(a);
      b = Math.abs(b);
      if (b > a) {
        let temp = a;
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

    const simply_lcm = (a, b) => {
      return Math.abs((a * b) / simplify_gcf(a, b));
    };

    const addHtml = (html) => {
      setResultContent((prev) => [...prev, html]);
    };

    const calculateAndDisplay = () => {
      setResultContent([]);

      const {
        tech_expression_unit,
        tech_num1,
        tech_num2,
        tech_num3,
        tech_num4,
        tech_num5,
        tech_num6,
      } = result;

      const a = parseFloat(tech_num1) || 1;
      const b = parseFloat(tech_num2);
      const n = parseFloat(tech_num3) || 2;
      const c = parseFloat(tech_num4) || 1;
      const d = parseFloat(tech_num5);
      const m = parseFloat(tech_num6) || 2;
      const option = tech_expression_unit;

      let newRoot = n;
      let simplification_first;
      let simplification_second;
      let numberwrite = n;
      let mWrite = m;
      let num1Write, cWrite;
      let fline = "",
        sline = "",
        tline = "",
        lline = "";
      let number_in_front;
      let expresssion_first = [a, n, b];
      let expression_second = [c, m, d];
      let operation = "";

      if (n === 2) {
        numberwrite = "";
      }
      if (m === 2) {
        mWrite = "";
      }
      if (isNaN(a) || a === 1) {
        num1Write = "";
      } else {
        num1Write = a + " * ";
      }
      if (isNaN(c) || c === 1) {
        cWrite = "";
      } else {
        cWrite = c + " * ";
      }

      expresssion_first = [a, n, b];
      expression_second = [c, m, d];

      if (!isNaN(b)) {
        if (isInteger(Math.pow(b, 1 / n)) && option === "1") {
          addHtml(
            <p className="font-s-25 mt-2 text-blue" key="simple-result">
              {num1Write}
              <sup>{numberwrite}</sup>√{b} = {a * Math.pow(b, 1 / n)}
            </p>
          );
          return;
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

      // OPTION 1: Simple Radical
      if (option === "1") {
        fline = (
          <p className="font-s-25 mt-2 text-blue" key="fline">
            {num1Write}
            <sup>{numberwrite}</sup>√{b}
          </p>
        );
        addHtml(fline);

        if (simplification_first && simplification_first.length > 2) {
          addHtml(
            <p className="font-s-25 mt-2 text-blue" key="simplify-line">
              = {num1Write}
              <sup>{numberwrite}</sup>√({simplification_first[1]}) =
            </p>
          );

          sline = (
            <p className="font-s-25 mt-2 text-blue" key="sline">
              = {num1Write}
              {simplification_first[2][0]} * <sup>{numberwrite}</sup>√(
              {simplification_first[2][1]})
            </p>
          );

          if (simplification_first.length > 3) {
            addHtml(sline);
            addHtml(
              <p className="font-s-25 mt-2 text-blue" key="equals">
                =
              </p>
            );

            const newNumberwrite =
              simplification_first[3][1] === 2
                ? ""
                : simplification_first[3][1];
            const newNum1Write =
              a * simplification_first[3][0] === 1
                ? ""
                : a * simplification_first[3][0] + " * ";

            tline = (
              <p className="font-s-25 mt-2 text-blue" key="tline">
                = {newNum1Write}
                <sup>{newNumberwrite}</sup>√{simplification_first[3][2]}
              </p>
            );
            addHtml(tline);
          } else {
            addHtml(sline);
          }
        } else {
          addHtml(
            <p className="font-s-20 mt-2" key="no-simplification">
              Cannot be simplified further.
            </p>
          );
        }
      }

      // OPTION 2: Addition
      else if (option === "2") {
        if (c >= 0) {
          operation = " + ";
        } else {
          operation = " ";
        }

        const expression = (
          <p className="font-s-25 mt-2 text-blue" key="expression">
            {num1Write}
            <sup>{numberwrite}</sup>√{b}
            {operation}
            {cWrite}
            <sup>{mWrite}</sup>√{d}
          </p>
        );
        addHtml(expression);

        if (n === m && b === d) {
          addHtml(
            <p className="font-s-25 mt-2 text-blue" key="result">
              = {a + c}
              <sup>{numberwrite}</sup>√{b}
            </p>
          );
        } else {
          addHtml(
            <p className="font-s-25 mt-2 text-blue" key="cannot-combine">
              = {num1Write}
              <sup>{numberwrite}</sup>√{b}
              {operation}
              {cWrite}
              <sup>{mWrite}</sup>√{d}
            </p>
          );
          addHtml(
            <p className="font-s-20 mt-2" key="explanation">
              Cannot combine - different radicands or indices.
            </p>
          );
        }
      }

      // OPTION 3: Multiplication
      else if (option === "3") {
        const expression = (
          <p className="font-s-25 mt-2 text-blue" key="expression">
            {num1Write}
            <sup>{numberwrite}</sup>√{b} × {cWrite}
            <sup>{mWrite}</sup>√{d}
          </p>
        );
        addHtml(expression);

        const productCoeff = a * c;
        const productRadicand = b * d;

        addHtml(
          <p className="font-s-25 mt-2 text-blue" key="step1">
            = {productCoeff}
            <sup>{numberwrite}</sup>√{productRadicand}
          </p>
        );

        const simplified = getSimplification(productRadicand, n);
        if (simplified && simplified.length > 2) {
          addHtml(
            <p className="font-s-25 mt-2 text-blue" key="step2">
              = {productCoeff * simplified[2][0]}
              <sup>{numberwrite}</sup>√{simplified[2][1]}
            </p>
          );
        }
      }

      // OPTION 4: Division
      else if (option === "4") {
        const expression = (
          <p className="font-s-25 mt-2 text-blue" key="expression">
            ({num1Write}
            <sup>{numberwrite}</sup>√{b}) ÷ ({cWrite}
            <sup>{mWrite}</sup>√{d})
          </p>
        );
        addHtml(expression);

        if (n === m && b === d) {
          addHtml(
            <p className="font-s-25 mt-2 text-blue" key="result">
              = {a / c}
            </p>
          );
        } else {
          const quotientCoeff = (a / c).toFixed(2);
          const quotientRadicand = (b / d).toFixed(2);

          addHtml(
            <p className="font-s-25 mt-2 text-blue" key="step1">
              = {quotientCoeff}
              <sup>{numberwrite}</sup>√{quotientRadicand}
            </p>
          );
        }
      }
    };

    return (
      <div>
        {resultContent.map((item, index) => (
          <React.Fragment key={index}>{item}</React.Fragment>
        ))}
      </div>
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
          <div className="lg:w-[60%] md:w-[60%] w-full mx-auto">
            <div className="grid grid-cols-12 gap-2 md:gap-4">
              <div className="col-span-12 relative">
                <label htmlFor="tech_expression_unit" className="label">
                  {data?.payload?.tech_lang_keys["1"] ??
                    "Select Expression Type"}
                  :
                </label>
                <select
                  className="input my-2"
                  name="tech_expression_unit"
                  id="tech_expression_unit"
                  value={formData.tech_expression_unit}
                  onChange={handleChange}
                >
                  <option value="1">
                    {data?.payload?.tech_lang_keys["2"] ?? "Simple Radical"}
                  </option>
                  <option value="2">
                    {data?.payload?.tech_lang_keys["3"] ?? "Addition"}
                  </option>
                  <option value="3">
                    {data?.payload?.tech_lang_keys["4"] ?? "Multiplication"}
                  </option>
                  <option value="4">
                    {data?.payload?.tech_lang_keys["5"] ?? "Division"}
                  </option>
                </select>
              </div>

              <div className="col-span-12 text-center p-0 bg-white rounded-lg text-[#2845F5] text-[25px] font-mono">
                {formData.tech_expression_unit === "1" && (
                  <BlockMath math={`a\\sqrt[n]{b}`} />
                )}
                {formData.tech_expression_unit === "2" && (
                  <BlockMath math={`a\\sqrt[n]{b} + c\\sqrt[m]{d} = ?`} />
                )}
                {formData.tech_expression_unit === "3" && (
                  <BlockMath math={`a\\sqrt[n]{b} \\cdot c\\sqrt[m]{d} = ?`} />
                )}
                {formData.tech_expression_unit === "4" && (
                  <BlockMath
                    math={`\\frac{a\\sqrt[n]{b}}{c\\sqrt[m]{d}} = ?`}
                  />
                )}
              </div>

              <div className="col-span-12 grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    a (Optional):
                  </label>
                  <input
                    type="number"
                    name="tech_num1"
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    value={formData.tech_num1}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    b <span className="text-red-500">*</span>:
                  </label>
                  <input
                    type="number"
                    name="tech_num2"
                    required
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    value={formData.tech_num2}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    n <span className="text-red-500">*</span>:
                  </label>
                  <input
                    type="number"
                    name="tech_num3"
                    required
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    value={formData.tech_num3}
                    onChange={handleChange}
                  />
                </div>

                {(formData.tech_expression_unit === "2" ||
                  formData.tech_expression_unit === "3" ||
                  formData.tech_expression_unit === "4") && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        c (Optional):
                      </label>
                      <input
                        type="number"
                        name="tech_num4"
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                        value={formData.tech_num4}
                        onChange={handleChange}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        d <span className="text-red-500">*</span>:
                      </label>
                      <input
                        type="number"
                        name="tech_num5"
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                        value={formData.tech_num5}
                        onChange={handleChange}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        m <span className="text-red-500">*</span>:
                      </label>
                      <input
                        type="number"
                        name="tech_num6"
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                        value={formData.tech_num6}
                        onChange={handleChange}
                      />
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="mb-6 mt-10 text-center space-x-2">
              <Button type="submit" isLoading={calculateDogLoading}>
                {data?.payload?.tech_lang_keys["calculate"] ?? "Calculate"}
              </Button>

              {result && (
                <ResetButton onClick={handleReset}>
                  {data?.payload?.tech_lang_keys["locale"] === "en"
                    ? "RESET"
                    : data?.payload?.tech_lang_keys["reset"] || "RESET"}
                </ResetButton>
              )}
            </div>
          </div>
        </div>

        <div className="w-full mx-auto bg-white rounded-lg space-y-6 mb-3">
          <div className="col-span-12">
            {isLoading && (
              <div className="mt-8 result_calculator rounded-lg p-6">
                <div className="animate-pulse space-y-4">
                  <div className="h-6 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                </div>
              </div>
            )}

            {result !== null && !isLoading && (
              <div className="w-full mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg space-y-6 result">
                <ResultActions lang={data?.payload?.tech_lang_keys} />
                <div className="rounded-lg flex items-center justify-center">
                  <div className="w-full mt-3">
                    <p className="text-[20px]">
                      <strong>
                        {data?.payload?.tech_lang_keys["7"] || "Result"}
                      </strong>
                    </p>
                    <div className="w-full overflow-auto">
                      <div className="all_result text-[16px] md:text-[25px]">
                        <RadicalResultDisplay result={result} />
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

export default SimplifyRadicalsCalculator;

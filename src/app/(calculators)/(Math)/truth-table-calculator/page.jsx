"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useTruthTableCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const TruthTableCalculator = ({ expression }) => {
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
  const [getSingleCalculatorDetails, { data, isLoading }] =
    useGetSingleCalculatorDetailsMutation();
  const handleFetchDetails = async () => {
    try {
      // Call the mutation with the `tech_calculator_link`
      await getSingleCalculatorDetails({ tech_calculator_link: url });
    } catch (err) {
      console.error("Error fetching calculator details:", err);
    }
  };

  const [truthTableHTML, setTruthTableHTML] = useState(null);
  const [error, setError] = useState(""); // ✅ This is required

  useEffect(() => {
    handleFetchDetails();
  }, [url]);

  const [formData, setFormData] = useState({
    tech_eq: "A<->(BvC), A, (~B->C)",
    tech_submit: true,
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useTruthTableCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_eq) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_eq: formData.tech_eq,
        tech_submit: formData.tech_submit,
      }).unwrap();
      setResult(response?.payload); // Assuming the response has 'lovePercentage'
      toast.success("Successfully Calculated");
    } catch (err) {
      setFormError(err.data.payload.error);
      toast.error(err.data.payload.error);
    }
  };

  // Handle reset form
  const handleReset = () => {
    setFormData({
      tech_eq: "A<->(BvC), A, (~B->C)",
      tech_submit: true,
    });
    setResult(null);
    setFormError(null);
  };
  // currency code
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
  // currency code

  const handleExampleLoad = () => {
    const eqs = [
      "~A",
      "(A & B)",
      "(# -> (B v ~A))",
      "A<->(BvC), A, (~B->C)",
      "(p & q) -> ~r",
      "(p | q) -> ~r",
      "(p & q) -> (~r | s)",
    ];

    const random = eqs[Math.floor(Math.random() * eqs.length)];
    setFormData((prev) => ({
      ...prev,
      tech_eq: random,
    }));
  };

  // result js

  useEffect(() => {
    try {
      if (!formData.tech_eq) {
        setError("You have to enter an expression.");
        setTruthTableHTML(null);
        return;
      }

      const sanitized = formData.tech_eq.replace(/\s+/g, "");
      const bad = badchar(sanitized);
      if (bad >= 0) {
        setError(`Unrecognized symbol "${sanitized[bad]}" in expression.`);
        setTruthTableHTML(null);
        return;
      }

      const eqs = sanitized.split(",");
      const trees = eqs.map(parseVal);
      for (let i = 0; i < trees.length; i++) {
        if (trees[i].length === 0) {
          eqs[i] = `(${eqs[i]})`;
          trees[i] = parseVal(eqs[i]);
        }
      }

      if (trees.some((t) => t.length === 0)) {
        setError("The string is not well formed.");
        setTruthTableHTML(null);
        return;
      }

      const table = makeTab(eqs, trees);
      const rendered = truthtable(table, trees);
      setTruthTableHTML(rendered);
      setError("");
    } catch (err) {
      setError("Error processing expression.");
      setTruthTableHTML(null);
    }
  }, [formData.tech_eq]);

  // ----------------------------------
  // 🔧 Helper Functions Below
  // ----------------------------------

  function badchar(s) {
    const valid =
      ",()~v&<>-|#ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuwxyz";
    for (let i = 0; i < s.length; i++) {
      if (!valid.includes(s[i])) return i;
    }
    return -1;
  }

  function parseVal(s) {
    if (s.length === 0) return [];
    if (isUnary(s[0])) {
      const sub = parseVal(s.substring(1));
      return sub.length ? [s[0], sub] : [];
    }
    if (s[0] === "(" && s[s.length - 1] === ")") {
      const a = gSub(s);
      if (a.includes(undefined) || a.includes("")) return [];
      const s1 = parseVal(a[0]);
      const s2 = parseVal(a[2]);
      return s1.length && s2.length ? ["(", s1, a[1], s2, ")"] : [];
    } else {
      return isAtm(s) ? [s] : [];
    }
  }

  function isUnary(s) {
    return s.indexOf("~") === 0;
  }

  function isAtm(s) {
    return (
      s.length === 1 &&
      "#ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuwxyz".includes(s)
    );
  }

  function gSub(s) {
    const stk = [];
    for (let i = 0; i < s.length; i++) {
      if (s[i] === "(") stk.push("(");
      else if (s[i] === ")" && stk.length > 0) stk.pop();
      else if (stk.length === 1 && isB(s.substring(i)) > 0) {
        const l = isB(s.substring(i));
        return [
          s.substring(1, i),
          s.substring(i, i + l),
          s.substring(i + l, s.length - 1),
        ];
      }
    }
    return [undefined, undefined, undefined];
  }

  function isB(s) {
    const bc = ["&", "v", "->", "<->", "|"];
    for (let i = 0; i < bc.length; i++) {
      if (s.startsWith(bc[i])) return bc[i].length;
    }
    return 0;
  }

  function getAtm(s) {
    return s.split("").filter(isAtm);
  }

  function remDup(a) {
    return a.filter((el, pos) => a.indexOf(el) === pos);
  }

  function aSorted(a) {
    return a
      .map((x) => x.charCodeAt(0))
      .sort((a, b) => a - b)
      .map((x) => String.fromCharCode(x));
  }

  function tvComb(n) {
    if (n === 0) return [[]];
    const prev = tvComb(n - 1);
    return [
      ...prev.map((x) => [true, ...x]),
      ...prev.map((x) => [false, ...x]),
    ];
  }

  function assign(vars, vals) {
    const a = {};
    for (let i = 0; i < vars.length; i++) a[vars[i]] = vals[i];
    return a;
  }

  function d1(t) {
    if (t.length === 5) return [].concat(t[0], d1(t[1]), t[2], d1(t[3]), t[4]);
    if (t.length === 2) return [].concat(t[0], d1(t[1]));
    return [].concat(t[0]);
  }

  function evalTree(t, a) {
    if (t.length === 5) {
      const t1 = evalTree(t[1], a);
      const t3 = evalTree(t[3], a);
      return ["", t1, getTvs([t[2], t1, t3]), t3, ""];
    } else if (t.length === 2) {
      const t1 = evalTree(t[1], a);
      return [getTvs([t[0], t1]), t1];
    } else if (t.length === 1) {
      return [a[t[0]]];
    }
  }

  function getTvs(arr) {
    function tvs(x) {
      if (x.length === 5) return x[2];
      if (x.length === 2) return x[0];
      return x[0];
    }

    switch (arr[0]) {
      case "~":
        return !tvs(arr[1]);
      case "&":
        return tvs(arr[1]) && tvs(arr[2]);
      case "v":
        return tvs(arr[1]) || tvs(arr[2]);
      case "->":
        return !tvs(arr[1]) || tvs(arr[2]);
      case "<->":
        return tvs(arr[1]) === tvs(arr[2]);
      case "|":
        return !(tvs(arr[1]) && tvs(arr[2]));
      default:
        return false;
    }
  }

  function resIndex(t) {
    return t.length <= 2 ? 0 : nl(t[1]) + 1;
  }

  function nl(t) {
    return t.reduce((acc, x) => acc + (Array.isArray(x) ? nl(x) : 1), 0);
  }

  function mkLhs(fs) {
    let atm = [];
    fs.forEach((f) => (atm = atm.concat(getAtm(f))));
    atm = aSorted(remDup(atm));
    let tvrows = atm.includes("#")
      ? tvComb(atm.length - 1).map((x) => [false, ...x])
      : tvComb(atm.length);
    return [atm, ...tvrows];
  }

  function tSeg(f, t, lhs) {
    const tblRows = lhs
      .slice(1)
      .map((row) => d1(evalTree(t, assign(lhs[0], row))));
    return [d1(t), ...tblRows];
  }

  function makeTab(fs, ts) {
    const lhs = mkLhs(fs);
    const rhs = ts.map((t, i) => tSeg(fs[i], t, lhs));
    return [lhs, ...rhs];
  }

  function truthtable(table, trees) {
    const resIndices = trees.map(resIndex);

    return (
      <table className="w-full border    text-sm table-auto">
        <thead>
          <tr>
            {table.map((col, i) =>
              col[0].map((cell, j) => (
                <th key={`${i}-${j}`} className="border-b py-2">
                  {charSet(cell)}
                </th>
              ))
            )}
          </tr>
        </thead>
        <tbody>
          {table[0].slice(1).map((_, rIndex) => (
            <tr key={rIndex}>
              {table.map((tbl, i) =>
                tbl[rIndex + 1].map((cell, j) => {
                  const isRes = resIndices[i - 1] === j;
                  return (
                    <td
                      key={`${i}-${j}`}
                      className={`border-b py-2 ${
                        isRes ? "font-bold text-blue-600" : ""
                      }`}
                    >
                      {charSet(cell)}
                    </td>
                  );
                })
              )}
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  function charSet(c) {
    switch (c) {
      case true:
        return "T";
      case false:
        return "F";
      case "~":
        return "~";
      case "&":
        return "∧";
      case "v":
        return "∨";
      case "->":
        return "→";
      case "<->":
        return "↔";
      case "|":
        return "|";
      case "#":
        return "⊥";
      default:
        return c;
    }
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
          path: pathname, // This will use the current path dynamically
        },
      ]}
    >
      <form className="row" onSubmit={handleSubmit}>
        <div className="w-full mx-auto p-4 lg:p-8 md:p-8 input_form rounded-lg shadow-md space-y-6 mb-3">
          {formError && (
            <p className="text-red-500 text-lg font-semibold w-full">
              {formError}
            </p>
          )}
          <div className="lg:w-[40%] md:w-[60%] w-full mx-auto ">
            <div className="col-12 mx-auto mt-2 lg:w-[50%] w-full">
              <div className="flex flex-wrap items-center cursor-pointer bg-blue-100 border border-blue-500 text-center rounded-lg px-1">
                <div className="lg:w-1/1 w-full px-2 py-1">
                  <div
                    className="bg-white px-3 py-2 cursor-pointer rounded-md transition-colors duration-300 hover_tags hover:text-white tagsUnit wed"
                    onClick={handleExampleLoad}
                  >
                    {data?.payload?.tech_lang_keys?.["2"] ?? "Load Example"}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-12 mt-3   gap-2 md:gap-4 lg:gap-4">
              <div className="col-span-12">
                <div className="w-full py-1">
                  <label htmlFor="tech_eq" className="label">
                    {data?.payload?.tech_lang_keys["1"]}:
                  </label>
                  <div className=" relative">
                    <input
                      type="text"
                      step="any"
                      name="tech_eq"
                      id="tech_eq"
                      className="input my-2"
                      aria-label="input"
                      placeholder="00"
                      value={formData.tech_eq}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
              <div className="col-span-12">
                <table className="w-full inp_table bordered radius-5">
                  <tbody>
                    <tr>
                      <td
                        colSpan="2"
                        className="border-b py-2 text-center tagsUnit"
                      >
                        <strong className="text-blue">
                          {data?.payload?.tech_lang_keys?.["3"]}
                        </strong>
                      </td>
                    </tr>
                    <tr>
                      <td className="border-b p-2">
                        {data?.payload?.tech_lang_keys?.["4"]}
                      </td>
                      <td className="border-b p-2">~</td>
                    </tr>
                    <tr>
                      <td className="border-b p-2">
                        {data?.payload?.tech_lang_keys?.["5"]}
                      </td>
                      <td className="border-b p-2">&amp;</td>
                    </tr>
                    <tr>
                      <td className="border-b p-2">
                        {data?.payload?.tech_lang_keys?.["6"]}
                      </td>
                      <td className="border-b p-2">v</td>
                    </tr>
                    <tr>
                      <td className="border-b p-2">
                        {data?.payload?.tech_lang_keys?.["7"]}
                      </td>
                      <td className="border-b p-2">-&gt;</td>
                    </tr>
                    <tr>
                      <td className="border-b p-2">
                        {data?.payload?.tech_lang_keys?.["8"]}
                      </td>
                      <td className="border-b p-2">&lt;-&gt;</td>
                    </tr>
                    <tr>
                      <td className="border-b p-2">
                        {data?.payload?.tech_lang_keys?.["9"]}
                      </td>
                      <td className="border-b p-2">|</td>
                    </tr>
                    <tr>
                      <td className="border-b p-2">
                        {data?.payload?.tech_lang_keys?.["10"]}
                      </td>
                      <td className="border-b p-2">#</td>
                    </tr>
                  </tbody>
                </table>
              </div>
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
          <div className="w-full mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg space-y-6 result">
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
              <div className="w-full mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />
                  <div className="rounded-lg flex items-center justify-center">
                    <div className="w-full my-[25px]">
                      <div className="row my-2 text-[18px]">
                        <p className=" text-[20px] font-bold">
                          {data?.payload?.tech_lang_keys["11"]}
                        </p>
                        {error && (
                          <p className="text-red-600 text-center mt-2">
                            {error}
                          </p>
                        )}
                        <div className="text-[16px] overflow-auto setborderadd">
                          {truthTableHTML}
                        </div>
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

export default TruthTableCalculator;

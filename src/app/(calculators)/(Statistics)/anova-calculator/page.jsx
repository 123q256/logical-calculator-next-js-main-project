"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useAnovaCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const AnovaCalculator = () => {
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

  const [tech_rows, setRows] = useState(3);
  const [tech_columns, setColumns] = useState(4);
  const [data1, setData] = useState(
    Array(3)
      .fill()
      .map(() => Array(4).fill(""))
  );

  const [formData, setFormData] = useState({
    tech_k: "2",
    tech_type: "one_way", //  one_way  two_way
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useAnovaCalculatorMutation();

  const [groups, setGroups] = useState(["group1", "group2"]);

  const handleChange = (e, groupName) => {
    setFormData({
      ...formData,
      [groupName]: e.target.value,
    });

    setResult(null);
    setFormError(null);
  };

  const handleInputChange = (r, c, value) => {
    const updated = [...data1];
    updated[r][c] = value;
    setData(updated);
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    // Get values from the form element
    const form = e.target;
    const formDataObj = new FormData(form);
    const formData = Object.fromEntries(formDataObj.entries());

    // Extract dynamic table values like td_0_0, td_1_2, etc.
    const tableValues = {};
    Object.keys(formData).forEach((key) => {
      if (key.startsWith("td_")) {
        tableValues[key] = formData[key];
      }
    });

    try {
      const groupsOnly = Object.keys(formData)
        .filter((key) => key.startsWith("group"))
        .reduce((obj, key) => {
          obj[key] = formData[key];
          return obj;
        }, {});

      const response = await calculateEbitCalculator({
        tech_type: formData.tech_type,
        tech_k: formData.tech_k,
        tech_rows: formData.tech_rows,
        tech_columns: formData.tech_columns,
        tableValues: formData.tableValues,
        ...tableValues,
        ...groupsOnly,
      }).unwrap();

      setResult(response);
      toast.success("Successfully Calculated");
    } catch (err) {
      setFormError(err?.data?.error || "Something went wrong");
      toast.error(err?.data?.error || "Something went wrong");
    }
  };

  // Handle reset form
  const handleReset = () => {
    setFormData({
      tech_k: "2",
      tech_type: "one_way", //  one_way  two_way
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

  const handleAddGroup = () => {
    const nextGroupNum = groups.length + 1;
    const nextGroupName = `group${nextGroupNum}`;
    const updatedGroups = [...groups, nextGroupName];

    setGroups(updatedGroups);
    setFormData((prev) => ({
      ...prev,
      [nextGroupName]: "",
      tech_k: updatedGroups.length.toString(), // set tech_k as count
    }));
  };

  const handleDeleteGroup = () => {
    if (groups.length > 1) {
      const updatedGroups = groups.slice(0, -1);
      const groupToRemove = groups[groups.length - 1];

      const updatedFormData = { ...formData };
      delete updatedFormData[groupToRemove];
      updatedFormData.tech_k = updatedGroups.length.toString(); // update count
      setGroups(updatedGroups);
      setFormData(updatedFormData);
    }
  };

  // result

  // second

  const addRow = () => {
    const newRow = Array(tech_columns).fill("");
    setData([...data1, newRow]);
    setRows(tech_rows + 1);
  };

  const deleteRow = () => {
    if (tech_rows > 1) {
      const updated = data1.slice(0, -1);
      setData(updated);
      setRows(tech_rows - 1);
    }
  };

  const addColumn = () => {
    const updated = data1.map((row) => [...row, ""]);
    setData(updated);
    setColumns(tech_columns + 1);
  };

  const deleteColumn = () => {
    if (tech_columns > 1) {
      const updated = data1.map((row) => row.slice(0, -1));
      setData(updated);
      setColumns(tech_columns - 1);
    }
  };

  // result 2

  const table = result?.tech_table;
  const table1 = result?.tech_table1;
  const table2 = result?.tech_table2;
  const k = result?.tech_k;
  const N = result?.tech_N;
  const s1 = result?.tech_s1;
  const s2 = result?.tech_s2;
  const ssb = result?.tech_ssb;
  const ssw = result?.tech_ssw;

  const dfb = k - 1;
  const dfw = N - k;
  const msb = +(ssb / dfb).toFixed(4);
  const msw = +(ssw / dfw).toFixed(4);
  const f = +(msb / msw).toFixed(4);

  const rows = result?.tech_rows;
  const columns = result?.tech_columns;
  const p1 = result?.tech_p1;
  const A = result?.tech_A;
  const p2_s1 = result?.tech_p2_s1;
  const p2_s2 = result?.tech_p2_s2;
  const p2_s3 = result?.tech_p2_s3;
  const B = result?.tech_B;
  const p3_s1 = result?.tech_p3_s1;
  const p3_s2 = result?.tech_p3_s2;
  const p3_s3 = result?.tech_p3_s3;
  const C = result?.tech_C;
  const p4_s1 = result?.tech_p4_s1;
  const p4_s2 = result?.tech_p4_s2;
  const p4_s3 = result?.tech_p4_s3;
  const D = result?.tech_D;
  const p5_s1 = result?.tech_p5_s1;
  const p5_s2 = result?.tech_p5_s2;
  const E = result?.tech_E;
  const n = result?.tech_n;

  const dfa = rows - 1;
  const dfbxx = columns - 1;
  const dfab = (rows - 1) * (columns - 1);
  const dfe = n - rows * columns;
  const df_total = n - 1;
  const sst = A - E;
  const ssa = C - E;
  const ssbxx = B - E;
  const ssab = D - E - ssa - ssbxx;
  const sse = sst - ssa - ssbxx - ssab;
  const msa = ssa / dfa;
  const msbxx = ssbxx / dfbxx;
  const msab = ssab / dfab;
  const mse = sse / dfe;
  const fa = msa / mse;
  const fb = msbxx / mse;
  const fab = msab / mse;

  const round = (num) => Math.round(num * 10000) / 10000;

  // majax
  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.5/MathJax.js?config=TeX-AMS_HTML";
    script.async = true;
    script.type = "text/javascript";
    script.onload = () => {
      window.MathJax &&
        window.MathJax.Hub.Queue(["Typeset", window.MathJax.Hub]);
    };
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [result]);
  // majax

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

          <div className="lg:w-[70%] md:w-[90%] w-full mx-auto ">
            <div className="col-12 col-lg-9 mx-auto mt-2 lg:w-[70%] w-full">
              <input
                type="hidden"
                name="tech_type"
                id="calculator_time"
                value={formData.tech_type}
              />
              <div className="flex flex-wrap items-center bg-blue-100 border border-blue-500 text-center rounded-lg px-1">
                {/* Date Cal Tab */}
                <div className="lg:w-1/2 w-full px-2 py-1">
                  <div
                    className={`bg-white px-3 py-2 cursor-pointer rounded-md transition-colors duration-300 hover_tags hover:text-white pacetab  ${
                      formData.tech_type === "one_way" ? "tagsUnit" : ""
                    }`}
                    id="one_way"
                    onClick={() => {
                      setFormData({ ...formData, tech_type: "one_way" });
                      setResult(null);
                      setFormError(null);
                    }}
                  >
                    {data?.payload?.tech_lang_keys["1"]}
                  </div>
                </div>
                {/* Time Cal Tab */}
                <div className="lg:w-1/2 w-full px-2 py-1">
                  <div
                    className={`bg-white px-3 py-2 cursor-pointer rounded-md transition-colors duration-300 hover_tags hover:text-white pacetab ${
                      formData.tech_type === "two_way" ? "tagsUnit" : ""
                    }`}
                    id="two_way"
                    onClick={() => {
                      setFormData({ ...formData, tech_type: "two_way" });
                      setResult(null);
                      setFormError(null);
                    }}
                  >
                    {data?.payload?.tech_lang_keys["2"]}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="lg:w-[80%] md:w-[80%] w-full mx-auto ">
            {formData.tech_type == "one_way" && (
              <>
                <div className="grid grid-cols-12 mt-3 gap-1">
                  <div className="col-span-12  one_way">
                    <div className="grid grid-cols-12 mt-3 gap-1  add_groups">
                      {groups.map((groupName, index) => (
                        <div
                          className="col-span-12 md:col-span-6  px-2 "
                          key={groupName}
                        >
                          <label htmlFor={groupName} className="label">
                            {data?.payload?.tech_lang_keys["3"]} {index + 1}:
                          </label>
                          <div className="w-full py-1">
                            <textarea
                              required
                              name={groupName}
                              id={groupName}
                              className="input textareaInput w-full border rounded p-2"
                              aria-label="textarea input"
                              placeholder="e.g. 5, 1, 11, 2, 8"
                              value={formData[groupName] || ""}
                              onChange={(e) => handleChange(e, groupName)}
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Hidden input */}
                    <input
                      type="hidden"
                      name="tech_k"
                      id="tech_k"
                      value={formData.tech_k}
                      onChange={handleChange}
                    />

                    <div className="col-lg-7 mx-auto d-flex px-2">
                      <button
                        type="button"
                        id="add"
                        onClick={handleAddGroup}
                        className="bg-[#000000] text-white border rounded-lg px-4 py-2 me-2 cursor-pointer"
                      >
                        <strong className="text-blue">
                          {data?.payload?.tech_lang_keys["5"]}{" "}
                          {data?.payload?.tech_lang_keys["7"]}
                        </strong>
                      </button>
                      <button
                        type="button"
                        id="del"
                        onClick={handleDeleteGroup}
                        className="bg-[#000000] text-white border rounded-lg px-4 py-2 cursor-pointer"
                      >
                        <strong className="text-blue">
                          {data?.payload?.tech_lang_keys["6"]}{" "}
                          {data?.payload?.tech_lang_keys["7"]}
                        </strong>
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
          {formData.tech_type == "two_way" && (
            <>
              <div className="lg:w-[90%] md:w-[90%] w-full mx-auto">
                <div className="grid grid-cols-12 mt-3 gap-2">
                  <div className="col-span-12 two_way">
                    <div className="overflow-auto">
                      <table width={685} className="bordered">
                        <tbody>
                          {data1.map((row, rIdx) => (
                            <tr key={rIdx}>
                              {row.map((val, cIdx) => (
                                <td key={cIdx}>
                                  <input
                                    type="text"
                                    className="input border"
                                    name={`td_${rIdx}_${cIdx}`} // 🔥 Important
                                    value={val}
                                    onChange={(e) =>
                                      handleInputChange(
                                        rIdx,
                                        cIdx,
                                        e.target.value
                                      )
                                    }
                                    placeholder="00"
                                  />
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>

                      <input
                        type="hidden"
                        name="tech_rows"
                        value={tech_rows}
                        onChange={handleChange}
                      />
                      <input
                        type="hidden"
                        name="tech_columns"
                        value={tech_columns}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-2 gap-2 mt-4">
                      <button
                        type="button"
                        onClick={addRow}
                        className="bg-[#000000] text-white rounded-lg border px-4 py-2 cursor-pointer"
                      >
                        Add Row
                      </button>
                      <button
                        type="button"
                        onClick={deleteRow}
                        className="bg-[#000000] text-white rounded-lg border px-4 py-2 cursor-pointer"
                      >
                        Delete Row
                      </button>
                      <button
                        type="button"
                        onClick={addColumn}
                        className="bg-[#000000] text-white rounded-lg border px-4 py-2 cursor-pointer"
                      >
                        Add Column
                      </button>
                      <button
                        type="button"
                        onClick={deleteColumn}
                        className="bg-[#000000] text-white rounded-lg border px-4 py-2 cursor-pointer"
                      >
                        Delete Column
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

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

                  <div className="rounded-lg  flex items-center justify-center">
                    <div className="w-full mt-2">
                      <div className="w-full">
                        {formData?.tech_type == "one_way" ? (
                          <>
                            <div className="lg:w-[50%] md:w-[70%] w-full mt-2 px-2">
                              <table className="w-full text-[16px]">
                                <tbody>
                                  <tr>
                                    <td className="text-blue py-2 border-b">
                                      {data?.payload?.tech_lang_keys["26"]}{" "}
                                      {data?.payload?.tech_lang_keys["10"]} F
                                    </td>
                                    <td className="py-2 border-b">
                                      <strong>{f}</strong>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="text-blue py-2 border-b">
                                      P-{data?.payload?.tech_lang_keys["11"]}
                                    </td>
                                    <td className="py-2 border-b">
                                      <strong className="p_value"></strong>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>

                            <div
                              className="w-full mt-3 overflow-auto"
                              dangerouslySetInnerHTML={{ __html: table }}
                            />
                            <div
                              className="w-full mt-3 overflow-auto"
                              dangerouslySetInnerHTML={{ __html: table1 }}
                            />
                            <div
                              className="w-full mt-3 overflow-auto"
                              dangerouslySetInnerHTML={{ __html: table2 }}
                            />

                            <div className="w-full mt-3 overflow-auto">
                              <table className="border-collapse">
                                <thead>
                                  <tr className="bg-[#2845F5] text-white">
                                    <td
                                      colSpan={6}
                                      className="p-2 border text-center text-blue"
                                    >
                                      {data?.payload?.tech_lang_keys["25"]}{" "}
                                      {data?.payload?.tech_lang_keys["13"]}
                                    </td>
                                  </tr>
                                  <tr className="bg-[#2845F5] text-white">
                                    <td className="p-2 border text-center text-blue">
                                      {data?.payload?.tech_lang_keys["14"]}
                                    </td>
                                    <td className="p-2 border text-center text-blue">
                                      {data?.payload?.tech_lang_keys["15"]} (DF)
                                    </td>
                                    <td className="p-2 border text-center text-blue">
                                      {data?.payload?.tech_lang_keys["16"]} (SS)
                                    </td>
                                    <td className="p-2 border text-center text-blue">
                                      {data?.payload?.tech_lang_keys["17"]} (MS)
                                    </td>
                                    <td className="p-2 border text-center text-blue">
                                      F-{data?.payload?.tech_lang_keys["18"]}
                                    </td>
                                    <td className="p-2 border text-center text-blue">
                                      P-{data?.payload?.tech_lang_keys["11"]}
                                    </td>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr className="bg-white">
                                    <td className="p-2 border text-center text-blue">
                                      {data?.payload?.tech_lang_keys["19"]}
                                    </td>
                                    <td className="p-2 border text-center">
                                      {dfb}
                                    </td>
                                    <td className="p-2 border text-center">
                                      {ssb}
                                    </td>
                                    <td className="p-2 border text-center">
                                      {msb}
                                    </td>
                                    <td className="p-2 border text-center">
                                      {f}
                                    </td>
                                    <td className="p_value p-2 border text-center"></td>
                                  </tr>
                                  <tr className="bg-white">
                                    <td className="p-2 border text-center text-blue">
                                      {data?.payload?.tech_lang_keys["20"]}
                                    </td>
                                    <td className="p-2 border text-center">
                                      {dfw}
                                    </td>
                                    <td className="p-2 border text-center">
                                      {ssw}
                                    </td>
                                    <td className="p-2 border text-center">
                                      {msw}
                                    </td>
                                    <td
                                      colSpan={2}
                                      className="p-2 border text-center"
                                    ></td>
                                  </tr>
                                  <tr className="bg-white">
                                    <td className="p-2 border text-center text-blue">
                                      {data?.payload?.tech_lang_keys["21"]}
                                    </td>
                                    <td className="p-2 border text-center">
                                      {dfb + dfw}
                                    </td>
                                    <td className="p-2 border text-center">
                                      {ssb + ssw}
                                    </td>
                                    <td
                                      colSpan={3}
                                      className="p-2 border text-center"
                                    ></td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>

                            <div className="w-full mt-3 overflow-auto">
                              <p className="mt-3 font-bold text-blue">
                                {data?.payload?.tech_lang_keys["22"]}:1 -{" "}
                                {data?.payload?.tech_lang_keys["16"]}{" "}
                                {data?.payload?.tech_lang_keys["19"]}
                              </p>
                              <BlockMath math="SS_B = \sum^k_{i=1} n_i(\bar x_i - \bar x)^2" />
                              <BlockMath math={`SS_B = ${s1}`} />
                              <BlockMath math={`SS_B = ${ssb}`} />

                              <p className="mt-3 font-bold text-blue">
                                {data?.payload?.tech_lang_keys["22"]}:2 -{" "}
                                {data?.payload?.tech_lang_keys["16"]}{" "}
                                {data?.payload?.tech_lang_keys["20"]}
                              </p>
                              <BlockMath math="SS_W = \sum^k_{i=1} (n_i − 1)S_i^{\space 2}" />
                              <BlockMath math={`SS_W = ${s2}`} />
                              <BlockMath math={`SS_W = ${ssw}`} />

                              <p className="mt-3 font-bold text-blue">
                                {data?.payload?.tech_lang_keys["22"]}:3 - Total{" "}
                                {data?.payload?.tech_lang_keys["16"]}
                              </p>
                              <BlockMath math="SS_T = SS_B + SS_W" />
                              <BlockMath math={`SS_T = ${ssb} + ${ssw}`} />
                              <BlockMath math={`SS_T = ${ssb + ssw}`} />

                              <p className="mt-3 font-bold text-blue">
                                {data?.payload?.tech_lang_keys["22"]}:4 -{" "}
                                {data?.payload?.tech_lang_keys["17"]}{" "}
                                {data?.payload?.tech_lang_keys["19"]}
                              </p>
                              <BlockMath math="MS_B = \dfrac{SS_B}{k - 1}" />
                              <BlockMath
                                math={`MS_B = \\dfrac{${ssb}}{${k} - 1}`}
                              />
                              <BlockMath
                                math={`MS_B = \\dfrac{${ssb}}{${dfb}}`}
                              />
                              <BlockMath math={`MS_B = ${msb}`} />

                              <p className="mt-3 font-bold text-blue">
                                {data?.payload?.tech_lang_keys["22"]}:5 -{" "}
                                {data?.payload?.tech_lang_keys["17"]}{" "}
                                {data?.payload?.tech_lang_keys["20"]}
                              </p>
                              <BlockMath math="MS_W = \dfrac{SS_W}{N - k}" />
                              <BlockMath
                                math={`MS_W = \\dfrac{${ssw}}{${N} - ${k}}`}
                              />
                              <BlockMath
                                math={`MS_W = \\dfrac{${ssw}}{${dfw}}`}
                              />
                              <BlockMath math={`MS_W = ${msw}`} />

                              <p className="mt-3 font-bold text-blue">
                                {data?.payload?.tech_lang_keys["22"]}:6 -{" "}
                                {data?.payload?.tech_lang_keys["26"]}{" "}
                                {data?.payload?.tech_lang_keys["23"]} F{" "}
                                {data?.payload?.tech_lang_keys["24"]}{" "}
                                {data?.payload?.tech_lang_keys["1"]}{" "}
                                {data?.payload?.tech_lang_keys["25"]}{" "}
                                {data?.payload?.tech_lang_keys["26"]}
                              </p>
                              <BlockMath math="F = \dfrac{MS_B}{MS_W}" />
                              <BlockMath math={`F = \\dfrac{${msb}}{${msw}}`} />
                              <BlockMath math={`F = ${f}`} />

                              <p className="mt-3 font-bold text-blue">
                                If F {data?.payload?.tech_lang_keys["26"]}{" "}
                                {data?.payload?.tech_lang_keys["27"]} &gt;{" "}
                                {data?.payload?.tech_lang_keys["28"]} (
                                {data?.payload?.tech_lang_keys["11"]}{" "}
                                {data?.payload?.tech_lang_keys["41"]} F-
                                {data?.payload?.tech_lang_keys["29"]}),{" "}
                                {data?.payload?.tech_lang_keys["30"]}{" "}
                                {data?.payload?.tech_lang_keys["32"]}
                              </p>
                              <p className="mt-3 font-bold text-blue">
                                If F {data?.payload?.tech_lang_keys["26"]}{" "}
                                {data?.payload?.tech_lang_keys["27"]} &lt;{" "}
                                {data?.payload?.tech_lang_keys["28"]} (
                                {data?.payload?.tech_lang_keys["11"]}{" "}
                                {data?.payload?.tech_lang_keys["41"]} F-
                                {data?.payload?.tech_lang_keys["29"]}),{" "}
                                {data?.payload?.tech_lang_keys["31"]}{" "}
                                {data?.payload?.tech_lang_keys["32"]}
                              </p>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="w-full mt-2 px-2">
                              <table className="w-full text-[16px]">
                                <tbody>
                                  <tr>
                                    <td className="text-blue py-2 border-b">
                                      {data?.payload?.tech_lang_keys["26"]}{" "}
                                      {data?.payload?.tech_lang_keys["10"]} F
                                    </td>
                                    <td className="py-2 border-b">
                                      <strong>
                                        <InlineMath
                                          math={`(${round(fa)}, ${round(
                                            fb
                                          )}, ${round(fab)})`}
                                        />
                                      </strong>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="text-blue py-2 border-b">
                                      P-{data?.payload?.tech_lang_keys["11"]}
                                    </td>
                                    <td className="py-2 border-b">
                                      <strong>
                                        <span className="p_value1"></span>,{" "}
                                        <span className="p_value2"></span>,{" "}
                                        <span className="p_value3"></span>
                                      </strong>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>

                              <p className="w-full mt-3">
                                <strong className="text-blue">
                                  {data?.payload?.tech_lang_keys["12"]}:
                                </strong>
                              </p>

                              <div
                                className="w-full mt-3 overflow-auto"
                                dangerouslySetInnerHTML={{ __html: table }}
                              />
                              <div
                                className="w-full mt-3 overflow-auto"
                                dangerouslySetInnerHTML={{ __html: table1 }}
                              />

                              <div className="w-full mt-3 overflow-auto">
                                <BlockMath
                                  math={`\\text{Note: } a \\Rightarrow \\text{${data?.payload?.tech_lang_keys["44"]}}, b \\Rightarrow \\text{${data?.payload?.tech_lang_keys["45"]}}, n \\Rightarrow \\text{${data?.payload?.tech_lang_keys["33"]}}`}
                                />
                              </div>

                              <div className="w-full mt-3 overflow-auto">
                                <table
                                  className="w-full"
                                  style={{ borderCollapse: "collapse" }}
                                >
                                  <thead className="bg-[#2845F5] text-white">
                                    <tr>
                                      <th
                                        className="p-2 border text-center text-blue"
                                        colSpan="6"
                                      >
                                        {data?.payload?.tech_lang_keys["25"]}{" "}
                                        {data?.payload?.tech_lang_keys["13"]}
                                      </th>
                                    </tr>
                                    <tr className="bg-white">
                                      <td className="p-2 border text-center text-blue">
                                        {data?.payload?.tech_lang_keys["14"]}
                                      </td>
                                      <td className="p-2 border text-center text-blue">
                                        {data?.payload?.tech_lang_keys["15"]}{" "}
                                        (DF)
                                      </td>
                                      <td className="p-2 border text-center text-blue">
                                        {data?.payload?.tech_lang_keys["16"]}{" "}
                                        (SS)
                                      </td>
                                      <td className="p-2 border text-center text-blue">
                                        {data?.payload?.tech_lang_keys["17"]}{" "}
                                        (MS)
                                      </td>
                                      <td className="p-2 border text-center text-blue">
                                        F-{data?.payload?.tech_lang_keys["18"]}
                                      </td>
                                      <td className="p-2 border text-center text-blue">
                                        P-{data?.payload?.tech_lang_keys["11"]}
                                      </td>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr className="bg-white">
                                      <td className="p-2 border text-center text-blue">
                                        A
                                      </td>
                                      <td className="p-2 border text-center">
                                        <InlineMath math={`a - 1 = ${dfa}`} />
                                      </td>
                                      <td className="p-2 border text-center">
                                        <InlineMath math={`${round(ssa)}`} />
                                      </td>
                                      <td className="p-2 border text-center">
                                        <InlineMath math={`${round(msa)}`} />
                                      </td>
                                      <td className="p-2 border text-center">
                                        <InlineMath math={`${round(fa)}`} />
                                      </td>
                                      <td className="p-2 border text-center p_value1"></td>
                                    </tr>
                                    <tr className="bg-white">
                                      <td className="p-2 border text-center text-blue">
                                        B
                                      </td>
                                      <td className="p-2 border text-center">
                                        <InlineMath math={`b - 1 = ${dfb}`} />
                                      </td>
                                      <td className="p-2 border text-center">
                                        <InlineMath math={`${round(ssbxx)}`} />
                                      </td>
                                      <td className="p-2 border text-center">
                                        <InlineMath math={`${round(msbxx)}`} />
                                      </td>
                                      <td className="p-2 border text-center">
                                        <InlineMath math={`${round(fb)}`} />
                                      </td>
                                      <td className="p-2 border text-center p_value2"></td>
                                    </tr>
                                    <tr className="bg-white">
                                      <td className="p-2 border text-center text-blue">
                                        AB
                                      </td>
                                      <td className="p-2 border text-center">
                                        <InlineMath
                                          math={`(a - 1)(b - 1) = ${dfab}`}
                                        />
                                      </td>
                                      <td className="p-2 border text-center">
                                        <InlineMath math={`${round(ssab)}`} />
                                      </td>
                                      <td className="p-2 border text-center">
                                        <InlineMath math={`${round(msab)}`} />
                                      </td>
                                      <td className="p-2 border text-center">
                                        <InlineMath math={`${round(fab)}`} />
                                      </td>
                                      <td className="p-2 border text-center p_value3"></td>
                                    </tr>
                                    <tr className="bg-white">
                                      <td className="p-2 border text-center text-blue">
                                        {data?.payload?.tech_lang_keys["34"]} (
                                        {data?.payload?.tech_lang_keys["35"]})
                                      </td>
                                      <td className="p-2 border text-center">
                                        <InlineMath math={`n - ab = ${dfe}`} />
                                      </td>
                                      <td className="p-2 border text-center">
                                        <InlineMath math={`${round(sse)}`} />
                                      </td>
                                      <td className="p-2 border text-center">
                                        <InlineMath math={`${round(mse)}`} />
                                      </td>
                                      <td
                                        colSpan="2"
                                        className="p-2 border text-center"
                                      ></td>
                                    </tr>
                                    <tr className="bg-white">
                                      <td className="p-2 border text-center text-blue">
                                        {data?.payload?.tech_lang_keys["21"]}
                                      </td>
                                      <td className="p-2 border text-center">
                                        <InlineMath
                                          math={`n - 1 = ${df_total}`}
                                        />
                                      </td>
                                      <td className="p-2 border text-center">
                                        <InlineMath math={`${round(sst)}`} />
                                      </td>
                                      <td
                                        colSpan="3"
                                        className="p-2 border text-center"
                                      ></td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>
                            <div className="overflow-auto">
                              <div className="w-full mt-3 overflow-auto">
                                <strong className="text-blue">
                                  {data?.payload?.tech_lang_keys["36"]} (A)
                                </strong>
                              </div>
                              <BlockMath math={`\\sum x^2 = ${p1}`} />
                              <BlockMath math={`\\sum x^2 = ${A}`} />

                              <div className="w-full mt-3 overflow-auto">
                                <strong className="text-blue">
                                  {data?.payload?.tech_lang_keys["36"]} (B)
                                </strong>
                              </div>
                              <BlockMath
                                math={`\\sum \\dfrac{x_b^2}{n_b} = ${p2_s1}`}
                              />
                              <BlockMath
                                math={`\\sum \\dfrac{x_b^2}{n_b} = ${p2_s2}`}
                              />
                              <BlockMath
                                math={`\\sum \\dfrac{x_b^2}{n_b} = ${p2_s3}`}
                              />
                              <BlockMath
                                math={`\\sum \\dfrac{x_b^2}{n_b} = ${B}`}
                              />

                              <div className="w-full mt-3 overflow-auto">
                                <strong className="text-blue">
                                  {data?.payload?.tech_lang_keys["36"]} (C)
                                </strong>
                              </div>
                              <BlockMath
                                math={`\\sum \\dfrac{x_a^2}{n_a} = ${p3_s1}`}
                              />
                              <BlockMath
                                math={`\\sum \\dfrac{x_a^2}{n_a} = ${p3_s2}`}
                              />
                              <BlockMath
                                math={`\\sum \\dfrac{x_a^2}{n_a} = ${p3_s3}`}
                              />
                              <BlockMath
                                math={`\\sum \\dfrac{x_a^2}{n_a} = ${C}`}
                              />

                              <div className="w-full mt-3 overflow-auto">
                                <strong className="text-blue">
                                  {data?.payload?.tech_lang_keys["36"]} (D)
                                </strong>
                              </div>
                              <BlockMath
                                math={`\\sum \\dfrac{\\sum x_{ab}^2}{n_{ab}} = ${p4_s1}`}
                              />
                              <BlockMath
                                math={`\\sum \\dfrac{\\sum x_{ab}^2}{n_{ab}} = ${p4_s2}`}
                              />
                              <BlockMath
                                math={`\\sum \\dfrac{\\sum x_{ab}^2}{n_{ab}} = ${p4_s3}`}
                              />
                              <BlockMath
                                math={`\\sum \\dfrac{\\sum x_{ab}^2}{n_{ab}} = ${D}`}
                              />

                              <div className="w-full mt-3 overflow-auto">
                                <strong className="text-blue">
                                  {data?.payload?.tech_lang_keys["36"]} (E)
                                </strong>
                              </div>
                              <BlockMath
                                math={`\\dfrac{\\sum x^2}{n} = ${p5_s1}`}
                              />
                              <BlockMath
                                math={`\\dfrac{\\sum x^2}{n} = ${p5_s2}`}
                              />
                              <BlockMath
                                math={`\\dfrac{\\sum x^2}{n} = ${E}`}
                              />

                              <div className="w-full mt-3 overflow-auto">
                                <strong className="text-blue">
                                  {data?.payload?.tech_lang_keys["22"]}:1 -
                                  Total {data?.payload?.tech_lang_keys["16"]}
                                </strong>
                              </div>

                              {/* SS_T */}
                              <BlockMath
                                math={`SS_T = \\sum x^2 - \\dfrac{(\\sum x)^2}{n}`}
                              />
                              <BlockMath math={`SS_T = (A) - (E)`} />
                              <BlockMath math={`SS_T = ${A} - ${E}`} />
                              <BlockMath math={`SS_T = ${sst}`} />

                              {/* SS_A */}
                              <div className="w-full mt-3 overflow-auto">
                                <strong className="text-blue">
                                  {data?.payload?.tech_lang_keys["22"]}:2 -{" "}
                                  {data?.payload?.tech_lang_keys["16"]}{" "}
                                  {data?.payload?.tech_lang_keys["37"]}
                                </strong>
                              </div>
                              <BlockMath
                                math={`SS_A = \\sum \\dfrac{x^2_a}{n_a} - \\dfrac{(\\sum x)^2}{n}`}
                              />
                              <BlockMath math={`SS_T = (C) - (E)`} />
                              <BlockMath math={`SS_A = ${C} - ${E}`} />
                              <BlockMath math={`SS_A = ${ssa}`} />

                              {/* SS_B */}
                              <div className="w-full mt-3 overflow-auto">
                                <strong className="text-blue">
                                  {data?.payload?.tech_lang_keys["22"]}:3 -{" "}
                                  {data?.payload?.tech_lang_keys["16"]}{" "}
                                  {data?.payload?.tech_lang_keys["38"]}
                                </strong>
                              </div>
                              <BlockMath
                                math={`SS_B = \\sum \\dfrac{x^2_b}{n_b} - \\dfrac{(\\sum x)^2}{n}`}
                              />
                              <BlockMath math={`SS_T = (B) - (E)`} />
                              <BlockMath math={`SS_B = ${B} - ${E}`} />
                              <BlockMath math={`SS_B = ${ssbxx}`} />

                              {/* SS_AB header */}
                              <div className="w-full mt-3 overflow-auto">
                                <strong className="text-blue">
                                  {data?.payload?.tech_lang_keys["22"]}:4 -{" "}
                                  {data?.payload?.tech_lang_keys["16"]}{" "}
                                  {data?.payload?.tech_lang_keys["39"]}
                                </strong>
                              </div>

                              {/* SS_AB */}
                              <BlockMath
                                math={`SS_{AB} = \\sum \\dfrac{\\sum x_{ab}^2}{n_{ab}} - \\dfrac{(\\sum x)^2}{n}`}
                              />
                              <BlockMath
                                math={`SS_T = (D) - (E) - SS_A - SS_B`}
                              />
                              <BlockMath
                                math={`SS_{AB} = ${D} - ${E} - ${ssa} - ${ssbxx}`}
                              />
                              <BlockMath math={`SS_{AB} = ${ssab}`} />

                              {/* SS_E */}
                              <div className="w-full mt-3 overflow-auto">
                                <strong className="text-blue">
                                  {data?.payload?.tech_lang_keys["22"]}:5 -{" "}
                                  {data?.payload?.tech_lang_keys["16"]}{" "}
                                  {data?.payload?.tech_lang_keys["34"]} (
                                  {data?.payload?.tech_lang_keys["35"]})
                                </strong>
                              </div>
                              <BlockMath
                                math={`SS_E = SS_T - SS_A - SS_B - SS_{AB}`}
                              />
                              <BlockMath
                                math={`SS_E = ${sst} - ${ssa} - ${ssbxx} - ${ssab}`}
                              />
                              <BlockMath math={`SS_E = ${sse}`} />

                              {/* MS_A */}
                              <div className="w-full mt-3 overflow-auto">
                                <strong className="text-blue">
                                  {data?.payload?.tech_lang_keys["40"]}{" "}
                                  {data?.payload?.tech_lang_keys["17"]}{" "}
                                  {data?.payload?.tech_lang_keys["37"]}
                                </strong>
                              </div>
                              <BlockMath math={`MS_A = \\dfrac{SS_A}{DF_A}`} />
                              <BlockMath
                                math={`MS_A = \\dfrac{${ssa}}{${dfa}}`}
                              />
                              <BlockMath math={`MS_A = ${msa}`} />

                              {/* MS_B */}
                              <div className="w-full mt-3 overflow-auto">
                                <strong className="text-blue">
                                  {data?.payload?.tech_lang_keys["40"]}{" "}
                                  {data?.payload?.tech_lang_keys["17"]}{" "}
                                  {data?.payload?.tech_lang_keys["38"]}
                                </strong>
                              </div>
                              <BlockMath math={`MS_B = \\dfrac{SS_B}{DF_B}`} />
                              <BlockMath
                                math={`MS_B = \\dfrac{${ssbxx}}{${dfb}}`}
                              />
                              <BlockMath math={`MS_B = ${msbxx}`} />

                              {/* MS_AB */}
                              <div className="w-full mt-3 overflow-auto">
                                <strong className="text-blue">
                                  {data?.payload?.tech_lang_keys["40"]}{" "}
                                  {data?.payload?.tech_lang_keys["17"]}{" "}
                                  {data?.payload?.tech_lang_keys["39"]}
                                </strong>
                              </div>
                              <BlockMath
                                math={`MS_{AB} = \\dfrac{SS_{AB}}{DF_{AB}}`}
                              />
                              <BlockMath
                                math={`MS_{AB} = \\dfrac{${ssab}}{${dfab}}`}
                              />
                              <BlockMath math={`MS_{AB} = ${msab}`} />

                              {/* MS_E */}
                              <div className="w-full mt-3 overflow-auto">
                                <strong className="text-blue">
                                  {data?.payload?.tech_lang_keys["40"]}{" "}
                                  {data?.payload?.tech_lang_keys["17"]}{" "}
                                  {data?.payload?.tech_lang_keys["24"]}{" "}
                                  {data?.payload?.tech_lang_keys["34"]}
                                </strong>
                              </div>
                              <BlockMath math={`MS_E = \\dfrac{SS_E}{DF_E}`} />
                              <BlockMath
                                math={`MS_E = \\dfrac{${sse}}{${dfe}}`}
                              />
                              <BlockMath math={`MS_E = ${mse}`} />

                              {/* F_A */}
                              <div className="w-full mt-3 overflow-auto">
                                <strong className="text-blue">
                                  {data?.payload?.tech_lang_keys["40"]} F-
                                  {data?.payload?.tech_lang_keys["10"]}{" "}
                                  {data?.payload?.tech_lang_keys["24"]}{" "}
                                  {data?.payload?.tech_lang_keys["42"]}
                                </strong>
                              </div>
                              <BlockMath math={`F_A = \\dfrac{MS_A}{MS_E}`} />
                              <BlockMath
                                math={`F_A = \\dfrac{${msa}}{${mse}}`}
                              />
                              <BlockMath math={`F_A = ${fa}`} />

                              {/* F_B */}
                              <div className="w-full mt-3 overflow-auto">
                                <strong className="text-blue">
                                  {data?.payload?.tech_lang_keys["40"]} F-
                                  {data?.payload?.tech_lang_keys["10"]}{" "}
                                  {data?.payload?.tech_lang_keys["24"]}{" "}
                                  {data?.payload?.tech_lang_keys["43"]}
                                </strong>
                              </div>
                              <BlockMath math={`F_B = \\dfrac{MS_B}{MS_E}`} />
                              <BlockMath
                                math={`F_B = \\dfrac{${msb}}{${mse}}`}
                              />
                              <BlockMath math={`F_B = ${fb}`} />
                              {/* F_AB Calculation */}
                              <div className="w-full mt-3 overflow-auto">
                                <strong className="text-blue">
                                  {data?.payload?.tech_lang_keys["40"]} F-
                                  {data?.payload?.tech_lang_keys["10"]}{" "}
                                  {data?.payload?.tech_lang_keys["24"]}{" "}
                                  {data?.payload?.tech_lang_keys["42"]} &{" "}
                                  {data?.payload?.tech_lang_keys["43"]}
                                </strong>
                              </div>
                              <BlockMath
                                math={`F_{AB} = \\dfrac{MS_{AB}}{MS_E}`}
                              />
                              <BlockMath
                                math={`F_{AB} = \\dfrac{${msab}}{${mse}}`}
                              />
                              <BlockMath math={`F_{AB} = ${fab}`} />

                              {/* Interpretation messages */}
                              <div className="w-full mt-3 overflow-auto">
                                <strong className="text-blue">
                                  If F {data?.payload?.tech_lang_keys["26"]}{" "}
                                  {data?.payload?.tech_lang_keys["27"]} &gt;{" "}
                                  {data?.payload?.tech_lang_keys["28"]} (
                                  {data?.payload?.tech_lang_keys["11"]}{" "}
                                  {data?.payload?.tech_lang_keys["41"]} F-
                                  {data?.payload?.tech_lang_keys["29"]}),{" "}
                                  {data?.payload?.tech_lang_keys["30"]}{" "}
                                  {data?.payload?.tech_lang_keys["32"]}
                                </strong>
                              </div>
                              <div className="w-full mt-3 overflow-auto">
                                <strong className="text-blue">
                                  If F {data?.payload?.tech_lang_keys["26"]}{" "}
                                  {data?.payload?.tech_lang_keys["27"]} &lt;{" "}
                                  {data?.payload?.tech_lang_keys["28"]} (
                                  {data?.payload?.tech_lang_keys["11"]}{" "}
                                  {data?.payload?.tech_lang_keys["41"]} F-
                                  {data?.payload?.tech_lang_keys["29"]}),{" "}
                                  {data?.payload?.tech_lang_keys["31"]}{" "}
                                  {data?.payload?.tech_lang_keys["32"]}
                                </strong>
                              </div>
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

export default AnovaCalculator;

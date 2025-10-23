"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { BlockMath } from "react-katex";
import "katex/dist/katex.min.css";

import {
  useGetSingleCalculatorDetailsMutation,
  useCentroidTriangleCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const CentroidCalculator = () => {
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

  const [formData, setFormData] = useState({
    tech_shap: "3", // 3 4  n
    tech_total: "3",
    tech_x1: "7",
    tech_y1: "5",
    tech_x2: "5",
    tech_y2: "2",
    tech_x3: "9",
    tech_y3: "11",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useCentroidTriangleCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "tech_shap") {
      // Jab tech_shap select ho toh tech_total ko set karo accordingly
      let total;
      if (value === "3") total = 3;
      else if (value === "4") total = 4;
      else total = Number(formData.tech_total) || 3; // Agar n select hai toh input ka value rakho ya 3 default

      // Update formData accordingly
      let newFormData = { ...formData, tech_shap: value, tech_total: total };

      for (let i = 1; i <= total; i++) {
        if (!("tech_x" + i in newFormData)) newFormData["tech_x" + i] = "";
        if (!("tech_y" + i in newFormData)) newFormData["tech_y" + i] = "";
      }

      // Extra keys delete karo
      for (let i = total + 1; i <= 10; i++) {
        delete newFormData["tech_x" + i];
        delete newFormData["tech_y" + i];
      }

      setFormData(newFormData);
    } else if (name === "tech_total") {
      // tech_total ke liye bhi same logic jese pehle
      let total = Math.min(Math.max(Number(value), 2), 10);
      let newFormData = { ...formData, tech_total: total };

      for (let i = 1; i <= total; i++) {
        if (!("tech_x" + i in newFormData)) newFormData["tech_x" + i] = "";
        if (!("tech_y" + i in newFormData)) newFormData["tech_y" + i] = "";
      }
      for (let i = total + 1; i <= 10; i++) {
        delete newFormData["tech_x" + i];
        delete newFormData["tech_y" + i];
      }

      setFormData(newFormData);
    } else {
      // normal input x/y changes
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Render dynamic inputs based on tech_total
  const totalPoints = Number(formData.tech_total);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_shap) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");

    // Dynamic payload object banate hain
    let payload = {
      tech_shap: formData.tech_shap,
      tech_total: formData.tech_total,
    };

    for (let i = 1; i <= Number(formData.tech_total); i++) {
      payload[`tech_x${i}`] = formData[`tech_x${i}`] || "";
      payload[`tech_y${i}`] = formData[`tech_y${i}`] || "";
    }

    try {
      const response = await calculateEbitCalculator(payload).unwrap();
      setResult(response?.payload);
      toast.success("Successfully Calculated");
    } catch (err) {
      setFormError(err.data?.payload?.error || "Something went wrong");
      toast.error(err.data?.payload?.error || "Something went wrong");
    }
  };

  // Handle reset form
  const handleReset = () => {
    setFormData({
      tech_shap: "3", // 3 4  n
      tech_total: "3",
      tech_x1: "7",
      tech_y1: "5",
      tech_x2: "5",
      tech_y2: "2",
      tech_x3: "9",
      tech_y3: "11",
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

  // result
  const x1 = formData?.tech_x1 ?? 0;
  const x2 = formData?.tech_x2 ?? 0;
  const x3 = formData?.tech_x3 ?? 0;
  const y1 = formData?.tech_y1 ?? 0;
  const y2 = formData?.tech_y2 ?? 0;
  const y3 = formData?.tech_y3 ?? 0;

  const n = result?.tech_n ?? 3; // default 3 points
  const xVals = [];
  const yVals = [];

  // Collect x and y values dynamically from formData
  for (let i = 1; i <= n; i++) {
    xVals.push(formData?.[`tech_x${i}`] ?? 0);
    yVals.push(formData?.[`tech_y${i}`] ?? 0);
  }

  // Build the LaTeX strings for sum of x and y with subscripts
  const buildSumWithSubs = (varName) =>
    Array.from({ length: n }, (_, i) => `${varName}_{${i + 1}}`).join(" + ");

  // Build the LaTeX strings for sum of values (numbers)
  const buildSumOfValues = (vals) => vals.join(" + ");

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

          <div className="lg:w-[60%] md:w-[80%] w-full mx-auto ">
            <div className="grid grid-cols-12  gap-2 md:gap-4 lg:gap-4 text-center">
              <div className="col-span-12 text-left">
                <label htmlFor="tech_shap" className="label">
                  {data?.payload?.tech_lang_keys["select"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_shap"
                    id="tech_shap"
                    value={formData.tech_shap}
                    onChange={handleChange}
                  >
                    <option value="3">
                      {data?.payload?.tech_lang_keys["tri"]}
                    </option>
                    <option value="4">
                      {data?.payload?.tech_lang_keys["pol"]}
                    </option>
                    <option value="n">
                      {data?.payload?.tech_lang_keys["n"]}
                    </option>
                  </select>
                </div>
              </div>
              {formData.tech_shap != "3" && (
                <>
                  <div className="col-span-12 text-left  nInput">
                    <label htmlFor="tech_total" className="label">
                      N:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        min="2"
                        max="10"
                        name="tech_total"
                        id="tech_total"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_total}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </>
              )}
              <div className="col-span-12">
                <div className="grid grid-cols-12 gap-2 md:gap-4 lg:gap-4 text-center">
                  {[...Array(Number(formData.tech_total))].map((_, i) => {
                    const index = i + 1; // 1-based indexing for naming

                    return (
                      <React.Fragment key={index}>
                        <div className="col-span-12  md:col-span-6  ">
                          <div className="grid grid-cols-12 gap-2 md:gap-4 lg:gap-4 text-center">
                            <p className="col-span-12">
                              <strong>
                                {data?.payload?.tech_lang_keys["x"]} (x
                                <sub className="font-s-14">{index}</sub>, y
                                <sub className="font-s-14">{index}</sub>)
                              </strong>
                            </p>
                            <div className="col-span-6">
                              <div className="relative">
                                <input
                                  type="number"
                                  step="any"
                                  name={`tech_x${index}`}
                                  id={`tech_x${index}`}
                                  className="input my-2"
                                  aria-label="input"
                                  placeholder="00"
                                  value={formData[`tech_x${index}`] || ""}
                                  onChange={handleChange}
                                />
                              </div>
                            </div>
                            <div className="col-span-6">
                              <div className="relative">
                                <input
                                  type="number"
                                  step="any"
                                  name={`tech_y${index}`}
                                  id={`tech_y${index}`}
                                  className="input my-2"
                                  aria-label="input"
                                  placeholder="00"
                                  value={formData[`tech_y${index}`] || ""}
                                  onChange={handleChange}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </React.Fragment>
                    );
                  })}
                </div>
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

                  <div className="rounded-lg  flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="w-full">
                        <div className="w-full overflow-auto  mt-2">
                          <table className="w-full text-[16px]">
                            <tbody>
                              <tr>
                                <td className="py-2 border-b" width="60%">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["anst"]}
                                  </strong>
                                </td>
                                <td className="py-2 border-b">
                                  ({result?.tech_ans})
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        <div className="w-full text-[18px] overflow-auto">
                          <p className="mt-2">
                            <strong>Solution</strong>
                          </p>
                          <p className="mt-2">Input Data:</p>
                          {formData?.tech_shap == "3" ||
                          formData?.tech_total == "3" ? (
                            <>
                              <p className="mt-2">
                                Point 1 (x<sub className="font-s-14">1</sub>, y
                                <sub className="font-s-14">1</sub>) = ({x1},{" "}
                                {y1})<br />
                                Point 2 (x<sub className="font-s-14">2</sub>, y
                                <sub className="font-s-14">2</sub>) = ({x2},{" "}
                                {y2})<br />
                                Point 3 (x<sub className="font-s-14">3</sub>, y
                                <sub className="font-s-14">3</sub>) = ({x3},{" "}
                                {y3})
                              </p>

                              <p className="mt-2">Formula of Centroid =</p>

                              <BlockMath
                                math={`\\left( \\frac{x_1 + x_2 + x_3}{3},\\ \\frac{y_1 + y_2 + y_3}{3} \\right)`}
                              />

                              <p className="mt-2">Substitute values:</p>

                              <BlockMath
                                math={`\\left( \\frac{${x1} + ${x2} + ${x3}}{3},\\ \\frac{${y1} + ${y2} + ${y3}}{3} \\right)`}
                              />

                              <p className="mt-2">Sum of coordinates:</p>

                              <BlockMath
                                math={`\\left( \\frac{${
                                  x1 + x2 + x3
                                }}{3},\\ \\frac{${y1 + y2 + y3}}{3} \\right)`}
                              />

                              <p className="mt-2">
                                Centroid (Result): ({result?.tech_ans})
                              </p>
                            </>
                          ) : (
                            <>
                              {/* Render points */}
                              {Array.from({ length: n }, (_, i) => (
                                <p key={i} className="mt-2">
                                  Point {i + 1} (x
                                  <sub className="font-s-14">{i + 1}</sub>, y
                                  <sub className="font-s-14">{i + 1}</sub>) = (
                                  {xVals[i]}, {yVals[i]})
                                </p>
                              ))}

                              <p className="mt-2">Formula of Centroid =</p>

                              <BlockMath
                                math={`\\left( \\frac{${buildSumWithSubs(
                                  "x"
                                )}}{${n}},\\ \\frac{${buildSumWithSubs(
                                  "y"
                                )}}{${n}} \\right)`}
                              />

                              <p className="mt-2">Substitute values:</p>

                              <BlockMath
                                math={`\\left( \\frac{${buildSumOfValues(
                                  xVals
                                )}}{${n}},\\ \\frac{${buildSumOfValues(
                                  yVals
                                )}}{${n}} \\right)`}
                              />

                              <p className="mt-2">Calculate sums:</p>

                              <BlockMath
                                math={`\\left( \\frac{${xVals.reduce(
                                  (a, b) => a + b,
                                  0
                                )} }{${n}},\\ \\frac{${yVals.reduce(
                                  (a, b) => a + b,
                                  0
                                )}}{${n}} \\right)`}
                              />

                              <p className="mt-2">
                                Centroid (Result): ({result?.tech_ans})
                              </p>
                            </>
                          )}
                          <div className="col-12 text-center mt-3">
                            {formData.tech_shap == "3" ? (
                              <>
                                <img
                                  src="/images/triangle.webp"
                                  height="100%"
                                  width="200px"
                                  alt="trianle details image first"
                                  loading="lazy"
                                  decoding="async"
                                />
                              </>
                            ) : formData.tech_shap == "4" ? (
                              <>
                                <img
                                  src="/images/pol.webp"
                                  height="100%"
                                  width="200px"
                                  alt="trianle details image second"
                                  loading="lazy"
                                  decoding="async"
                                />
                              </>
                            ) : (
                              <>
                                <img
                                  src="/images/npoint.webp"
                                  height="100%"
                                  width="200px"
                                  alt="trianle details image third"
                                  loading="lazy"
                                  decoding="async"
                                />
                              </>
                            )}
                          </div>
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

export default CentroidCalculator;

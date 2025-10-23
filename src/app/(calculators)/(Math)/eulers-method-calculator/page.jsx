"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useEulersMethodCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const EulersMethodCalculator = () => {
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
    tech_EnterEq: "(x^2+4y)^(1/2)",
    tech_steps: "h", // h n
    tech_size: "0.2",
    tech_ini: "0",
    tech_con: "3",
    tech_find: "1",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useEulersMethodCalculatorMutation();

  const [showKeyboard, setShowKeyboard] = useState(false);

  const toggleKeyboard = () => {
    setShowKeyboard((prev) => !prev);
  };
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      let updated = { ...prev, [name]: value };

      // Auto-update tech_size when tech_with changes
      if (name === "tech_with") {
        updated.tech_size = value === "n" ? 3 : 0.2;
      }

      return updated;
    });

    setResult(null);
    setFormError(null);
  };

  const handleKeyClick = (value) => {
    setFormData((prev) => ({
      ...prev,
      tech_EnterEq: (prev.tech_EnterEq || "") + value,
    }));
    setResult(null);
    setFormError(null);
  };

  const clearInput = () => {
    setFormData((prev) => ({ ...prev, tech_EnterEq: "" }));
    setResult(null);
    setFormError(null);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_EnterEq) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_EnterEq: formData.tech_EnterEq,
        tech_steps: formData.tech_steps,
        tech_size: formData.tech_size,
        tech_ini: formData.tech_ini,
        tech_con: formData.tech_con,
        tech_find: formData.tech_find,
      }).unwrap();
      setResult(response); // Assuming the response has 'lovePercentage'
      toast.success("Successfully Calculated");
    } catch (err) {
      setFormError(err.data.error);
      toast.error(err.data.error);
    }
  };

  // Handle reset form
  const handleReset = () => {
    setFormData({
      tech_EnterEq: "(x^2+4y)^(1/2)",
      tech_steps: "h", // h n
      tech_size: "0.2",
      tech_ini: "0",
      tech_con: "3",
      tech_find: "1",
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

  const exampleLoadHandler = () => {
    const examples = [
      "(x^2 + 1)^(1/2)",
      "(3x^2 - 2x + 5)^(1/2)",
      "(4x^2 + 9)^(1/2)",
      "(x^2 - 6x + 8)^(1/2)",
      "(2x^2 + x + 7)^(1/2)",
    ];

    const randomExample = examples[Math.floor(Math.random() * examples.length)];
    setFormData((prev) => ({
      ...prev,
      tech_EnterEq: randomExample,
    }));
    setResult(null);
    setFormError(null);
  };

  // result
  const h = parseFloat(result?.tech_h || 0).toFixed(2);
  const steps = result?.tech_steps || [];
  const steps1 = result?.tech_steps1 || [];

  let x = parseFloat(result?.tech_ini);
  let y = parseFloat(result?.tech_con);
  let tableRows = [];

  // Generate table rows
  for (let i = 1; i <= steps.length; i++) {
    // Skip if value is empty string or invalid
    if (steps[i - 1] === "" || steps1[i - 1] === "") continue;

    const slope = parseFloat(steps[i - 1]).toFixed(2);
    const yNext = parseFloat(steps1[i - 1]).toFixed(2);
    const xPrev = x.toFixed(2);
    const yPrev = y.toFixed(2);
    const xNext = (x + parseFloat(h)).toFixed(2);

    tableRows.push({
      i,
      xPrev,
      yPrev,
      slope,
      yNext,
    });

    // Update x and y for next iteration
    x = parseFloat(xNext);
    y = parseFloat(yNext);
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
        <div className="w-full mx-auto p-4 lg:p-8 md:p-8 input_form rounded-lg space-y-6 mb-3">
          {formError && (
            <p className="text-red-500 text-lg font-semibold w-full">
              {formError}
            </p>
          )}

          <div className="lg:w-[60%] md:w-[80%] w-full mx-auto ">
            <div className="grid grid-cols-12 mt-3   gap-2 md:gap-4 lg:gap-4">
              <div className="col-span-12">
                <div className="col-span-12 md:col-span-4 lg:col-span-4 md:flex md:justify-between">
                  <label for="tech_EnterEq" className="label mt-4">
                    {data?.payload?.tech_lang_keys["1"]} y′=f(x,y)` or
                    `y′=f(t,y)=:
                  </label>
                  <button
                    type="button"
                    className="mt-3 flex border rounded-lg p-1  items-center"
                    id="exampleLoadBtn"
                    onClick={exampleLoadHandler}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="13"
                      height="13"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      className="lucide lucide-arrow-up-right size-5 me-1"
                    >
                      <path d="M7 7h10v10"></path>
                      <path d="M7 17 17 7"></path>
                    </svg>
                    Load Example
                  </button>
                </div>
                <div className="w-full py-2 relative">
                  <input
                    type="text"
                    step="any"
                    name="tech_EnterEq"
                    id="tech_EnterEq"
                    className="input "
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_EnterEq}
                    onChange={handleChange}
                  />
                  <img
                    src="/images/keyboard.png"
                    className="keyboardImg absolute right-2 top-8 cursor-pointer  transform -translate-y-1/2 w-9 h-9"
                    alt="keyboard"
                    loading="lazy"
                    decoding="async"
                    onClick={toggleKeyboard}
                  />
                </div>
              </div>

              {showKeyboard && (
                <div className="col-span-12 keyboard grid grid-cols-9 gap-1 mt-2">
                  <button
                    type="button"
                    className="bg-blue-700 cursor-pointer text-white rounded-sm h-9 px-2 uppercase shadow-md hover:bg-blue-600"
                    onClick={clearInput}
                  >
                    CLS
                  </button>
                  {["+", "-", "/", "*", "^", "sqrt(", "(", ")"].map(
                    (keyVal, idx) => (
                      <button
                        key={idx}
                        type="button"
                        className="keyBtn bg-blue-700 cursor-pointer text-white rounded-sm h-9 px-2 uppercase shadow-md hover:bg-blue-600"
                        onClick={() => handleKeyClick(keyVal)}
                      >
                        {keyVal === "sqrt(" ? "√" : keyVal}
                      </button>
                    )
                  )}
                </div>
              )}
              <div className="col-span-12 mt-2">
                <label htmlFor="tech_with" className="label">
                  W.R.T:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_with"
                    id="tech_with"
                    value={formData.tech_with}
                    onChange={handleChange}
                  >
                    <option value="h">
                      {data?.payload?.tech_lang_keys["3"]}{" "}
                    </option>
                    <option value="n">
                      {data?.payload?.tech_lang_keys["4"]}{" "}
                    </option>
                  </select>
                </div>
              </div>

              <div className="col-span-6">
                {formData.tech_with == "h" ? (
                  <>
                    <label htmlFor="tech_size" className="label">
                      {" "}
                      {data?.payload?.tech_lang_keys["18"]} (h):{" "}
                    </label>
                  </>
                ) : (
                  <>
                    <label htmlFor="tech_size" className="label">
                      {" "}
                      {data?.payload?.tech_lang_keys["18"]} (n):{" "}
                    </label>
                  </>
                )}
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_size"
                    id="tech_size"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_size}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-span-6">
                <label htmlFor="tech_ini" className="label">
                  {data?.payload?.tech_lang_keys["5"]} (t₀)
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_ini"
                    id="tech_ini"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_ini}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-span-6">
                <label htmlFor="tech_con" className="label">
                  {data?.payload?.tech_lang_keys["19"]} (Y₀):
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_con"
                    id="tech_con"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_con}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-span-6">
                <label htmlFor="tech_con" className="label">
                  {data?.payload?.tech_lang_keys["6"]}{" "}
                  <sub className="text-blue">1</sub>
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_find"
                    id="tech_find"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_find}
                    onChange={handleChange}
                  />
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

                  <div className="rounded-lg flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="w-full">
                        <div className="w-full text-center text-[20px]">
                          <p className="my-3">
                            <strong className="bg-[#2845F5] px-3 py-2 text-[23px] rounded-lg text-white">
                              <InlineMath
                                math={`y_{${result?.tech_find}} = ${parseFloat(
                                  result?.tech_ans
                                ).toFixed(2)}`}
                              />
                            </strong>
                          </p>
                        </div>

                        <div className="w-full text-[16px] rounded-lg px-4 py-2 overflow-auto">
                          <p className="mt-3">
                            {data?.payload?.tech_lang_keys["9"]}{" "}
                            <InlineMath math={`y(${result?.tech_find})`} />{" "}
                            {data?.payload?.tech_lang_keys["10"]}{" "}
                            <InlineMath math={`y' = ${result?.tech_enter}`} />,
                          </p>

                          <p className="mt-3">
                            <strong>
                              {data?.payload?.tech_lang_keys["8"]}
                            </strong>
                          </p>

                          {formData?.tech_steps === "n" && (
                            <p className="mt-3">
                              {data?.payload?.tech_lang_keys["13"]}{" "}
                              <InlineMath
                                math={`h = \\frac{${result?.tech_find} - ${result?.tech_ini}}{${formData?.tech_size}} = ${h}`}
                              />
                            </p>
                          )}

                          <p className="mt-3">
                            {data?.payload?.tech_lang_keys["14"]}{" "}
                            <InlineMath
                              math={`y_{n+1} = y_n + h \\cdot f(${result?.tech_one}_n, y_n)`}
                            />
                          </p>

                          <p className="mt-3">
                            {data?.payload?.tech_lang_keys["16"]}
                          </p>

                          <ul className="px-3">
                            <li className="py-2">
                              <InlineMath math={`h = ${h}`} />
                            </li>
                            <li className="py-2">
                              <InlineMath
                                math={`${result?.tech_one}_0 = ${result?.tech_ini}`}
                              />
                            </li>
                            <li className="py-2">
                              <InlineMath math={`y_0 = ${result?.tech_con}`} />
                            </li>
                            <li className="py-2">
                              <InlineMath
                                math={`f(${result?.tech_one}, y) = ${result?.tech_enter}`}
                              />
                            </li>
                          </ul>

                          {tableRows.map((row) => (
                            <div key={row.i}>
                              <p className="mt-3">
                                <strong>
                                  {data?.payload?.tech_lang_keys["17"]} {row.i}
                                </strong>
                              </p>
                              <p className="mt-3">
                                <InlineMath
                                  math={`${result?.tech_one}_${row.i} = ${
                                    row.xPrev
                                  } + h = ${(
                                    parseFloat(row.xPrev) + parseFloat(h)
                                  ).toFixed(2)}`}
                                />
                              </p>
                              <p className="mt-3">
                                <InlineMath
                                  math={`y(${result?.tech_one}_${row.i}) = y(${(
                                    parseFloat(row.xPrev) + parseFloat(h)
                                  ).toFixed(2)}) = y_${row.i} = y_{${
                                    row.i - 1
                                  }} + h \\cdot f(${row.xPrev}, ${row.yPrev})`}
                                />
                              </p>
                              <p className="mt-3">
                                <InlineMath
                                  math={`= ${row.yPrev} + ${h} \\cdot ${row.slope} = ${row.yNext}`}
                                />
                              </p>
                            </div>
                          ))}

                          <p className="mt-3">
                            <strong>
                              {data?.payload?.tech_lang_keys["7"]}:{" "}
                              <InlineMath
                                math={`y(${result?.tech_find}) = ${parseFloat(
                                  result?.tech_ans
                                ).toFixed(2)}`}
                              />
                            </strong>
                          </p>

                          <div className="w-full mt-3 overflow-auto">
                            <table className="w-full text-center border-collapse border border-black">
                              <thead
                                style={{
                                  backgroundImage:
                                    "linear-gradient(90deg,rgb(97, 114, 219), #2845F5)",
                                }}
                              >
                                <tr className="text-white">
                                  <td className="bordered">
                                    <strong>
                                      {data?.payload?.tech_lang_keys["17"]}
                                    </strong>
                                  </td>
                                  <td className="bordered">
                                    <strong>
                                      x<sub>0</sub>
                                    </strong>
                                  </td>
                                  <td className="bordered">
                                    <strong>
                                      y<sub>0</sub>
                                    </strong>
                                  </td>
                                  <td className="bordered">
                                    <strong>slope</strong>
                                  </td>
                                  <td className="bordered">
                                    <strong>
                                      y<sub>n</sub>
                                    </strong>
                                  </td>
                                </tr>
                              </thead>
                              <tbody>
                                {tableRows.map((row, idx) => (
                                  <tr key={idx}>
                                    <td className="bordered p-2">{row.i}</td>
                                    <td className="bordered p-2">
                                      {row.xPrev}
                                    </td>
                                    <td className="bordered p-2">
                                      {row.yPrev}
                                    </td>
                                    <td className="bordered p-2">
                                      {row.slope}
                                    </td>
                                    <td className="bordered p-2">
                                      {row.yNext}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
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

export default EulersMethodCalculator;

"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useIntervalNotationCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const IntervalNotationCalculator = () => {
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
    tech_i: "(2,8]",
    tech_x: "select", // select  even odd prime
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useIntervalNotationCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_i || !formData.tech_x) {
      setFormError("Please fill in input.");
      return;
    }
    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_i: formData.tech_i,
        tech_x: formData.tech_x,
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
      tech_i: "(2,8]",
      tech_x: "select", // select  even odd prime
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

  const isPrime = (number) => {
    if (number === 1) return false;
    if (number === 2) return true;
    const sqrt = Math.floor(Math.sqrt(number));
    for (let i = 2; i <= sqrt; ++i) {
      if (number % i === 0) return false;
    }
    return true;
  };

  const l = Number(result?.tech_l ?? 0);
  const r = Number(result?.tech_r ?? 0);

  const x = formData?.tech_x;

  const rawSet = result?.tech_set || [];
  let set = [...rawSet];

  // Filter set
  if (x === "even") {
    set = set.filter((val) => val % 2 === 0);
  } else if (x === "odd") {
    set = set.filter((val) => val % 2 !== 0);
  } else if (x === "prime") {
    const start = set[0];
    const end = set[set.length - 1];
    const prime = [];
    for (let i = start; i <= end; i++) {
      if (isPrime(i)) prime.push(i);
    }
    set = prime;
  }

  const set_len = set.length;

  // Build interval expression
  const rangeType = result?.tech_lo_ro
    ? "lo_ro"
    : result?.tech_lo_rc
    ? "lo_rc"
    : result?.tech_lc_ro
    ? "lc_ro"
    : result?.tech_lc_rc
    ? "lc_rc"
    : null;

  const getRangeExpression = () => {
    if (!rangeType || isNaN(l) || isNaN(r)) return "";

    const xs = x && x !== "select" ? `,\\ x\\ is\\ ${x}` : "";

    const min = Math.min(l, r);
    const max = Math.max(l, r);

    const leftSymbol = ["lo_ro", "lo_rc"].includes(rangeType) ? "<" : "\\le";
    const rightSymbol = ["lo_ro", "lc_ro"].includes(rangeType) ? "<" : "\\le";

    return `\\{x\\ \\mid\\ ${min}\\ ${leftSymbol}\\ x\\ ${rightSymbol}\\ ${max}${xs} \\}`;
  };

  const getBoundType = () => {
    const left = ["lc_ro", "lc_rc"].includes(rangeType)
      ? data?.payload?.tech_lang_keys["18"]
      : data?.payload?.tech_lang_keys["17"];
    const right = ["lo_rc", "lc_rc"].includes(rangeType)
      ? data?.payload?.tech_lang_keys["18"]
      : data?.payload?.tech_lang_keys["17"];
    return `\\text{left} \\ ${left} \\ \\mid \\ \\text{right} \\ ${right}`;
  };

  const previewValues = () => {
    if (set_len <= 7) return null;
    const v1 = Math.floor((set_len - 1) / 3);
    const v2 = v1 * 2;
    const v3 = v1 * 3;
    return (
      <div className="mt-2 flex gap-2">
        <span className="s_set ml-[5px]">{set[0]}</span>
        <span className="s_set">{set[v1]}</span>
        <span className="s_set">{set[v2]}</span>
        <span className="s_set">{set[v3]}</span>
        <span className="s_set">{set[set_len - 1]}</span>
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
          <div className="lg:w-[50%] md:w-[70%] w-full mx-auto ">
            <div className="grid grid-cols-1  lg:grid-cols-2 md:grid-cols-2 mt-3   gap-2 md:gap-4 lg:gap-4">
              <p className="col-span-12 text-[14px]">
                <strong>
                  {data?.payload?.tech_lang_keys["1"]}. (2,8){" "}
                  {data?.payload?.tech_lang_keys["2"]} [2,8]{" "}
                  {data?.payload?.tech_lang_keys["2"]} [2,8){" "}
                  {data?.payload?.tech_lang_keys["2"]} (2,8]
                </strong>
              </p>
              <div className="col-span-12">
                <label htmlFor="tech_i" className="label">
                  {data?.payload?.tech_lang_keys["3"]}:
                </label>
                <div className=" relative">
                  <input
                    type="text"
                    step="any"
                    name="tech_i"
                    id="tech_i"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_i}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-span-12">
                <label htmlFor="tech_x" className="label">
                  {data?.payload?.tech_lang_keys["4"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_x"
                    id="tech_x"
                    value={formData.tech_x}
                    onChange={handleChange}
                  >
                    <option value="select">
                      {data?.payload?.tech_lang_keys["5"]}{" "}
                    </option>
                    <option value="even">
                      {data?.payload?.tech_lang_keys["6"]}{" "}
                    </option>
                    <option value="odd">
                      {data?.payload?.tech_lang_keys["7"]}{" "}
                    </option>
                    <option value="prime">
                      {data?.payload?.tech_lang_keys["8"]}{" "}
                    </option>
                  </select>
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
                      <div className="w-full md:w-[80%] lg:w-[60%] overflow-auto mt-2">
                        <table className="w-full text-[16px]">
                          <tbody>
                            <tr>
                              <td className="py-2 border-b w-[60%]">
                                <strong>
                                  {data?.payload?.tech_lang_keys[9]}
                                </strong>
                              </td>
                              <td className="py-2 border-b">
                                {set.join(", ")}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      <div className="w-full text-[16px] steps overflow-auto">
                        <p className="mt-2 font-bold">
                          {data?.payload?.tech_lang_keys["12"]}
                        </p>
                        <div className="mt-2">
                          {data?.payload?.tech_lang_keys["13"]}
                        </div>
                        <div className="mt-2">{set.join(", ")}</div>

                        <div className="mt-2">
                          {data?.payload?.tech_lang_keys["14"]}
                        </div>
                        <div className="mt-2">
                          <BlockMath math={getRangeExpression()} />
                        </div>

                        <div className="mt-2">
                          {data?.payload?.tech_lang_keys["15"]}
                        </div>
                        <div className="mt-2">
                          <InlineMath math={`${set_len}`} />
                        </div>

                        <div className="mt-2">
                          {data?.payload?.tech_lang_keys["16"]}
                        </div>
                        <div className="mt-2">
                          <BlockMath math={getBoundType()} />
                        </div>

                        {set_len > 7 && (
                          <>
                            <div className="mt-2">
                              {data?.payload?.tech_lang_keys["19"]}
                            </div>
                            <hr className="mt-2 hr_set" />
                            <hr className="mt-2 hr_set1" />
                            {previewValues()}
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

export default IntervalNotationCalculator;

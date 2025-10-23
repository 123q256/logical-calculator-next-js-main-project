"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  usePascalsTriangleCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const PascalsTriangleCalculator = () => {
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
    tech_method: "1",
    tech_row: 6,
    tech_column: 5,
    tech_to_row: 10,
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = usePascalsTriangleCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_method) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_method: formData.tech_method,
        tech_row: formData.tech_row,
        tech_column: formData.tech_column,
        tech_to_row: formData.tech_to_row,
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
      tech_method: "1",
      tech_row: 6,
      tech_column: 5,
      tech_to_row: 10,
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
  const renderMethod1 = () => {
    const level = result?.tech_row + 1;
    const number = [];

    const rows = [];

    for (let y = 1; y <= level; y++) {
      const row = [];
      number[y] = [];
      const l2 = y - 1;

      row.push(
        <td key={`label-${y}`} className="py-2 border-b">
          <b>{l2}.</b>
        </td>
      );
      row.push(<td key={`spacer-start-${y}`} className="py-2 border-b"></td>);

      for (let x = 1; x <= y; x++) {
        if (x === 1) {
          number[y][x] = 1;
          if (level !== y) {
            row.push(
              <td
                key={`colspan-${y}`}
                className="py-2 border-b"
                colSpan={level - y}
              ></td>
            );
          }
          row.push(
            <td key={`start-${y}`} className="py-2 border-b">
              {number[y][x]}
            </td>
          );
          row.push(<td key={`gap-${y}`} className="py-2 border-b"></td>);
        } else if (x === y) {
          number[y][x] = 1;
          row.push(
            <td key={`end-${y}`} className="py-2 border-b">
              {number[y][x]}
            </td>
          );
        } else {
          number[y][x] = number[y - 1][x - 1] + number[y - 1][x];
          row.push(
            <td key={`mid-${y}-${x}`} className="py-2 border-b">
              {number[y][x]}
            </td>
          );
          row.push(<td key={`gap-${y}-${x}`} className="py-2 border-b"></td>);
        }
      }

      rows.push(<tr key={`row-${y}`}>{row}</tr>);
    }

    return (
      <table className="w-full text-[18px] text-center">
        <tbody>{rows}</tbody>
      </table>
    );
  };

  const renderMethod2 = () => {
    const row = result?.tech_row;
    const numbers = [];

    let num = 1;
    for (let j = 0; j <= row; j++) {
      numbers.push(Math.round(num));
      num = (num * (row - j)) / (j + 1);
    }

    return (
      <div className="w-full text-center my-4">
        <p className="text-[20px] font-semibold text-blue mb-2">
          Pascal's Triangle Row {row}
        </p>
        <div className="flex justify-center flex-wrap gap-2">
          {numbers.map((val, idx) => (
            <span
              key={idx}
              className="px-3 py-2 bg-[#2845F5] text-white rounded-xl text-[18px]"
            >
              {val}
            </span>
          ))}
        </div>
      </div>
    );
  };

  const renderMethod3 = () => {
    const cols = result?.tech_col;
    const rows = [];

    for (let i = result?.tech_row; i <= cols; i++) {
      const row = [];
      let num = 1;

      row.push(
        <td key={`label-${i}`} className="py-2 border-b">
          <b>{i}.</b>
        </td>
      );

      for (let k = cols; k > i; k--) {
        row.push(<td key={`sp-${k}`} className="py-2 border-b"></td>);
      }

      for (let j = 0; j <= i; j++) {
        row.push(
          <td key={`val-${i}-${j}`} className="py-2 border-b">
            {Math.round(num)}
          </td>
        );
        if (j < i) {
          row.push(<td key={`gap-${i}-${j}`} className="py-2 border-b"></td>);
        }
        num = (num * (i - j)) / (j + 1);
      }

      rows.push(<tr key={`row-${i}`}>{row}</tr>);
    }

    return (
      <table className="w-full text-[18px] text-center">
        <tbody>{rows}</tbody>
      </table>
    );
  };

  const pascalTriangleRecursive = (c, r) => {
    if (c === 0 || c === r) return 1;
    return (
      pascalTriangleRecursive(c - 1, r - 1) + pascalTriangleRecursive(c, r - 1)
    );
  };

  const renderDefault = () => {
    const resultVal = pascalTriangleRecursive(
      result?.tech_column,
      result?.tech_row
    );
    return (
      <div className="w-full text-center my-2">
        <p>
          <strong className="bg-[#2845F5] text-white px-3 py-2 text-[21px] rounded-xl">
            {resultVal}
          </strong>
        </p>
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

          <div className="lg:w-[40%] md:w-[70%] w-full mx-auto ">
            <div className="grid grid-cols-12 mt-3 gap-2 md:gap-4 lg:gap-4">
              <div className="col-span-12">
                <label htmlFor="tech_method" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_method"
                    id="tech_method"
                    value={formData.tech_method}
                    onChange={handleChange}
                  >
                    <option value="1">
                      {data?.payload?.tech_lang_keys["2"]}{" "}
                    </option>
                    <option value="2">
                      {data?.payload?.tech_lang_keys["3"]}{" "}
                    </option>
                    <option value="3">
                      {data?.payload?.tech_lang_keys["4"]}{" "}
                    </option>
                    <option value="4">
                      {data?.payload?.tech_lang_keys["5"]}{" "}
                    </option>
                  </select>
                </div>
              </div>
              <div className="col-span-12">
                <label htmlFor="tech_row" className="label">
                  {data?.payload?.tech_lang_keys["6"]} (n)
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_row"
                    id="tech_row"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_row}
                    onChange={handleChange}
                  />
                </div>
              </div>
              {formData.tech_method == "3" && (
                <>
                  <div className="col-span-12 to_row ">
                    <label htmlFor="tech_to_row" className="label">
                      {data?.payload?.tech_lang_keys["7"]}
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_to_row"
                        id="tech_to_row"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_to_row}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </>
              )}
              {formData.tech_method == "4" && (
                <>
                  <div className="col-span-12 column ">
                    <label htmlFor="tech_column" className="label">
                      {data?.payload?.tech_lang_keys["8"]} (k)
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_column"
                        id="tech_column"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_column}
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
                    <div className="w-full mt-3 overflow-auto">
                      {result?.tech_method == "1"
                        ? renderMethod1()
                        : result?.tech_method == "2"
                        ? renderMethod2()
                        : result?.tech_method == "3"
                        ? renderMethod3()
                        : renderDefault()}
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

export default PascalsTriangleCalculator;

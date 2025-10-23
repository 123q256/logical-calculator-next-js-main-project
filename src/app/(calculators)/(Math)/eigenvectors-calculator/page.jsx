"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { BlockMath } from "react-katex";
import "katex/dist/katex.min.css";

import {
  useGetSingleCalculatorDetailsMutation,
  useEigenvectorsCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const EigenvectorCalculator = () => {
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
    tech_matrix: "2",
    tech_matrix_0_0: "2",
    tech_matrix_0_1: "1",
    tech_matrix_0_2: "2",
    tech_matrix_1_0: "8",
    tech_matrix_1_1: "1",
    tech_matrix_1_2: "1",
    tech_matrix_2_0: "1",
    tech_matrix_2_1: "6",
    tech_matrix_2_2: "1",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useEigenvectorsCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_matrix) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_matrix: formData.tech_matrix,
        tech_matrix_0_0: formData.tech_matrix_0_0,
        tech_matrix_0_1: formData.tech_matrix_0_1,
        tech_matrix_0_2: formData.tech_matrix_0_2,
        tech_matrix_1_0: formData.tech_matrix_1_0,
        tech_matrix_1_1: formData.tech_matrix_1_1,
        tech_matrix_1_2: formData.tech_matrix_1_2,
        tech_matrix_2_0: formData.tech_matrix_2_0,
        tech_matrix_2_1: formData.tech_matrix_2_1,
        tech_matrix_2_2: formData.tech_matrix_2_2,
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
      tech_matrix: "2",
      tech_matrix_0_0: "2",
      tech_matrix_0_1: "1",
      tech_matrix_0_2: "2",
      tech_matrix_1_0: "8",
      tech_matrix_1_1: "1",
      tech_matrix_1_2: "1",
      tech_matrix_2_0: "1",
      tech_matrix_2_1: "6",
      tech_matrix_2_2: "1",
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

  const handleGenerateRandom = () => {
    const newFormData = { ...formData };

    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 5; j++) {
        const key = `tech_matrix_${i}_${j}`;
        newFormData[key] = Math.floor(Math.random() * 11).toString(); // 0–10 random
      }
    }

    setFormData(newFormData);
  };

  const handleClearInputs = () => {
    const newFormData = { ...formData };

    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 5; j++) {
        const key = `tech_matrix_${i}_${j}`;
        newFormData[key] = "";
      }
    }

    setFormData(newFormData);
  };

  // result
  const eigvecs = result?.tech_eigvecs;
  const mul = result?.tech_mul;
  const eigvals = result?.tech_eigvals;
  const eigvals1 = result?.tech_eigvals1;
  const eigvals2 = result?.tech_eigvals2;
  const eigvals3 = result?.tech_eigvals3;
  const d = result?.tech_d;
  const dtrmnt = result?.tech_dtrmnt;
  const l1 = result?.tech_l1;
  const l2 = result?.tech_l2;
  const l3 = result?.tech_l3;
  const res1 = result?.tech_res1;
  const res2 = result?.tech_res2;
  const res3 = result?.tech_res3;

  const latexSafe = (expr) => expr?.replace(/frac/g, "dfrac") || "";
  const formatValue = (val) => (val !== undefined && val !== null ? val : "0");

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
                <label htmlFor="tech_matrix" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_matrix"
                    id="tech_matrix"
                    value={formData.tech_matrix}
                    onChange={handleChange}
                  >
                    <option value="2">2 </option>
                    <option value="3">3 </option>
                  </select>
                </div>
              </div>
              <div className="col-span-12">
                <table className="w-full matrix_table">
                  <tbody>
                    <tr>
                      <td>
                        <div className="">
                          <input
                            type="number"
                            step="any"
                            name="tech_matrix_0_0"
                            id="tech_matrix_0_0"
                            className="input my-2"
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_matrix_0_0}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </td>
                      <td>
                        <div className="">
                          <input
                            type="number"
                            step="any"
                            name="tech_matrix_0_1"
                            id="tech_matrix_0_1"
                            className="input my-2"
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_matrix_0_1}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </td>
                      {formData.tech_matrix == "3" && (
                        <>
                          <td className="">
                            <div className="">
                              <input
                                type="number"
                                step="any"
                                name="tech_matrix_0_2"
                                id="tech_matrix_0_2"
                                className="input my-2"
                                aria-label="input"
                                placeholder="00"
                                value={formData.tech_matrix_0_2}
                                onChange={handleChange}
                                required
                              />
                            </div>
                          </td>
                        </>
                      )}
                    </tr>

                    <tr>
                      <td>
                        <div className="">
                          <input
                            type="number"
                            step="any"
                            name="tech_matrix_1_0"
                            id="tech_matrix_1_0"
                            className="input my-2"
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_matrix_1_0}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </td>
                      <td>
                        <div className="">
                          <input
                            type="number"
                            step="any"
                            name="tech_matrix_1_1"
                            id="tech_matrix_1_1"
                            className="input my-2"
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_matrix_1_1}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </td>
                      {formData.tech_matrix == "3" && (
                        <>
                          <td className="">
                            <div className="">
                              <input
                                type="number"
                                step="any"
                                name="tech_matrix_1_2"
                                id="tech_matrix_1_2"
                                className="input my-2"
                                aria-label="input"
                                placeholder="00"
                                value={formData.tech_matrix_1_2}
                                onChange={handleChange}
                                required
                              />
                            </div>
                          </td>
                        </>
                      )}
                    </tr>
                    {formData.tech_matrix == "3" && (
                      <>
                        <tr className="">
                          <td>
                            <div className="">
                              <input
                                type="number"
                                step="any"
                                name="tech_matrix_2_0"
                                id="tech_matrix_2_0"
                                className="input my-2"
                                aria-label="input"
                                placeholder="00"
                                value={formData.tech_matrix_2_0}
                                onChange={handleChange}
                                required
                              />
                            </div>
                          </td>
                          <td>
                            <div className="">
                              <input
                                type="number"
                                step="any"
                                name="tech_matrix_2_1"
                                id="tech_matrix_2_1"
                                className="input my-2"
                                aria-label="input"
                                placeholder="00"
                                value={formData.tech_matrix_2_1}
                                onChange={handleChange}
                                required
                              />
                            </div>
                          </td>
                          <td>
                            <div className="">
                              <input
                                type="number"
                                step="any"
                                name="tech_matrix_2_2"
                                id="tech_matrix_2_2"
                                className="input my-2"
                                aria-label="input"
                                placeholder="00"
                                value={formData.tech_matrix_2_2}
                                onChange={handleChange}
                                required
                              />
                            </div>
                          </td>
                        </tr>
                      </>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="col-span-12 ">
                <div className="col-span-12">
                  <button
                    type="button"
                    id="dtrmn_gen_btn"
                    onClick={handleGenerateRandom}
                    className="px-3 py-2 mt-1 mx-1 addmore cursor-pointer bg-[#2845F5] text-white md:text-[16px] text-[14px] rounded-lg"
                  >
                    {data?.payload?.tech_lang_keys["2"]}
                  </button>

                  <button
                    type="button"
                    id="dtrmn_clr_btn"
                    onClick={handleClearInputs}
                    className="px-3 py-2 mt-1 mx-1 addmore cursor-pointer bg-[#2845F5] text-white md:text-[16px] text-[14px] rounded-lg"
                  >
                    {data?.payload?.tech_lang_keys["3"]}
                  </button>
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
                    <div className="w-full mt-3 text-[16px] overflow-auto">
                      <p className="mt-3 text-[18px] font-bold">
                        {data?.payload?.tech_lang_keys["4"]}
                      </p>
                      {formData?.tech_matrix === "2" ? (
                        <BlockMath math={`\left(${res1}, ${res2}\right)`} />
                      ) : (
                        <BlockMath
                          math={`\left(${res1}, ${res2}, ${res3}\right)`}
                        />
                      )}

                      <p className="mt-3 text-[18px] font-bold">
                        {data?.payload?.tech_lang_keys["5"]}
                      </p>
                      <BlockMath math={`${mul}`} />

                      <p className="mt-3 text-[18px] font-bold">
                        {data?.payload?.tech_lang_keys["6"]}
                      </p>
                      {formData?.tech_matrix === "2" ? (
                        <BlockMath math={`(${l1}, ${l2})`} />
                      ) : (
                        <BlockMath math={`(${l1}, ${l2}, ${l3})`} />
                      )}

                      <p className="mt-3 font-bold">
                        {data?.payload?.tech_lang_keys["7"]}:
                      </p>
                      <p className="mt-3 font-bold">
                        {data?.payload?.tech_lang_keys["8"]} \lambda{" "}
                        {data?.payload?.tech_lang_keys["9"]}
                      </p>
                      <BlockMath math={`${d}`} />

                      <p className="mt-3 font-bold">
                        {data?.payload?.tech_lang_keys["10"]}
                      </p>
                      <BlockMath math={`${dtrmnt}`} />

                      <p className="mt-3 font-bold">
                        {data?.payload?.tech_lang_keys["11"]}
                      </p>
                      <BlockMath math={`${dtrmnt} = 0`} />

                      <p className="mt-3 font-bold">
                        {data?.payload?.tech_lang_keys["12"]} (
                        {data?.payload?.tech_lang_keys["6"]})
                      </p>

                      {formData?.tech_matrix === "2" ? (
                        <BlockMath
                          math={`(\\lambda_1, \\lambda_2) = \\left(${formatValue(
                            l1
                          )}, ${formatValue(l2)}\\right)`}
                        />
                      ) : (
                        <BlockMath
                          math={`(\\lambda_1, \\lambda_2, \\lambda_3) = \\left(${formatValue(
                            l1
                          )}, ${formatValue(l2)}, ${formatValue(l3)}\\right)`}
                        />
                      )}

                      <p className="mt-3 font-bold">
                        {data?.payload?.tech_lang_keys["13"]}{" "}
                        {data?.payload?.tech_lang_keys["4"]}
                      </p>

                      <BlockMath
                        math={`\\text{a.} \\quad \\lambda = ${latexSafe(
                          eigvals1
                        )}`}
                      />
                      <BlockMath math={`\\quad\\quad ${d} = ${res1}`} />

                      <BlockMath
                        math={`\\text{b.} \\quad \\lambda = ${latexSafe(
                          eigvals2
                        )}`}
                      />
                      <BlockMath math={`\\quad\\quad ${d} = ${res2}`} />

                      {formData?.tech_matrix === "3" && eigvals3 && (
                        <>
                          <BlockMath
                            math={`\\text{c.} \\quad \\lambda = ${latexSafe(
                              eigvals3
                            )}`}
                          />
                          <BlockMath math={`\\quad\\quad ${d} = ${res3}`} />
                        </>
                      )}

                      <p className="mt-3 font-bold">
                        {data?.payload?.tech_lang_keys["6"]}
                      </p>
                      {formData?.tech_matrix === "2" ? (
                        <BlockMath math={`(${l1}, ${l2})`} />
                      ) : (
                        <BlockMath math={`(${l1}, ${l2}, ${l3})`} />
                      )}

                      <p className="mt-3 font-bold">
                        {data?.payload?.tech_lang_keys["5"]}
                      </p>
                      <BlockMath math={`${mul}`} />

                      <p className="mt-3 font-bold">
                        {data?.payload?.tech_lang_keys["4"]}
                      </p>
                      {formData?.tech_matrix === "2" ? (
                        <BlockMath math={`\left(${res1}, ${res2}\right)`} />
                      ) : (
                        <BlockMath
                          math={`\left(${res1}, ${res2}, ${res3}\right)`}
                        />
                      )}
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

export default EigenvectorCalculator;

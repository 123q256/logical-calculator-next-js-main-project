"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useRationalizeTheDenominatorCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const RationalizeTheDenominatorCalculator = () => {
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
    tech_type: "first", //  first second
    tech_operations: "1",
    tech_a: "15",
    tech_b: "13",
    tech_n: "11",
    tech_c: "7",
    tech_d: "5",
    tech_m: "4",
    tech_x: "7",
    tech_y: "13",
    tech_k: "5",
    tech_u: "5",
    tech_n1: "x^3-2x+1",
    tech_d1: "x^2-1",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useRationalizeTheDenominatorCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_type) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_type: formData.tech_type,
        tech_operations: formData.tech_operations,
        tech_a: formData.tech_a,
        tech_b: formData.tech_b,
        tech_n: formData.tech_n,
        tech_c: formData.tech_c,
        tech_d: formData.tech_d,
        tech_m: formData.tech_m,
        tech_x: formData.tech_x,
        tech_y: formData.tech_y,
        tech_k: formData.tech_k,
        tech_u: formData.tech_u,
        tech_n1: formData.tech_n1,
        tech_d1: formData.tech_d1,
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
      tech_type: "first", //  first second
      tech_operations: "1",
      tech_a: "15",
      tech_b: "13",
      tech_n: "11",
      tech_c: "7",
      tech_d: "5",
      tech_m: "4",
      tech_x: "7",
      tech_y: "13",
      tech_k: "5",
      tech_u: "5",
      tech_n1: "x^3-2x+1",
      tech_d1: "x^2-1",
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

  const operations = result?.tech_operations;
  const a = result?.tech_a;
  const b = result?.tech_b;
  const n = result?.tech_n;
  const c = result?.tech_c;
  const d = result?.tech_d;
  const m = result?.tech_m;
  const x = result?.tech_x;
  const y = result?.tech_y;
  const k = result?.tech_k;
  const u = result?.tech_u;
  const z = result?.tech_z;

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

          <div className="lg:w-[60%] md:w-[60%] w-full mx-auto ">
            <div className="grid grid-cols-12 mt-3   gap-2 md:gap-4 lg:gap-4">
              <div className="col-span-12 flex items-center justify-evenly">
                <p className="font-s-14 text-blue">
                  <strong>{data?.payload?.tech_lang_keys[1]}:</strong>
                </p>
                <p id="fInput">
                  <label className="pe-2 cursor-pointer" htmlFor="first">
                    <input
                      type="radio"
                      name="tech_type"
                      value="first"
                      id="first"
                      className="mr-2 border cursor-pointer"
                      onChange={handleChange}
                      checked={formData.tech_type == "first"}
                    />
                    <span>{data?.payload?.tech_lang_keys["2"]}</span>
                  </label>
                </p>
                <p id="sInput">
                  <label className="pe-2 cursor-pointer" htmlFor="second">
                    <input
                      type="radio"
                      name="tech_type"
                      value="second"
                      id="second"
                      className="mr-2 border cursor-pointer"
                      onChange={handleChange}
                      checked={formData.tech_type == "second"}
                    />
                    <span>{data?.payload?.tech_lang_keys["3"]}</span>
                  </label>
                </p>
              </div>
              {formData.tech_type == "first" && (
                <>
                  <div className="col-span-12" id="simpleMethod">
                    <div className="grid grid-cols-12    gap-2 md:gap-4 lg:gap-4">
                      <div className="col-span-12 px-2">
                        <label htmlFor="tech_operations" className="label">
                          {data?.payload?.tech_lang_keys["4"]}:
                        </label>
                        <div className="mt-2">
                          <select
                            className="input"
                            aria-label="select"
                            name="tech_operations"
                            id="tech_operations"
                            value={formData.tech_operations}
                            onChange={handleChange}
                          >
                            <option value="1">
                              {data?.payload?.tech_lang_keys["5"]}/{" "}
                              {data?.payload?.tech_lang_keys["5"]}{" "}
                            </option>
                            <option value="2">
                              {data?.payload?.tech_lang_keys["6"]}/{" "}
                              {data?.payload?.tech_lang_keys["5"]}
                            </option>
                            <option value="3">
                              {data?.payload?.tech_lang_keys["5"]}/{" "}
                              {data?.payload?.tech_lang_keys["6"]}
                            </option>
                            <option value="4">
                              {data?.payload?.tech_lang_keys["6"]} /
                              {data?.payload?.tech_lang_keys["6"]}
                            </option>
                          </select>
                        </div>
                      </div>
                      <div className="col-span-12 px-2 ">
                        {/* Operation 1 */}
                        {(!formData.tech_operations ||
                          formData.tech_operations == "1") && (
                          <p className="col-span-12 text-[25px] mt-0 mt-lg-2 text-center">
                            <InlineMath
                              math={`\\frac{a\\sqrt[n]{b}}{x\\sqrt[k]{y}} = ?`}
                            />
                          </p>
                        )}

                        {/* Operation 2 */}
                        {formData.tech_operations == "2" && (
                          <p className="col-span-12 text-[25px] mt-0 mt-lg-2 text-center">
                            <InlineMath
                              math={`\\frac{a\\sqrt[n]{b} + c\\sqrt[m]{d}}{x\\sqrt[k]{y}} = ?`}
                            />
                          </p>
                        )}

                        {/* Operation 3 */}
                        {formData.tech_operations == "3" && (
                          <p className="col-span-12 text-[25px] mt-0 mt-lg-2 text-center">
                            <InlineMath
                              math={`\\frac{a\\sqrt{b}}{x\\sqrt{y} + z\\sqrt{u}} = ?`}
                            />
                          </p>
                        )}

                        {/* Operation 4 */}
                        {formData.tech_operations == "4" && (
                          <p className="col-span-12 text-[25px] mt-0 mt-lg-2 text-center">
                            <InlineMath
                              math={`\\frac{a\\sqrt{b} + c\\sqrt{d}}{x\\sqrt{y} + k\\sqrt{u}} = ?`}
                            />
                          </p>
                        )}
                      </div>

                      <p className="col-span-12">
                        <strong>{data?.payload?.tech_lang_keys[7]}</strong>
                      </p>
                      <div className="col-span-4" id="aInput">
                        <label htmlFor="tech_a" className="label">
                          a:
                        </label>
                        <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_a"
                            id="tech_a"
                            className="input my-2"
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_a}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="col-span-4" id="bInput">
                        <label htmlFor="tech_b" className="label">
                          b:
                        </label>
                        <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_b"
                            id="tech_b"
                            className="input my-2"
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_b}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      {(formData.tech_operations == "1" ||
                        formData.tech_operations == "2") && (
                        <>
                          <div className="col-span-4 " id="nInput">
                            <label htmlFor="tech_n" className="label">
                              n:
                            </label>
                            <div className=" relative">
                              <input
                                type="number"
                                step="any"
                                name="tech_n"
                                id="tech_n"
                                className="input my-2"
                                aria-label="input"
                                placeholder="00"
                                value={formData.tech_n}
                                onChange={handleChange}
                              />
                            </div>
                          </div>
                        </>
                      )}
                      {(formData.tech_operations == "2" ||
                        formData.tech_operations == "4") && (
                        <>
                          <div className="col-span-4 " id="cInput">
                            <label htmlFor="tech_c" className="label">
                              c:
                            </label>
                            <div className=" relative">
                              <input
                                type="number"
                                step="any"
                                name="tech_c"
                                id="tech_c"
                                className="input my-2"
                                aria-label="input"
                                placeholder="00"
                                value={formData.tech_c}
                                onChange={handleChange}
                              />
                            </div>
                          </div>
                        </>
                      )}
                      {(formData.tech_operations == "2" ||
                        formData.tech_operations == "4") && (
                        <>
                          <div className="col-span-4 " id="dInput">
                            <label htmlFor="tech_d" className="label">
                              d:
                            </label>
                            <div className=" relative">
                              <input
                                type="number"
                                step="any"
                                name="tech_d"
                                id="tech_d"
                                className="input my-2"
                                aria-label="input"
                                placeholder="00"
                                value={formData.tech_d}
                                onChange={handleChange}
                              />
                            </div>
                          </div>
                        </>
                      )}
                      {formData.tech_operations == "2" && (
                        <>
                          <div className="col-span-4 " id="mInput">
                            <label htmlFor="tech_m" className="label">
                              m:
                            </label>
                            <div className=" relative">
                              <input
                                type="number"
                                step="any"
                                name="tech_m"
                                id="tech_m"
                                className="input my-2"
                                aria-label="input"
                                placeholder="00"
                                value={formData.tech_m}
                                onChange={handleChange}
                              />
                            </div>
                          </div>
                        </>
                      )}
                      <p className="col-span-12">
                        <strong>{data?.payload?.tech_lang_keys[8]}</strong>
                      </p>
                      <div className="col-span-4" id="xInput">
                        <label htmlFor="tech_x" className="label">
                          x:
                        </label>
                        <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_x"
                            id="tech_x"
                            className="input my-2"
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_x}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="col-span-4" id="yInput">
                        <label htmlFor="tech_y" className="label">
                          y:
                        </label>
                        <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_y"
                            id="tech_y"
                            className="input my-2"
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_y}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="col-span-4" id="kInput">
                        <label htmlFor="tech_k" className="label">
                          k:
                        </label>
                        <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_k"
                            id="tech_k"
                            className="input my-2"
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_k}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      {(formData.tech_operations == "3" ||
                        formData.tech_operations == "4") && (
                        <>
                          <div className="col-span-4" id="uInput">
                            <label htmlFor="tech_u" className="label">
                              u:
                            </label>
                            <div className=" relative">
                              <input
                                type="number"
                                step="any"
                                name="tech_u"
                                id="tech_u"
                                className="input my-2"
                                aria-label="input"
                                placeholder="00"
                                value={formData.tech_u}
                                onChange={handleChange}
                              />
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </>
              )}
              {formData.tech_type == "second" && (
                <>
                  <div className="col-span-12 mt-0 mt-lg-2 " id="advanceMethod">
                    <label htmlFor="tech_n1" className="label">
                      {data?.payload?.tech_lang_keys["9"]}:
                    </label>
                    <div className=" relative">
                      <input
                        type="text"
                        step="any"
                        name="tech_n1"
                        id="tech_n1"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_n1}
                        onChange={handleChange}
                      />
                    </div>
                    <hr className="my-2" />
                    <label htmlFor="tech_d1" className="label">
                      {data?.payload?.tech_lang_keys["10"]}:
                    </label>
                    <div className=" relative">
                      <input
                        type="text"
                        step="any"
                        name="tech_d1"
                        id="tech_d1"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_d1}
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
                {data?.payload?.tech_lang_keys["locale"] == "en"
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
                      <div className="w-full text-[16px]">
                        {formData?.tech_type == "first" ? (
                          <>
                            <p className="mt-3 text-[18px] font-bold">
                              <span className="main_jawab"></span>
                            </p>
                            <p className="mt-3">
                              <strong>
                                {data?.payload?.tech_lang_keys[12]}:
                              </strong>
                            </p>
                            <div className="w-full all_result">
                              <p className="mt-3">
                                {/* you can place extra output here */}
                              </p>
                            </div>
                            <p className="mt-3">
                              = &nbsp;&nbsp;&nbsp;&nbsp;
                              <span className="main_jawab"></span>
                            </p>
                          </>
                        ) : (
                          <>
                            <p className="mt-3 text-[18px] md:text-[22px] font-bold">
                              <InlineMath math={result?.tech_main_ans || ""} />
                            </p>
                            <p className="mt-3 text-[18px] md:text-[22px]">
                              <strong>
                                {data?.payload?.tech_lang_keys[12]}:
                              </strong>
                            </p>
                            <p className="mt-3 text-[18px] md:text-[22px]">
                              <InlineMath
                                math={`= ${result?.tech_enter || ""}`}
                              />
                            </p>
                            <p className="mt-3 text-[18px] md:text-[22px]">
                              <InlineMath
                                math={`= \\dfrac{${result?.tech_up || ""}}{${
                                  result?.tech_down || ""
                                }}`}
                              />
                            </p>
                            <p className="mt-3 text-[18px] md:text-[22px]">
                              <InlineMath
                                math={`= ${result?.tech_main_ans || ""}`}
                              />
                            </p>
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

export default RationalizeTheDenominatorCalculator;

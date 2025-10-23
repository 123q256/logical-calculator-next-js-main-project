"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import "katex/dist/katex.min.css";
import { BlockMath } from "react-katex";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useUnitVectorCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const UnitVectorCalculator = () => {
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
    tech_method: "find", //  find normalize
    tech_dimen: "3d",
    tech_find: "x",
    tech_find1: "x",
    tech_fx: "0.3",
    tech_fy: "0.2",
    tech_fz: "0.4",
    tech_x: "2",
    tech_y: "3",
    tech_z: "5",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useUnitVectorCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_method || !formData.tech_dimen) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_method: formData.tech_method,
        tech_dimen: formData.tech_dimen,
        tech_find: formData.tech_find,
        tech_find1: formData.tech_find1,
        tech_fx: formData.tech_fx,
        tech_fy: formData.tech_fy,
        tech_fz: formData.tech_fz,
        tech_x: formData.tech_x,
        tech_y: formData.tech_y,
        tech_z: formData.tech_z,
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
      tech_method: "find", //  find normalize
      tech_dimen: "3d",
      tech_find: "x",
      tech_find1: "x",
      tech_fx: "0.3",
      tech_fy: "0.2",
      tech_fz: "0.4",
      tech_x: "2",
      tech_y: "3",
      tech_z: "5",
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

  // result?
  const {
    tech_vx: vx,
    tech_vy: vy,
    tech_vz: vz,
    tech_fx: fx,
    tech_fy: fy,
    tech_fz: fz,
    tech_deg: deg,
    tech_magnitude: magnitude,
    tech_x: x,
    tech_y: y,
    tech_z: z,
  } = result || {};

  const dimen = formData?.tech_dimen;
  const method = formData?.tech_method;
  const lang = data?.payload?.tech_lang_keys;

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

          <div className="lg:w-[60%] md:w-[80%] w-full mx-auto ">
            <div className="grid grid-cols-1  lg:grid-cols-2 md:grid-cols-2 mt-3  gap-4">
              <div className="lg:col-span-6 md:col-span-6 col-span-12 left">
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
                    <option value="normalize">
                      {data?.payload?.tech_lang_keys["2"]}
                    </option>
                    <option value="find">
                      {data?.payload?.tech_lang_keys["3"]}
                    </option>
                  </select>
                </div>
              </div>
              <div className="lg:col-span-6 md:col-span-6 col-span-12 left">
                <label htmlFor="tech_dimen" className="label">
                  {data?.payload?.tech_lang_keys["4"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_dimen"
                    id="tech_dimen"
                    value={formData.tech_dimen}
                    onChange={handleChange}
                  >
                    <option value="3d">3D</option>
                    <option value="2d">2D</option>
                  </select>
                </div>
              </div>
              <div className="col-span-12 flex justify-center">
                <div className="" id="uv_3d">
                  {formData.tech_dimen == "3d" && (
                    <>
                      <img
                        src="/images/uv_3d.png"
                        className="uv_img"
                        width="130px"
                        alt="Unit Vector - 3d"
                      />
                    </>
                  )}
                  {formData.tech_dimen == "2d" && (
                    <>
                      <img
                        src="/images/uv_2d.png"
                        className="uv_img"
                        width="130px"
                        alt="Unit Vector - 2d"
                      />
                    </>
                  )}
                </div>
              </div>

              {formData.tech_method == "find" &&
                formData.tech_dimen == "2d" && (
                  <>
                    <div className="col-span-6 left " id="find2">
                      <label htmlFor="tech_find" className="label">
                        {data?.payload?.tech_lang_keys["5"]}:
                      </label>
                      <div className="mt-2">
                        <select
                          className="input"
                          aria-label="select"
                          name="tech_find"
                          id="tech_find"
                          value={formData.tech_find}
                          onChange={handleChange}
                        >
                          <option value="x">x</option>
                          <option value="y">y</option>
                        </select>
                      </div>
                    </div>
                  </>
                )}

              {formData.tech_method == "find" &&
                formData.tech_dimen == "3d" && (
                  <>
                    <div className="col-span-6 left " id="find3">
                      <label htmlFor="tech_find1" className="label">
                        {data?.payload?.tech_lang_keys["5"]}:
                      </label>
                      <div className="mt-2">
                        <select
                          className="input"
                          aria-label="select"
                          name="tech_find1"
                          id="tech_find1"
                          value={formData.tech_find1}
                          onChange={handleChange}
                        >
                          <option value="x">x</option>
                          <option value="y">y</option>
                          <option value="z">z</option>
                        </select>
                      </div>
                    </div>
                  </>
                )}
              {((formData.tech_method == "find" &&
                formData.tech_dimen == "2d" &&
                formData.tech_find == "y") ||
                (formData.tech_method == "find" &&
                  formData.tech_dimen == "3d" &&
                  formData.tech_find1 == "y") ||
                (formData.tech_method == "find" &&
                  formData.tech_dimen == "3d" &&
                  formData.tech_find1 == "z")) && (
                <>
                  <div className="col-span-6" id="fx">
                    <label htmlFor="tech_fx" className="label">
                      x
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_fx"
                        id="tech_fx"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_fx}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </>
              )}
              {((formData.tech_method == "find" &&
                formData.tech_dimen == "2d" &&
                formData.tech_find == "x") ||
                (formData.tech_method == "find" &&
                  formData.tech_dimen == "3d" &&
                  formData.tech_find1 == "x")) && (
                <>
                  <div className="col-span-6" id="fy">
                    <label htmlFor="tech_fy" className="label">
                      y
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_fy"
                        id="tech_fy"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_fy}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </>
              )}

              {formData.tech_method == "find" &&
                formData.tech_dimen == "3d" && (
                  <>
                    <div
                      className="lg:col-span-6 md:col-span-6 col-span-12 "
                      id="fz"
                    >
                      <label htmlFor="tech_fz" className="label">
                        y
                      </label>
                      <div className=" relative">
                        <input
                          type="number"
                          step="any"
                          name="tech_fz"
                          id="tech_fz"
                          className="input my-2"
                          aria-label="input"
                          placeholder="00"
                          value={formData.tech_fz}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </>
                )}

              {((formData.tech_method == "normalize" &&
                formData.tech_dimen == "2d") ||
                (formData.tech_method == "normalize" &&
                  formData.tech_dimen == "3d")) && (
                <>
                  <div
                    className="lg:col-span-6 md:col-span-6 col-span-12"
                    id="x"
                  >
                    <label htmlFor="tech_x" className="label">
                      y
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
                </>
              )}
              {((formData.tech_method == "normalize" &&
                formData.tech_dimen == "2d") ||
                (formData.tech_method == "normalize" &&
                  formData.tech_dimen == "3d")) && (
                <>
                  <div
                    className="lg:col-span-6 md:col-span-6 col-span-12 "
                    id="y"
                  >
                    <label htmlFor="tech_y" className="label">
                      y
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
                </>
              )}
              {formData.tech_method == "normalize" &&
                formData.tech_dimen == "3d" && (
                  <>
                    <div
                      className="lg:col-span-6 md:col-span-6 col-span-12"
                      id="z"
                    >
                      <label htmlFor="tech_z" className="label">
                        z
                      </label>
                      <div className=" relative">
                        <input
                          type="number"
                          step="any"
                          name="tech_z"
                          id="tech_z"
                          className="input my-2"
                          aria-label="input"
                          placeholder="00"
                          value={formData.tech_z}
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
              <div className="w-full  mx-auto p-2 lg:p-8 md:p-8 result_calculator rounded-lg space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg flex items-center justify-center">
                    <div className="w-full mt-3 overflow-auto">
                      <div className="w-full text-[20px] p-2 md:p-4">
                        <p className="mt-2 font-bold">{lang?.[6]}</p>

                        {method === "normalize" && (
                          <>
                            <BlockMath
                              math={`(x, y${
                                dimen === "3d" ? ", z" : ""
                              }) = (${vx?.toFixed(5)}, ${vy?.toFixed(5)}${
                                dimen === "3d" ? ", " + vz?.toFixed(5) : ""
                              })`}
                            />

                            <p className="mt-2 font-bold">{lang?.[7]}</p>

                            {dimen === "2d" && (
                              <>
                                <p className="mt-2 font-bold">{lang?.[8]}</p>
                                <BlockMath math={`(x, y) = (${x}, ${y})`} />
                              </>
                            )}

                            {dimen === "3d" && (
                              <>
                                <p className="mt-2 font-bold">{lang?.[8]}</p>
                                <BlockMath
                                  math={`(x, y, z) = (${x}, ${y}, ${z})`}
                                />
                              </>
                            )}

                            <p className="mt-2 font-bold">{lang?.[9]}</p>
                            <BlockMath math={`|\\vec v| = ${magnitude}`} />

                            <p className="mt-2">
                              {lang?.[10]}{" "}
                              <a
                                href="https://technical-calculator.com/vector-magnitude-calculator/"
                                className="text-blue-600 underline"
                                target="_blank"
                                rel="noreferrer"
                              >
                                Vector Magnitude Calculator
                              </a>{" "}
                              {lang?.[11]}
                            </p>

                            {dimen === "2d" && (
                              <>
                                <p className="mt-2 font-bold">
                                  {lang?.[12]} θ:
                                </p>
                                <BlockMath math={`θ = ${deg}`} />
                              </>
                            )}

                            <p className="mt-2">{lang?.[13]}</p>
                            <p className="mt-2">{lang?.[14]}:</p>
                            <BlockMath
                              math={`\\vec e = \\left (\\dfrac{${x}}{${magnitude}}, \\dfrac{${y}}{${magnitude}}${
                                dimen === "3d"
                                  ? `, \\dfrac{${z}}{${magnitude}}`
                                  : ""
                              } \\right )`}
                            />
                            <BlockMath
                              math={`\\vec e \\approx (${vx}, ${vy}${
                                dimen === "3d" ? `, ${vz}` : ""
                              })`}
                            />
                          </>
                        )}

                        {method === "find" && (
                          <>
                            {dimen === "2d" && (
                              <BlockMath
                                math={`(x, y) = (${
                                  fx !== undefined
                                    ? `\\color{#ff6d00}{${Number(fx).toFixed(
                                        3
                                      )}}`
                                    : fx
                                }, ${
                                  fy !== undefined
                                    ? `\\color{#ff6d00}{${Number(fy).toFixed(
                                        3
                                      )}}`
                                    : fy
                                })`}
                              />
                            )}
                            {dimen === "3d" && (
                              <BlockMath
                                math={`(x, y, z) = (${
                                  fx !== undefined
                                    ? `\\color{#ff6d00}{${Number(fx).toFixed(
                                        3
                                      )}}`
                                    : fx
                                }, ${
                                  fy !== undefined
                                    ? `\\color{#ff6d00}{${Number(fy).toFixed(
                                        3
                                      )}}`
                                    : fy
                                }, ${
                                  fz !== undefined
                                    ? `\\color{#ff6d00}{${Number(fz).toFixed(
                                        3
                                      )}}`
                                    : fz
                                })`}
                              />
                            )}

                            <p className="mt-2 font-bold">{lang?.[15]}</p>
                            <BlockMath math={`1`} />

                            {dimen === "2d" && (
                              <>
                                <p className="mt-2 font-bold">{lang?.[12]} θ</p>
                                <BlockMath
                                  math={`θ = ${Number(deg).toFixed(3)}`}
                                />
                              </>
                            )}
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

export default UnitVectorCalculator;

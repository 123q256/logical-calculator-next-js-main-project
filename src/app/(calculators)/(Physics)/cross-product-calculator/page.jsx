"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

import {
  useGetSingleCalculatorDetailsMutation,
  useCrossProductCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const CrossProductCalculator = () => {
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
    tech_a_rep: "point", // point  coor
    tech_ax: "50",
    tech_ay: "50",
    tech_az: "50",
    tech_a1: "2",
    tech_a2: "3",
    tech_a3: "4",
    tech_b1: "2",
    tech_b2: "3",
    tech_b3: "4",
    tech_b_rep: "point", // point  coor
    tech_bx: "7",
    tech_by: "8",
    tech_bz: "9",
    tech_aa1: "2",
    tech_aa2: "3",
    tech_aa3: "4",
    tech_bb1: "2",
    tech_bb2: "3",
    tech_bb3: "4",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useCrossProductCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_a_rep || !formData.tech_b_rep) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_a_rep: formData.tech_a_rep,
        tech_ax: formData.tech_ax,
        tech_ay: formData.tech_ay,
        tech_az: formData.tech_az,
        tech_a1: formData.tech_a1,
        tech_a2: formData.tech_a2,
        tech_a3: formData.tech_a3,
        tech_b1: formData.tech_b1,
        tech_b2: formData.tech_b2,
        tech_b3: formData.tech_b3,
        tech_b_rep: formData.tech_b_rep,
        tech_bx: formData.tech_bx,
        tech_by: formData.tech_by,
        tech_bz: formData.tech_bz,
        tech_aa1: formData.tech_aa1,
        tech_aa2: formData.tech_aa2,
        tech_aa3: formData.tech_aa3,
        tech_bb1: formData.tech_bb1,
        tech_bb2: formData.tech_bb2,
        tech_bb3: formData.tech_bb3,
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
      tech_a_rep: "point", // point  coor
      tech_ax: "50",
      tech_ay: "50",
      tech_az: "50",
      tech_a1: "2",
      tech_a2: "3",
      tech_a3: "4",
      tech_b1: "2",
      tech_b2: "3",
      tech_b3: "4",
      tech_b_rep: "point", // point  coor
      tech_bx: "7",
      tech_by: "8",
      tech_bz: "9",
      tech_aa1: "2",
      tech_aa2: "3",
      tech_aa3: "4",
      tech_bb1: "2",
      tech_bb2: "3",
      tech_bb3: "4",
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

  // Vector a components calculation
  const ax =
    formData.tech_a_rep === "coor"
      ? Number(formData.tech_ax)
      : Number(formData.tech_b1) - Number(formData.tech_a1);

  const ay =
    formData.tech_a_rep === "coor"
      ? Number(formData.tech_ay)
      : Number(formData.tech_b2) - Number(formData.tech_a2);

  const az =
    formData.tech_a_rep === "coor"
      ? Number(formData.tech_az)
      : Number(formData.tech_b3) - Number(formData.tech_a3);

  // Vector b components calculation
  const bx =
    formData.tech_b_rep === "coor"
      ? Number(formData.tech_bx)
      : Number(formData.tech_bb1) - Number(formData.tech_aa1);

  const by =
    formData.tech_b_rep === "coor"
      ? Number(formData.tech_by)
      : Number(formData.tech_bb2) - Number(formData.tech_aa2);

  const bz =
    formData.tech_b_rep === "coor"
      ? Number(formData.tech_bz)
      : Number(formData.tech_bb3) - Number(formData.tech_aa3);

  // Helper to format vector terms with + or - signs
  const formatTerm = (val) => (val < 0 ? `${val}` : `+${val}`);

  const ans_a1 = ay * bz - by * az;
  const ans_a2 = (ax * bz - bx * az) * -1;
  const ans_a3 = ax * by - bx * ay;
  const magnitude = Math.sqrt(ans_a1 ** 2 + ans_a2 ** 2 + ans_a3 ** 2).toFixed(
    4
  );

  const polar =
    magnitude == 0
      ? 0
      : ((Math.acos(ans_a3 / magnitude) * 180) / Math.PI).toFixed(4);
  const phi =
    ans_a1 == 0 ? 0 : ((Math.atan(ans_a2 / ans_a1) * 180) / Math.PI).toFixed(4);

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
            <div className="grid grid-cols-12 mt-3  gap-2">
              <div className="col-span-12">
                <label htmlFor="tech_a_rep" className="label">
                  {data?.payload?.tech_lang_keys["vec"]} (A){" "}
                  {data?.payload?.tech_lang_keys["rep"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_a_rep"
                    id="tech_a_rep"
                    value={formData.tech_a_rep}
                    onChange={handleChange}
                  >
                    <option value="coor">
                      {data?.payload?.tech_lang_keys["coor"]}
                    </option>
                    <option value="point">
                      {data?.payload?.tech_lang_keys["point"]}
                    </option>
                  </select>
                </div>
              </div>
              <div className="col-span-12">
                <p>
                  <strong>{data?.payload?.tech_lang_keys["a"]}</strong>
                </p>
              </div>
              {formData.tech_a_rep == "coor" && (
                <>
                  <div className="col-span-12 a_coor">
                    <div className="grid grid-cols-12   gap-2">
                      <div className="col-span-4">
                        <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_ax"
                            id="tech_ax"
                            className="input "
                            aria-label="input"
                            placeholder="x"
                            value={formData.tech_ax}
                            onChange={handleChange}
                          />
                          <span className="input_unit">
                            <InlineMath math="\vec{i}" />
                          </span>
                        </div>
                      </div>
                      <div className="col-span-4">
                        <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_ay"
                            id="tech_ay"
                            className="input "
                            aria-label="input"
                            placeholder="y"
                            value={formData.tech_ay}
                            onChange={handleChange}
                          />
                          <span className="input_unit">
                            <InlineMath math="\vec{j}" />
                          </span>
                        </div>
                      </div>
                      <div className="col-span-4">
                        <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_az"
                            id="tech_az"
                            className="input "
                            aria-label="input"
                            placeholder="z"
                            value={formData.tech_az}
                            onChange={handleChange}
                          />
                          <span className="input_unit">
                            <InlineMath math="\vec{k}" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
              {formData.tech_a_rep == "point" && (
                <>
                  <div className="col-span-12  a_points">
                    <div className="grid grid-cols-12   gap-2">
                      <div className="col-span-12">
                        <p>
                          <strong>
                            {data?.payload?.tech_lang_keys["ini"]} (A)
                          </strong>
                        </p>
                      </div>
                      <div className="col-span-4 ">
                        <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_a1"
                            id="tech_a1"
                            className="input "
                            aria-label="input"
                            placeholder="Ax"
                            value={formData.tech_a1}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="col-span-4 ">
                        <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_a2"
                            id="tech_a2"
                            className="input "
                            aria-label="input"
                            placeholder="Ay"
                            value={formData.tech_a2}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="col-span-4 ">
                        <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_a3"
                            id="tech_a3"
                            className="input "
                            aria-label="input"
                            placeholder="Az"
                            value={formData.tech_a3}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="col-span-12">
                        <p>
                          <strong>
                            {data?.payload?.tech_lang_keys["ter"]} (B)
                          </strong>
                        </p>
                      </div>
                      <div className="col-span-4 ">
                        <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_b1"
                            id="tech_b1"
                            className="input "
                            aria-label="input"
                            placeholder="Ax"
                            value={formData.tech_b1}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="col-span-4 ">
                        <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_b2"
                            id="tech_b2"
                            className="input "
                            aria-label="input"
                            placeholder="Ay"
                            value={formData.tech_b2}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="col-span-4 ">
                        <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_b3"
                            id="tech_b3"
                            className="input "
                            aria-label="input"
                            placeholder="Az"
                            value={formData.tech_b3}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              <div className="col-span-12">
                <label htmlFor="tech_b_rep" className="label">
                  {data?.payload?.tech_lang_keys["vec"]} (B){" "}
                  {data?.payload?.tech_lang_keys["rep"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_b_rep"
                    id="tech_b_rep"
                    value={formData.tech_b_rep}
                    onChange={handleChange}
                  >
                    <option value="coor">
                      {data?.payload?.tech_lang_keys["coor"]}
                    </option>
                    <option value="point">
                      {data?.payload?.tech_lang_keys["point"]}
                    </option>
                  </select>
                </div>
              </div>
              <div className="col-span-12">
                <p>
                  <strong>{data?.payload?.tech_lang_keys["b"]}</strong>
                </p>
              </div>
              {formData.tech_b_rep == "coor" && (
                <>
                  <div className="col-span-12 b_coor">
                    <div className="grid grid-cols-12   gap-2">
                      <div className="col-span-4 ">
                        <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_bx"
                            id="tech_bx"
                            className="input "
                            aria-label="input"
                            placeholder="x"
                            value={formData.tech_bx}
                            onChange={handleChange}
                          />
                          <span className="input_unit">
                            <InlineMath math="\vec{i}" />
                          </span>
                        </div>
                      </div>
                      <div className="col-span-4 ">
                        <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_by"
                            id="tech_by"
                            className="input "
                            aria-label="input"
                            placeholder="y"
                            value={formData.tech_by}
                            onChange={handleChange}
                          />
                          <span className="input_unit">
                            <InlineMath math="\vec{j}" />
                          </span>
                        </div>
                      </div>
                      <div className="col-span-4 ">
                        <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_bz"
                            id="tech_bz"
                            className="input "
                            aria-label="input"
                            placeholder="z"
                            value={formData.tech_bz}
                            onChange={handleChange}
                          />
                          <span className="input_unit">
                            <InlineMath math="\vec{k}" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
              {formData.tech_b_rep == "point" && (
                <>
                  <div className="col-span-12   b_points">
                    <div className="grid grid-cols-12   gap-2">
                      <div className="col-span-12">
                        <p>
                          <strong>
                            {data?.payload?.tech_lang_keys["ini"]} (A)
                          </strong>
                        </p>
                      </div>
                      <div className="col-span-4 ">
                        <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_aa1"
                            id="tech_aa1"
                            className="input "
                            aria-label="input"
                            placeholder="Ax"
                            value={formData.tech_aa1}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="col-span-4 ">
                        <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_aa2"
                            id="tech_aa2"
                            className="input "
                            aria-label="input"
                            placeholder="Ay"
                            value={formData.tech_aa2}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="col-span-4 ">
                        <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_aa3"
                            id="tech_aa3"
                            className="input "
                            aria-label="input"
                            placeholder="Az"
                            value={formData.tech_aa3}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="col-span-12">
                        <p>
                          <strong>
                            {data?.payload?.tech_lang_keys["ter"]} (B)
                          </strong>
                        </p>
                      </div>
                      <div className="col-span-4 ">
                        <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_bb1"
                            id="tech_bb1"
                            className="input "
                            aria-label="input"
                            placeholder="Bx"
                            value={formData.tech_bb1}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="col-span-4 ">
                        <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_bb2"
                            id="tech_bb2"
                            className="input "
                            aria-label="input"
                            placeholder="By"
                            value={formData.tech_bb2}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="col-span-4 ">
                        <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_bb3"
                            id="tech_bb3"
                            className="input "
                            aria-label="input"
                            placeholder="Bz"
                            value={formData.tech_bb3}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
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

                  <div className="rounded-lg  flex items-center justify-center overflow-auto">
                    <div className="w-full mt-3">
                      <div className="col-12 bg-gray-100 p-3">
                        <div className="overflow-auto p-4  ">
                          {/* Display input */}
                          <p className=" font-bold">
                            {data?.payload?.tech_lang_keys["input"]}
                          </p>

                          {/* Vector a */}
                          {formData.tech_a_rep == "coor" ? (
                            <BlockMath
                              math={`\\vec{a} = ${ax} \\vec{i} ${formatTerm(
                                ay
                              )} \\vec{j} ${formatTerm(az)} \\vec{k}`}
                            />
                          ) : (
                            <>
                              <BlockMath math="\\vec{a} = \\vec{AB} = (B_x - A_x, B_y - A_y, B_z - A_z)" />
                              <BlockMath
                                math={`\\vec{a} = \\vec{AB} = (${formData.tech_b1} - ${formData.tech_a1}, ${formData.tech_b2} - ${formData.tech_a2}, ${formData.tech_b3} - ${formData.tech_a3})`}
                              />
                              <BlockMath
                                math={`\\vec{a} = \\vec{AB} = (${ax}, ${ay}, ${az})`}
                              />
                              <BlockMath
                                math={`\\vec{a} = ${ax} \\vec{i} ${formatTerm(
                                  ay
                                )} \\vec{j} ${formatTerm(az)} \\vec{k}`}
                              />
                            </>
                          )}
                          {/* Vector b */}
                          {formData.tech_b_rep == "coor" ? (
                            <BlockMath
                              math={`\\vec{b} = ${bx} \\vec{i} ${formatTerm(
                                by
                              )} \\vec{j} ${formatTerm(bz)} \\vec{k}`}
                            />
                          ) : (
                            <>
                              <BlockMath math="\\vec{b} = \\vec{AB} = (B_x - A_x, B_y - A_y, B_z - A_z)" />
                              <BlockMath
                                math={`\\vec{b} = \\vec{AB} = (${formData.tech_bb1} - ${formData.tech_aa1}, ${formData.tech_bb2} - ${formData.tech_aa2}, ${formData.tech_bb3} - ${formData.tech_aa3})`}
                              />
                              <BlockMath
                                math={`\\vec{b} = \\vec{AB} = (${bx}, ${by}, ${bz})`}
                              />
                              <BlockMath
                                math={`\\vec{b} = ${bx} \\vec{i} ${formatTerm(
                                  by
                                )} \\vec{j} ${formatTerm(bz)} \\vec{k}`}
                              />
                            </>
                          )}
                        </div>
                        <div className="mt-4 space-y-4">
                          <p className="font-bold">
                            {data?.payload?.tech_lang_keys["sol"]}
                          </p>

                          <BlockMath
                            math={`\\vec a \\times \\vec b = \\begin{vmatrix} i & j & k \\\\ a_1 & a_2 & a_3 \\\\ b_1 & b_2 & b_3 \\end{vmatrix}`}
                          />
                          <BlockMath
                            math={`\\vec a \\times \\vec b = \\begin{vmatrix} i & j & k \\\\ ${ax} & ${ay} & ${az} \\\\ ${bx} & ${by} & ${bz} \\end{vmatrix}`}
                          />

                          <BlockMath
                            math={`= \\begin{vmatrix} ${ay} & ${az} \\\\ ${by} & ${bz} \\end{vmatrix} \\vec i - \\begin{vmatrix} ${ax} & ${az} \\\\ ${bx} & ${bz} \\end{vmatrix} \\vec j + \\begin{vmatrix} ${ax} & ${ay} \\\\ ${bx} & ${by} \\end{vmatrix} \\vec k`}
                          />

                          <BlockMath
                            math={`= ((${ay} \\times ${bz}) - (${by} \\times ${az}))\\vec i - ((${ax} \\times ${bz}) - (${bx} \\times ${az}))\\vec j + ((${ax} \\times ${by}) - (${bx} \\times ${ay}))\\vec k`}
                          />

                          <BlockMath
                            math={`= ${ans_a1}\\vec i ${
                              ans_a2 < 0 ? ans_a2 : "+" + ans_a2
                            }\\vec j ${
                              ans_a3 < 0 ? ans_a3 : "+" + ans_a3
                            }\\vec k`}
                          />

                          <BlockMath
                            math={`\\vec a \\times \\vec b = (${ans_a1}, ${ans_a2}, ${ans_a3})`}
                          />

                          <BlockMath
                            math={`\\text{${data?.payload?.tech_lang_keys["ans"]}}: (${ax}, ${ay}, ${az}) \\times (${bx}, ${by}, ${bz}) = (${ans_a1}, ${ans_a2}, ${ans_a3})`}
                          />

                          <BlockMath
                            math={`\\text{${data?.payload?.tech_lang_keys["vecm"]}} = ${magnitude}`}
                          />

                          <BlockMath
                            math={`\\text{${data?.payload?.tech_lang_keys["nor"]}}:`}
                          />
                          <BlockMath
                            math={`\\left(\\frac{${ans_a1}}{${magnitude}}, \\frac{${ans_a2}}{${magnitude}}, \\frac{${ans_a3}}{${magnitude}}\\right)`}
                          />

                          <BlockMath
                            math={`\\text{${data?.payload?.tech_lang_keys["scoor"]}}:`}
                          />
                          <BlockMath
                            math={`\\text{${data?.payload?.tech_lang_keys["rad"]}}\\ r = ${magnitude}`}
                          />

                          <BlockMath
                            math={`\\text{${data?.payload?.tech_lang_keys["pol"]}}\\ \\theta = ${polar}^\\circ`}
                          />
                          <BlockMath
                            math={`\\text{${data?.payload?.tech_lang_keys["angle"]}}\\ \\phi = ${phi}^\\circ`}
                          />
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

export default CrossProductCalculator;

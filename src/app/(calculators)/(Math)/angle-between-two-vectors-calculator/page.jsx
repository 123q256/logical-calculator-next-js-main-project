"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useAngleBetweenTwoVectorsCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const AngleBetweenTwoVectorsCalculator = () => {
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
    tech_dimen: "3d", // 3d 2d
    tech_a_rep: "coor", // point  coor
    tech_ax: "3",
    tech_ay: "4",
    tech_az: "5",
    tech_a1: "3",
    tech_a2: "4",
    tech_a3: "5",
    tech_b1: "5",
    tech_b2: "6",
    tech_b3: "11",
    tech_b_rep: "coor", // point  coor
    tech_bx: "3",
    tech_by: "4",
    tech_bz: "5",
    tech_aa1: "3",
    tech_aa2: "4",
    tech_aa3: "5",
    tech_bb1: "4",
    tech_bb2: "9",
    tech_bb3: "12",
    tech_submit: "calculate",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useAngleBetweenTwoVectorsCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_dimen) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_dimen: formData.tech_dimen,
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
        tech_submit: formData.tech_submit,
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
      tech_dimen: "3d", // 3d 2d
      tech_a_rep: "coor", // point  coor
      tech_ax: "3",
      tech_ay: "4",
      tech_az: "5",
      tech_a1: "3",
      tech_a2: "4",
      tech_a3: "5",
      tech_b1: "5",
      tech_b2: "6",
      tech_b3: "11",
      tech_b_rep: "coor", // point  coor
      tech_bx: "3",
      tech_by: "4",
      tech_bz: "5",
      tech_aa1: "3",
      tech_aa2: "4",
      tech_aa3: "5",
      tech_bb1: "4",
      tech_bb2: "9",
      tech_bb3: "12",
      tech_submit: "calculate",
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
            <div className="grid grid-cols-12 mt-3 gap-2 md:gap-4 lg:gap-4">
              <div className="col-span-12">
                <p className="d-inline pe-lg-3 ps-3 text-blue">
                  {data?.payload?.tech_lang_keys["1"]}
                </p>
                <label className="pe-2 cursor-pointer" htmlFor="3d">
                  <input
                    type="radio"
                    name="tech_dimen"
                    value="3d"
                    id="3d"
                    className="mr-2 border cursor-pointer"
                    onChange={handleChange}
                    checked={formData.tech_dimen === "3d"}
                  />
                  <span>3D {data?.payload?.tech_lang_keys["2"]}</span>
                </label>
                <label className="pe-2 cursor-pointer" htmlFor="2d">
                  <input
                    type="radio"
                    name="tech_dimen"
                    value="2d"
                    id="2d"
                    className="mr-2 border cursor-pointer"
                    onChange={handleChange}
                    checked={formData.tech_dimen === "2d"}
                  />
                  <span>2D {data?.payload?.tech_lang_keys["2"]}</span>
                </label>
              </div>
              <div className="col-span-12">
                <label htmlFor="tech_a_rep" className="label">
                  {data?.payload?.tech_lang_keys["2"]}(A){" "}
                  {data?.payload?.tech_lang_keys["3"]}:
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
                      {data?.payload?.tech_lang_keys["17"]}{" "}
                    </option>
                    <option value="point">
                      {data?.payload?.tech_lang_keys["18"]}{" "}
                    </option>
                  </select>
                </div>
              </div>
              {formData.tech_a_rep == "coor" && (
                <>
                  <div className="col-span-12 a_coor">
                    <div className="grid grid-cols-12   gap-2 md:gap-4 lg:gap-4">
                      <p className="col-span-12">
                        {data?.payload?.tech_lang_keys["4"]} (a)
                      </p>
                      <div className="col-span-4">
                        <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_ax"
                            id="tech_ax"
                            className="input my-2"
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_ax}
                            onChange={handleChange}
                          />
                          <span className="input_unit">
                            <InlineMath math="\vec{x}" />
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
                            className="input my-2"
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_ay}
                            onChange={handleChange}
                          />
                          <span className="input_unit">
                            <InlineMath math="\vec{y}" />
                          </span>
                        </div>
                      </div>
                      {formData.tech_dimen === "3d" && (
                        <>
                          <div className="col-span-4" id="y">
                            <div className=" relative">
                              <input
                                type="number"
                                step="any"
                                name="tech_az"
                                id="tech_az"
                                className="input my-2"
                                aria-label="input"
                                placeholder="00"
                                value={formData.tech_az}
                                onChange={handleChange}
                              />
                              <span className="input_unit">
                                <InlineMath math="\vec{z}" />
                              </span>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </>
              )}
              {formData.tech_a_rep == "point" && (
                <>
                  <div className="col-span-12 a_points">
                    <div className="grid grid-cols-12   gap-2 md:gap-4 lg:gap-4">
                      <p className="col-span-12">
                        {data?.payload?.tech_lang_keys["5"]} (A){" "}
                      </p>
                      <div className="col-span-4">
                        <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_a1"
                            id="tech_a1"
                            className="input my-2"
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_a1}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="col-span-4">
                        <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_a2"
                            id="tech_a2"
                            className="input my-2"
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_a2}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      {formData.tech_dimen === "3d" && (
                        <>
                          <div className="col-span-4" id="a3">
                            <div className=" relative">
                              <input
                                type="number"
                                step="any"
                                name="tech_a3"
                                id="tech_a3"
                                className="input my-2"
                                aria-label="input"
                                placeholder="00"
                                value={formData.tech_a3}
                                onChange={handleChange}
                              />
                            </div>
                          </div>
                        </>
                      )}
                      <p className="col-span-12">
                        {data?.payload?.tech_lang_keys["6"]} (B){" "}
                      </p>
                      <div className="col-span-4">
                        <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_b1"
                            id="tech_b1"
                            className="input my-2"
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_b1}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="col-span-4">
                        <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_b2"
                            id="tech_b2"
                            className="input my-2"
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_b2}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      {formData.tech_dimen === "3d" && (
                        <>
                          <div className="col-span-4" id="b3">
                            <div className=" relative">
                              <input
                                type="number"
                                step="any"
                                name="tech_b3"
                                id="tech_b3"
                                className="input my-2"
                                aria-label="input"
                                placeholder="00"
                                value={formData.tech_b3}
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

              <div className="col-span-12">
                <label htmlFor="tech_b_rep" className="label">
                  {data?.payload?.tech_lang_keys["16"]} (m):
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
                    <option value="coor">by Coordinates </option>
                    <option value="point">by Points </option>
                  </select>
                </div>
              </div>

              {formData.tech_b_rep == "coor" && (
                <>
                  <div className="col-span-12 b_coor ">
                    <div className="grid grid-cols-12   gap-2 md:gap-4 lg:gap-4">
                      <p className="col-span-12">
                        {data?.payload?.tech_lang_keys["7"]} (b){" "}
                      </p>
                      <div className="col-span-4">
                        <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_bx"
                            id="tech_bx"
                            className="input my-2"
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_bx}
                            onChange={handleChange}
                          />
                          <span className="input_unit">
                            <InlineMath math="\vec{x}" />
                          </span>
                        </div>
                      </div>
                      <div className="col-span-4">
                        <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_by"
                            id="tech_by"
                            className="input my-2"
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_by}
                            onChange={handleChange}
                          />
                          <span className="input_unit">
                            <InlineMath math="\vec{y}" />
                          </span>
                        </div>
                      </div>
                      {formData.tech_dimen === "3d" && (
                        <>
                          <div className="col-span-4" id="y1">
                            <div className=" relative">
                              <input
                                type="number"
                                step="any"
                                name="tech_bz"
                                id="tech_bz"
                                className="input my-2"
                                aria-label="input"
                                placeholder="00"
                                value={formData.tech_bz}
                                onChange={handleChange}
                              />
                              <span className="input_unit">
                                <InlineMath math="\vec{z}" />
                              </span>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </>
              )}
              {formData.tech_b_rep == "point" && (
                <>
                  <div className="col-span-12 b_points">
                    <div className="grid grid-cols-12   gap-2 md:gap-4 lg:gap-4">
                      <p className="col-span-12">
                        {data?.payload?.tech_lang_keys["5"]} (A){" "}
                      </p>
                      <div className="col-span-4">
                        <div className="w-full py-2">
                          <input
                            type="number"
                            step="any"
                            name="tech_aa1"
                            id="tech_aa1"
                            className="input my-2"
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_aa1}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="col-span-4">
                        <div className="w-full py-2">
                          <input
                            type="number"
                            step="any"
                            name="tech_aa2"
                            id="tech_aa2"
                            className="input my-2"
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_aa2}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      {formData.tech_dimen === "3d" && (
                        <>
                          <div className="col-span-4" id="aa3">
                            <div className="w-full py-2">
                              <input
                                type="number"
                                step="any"
                                name="tech_aa3"
                                id="tech_aa3"
                                className="input my-2"
                                aria-label="input"
                                placeholder="00"
                                value={formData.tech_aa3}
                                onChange={handleChange}
                              />
                            </div>
                          </div>
                        </>
                      )}
                      <p className="col-span-12">
                        {data?.payload?.tech_lang_keys["6"]} (B){" "}
                      </p>
                      <div className="col-span-4">
                        <div className="w-full py-2">
                          <input
                            type="number"
                            step="any"
                            name="tech_bb1"
                            id="tech_bb1"
                            className="input my-2"
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_bb1}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="col-span-4">
                        <div className="w-full py-2">
                          <input
                            type="number"
                            step="any"
                            name="tech_bb2"
                            id="tech_bb2"
                            className="input my-2"
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_bb2}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      {formData.tech_dimen === "3d" && (
                        <>
                          <div className="col-span-4" id="bb3">
                            <div className="w-full py-2">
                              <input
                                type="number"
                                step="any"
                                name="tech_bb3"
                                id="tech_bb3"
                                className="input my-2"
                                aria-label="input"
                                placeholder="00"
                                value={formData.tech_bb3}
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
                      <div className="w-full my-2">
                        <div className="w-full md:w-[80%] lg:w-[80%] text-[16px] overflow-auto">
                          <table className="w-full">
                            <tbody>
                              <tr>
                                <td className="border-b py-2">
                                  <b>{data?.payload?.tech_lang_keys["8"]} :</b>
                                </td>
                                <td className="border-b py-2">
                                  {result?.tech_deg}{" "}
                                  <span className="text-[16px]">deg</span>
                                </td>
                              </tr>

                              <tr>
                                <td colSpan="2" className="pt-2">
                                  <strong>
                                    {data?.payload?.tech_lang_keys["9"]}
                                  </strong>
                                </td>
                              </tr>

                              <tr>
                                <td className="border-b py-2">
                                  {data?.payload?.tech_lang_keys["10"]}
                                </td>
                                <td className="border-b py-2">
                                  {result?.tech_prod}
                                </td>
                              </tr>

                              <tr>
                                <td className="border-b py-2">
                                  {data?.payload?.tech_lang_keys["11"]} A =&gt;
                                  |A|
                                </td>
                                <td className="border-b py-2">
                                  {result?.tech_mgntd_a}
                                </td>
                              </tr>

                              <tr>
                                <td className="border-b py-2">
                                  {data?.payload?.tech_lang_keys["11"]} B =&gt;
                                  |B|
                                </td>
                                <td className="border-b py-2">
                                  {result?.tech_mgntd_b}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                      <div className="w-full overflow-auto">
                        {formData?.tech_dimen == "3d" ? (
                          <>
                            {formData?.tech_a_rep === "coor" &&
                            formData?.tech_b_rep === "point" ? (
                              <>
                                <p className="mt-2">
                                  <b>{data?.payload?.tech_lang_keys["13"]}:</b>
                                </p>
                                <BlockMath
                                  math={`\\vec{C} \\cdot \\vec{D} = Cx - Dx \\times Dy - Cy \\times Dz - Cz`}
                                />
                                <BlockMath
                                  math={`\\vec{C} \\cdot \\vec{D} = (${formData?.tech_bb1}-${formData?.tech_aa1}) \\times (${formData?.tech_bb2}-${formData?.tech_aa2}) \\times (${formData?.tech_bb3}-${formData?.tech_aa3})`}
                                />
                                <BlockMath
                                  math={`\\vec{C} \\cdot \\vec{D} = (${result?.tech_bx}; ${result?.tech_by}; ${result?.tech_bz})`}
                                />
                                <p className="mt-2">
                                  <b>
                                    {data?.payload?.tech_lang_keys["14"]} A{" "}
                                    {data?.payload?.tech_lang_keys["15"]} B =
                                    (CD):
                                  </b>
                                </p>
                                <BlockMath
                                  math={`\\vec{A} \\cdot \\vec{B} = Ax \\times Bx + Ay \\times By + Az \\times Bz`}
                                />
                                <BlockMath
                                  math={`\\vec{A} \\cdot \\vec{B} = (${formData?.tech_ax} \\times ${result?.tech_bx}) + (${formData?.tech_ay} \\times ${result?.tech_by}) + (${formData?.tech_az} \\times ${result?.tech_bz})`}
                                />
                                <BlockMath
                                  math={`\\vec{A} \\cdot \\vec{B} = (${result?.tech_i}) + (${result?.tech_j}) + (${result?.tech_k})`}
                                />
                                <BlockMath
                                  math={`\\vec{A} \\cdot \\vec{B} = ${result?.tech_prod}`}
                                />
                              </>
                            ) : formData?.tech_a_rep === "point" &&
                              formData?.tech_b_rep === "coor" ? (
                              <>
                                <p className="mt-2">
                                  <b>{data?.payload?.tech_lang_keys["13"]}:</b>
                                </p>
                                <BlockMath
                                  math={`\\vec{A} \\cdot \\vec{B} = Bx - Ax \\times By - Ay \\times Bz - Az`}
                                />
                                <BlockMath
                                  math={`\\vec{A} \\cdot \\vec{B} = (${formData?.tech_b1}-${formData?.tech_a1}) \\times (${formData?.tech_b2}-${formData?.tech_a2}) \\times (${formData?.tech_b3}-${formData?.tech_a3})`}
                                />
                                <BlockMath
                                  math={`\\vec{A} \\cdot \\vec{B} = (${result?.tech_ax}; ${result?.tech_ay}; ${result?.tech_az})`}
                                />
                                <p className="mt-2">
                                  <b>
                                    {data?.payload?.tech_lang_keys["14"]} A =
                                    (AB) {data?.payload?.tech_lang_keys["15"]}{" "}
                                    B:
                                  </b>
                                </p>
                                <BlockMath
                                  math={`\\vec{A} \\cdot \\vec{B} = Ax \\times Bx + Ay \\times By + Az \\times Bz`}
                                />
                                <BlockMath
                                  math={`\\vec{A} \\cdot \\vec{B} = (${result?.tech_ax} \\times ${formData?.tech_bx}) + (${result?.tech_ay} \\times ${formData?.tech_by}) + (${result?.tech_az} \\times ${formData?.tech_bz})`}
                                />
                                <BlockMath
                                  math={`\\vec{A} \\cdot \\vec{B} = (${result?.tech_i}) + (${result?.tech_j}) + (${result?.tech_k})`}
                                />
                                <BlockMath
                                  math={`\\vec{A} \\cdot \\vec{B} = ${result?.tech_prod}`}
                                />
                              </>
                            ) : formData?.tech_a_rep === "point" &&
                              formData?.tech_b_rep === "point" ? (
                              <>
                                <p className="mt-2">
                                  <b>{data?.payload?.tech_lang_keys["13"]}:</b>
                                </p>
                                <BlockMath
                                  math={`\\vec{A} \\cdot \\vec{B} = Bx - Ax \\times By - Ay \\times Bz - Az`}
                                />
                                <BlockMath
                                  math={`\\vec{A} \\cdot \\vec{B} = (${formData?.tech_b1}-${formData?.tech_a1}) \\times (${formData?.tech_b2}-${formData?.tech_a2}) \\times (${formData?.tech_b3}-${formData?.tech_a3})`}
                                />
                                <BlockMath
                                  math={`\\vec{A} \\cdot \\vec{B} = (${result?.tech_ax}; ${result?.tech_ay}; ${result?.tech_az})`}
                                />
                                <p className="mt-2">&nbsp;</p>
                                <BlockMath
                                  math={`\\vec{C} \\cdot \\vec{D} = Cx - Dx \\times Dy - Cy \\times Dz - Cz`}
                                />
                                <BlockMath
                                  math={`\\vec{C} \\cdot \\vec{D} = (${formData?.tech_bb1}-${formData?.tech_aa1}) \\times (${formData?.tech_bb2}-${formData?.tech_aa2}) \\times (${formData?.tech_bb3}-${formData?.tech_aa3})`}
                                />
                                <BlockMath
                                  math={`\\vec{C} \\cdot \\vec{D} = (${result?.tech_bx}; ${result?.tech_by}; ${result?.tech_bz})`}
                                />
                                <p className="mt-2">
                                  <b>
                                    {data?.payload?.tech_lang_keys["14"]} A =
                                    (AB) {data?.payload?.tech_lang_keys["15"]} B
                                    = (CD):
                                  </b>
                                </p>
                                <BlockMath
                                  math={`\\vec{A} \\cdot \\vec{B} = Ax \\times Bx + Ay \\times By + Az \\times Bz`}
                                />
                                <BlockMath
                                  math={`\\vec{A} \\cdot \\vec{B} = (${result?.tech_ax} \\times ${result?.tech_bx}) + (${result?.tech_ay} \\times ${result?.tech_by}) + (${result?.tech_az} \\times ${result?.tech_bz})`}
                                />
                                <BlockMath
                                  math={`\\vec{A} \\cdot \\vec{B} = (${result?.tech_i}) + (${result?.tech_j}) + (${result?.tech_k})`}
                                />
                                <BlockMath
                                  math={`\\vec{A} \\cdot \\vec{B} = ${result?.tech_prod}`}
                                />
                              </>
                            ) : (
                              <>
                                <p className="mt-2">
                                  <b>
                                    {data?.payload?.tech_lang_keys["14"]} A{" "}
                                    {data?.payload?.tech_lang_keys["15"]} B:
                                  </b>
                                </p>
                                <BlockMath
                                  math={`\\vec{A} \\cdot \\vec{B} = Ax \\times Bx + Ay \\times By + Az \\times Bz`}
                                />
                                <BlockMath
                                  math={`\\vec{A} \\cdot \\vec{B} = (${formData?.tech_ax} \\times ${formData?.tech_bx}) + (${formData?.tech_ay} \\times ${formData?.tech_by}) + (${formData?.tech_az} \\times ${formData?.tech_bz})`}
                                />
                                <BlockMath
                                  math={`\\vec{A} \\cdot \\vec{B} = (${result?.tech_i}) + (${result?.tech_j}) + (${result?.tech_k})`}
                                />
                                <BlockMath
                                  math={`\\vec{A} \\cdot \\vec{B} = ${result?.tech_prod}`}
                                />
                              </>
                            )}

                            <p className="mt-2">
                              <b>{data?.payload?.tech_lang_keys["11"]} A:</b>
                            </p>
                            <BlockMath
                              math={`|A| = \\sqrt{Ax^2 + Ay^2 + Az^2}`}
                            />
                            <BlockMath
                              math={`|A| = \\sqrt{(${formData?.tech_ax})^2 + (${formData?.tech_ay})^2 + (${formData?.tech_az})^2}`}
                            />
                            <BlockMath
                              math={`|A| = \\sqrt{${result?.tech_ax2} + ${result?.tech_ay2} + ${result?.tech_az2}}`}
                            />
                            <BlockMath math={`|A| = ${result?.tech_mgntd_a}`} />

                            <p className="mt-2">
                              <b>{data?.payload?.tech_lang_keys["11"]} B:</b>
                            </p>
                            <BlockMath
                              math={`|B| = \\sqrt{Bx^2 + By^2 + Bz^2}`}
                            />
                            <BlockMath
                              math={`|B| = \\sqrt{(${formData?.tech_bx})^2 + (${formData?.tech_by})^2 + (${formData?.tech_bz})^2}`}
                            />
                            <BlockMath
                              math={`|B| = \\sqrt{${result?.tech_bx2} + ${result?.tech_by2} + ${result?.tech_bz2}}`}
                            />
                            <BlockMath math={`|B| = ${result?.tech_mgntd_b}`} />

                            <p className="mt-2">
                              <b>
                                {data?.payload?.tech_lang_keys["16"]} A{" "}
                                {data?.payload?.tech_lang_keys["15"]} B:
                              </b>
                            </p>
                            <BlockMath
                              math={`\\cos\\theta = (\\vec{A} \\cdot \\vec{B}) / (|A||B|)`}
                            />
                            <BlockMath
                              math={`\\cos\\theta = (${result?.tech_prod}) / (${result?.tech_mgntd_a} \\times ${result?.tech_mgntd_b})`}
                            />
                            <BlockMath
                              math={`\\cos\\theta = (${result?.tech_prod}) / (${result?.tech_mgntd})`}
                            />
                            <BlockMath
                              math={`\\cos\\theta = ${result?.tech_angle}`}
                            />
                            <BlockMath
                              math={`\\theta = ${result?.tech_deg} \\text{ deg}`}
                            />
                          </>
                        ) : (
                          <>
                            {formData?.tech_a_rep === "coor" &&
                            formData?.tech_b_rep === "point" ? (
                              <>
                                <p className="mt-2">
                                  <b>{data?.payload?.tech_lang_keys["13"]}:</b>
                                </p>
                                <BlockMath
                                  math={`\\vec C \\cdot \\vec D = Cx - Dx * Dy - Cy`}
                                />
                                <BlockMath
                                  math={`\\vec C \\cdot \\vec D = (${formData?.tech_bb1} - ${formData?.tech_aa1}) * (${formData?.tech_bb2} - ${formData?.tech_aa2})`}
                                />
                                <BlockMath
                                  math={`\\vec C \\cdot \\vec D = (${result?.tech_bx};${result?.tech_by})`}
                                />
                                <p className="mt-2">
                                  <b>
                                    {data?.payload?.tech_lang_keys["14"]} A{" "}
                                    {data?.payload?.tech_lang_keys["15"]} B =
                                    (CD):
                                  </b>
                                </p>
                                <BlockMath
                                  math={`\\vec A \\cdot \\vec B = Ax * Bx + Ay * By`}
                                />
                                <BlockMath
                                  math={`\\vec A \\cdot \\vec B = (${formData?.tech_ax} * ${result?.tech_bx}) + (${formData?.tech_ay} * ${result?.tech_by})`}
                                />
                                <BlockMath
                                  math={`\\vec A \\cdot \\vec B = (${result?.tech_i}) + (${result?.tech_j})`}
                                />
                                <BlockMath
                                  math={`\\vec A \\cdot \\vec B = ${result?.tech_prod}`}
                                />
                              </>
                            ) : formData?.tech_a_rep === "point" &&
                              formData?.tech_b_rep === "coor" ? (
                              <>
                                <p className="mt-2">
                                  <b>{data?.payload?.tech_lang_keys["13"]}:</b>
                                </p>
                                <BlockMath
                                  math={`\\vec A \\cdot \\vec B = Bx - Ax * By - Ay`}
                                />
                                <BlockMath
                                  math={`\\vec A \\cdot \\vec B = (${formData?.tech_b1} - ${formData?.tech_a1}) * (${formData?.tech_b2} - ${formData?.tech_a2})`}
                                />
                                <BlockMath
                                  math={`\\vec A \\cdot \\vec B = (${result?.tech_ax};${result?.tech_ay})`}
                                />
                                <p className="mt-2">
                                  <b>
                                    {data?.payload?.tech_lang_keys["14"]} A =
                                    (AB) {data?.payload?.tech_lang_keys["15"]}{" "}
                                    B:
                                  </b>
                                </p>
                                <BlockMath
                                  math={`\\vec A \\cdot \\vec B = Ax * Bx + Ay * By`}
                                />
                                <BlockMath
                                  math={`\\vec A \\cdot \\vec B = (${result?.tech_ax} * ${formData?.tech_bx}) + (${result?.tech_ay} * ${formData?.tech_by})`}
                                />
                                <BlockMath
                                  math={`\\vec A \\cdot \\vec B = (${result?.tech_i}) + (${result?.tech_j})`}
                                />
                                <BlockMath
                                  math={`\\vec A \\cdot \\vec B = ${result?.tech_prod}`}
                                />
                              </>
                            ) : formData?.tech_a_rep === "point" &&
                              formData?.tech_b_rep === "point" ? (
                              <>
                                <p className="mt-2">
                                  <b>{data?.payload?.tech_lang_keys["13"]}:</b>
                                </p>
                                <BlockMath
                                  math={`\\vec A \\cdot \\vec B = Bx - Ax * By - Ay`}
                                />
                                <BlockMath
                                  math={`\\vec A \\cdot \\vec B = (${formData?.tech_b1} - ${formData?.tech_a1}) * (${formData?.tech_b2} - ${formData?.tech_a2})`}
                                />
                                <BlockMath
                                  math={`\\vec A \\cdot \\vec B = (${result?.tech_ax};${result?.tech_ay})`}
                                />
                                <br />
                                <BlockMath
                                  math={`\\vec C \\cdot \\vec D = Cx - Dx * Dy - Cy`}
                                />
                                <BlockMath
                                  math={`\\vec C \\cdot \\vec D = (${formData?.tech_bb1} - ${formData?.tech_aa1}) * (${formData?.tech_bb2} - ${formData?.tech_aa2})`}
                                />
                                <BlockMath
                                  math={`\\vec C \\cdot \\vec D = (${result?.tech_bx};${result?.tech_by})`}
                                />
                                <p className="mt-2">
                                  <b>
                                    {data?.payload?.tech_lang_keys["14"]} A =
                                    (AB) {data?.payload?.tech_lang_keys["15"]} B
                                    = (CD):
                                  </b>
                                </p>
                                <BlockMath
                                  math={`\\vec A \\cdot \\vec B = Ax * Bx + Ay * By`}
                                />
                                <BlockMath
                                  math={`\\vec A \\cdot \\vec B = (${result?.tech_ax} * ${result?.tech_bx}) + (${result?.tech_ay} * ${result?.tech_by})`}
                                />
                                <BlockMath
                                  math={`\\vec A \\cdot \\vec B = (${result?.tech_i}) + (${result?.tech_j}) + (${result?.tech_k})`}
                                />
                                <BlockMath
                                  math={`\\vec A \\cdot \\vec B = ${result?.tech_prod}`}
                                />
                              </>
                            ) : (
                              <>
                                <p className="mt-2">
                                  <b>
                                    {data?.payload?.tech_lang_keys["14"]} A{" "}
                                    {data?.payload?.tech_lang_keys["15"]} B:
                                  </b>
                                </p>
                                <BlockMath
                                  math={`\\vec A \\cdot \\vec B = Ax * Bx + Ay * By`}
                                />
                                <BlockMath
                                  math={`\\vec A \\cdot \\vec B = (${formData?.tech_ax} * ${formData?.tech_bx}) + (${formData?.tech_ay} * ${formData?.tech_by})`}
                                />
                                <BlockMath
                                  math={`\\vec A \\cdot \\vec B = (${result?.tech_i}) + (${result?.tech_j})`}
                                />
                                <BlockMath
                                  math={`\\vec A \\cdot \\vec B = ${result?.tech_prod}`}
                                />
                              </>
                            )}

                            <p className="mt-2">
                              <b>{data?.payload?.tech_lang_keys["11"]} A:</b>
                            </p>
                            <BlockMath math={`|A| = \\sqrt{Ax^2 + Ay^2}`} />
                            <BlockMath
                              math={`|A| = \\sqrt{(${formData?.tech_ax})^2 + (${formData?.tech_ay})^2}`}
                            />
                            <BlockMath
                              math={`|A| = \\sqrt{${result?.tech_ax2} + ${result?.tech_ay2}}`}
                            />
                            <BlockMath math={`|A| = ${result?.tech_mgntd_a}`} />

                            <p className="mt-2">
                              <b>{data?.payload?.tech_lang_keys["11"]} B:</b>
                            </p>
                            <BlockMath math={`|B| = \\sqrt{Bx^2 + By^2}`} />
                            <BlockMath
                              math={`|B| = \\sqrt{(${formData?.tech_bx})^2 + (${formData?.tech_by})^2}`}
                            />
                            <BlockMath
                              math={`|B| = \\sqrt{${result?.tech_bx2} + ${result?.tech_by2}}`}
                            />
                            <BlockMath math={`|B| = ${result?.tech_mgntd_b}`} />

                            <p className="mt-2">
                              <b>
                                {data?.payload?.tech_lang_keys["16"]} A{" "}
                                {data?.payload?.tech_lang_keys["15"]} B:
                              </b>
                            </p>
                            <BlockMath
                              math={`\\cos\\theta = (\\vec A \\cdot \\vec B) / (|A||B|)`}
                            />
                            <BlockMath
                              math={`\\cos\\theta = (${result?.tech_prod}) / (${result?.tech_mgntd_a} \\times ${result?.tech_mgntd_b})`}
                            />
                            <BlockMath
                              math={`\\cos\\theta = (${result?.tech_prod}) / (${result?.tech_mgntd})`}
                            />
                            <BlockMath
                              math={`\\cos\\theta = ${result?.tech_angle}`}
                            />
                            <BlockMath
                              math={`\\theta = ${result?.tech_deg}^\\circ`}
                            />
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

export default AngleBetweenTwoVectorsCalculator;

"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useElementaryMatrixCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const ElementaryMatrixCalculator = () => {
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
    tech_type: "row", // row col
    tech_matrix_size: "3",
    tech_pth_matrix: "2",
    tech_a: "5",
    tech_result_q: "3",
    tech_b: "5",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useElementaryMatrixCalculatorMutation();

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
        tech_matrix_size: formData.tech_matrix_size,
        tech_pth_matrix: formData.tech_pth_matrix,
        tech_a: formData.tech_a,
        tech_result_q: formData.tech_result_q,
        tech_b: formData.tech_b,
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
      tech_type: "row", // row col
      tech_matrix_size: "3",
      tech_pth_matrix: "2",
      tech_a: "5",
      tech_result_q: "3",
      tech_b: "5",
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

  const generateMatrixLatex = () => {
    if (!result?.tech_array || !formData?.tech_matrix_size) return "";

    let latex = "\\begin{bmatrix}";
    for (let i = 0; i < formData.tech_matrix_size; i++) {
      for (let j = 0; j < formData.tech_matrix_size; j++) {
        latex += result.tech_array[i][j];
        if (j < formData.tech_matrix_size - 1) latex += " & ";
      }
      if (i < formData.tech_matrix_size - 1) latex += " \\\\ ";
    }
    latex += "\\end{bmatrix}";
    return latex;
  };

  //
  const [showSteps, setShowSteps] = useState(false);

  const matrixToLatex = (matrix) => {
    if (!matrix || !Array.isArray(matrix)) return "";
    return (
      "\\begin{bmatrix}" +
      matrix.map((row) => row.map((val) => val).join(" & ")).join(" \\\\ ") +
      "\\end{bmatrix}"
    );
  };

  const getOrdinal = (n) => {
    if (n === 1) return "st";
    if (n === 2) return "nd";
    if (n === 3) return "rd";
    return "th";
  };

  //

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
            <div className="grid grid-cols-12 mt-3 gap-2 md:gap-4 lg:gap-4">
              <div className="col-span-12">
                <label htmlFor="tech_type" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_type"
                    id="tech_type"
                    value={formData.tech_type}
                    onChange={handleChange}
                  >
                    <option value="row">
                      {data?.payload?.tech_lang_keys["2"]}{" "}
                    </option>
                    <option value="col">
                      {data?.payload?.tech_lang_keys["3"]}{" "}
                    </option>
                  </select>
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                <label htmlFor="tech_matrix_size" className="label">
                  {data?.payload?.tech_lang_keys["amount"]}:
                </label>
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_matrix_size"
                    id="tech_matrix_size"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_matrix_size}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                {formData?.tech_type == "col" ? (
                  <>
                    <label htmlFor="tech_pth_matrix" className="label">
                      {" "}
                      Pth Column (C<sub className="font-s-12 text-blue">p</sub>)
                    </label>
                  </>
                ) : (
                  <>
                    <label htmlFor="tech_pth_matrix" className="label">
                      {" "}
                      {data?.payload?.tech_lang_keys[5]} (R
                      <sub className="font-s-12 text-blue">p</sub>)
                    </label>
                  </>
                )}
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_pth_matrix"
                    id="tech_pth_matrix"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_pth_matrix}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                {formData?.tech_type == "col" ? (
                  <>
                    <label htmlFor="tech_a" className="label">
                      {" "}
                      Factor "a" to be multiplied by C
                      <sub className="font-s-12 text-blue">p</sub>
                    </label>
                  </>
                ) : (
                  <>
                    <label htmlFor="tech_a" className="label">
                      {" "}
                      Factor "a" to be multiplied by R
                      <sub className="font-s-12 text-blue">p</sub>
                    </label>
                  </>
                )}
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
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                {formData?.tech_type == "col" ? (
                  <>
                    <label htmlFor="tech_result_q" className="label">
                      {" "}
                      Column q that Receives Result (C
                      <sub className="font-s-12 text-blue">q</sub>)
                    </label>
                  </>
                ) : (
                  <>
                    <label htmlFor="tech_result_q" className="label">
                      {" "}
                      {data?.payload?.tech_lang_keys[7]}(R
                      <sub className="font-s-12 text-blue">q</sub>)
                    </label>
                  </>
                )}
                <div className=" relative">
                  <input
                    type="number"
                    step="any"
                    name="tech_result_q"
                    id="tech_result_q"
                    className="input my-2"
                    aria-label="input"
                    placeholder="00"
                    value={formData.tech_result_q}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-6">
                {formData?.tech_type == "col" ? (
                  <>
                    <label htmlFor="tech_b" className="label">
                      {" "}
                      Factor "b" to be multiplied by C
                      <sub className="font-s-12 text-blue">q</sub>
                    </label>
                  </>
                ) : (
                  <>
                    <label htmlFor="tech_b" className="label">
                      {" "}
                      Factor "b" to be multiplied by R
                      <sub className="font-s-12 text-blue">q</sub>
                    </label>
                  </>
                )}
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
                        {data?.payload?.tech_lang_keys["9"]}
                      </p>

                      <div className="mt-3 font-bold">
                        <BlockMath
                          math={`\\displaystyle ${generateMatrixLatex()}`}
                        />
                      </div>

                      <p className="mt-3 font-bold">
                        {data?.payload?.tech_lang_keys["17"]}
                      </p>

                      {formData?.tech_type == "row" ? (
                        <>
                          <div>
                            <p className="mt-3">
                              {data?.payload?.tech_lang_keys[11]}
                            </p>
                            <p className="mt-3">
                              {data?.payload?.tech_lang_keys[12]}{" "}
                              {formData?.tech_matrix_size}
                            </p>
                            <p className="mt-3">
                              ({data?.payload?.tech_lang_keys[13]}
                              <sub className="font-s-14">q</sub>) ={" "}
                              {formData?.tech_result_q}
                            </p>
                            <p className="mt-3">
                              p<sup className="font-s-14">th</sup> Row (R
                              <sub className="font-s-14">p</sub>) ={" "}
                              {formData?.tech_pth_matrix}
                            </p>
                            <p className="mt-3">
                              {data?.payload?.tech_lang_keys[14]}{" "}
                              {formData?.tech_a}
                            </p>
                            <p className="mt-3">
                              {data?.payload?.tech_lang_keys[15]}{" "}
                              {formData?.tech_b}
                            </p>
                            <p className="mt-3">
                              {data?.payload?.tech_lang_keys[16]}
                            </p>
                            <p className="mt-3">
                              <BlockMath
                                math={`aR_p + bR_q \\rightarrow R_q`}
                              />
                            </p>

                            <div className="col-12 mt-3 d-flex align-items-center">
                              <p>For step by step calculations</p>
                              <button
                                type="button"
                                className="calculate ms-2 px-6 py-3 font-semibold text-[#ffffff] mt-3 bg-[#2845F5] text-[14px] rounded-lg focus:outline-none focus:ring-2 "
                                style={{
                                  fontSize: "16px",
                                  padding: "10px",
                                  cursor: "pointer",
                                }}
                                onClick={() => setShowSteps((prev) => !prev)}
                              >
                                Click Here
                              </button>
                            </div>

                            {showSteps && (
                              <div className="col-12 mt-3 res_step elementrySteps">
                                <p className="mt-3">
                                  {data?.payload?.tech_lang_keys[18]}
                                  {formData?.tech_matrix_size}
                                  {data?.payload?.tech_lang_keys[19]}
                                  {formData?.tech_matrix_size}x
                                  {formData?.tech_matrix_size}
                                  {data?.payload?.tech_lang_keys[20]}
                                </p>

                                <p className="mt-3">
                                  <BlockMath
                                    math={matrixToLatex(
                                      result?.tech_identity_matrix
                                    )}
                                  />
                                </p>

                                <p className="mt-3">
                                  {data?.payload?.tech_lang_keys[21]}
                                </p>
                                <p className="mt-3">
                                  <BlockMath
                                    math={`aR_p + bR_q \\rightarrow R_q`}
                                  />
                                </p>

                                <p className="mt-3">
                                  aR<sub className="font-s-14">p</sub> ={" "}
                                  {formData?.tech_a} × R
                                  <sub className="font-s-14">
                                    {formData?.tech_pth_matrix}
                                  </sub>{" "}
                                  (R
                                  <sub className="font-s-14">p</sub> is{" "}
                                  {formData?.tech_pth_matrix}
                                  <sup className="font-s-14">
                                    {getOrdinal(formData?.tech_pth_matrix)}
                                  </sup>
                                  Row)
                                </p>

                                <p className="mt-3">
                                  bR<sub className="font-s-14">q</sub> ={" "}
                                  {formData?.tech_b} × R
                                  <sub className="font-s-14">
                                    {formData?.tech_result_q}
                                  </sub>{" "}
                                  (R
                                  <sub className="font-s-14">q</sub> is{" "}
                                  {formData?.tech_result_q}
                                  <sup className="font-s-14">
                                    {getOrdinal(formData?.tech_result_q)}
                                  </sup>
                                  Row)
                                </p>

                                <p className="mt-3">
                                  <BlockMath
                                    math={matrixToLatex(
                                      result?.tech_multiply_matrix
                                    )}
                                  />
                                </p>

                                <p className="mt-3">Now:</p>

                                <p className="mt-3">
                                  <BlockMath
                                    math={`${formData?.tech_a}R_${formData?.tech_pth_matrix} + ${formData?.tech_b}R_${formData?.tech_result_q} = aR_p + bR_q`}
                                  />
                                </p>

                                <p className="mt-3">
                                  <BlockMath
                                    math={matrixToLatex(
                                      result?.tech_addition_matrix
                                    )}
                                  />
                                </p>

                                <p className="mt-3">Final Matrix</p>

                                <p className="mt-3">
                                  <BlockMath
                                    math={matrixToLatex(result?.tech_array)}
                                  />
                                </p>
                              </div>
                            )}
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="p-4">
                            <p className="mt-3 font-bold">
                              {data?.payload?.tech_lang_keys[11]}
                            </p>
                            <p className="mt-3">
                              {data?.payload?.tech_lang_keys[12]}{" "}
                              {formData?.tech_matrix_size}
                            </p>
                            <p className="mt-3">
                              ({data?.payload?.tech_lang_keys[24]}
                              <sub className="font-s-14">q</sub>) ={" "}
                              {formData?.tech_result_q}
                            </p>
                            <p className="mt-3">
                              p<sup className="font-s-14">th</sup> Column (C
                              <sub className="font-s-14">p</sub>) ={" "}
                              {formData?.tech_pth_matrix}
                            </p>
                            <p className="mt-3">
                              {data?.payload?.tech_lang_keys[14]}{" "}
                              {formData?.tech_a}
                            </p>
                            <p className="mt-3">
                              {data?.payload?.tech_lang_keys[15]}{" "}
                              {formData?.tech_b}
                            </p>
                            <p className="mt-3">
                              {data?.payload?.tech_lang_keys[16]}
                            </p>
                            <p className="mt-3">
                              <BlockMath
                                math={`aC_p + bC_q \\rightarrow C_q`}
                              />
                            </p>

                            <div className="col-12 mt-3 d-flex align-items-center">
                              <p>For step by step calculations</p>
                              <button
                                type="button"
                                className="ms-2 px-6 py-3 font-semibold text-[#ffffff] mt-3 bg-[#2845F5] text-[14px] rounded-lg focus:outline-none focus:ring-2"
                                style={{
                                  fontSize: "16px",
                                  padding: "10px",
                                  cursor: "pointer",
                                }}
                                onClick={() => setShowSteps((prev) => !prev)}
                              >
                                Click Here
                              </button>
                            </div>

                            {showSteps && (
                              <div className="col-12 mt-3 res_step elementrySteps">
                                <p className="mt-3">
                                  {data?.payload?.tech_lang_keys[18]}
                                  {formData?.tech_matrix_size}
                                  {data?.payload?.tech_lang_keys[19]}
                                  {formData?.tech_matrix_size}x
                                  {formData?.tech_matrix_size}
                                  {data?.payload?.tech_lang_keys[20]}
                                </p>

                                <p className="mt-3">
                                  <BlockMath
                                    math={matrixToLatex(
                                      result?.tech_identity_matrix
                                    )}
                                  />
                                </p>

                                <p className="mt-3">
                                  {data?.payload?.tech_lang_keys[21]}
                                </p>

                                <p className="mt-3">
                                  <BlockMath
                                    math={`aC_p + bC_q \\rightarrow C_q`}
                                  />
                                </p>

                                <p className="mt-3">
                                  aC<sub className="font-s-14">p</sub> ={" "}
                                  {formData?.tech_a} × C
                                  <sub className="font-s-14">
                                    {formData?.tech_pth_matrix}
                                  </sub>{" "}
                                  (C
                                  <sub className="font-s-14">p</sub> is{" "}
                                  {formData?.tech_pth_matrix}
                                  <sup className="font-s-14">
                                    {getOrdinal(formData?.tech_pth_matrix)}
                                  </sup>
                                  Column)
                                </p>

                                <p className="mt-3">
                                  bC<sub className="font-s-14">q</sub> ={" "}
                                  {formData?.tech_b} × C
                                  <sub className="font-s-14">
                                    {formData?.tech_result_q}
                                  </sub>{" "}
                                  (C
                                  <sub className="font-s-14">q</sub> is{" "}
                                  {formData?.tech_result_q}
                                  <sup className="font-s-14">
                                    {getOrdinal(formData?.tech_result_q)}
                                  </sup>
                                  Column)
                                </p>

                                <p className="mt-3">
                                  <BlockMath
                                    math={matrixToLatex(
                                      result?.tech_multiply_matrix
                                    )}
                                  />
                                </p>

                                <p className="mt-3">
                                  {data?.payload?.tech_lang_keys[22]}
                                </p>

                                <p className="mt-3">
                                  <BlockMath
                                    math={`${formData?.tech_a}C_${formData?.tech_pth_matrix} + ${formData?.tech_b}C_${formData?.tech_result_q} = aC_p + bC_q`}
                                  />
                                </p>

                                <p className="mt-3">
                                  <BlockMath
                                    math={matrixToLatex(
                                      result?.tech_addition_matrix
                                    )}
                                  />
                                </p>

                                <p className="mt-3">
                                  {data?.payload?.tech_lang_keys[23]}
                                </p>

                                <p className="mt-3">
                                  <BlockMath
                                    math={matrixToLatex(result?.tech_array)}
                                  />
                                </p>
                              </div>
                            )}
                          </div>
                        </>
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

export default ElementaryMatrixCalculator;

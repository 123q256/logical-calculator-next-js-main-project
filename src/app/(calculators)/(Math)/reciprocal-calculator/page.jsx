"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";

import {
  useGetSingleCalculatorDetailsMutation,
  useReciprocalCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const ReciprocalCalculator = () => {
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
    tech_operations: 1,
    tech_first: 3,
    tech_second: 7,
    tech_third: 7,
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useReciprocalCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_operations) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_operations: formData.tech_operations,
        tech_first: formData.tech_first,
        tech_second: formData.tech_second,
        tech_third: formData.tech_third,
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
      tech_operations: 1,
      tech_first: 3,
      tech_second: 7,
      tech_third: 7,
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
  // Upr ko calculate karo pehle (JSX ke bahar)
  let upr = result?.tech_upr;
  if (upr && upr.toString().includes(".")) {
    upr = Number(upr).toFixed(3);
  }

  // Pehle formData.tech_first ka decimal check karo (JSX ke bahar)
  const parts = formData?.tech_first?.toString().split(".") || [];
  const isInteger = parts.length === 1;

  // JavaScript me number decimal check
  const uprStr = result?.tech_upr?.toString() || "";
  const uprParts = uprStr.split(".");
  let uprFormatted = result?.tech_upr;

  if (uprParts.length === 2) {
    uprFormatted = Number(result.tech_upr).toFixed(3);
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
            <div className="grid grid-cols-12 mt-3 gap-2 md:gap-4 lg:gap-4">
              <div className="col-span-12">
                <label htmlFor="tech_operations" className="label">
                  {data?.payload?.tech_lang_keys["1"]}:
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
                      {data?.payload?.tech_lang_keys["2"]}{" "}
                    </option>
                    <option value="2">
                      {data?.payload?.tech_lang_keys["3"]}{" "}
                    </option>
                    <option value="3">
                      {data?.payload?.tech_lang_keys["4"]}{" "}
                    </option>
                  </select>
                </div>
              </div>

              {formData.tech_operations == "3" && (
                <>
                  <p className="col-span-12 text-center my-3 txt" id="math_s">
                    {data?.payload?.tech_lang_keys[5]}
                    <span className="fraction">
                      <span className="num">
                        {data?.payload?.tech_lang_keys[6]}
                      </span>
                      <span className="visually-hidden"></span>
                      <span className="den">
                        {data?.payload?.tech_lang_keys[7]}
                      </span>
                    </span>
                  </p>
                </>
              )}
              {formData.tech_operations == "1" && (
                <>
                  <p className="col-span-12 text-center my-3 txt" id="math_d">
                    <span className="fraction">
                      <span className="num">
                        {data?.payload?.tech_lang_keys[6]}
                      </span>
                      <span className="visually-hidden"></span>
                      <span className="den">
                        {data?.payload?.tech_lang_keys[7]}
                      </span>
                    </span>
                  </p>
                </>
              )}
              {(formData.tech_operations == "3" ||
                formData.tech_operations == "2") && (
                <>
                  <div className="col-span-6 pehli">
                    {formData.tech_operations == "3" ? (
                      <>
                        <label htmlFor="tech_first" className="label">
                          {data?.payload?.tech_lang_keys["5"]}:{" "}
                        </label>
                      </>
                    ) : (
                      <>
                        <label htmlFor="tech_first" className="label">
                          {data?.payload?.tech_lang_keys["8"]}:{" "}
                        </label>
                      </>
                    )}
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_first"
                        id="tech_first"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_first}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </>
              )}
              {(formData.tech_operations == "1" ||
                formData.tech_operations == "3") && (
                <>
                  <div className="col-span-6 pehli2">
                    <label htmlFor="tech_second" className="label">
                      {data?.payload?.tech_lang_keys["6"]}:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_second"
                        id="tech_second"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_second}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </>
              )}
              {(formData.tech_operations == "1" ||
                formData.tech_operations == "3") && (
                <>
                  <div className="col-span-6 pehli3">
                    <label htmlFor="tech_third" className="label">
                      {data?.payload?.tech_lang_keys["7"]}:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_third"
                        id="tech_third"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_third}
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

                  <div className="rounded-lg  flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="w-full my-2 text-[16px] overflow-auto">
                        {result?.tech_operations == 1 ? (
                          <>
                            <div className="text-center">
                              <p className="text-[20px]">
                                <strong>
                                  {data?.payload?.tech_lang_keys["ans"]}
                                </strong>
                              </p>
                              <div className="flex justify-center">
                                <p className="text-[25px] bg-[#2845F5] text-white rounded-lg px-3 py-2  my-3">
                                  <strong className="text-blue">
                                    <InlineMath
                                      math={`\\frac{${formData?.tech_second}}{${
                                        formData?.tech_third
                                      }} = ${(
                                        formData?.tech_third /
                                        formData?.tech_second
                                      ).toFixed(4)}`}
                                    />
                                  </strong>
                                </p>
                              </div>
                            </div>

                            <p className="mb-2 text-[18px]">
                              <strong>
                                {data?.payload?.tech_lang_keys["ex"]}:
                              </strong>
                            </p>
                            <p className="text-[18px]">
                              {data?.payload?.tech_lang_keys["input"]} :
                              <InlineMath
                                math={`\\frac{${formData?.tech_second}}{${formData?.tech_third}}`}
                              />
                            </p>

                            <p className="text-[18px] mt-2">
                              {data?.payload?.tech_lang_keys["step"]} # 1
                              <InlineMath
                                math={`= \\frac{${result?.tech_totalN} \\div ${result?.tech_g}}{${result?.tech_totalD} \\div ${result?.tech_g}}`}
                              />
                            </p>

                            {result?.tech_btm === "1" ? (
                              <>
                                <p className="mt-2">
                                  {data?.payload?.tech_lang_keys["step"]} # 2
                                  <InlineMath math={`= ${upr}`} />
                                </p>
                                <table className="col-lg-8 w-full">
                                  <tbody>
                                    <tr>
                                      <td>
                                        <span>
                                          {
                                            data?.payload?.tech_lang_keys[
                                              "step"
                                            ]
                                          }{" "}
                                          # 3{" "}
                                        </span>
                                        <InlineMath
                                          math={`= \\frac{${upr}}{${result?.tech_btm}}`}
                                        />
                                        <span className="r-cross text-gray">
                                          &nbsp;&nbsp; ⤭ &nbsp;&nbsp;
                                        </span>
                                        <InlineMath
                                          math={`\\frac{${result?.tech_btm}}{${upr}}`}
                                        />
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>
                                        <span>
                                          {
                                            data?.payload?.tech_lang_keys[
                                              "step"
                                            ]
                                          }{" "}
                                          # 4{" "}
                                        </span>
                                        <InlineMath
                                          math={`= ${(
                                            result?.tech_btm / result?.tech_upr
                                          ).toFixed(4)}`}
                                        />
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </>
                            ) : (
                              <>
                                <p className="mt-2">
                                  {data?.payload?.tech_lang_keys["step"]} # 2
                                  <InlineMath
                                    math={`= \\frac{${result?.tech_upr}}{${result?.tech_btm}}`}
                                  />
                                </p>
                                <table className="w-full">
                                  <tbody>
                                    <tr>
                                      <td>
                                        <span>
                                          {
                                            data?.payload?.tech_lang_keys[
                                              "step"
                                            ]
                                          }{" "}
                                          # 3{" "}
                                        </span>
                                        <InlineMath
                                          math={`= \\frac{${result?.tech_upr}}{${result?.tech_btm}}`}
                                        />
                                        <span className="r-cross text-gray">
                                          &nbsp;&nbsp; ⤭ &nbsp;&nbsp;
                                        </span>
                                        <InlineMath
                                          math={`\\frac{${result?.tech_btm}}{${result?.tech_upr}}`}
                                        />
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>
                                        <span>
                                          {
                                            data?.payload?.tech_lang_keys[
                                              "step"
                                            ]
                                          }{" "}
                                          # 4{" "}
                                        </span>
                                        <InlineMath
                                          math={`= ${(
                                            result?.tech_btm / result?.tech_upr
                                          ).toFixed(4)}`}
                                        />
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </>
                            )}
                          </>
                        ) : result?.tech_operations == 2 ? (
                          <>
                            <div className="text-center">
                              <p className="text-[20px]">
                                <strong>
                                  {data?.payload?.tech_lang_keys["ans"]}
                                </strong>
                              </p>
                              <div className="flex justify-center">
                                <p className="text-[25px] bg-[#2845F5] text-white rounded-lg px-3 py-2  my-3">
                                  <strong className="text-blue">
                                    <InlineMath
                                      math={`${formData?.tech_first} = ${
                                        result
                                          ? result.tech_answer.toFixed(4)
                                          : ""
                                      }`}
                                    />
                                  </strong>
                                </p>
                              </div>
                            </div>

                            <p className="mb-2 text-[18px]">
                              <strong>
                                {data?.payload?.tech_lang_keys["ex"]}:
                              </strong>
                            </p>
                            <p className="text-[18px]">
                              {data?.payload?.tech_lang_keys["input"]} :{" "}
                              <InlineMath math={`${formData?.tech_first}`} />
                            </p>
                            <p className="text-[18px] mt-2">
                              {data?.payload?.tech_lang_keys["step"]} # 1{" "}
                              <InlineMath
                                math={`\\frac{${formData?.tech_first}}{1}`}
                              />
                            </p>
                            <div className="w-full overflow-auto text-[16px]">
                              <table className="w-full">
                                <tbody>
                                  {isInteger ? (
                                    <>
                                      <tr className="mt-2">
                                        <td>
                                          <span>
                                            {
                                              data?.payload?.tech_lang_keys[
                                                "step"
                                              ]
                                            }{" "}
                                            # 2{" "}
                                          </span>
                                          <InlineMath
                                            math={`\\frac{${formData?.tech_first}}{1}`}
                                          />
                                          <span className="r-cross text-gray">
                                            &nbsp;&nbsp; ⤭ &nbsp;&nbsp;
                                          </span>
                                          <InlineMath
                                            math={`\\frac{1}{${formData?.tech_first}}`}
                                          />
                                        </td>
                                      </tr>
                                      <tr className="col s12 font_size20">
                                        <td>
                                          <span>
                                            {
                                              data?.payload?.tech_lang_keys[
                                                "step"
                                              ]
                                            }{" "}
                                            # 3{" "}
                                          </span>
                                          <InlineMath
                                            math={`${
                                              result
                                                ? result.tech_answer.toFixed(4)
                                                : ""
                                            }`}
                                          />
                                        </td>
                                      </tr>
                                    </>
                                  ) : (
                                    <>
                                      <tr className="mt-2">
                                        <td>
                                          <span>
                                            {
                                              data?.payload?.tech_lang_keys[
                                                "step"
                                              ]
                                            }{" "}
                                            # 2{" "}
                                          </span>
                                          <InlineMath
                                            math={`\\frac{${formData?.tech_first}}{1}`}
                                          />
                                          <span className="r-cross text-gray">
                                            &nbsp;&nbsp; ⤭ &nbsp;&nbsp;
                                          </span>
                                          <InlineMath
                                            math={`\\frac{1}{${formData?.tech_first}}`}
                                          />
                                        </td>
                                      </tr>
                                      <tr className="mt-2">
                                        <td>
                                          <span>
                                            {
                                              data?.payload?.tech_lang_keys[
                                                "step"
                                              ]
                                            }{" "}
                                            # 3{" "}
                                          </span>
                                          <InlineMath
                                            math={`\\frac{${result?.tech_upper}}{${result?.tech_lower}}`}
                                          />
                                        </td>
                                      </tr>
                                      <tr className="mt-2">
                                        <td>
                                          <span>
                                            {
                                              data?.payload?.tech_lang_keys[
                                                "step"
                                              ]
                                            }{" "}
                                            # 4{" "}
                                          </span>
                                          <InlineMath
                                            math={`= \\frac{${result?.tech_totalN} \\div ${result?.tech_g}}{${result?.tech_totalD} \\div ${result?.tech_g}}`}
                                          />
                                        </td>
                                      </tr>
                                      <tr className="mt-2">
                                        <td>
                                          <span>
                                            {
                                              data?.payload?.tech_lang_keys[
                                                "step"
                                              ]
                                            }{" "}
                                            # 5{" "}
                                          </span>
                                          <InlineMath
                                            math={`= \\frac{${result?.tech_upr}}{${result?.tech_btm}}`}
                                          />
                                        </td>
                                      </tr>
                                      <tr className="mt-2">
                                        <td>
                                          <span>
                                            {
                                              data?.payload?.tech_lang_keys[
                                                "step"
                                              ]
                                            }{" "}
                                            # 6{" "}
                                          </span>
                                          <InlineMath
                                            math={`${
                                              result
                                                ? result.tech_answer.toFixed(4)
                                                : ""
                                            }`}
                                          />
                                        </td>
                                      </tr>
                                    </>
                                  )}
                                </tbody>
                              </table>
                            </div>
                          </>
                        ) : result?.tech_operations == 3 ? (
                          <>
                            <div className="text-center">
                              <p className="text-[20px]">
                                <strong>
                                  {data?.payload?.tech_lang_keys["ans"]}
                                </strong>
                              </p>
                              <div className="flex justify-center">
                                <p className="text-[25px] bg-[#2845F5] text-white rounded-lg px-3 py-2  my-3">
                                  <strong className="text-blue">
                                    <InlineMath
                                      math={`${formData?.tech_first ?? ""} ${
                                        formData?.tech_second
                                      }/${formData?.tech_third} = ${
                                        result
                                          ? (
                                              result.tech_btm / result.tech_upr
                                            ).toFixed(4)
                                          : ""
                                      }`}
                                    />
                                  </strong>
                                </p>
                              </div>
                            </div>

                            <p className="mb-2 text-[18px]">
                              <strong>
                                {data?.payload?.tech_lang_keys["ex"]}:
                              </strong>
                            </p>

                            <p className="text-[18px]">
                              {data?.payload?.tech_lang_keys["input"]} :{" "}
                              <InlineMath
                                math={`${formData?.tech_first ?? ""} ${
                                  formData?.tech_second
                                }/${formData?.tech_third}`}
                              />
                            </p>

                            <p className="text-[18px] mt-2">
                              {data?.payload?.tech_lang_keys["step"]} # 1{" "}
                              <InlineMath
                                math={`\\frac{${result?.tech_totalN}}{${result?.tech_totalD}}`}
                              />
                            </p>

                            <p className="text-[18px] mt-2">
                              {data?.payload?.tech_lang_keys["step"]} # 2{" "}
                              <InlineMath
                                math={`\\frac{${result?.tech_totalN} \\div ${result?.tech_g}}{${result?.tech_totalD} \\div ${result?.tech_g}}`}
                              />
                            </p>

                            {result?.tech_btm === "1" ? (
                              <>
                                <p className="text-[18px] mt-2">
                                  {data?.payload?.tech_lang_keys["step"]} # 3{" "}
                                  <InlineMath math={`${uprFormatted}`} />
                                </p>
                                <table className="w-full">
                                  <tbody>
                                    <tr className="mt-2">
                                      <td>
                                        <span>
                                          {
                                            data?.payload?.tech_lang_keys[
                                              "step"
                                            ]
                                          }{" "}
                                          # 4{" "}
                                        </span>
                                        <InlineMath
                                          math={`\\frac{${uprFormatted}}{${result?.tech_btm}}`}
                                        />
                                        <span className="r-cross text-gray">
                                          &nbsp;&nbsp; ⤭ &nbsp;&nbsp;
                                        </span>
                                        <InlineMath
                                          math={`\\frac{${result?.tech_btm}}{${uprFormatted}}`}
                                        />
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>
                                        <span>
                                          {
                                            data?.payload?.tech_lang_keys[
                                              "step"
                                            ]
                                          }{" "}
                                          # 5{" "}
                                        </span>
                                        <InlineMath
                                          math={`${(
                                            result.tech_btm / result.tech_upr
                                          ).toFixed(4)}`}
                                        />
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </>
                            ) : (
                              <>
                                <p className="text-[18px] mt-2">
                                  {data?.payload?.tech_lang_keys["step"]} # 3{" "}
                                  <InlineMath
                                    math={`\\frac{${result?.tech_upr}}{${result?.tech_btm}}`}
                                  />
                                </p>
                                <table className="w-full">
                                  <tbody>
                                    <tr className="mt-2">
                                      <td>
                                        <span>
                                          {
                                            data?.payload?.tech_lang_keys[
                                              "step"
                                            ]
                                          }{" "}
                                          # 4{" "}
                                        </span>
                                        <InlineMath
                                          math={`\\frac{${result?.tech_upr}}{${result?.tech_btm}}`}
                                        />
                                        <span className="r-cross text-gray">
                                          &nbsp;&nbsp; ⤭ &nbsp;&nbsp;
                                        </span>
                                        <InlineMath
                                          math={`\\frac{${result?.tech_btm}}{${result?.tech_upr}}`}
                                        />
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>
                                        <span>
                                          {
                                            data?.payload?.tech_lang_keys[
                                              "step"
                                            ]
                                          }{" "}
                                          # 5{" "}
                                        </span>
                                        <InlineMath
                                          math={`${(
                                            result.tech_btm / result.tech_upr
                                          ).toFixed(4)}`}
                                        />
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </>
                            )}
                          </>
                        ) : null}
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

export default ReciprocalCalculator;

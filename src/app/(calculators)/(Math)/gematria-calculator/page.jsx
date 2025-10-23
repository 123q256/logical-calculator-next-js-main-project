"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useGematriaCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const GematriaCalculator = () => {
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
    tech_input: "HELLO",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useGematriaCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_input) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_input: formData.tech_input,
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
      tech_input: "HELLO",
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

  const innerAnsRo = result?.tech_inner_ans_ro || [];

  const innerAlpha = result?.tech_inner_alpha || [];
  const innerAnsJG = result?.tech_inner_ans_jg || [];
  const answerJG = result?.tech_answer_jg;
  const techInput = result?.tech_input;

  const innerAnsEG = result?.tech_inner_ans_eg || [];
  const answerEG = result?.tech_answer_eg;
  const input = result?.tech_input;

  const techAnswer = result?.tech_answer_eo;
  // const techInput = result?.tech_input;
  // const innerAlpha = result?.tech_inner_alpha || [];
  const innerAns = result?.tech_inner_ans_eo || [];

  const absValue = Math.abs(techAnswer);
  const of_octal = parseInt(absValue, 10).toString(8);
  const of_duo = parseInt(absValue, 10).toString(12);
  const of_hex = parseInt(absValue, 10).toString(16);
  const in_octal = parseInt(absValue, 10).toString(8);
  const in_hex = parseInt(absValue, 10).toString(16);
  const in_duo = parseInt(absValue, 10).toString(12);

  const [showSteps, setShowSteps] = useState(false);
  const [showSteps1, setShowSteps1] = useState(false);
  const [showSteps2, setShowSteps2] = useState(false);

  const toggleSteps = () => {
    setShowSteps((prev) => !prev);
  };
  const toggleSteps1 = () => {
    setShowSteps1((prev) => !prev);
  };
  const toggleSteps2 = () => {
    setShowSteps2((prev) => !prev);
  };

  const [showReduction, setShowReduction] = useState(false);
  const [showReverse, setShowReverse] = useState(false);
  const [showReverse1, setShowReverse1] = useState(false);

  const innerAnsFr = result?.tech_inner_ans_fr || [];

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
              <div className="col-span-12 two mt-1">
                <label htmlFor="tech_input" className="text-[14px]">
                  {data?.payload?.tech_lang_keys["1"]} e.g:
                  <span className="ps-1 text-decoration-underline link cursor-pointer text-blue">
                    Heaven
                  </span>
                  ,
                  <span className="text-decoration-underline link cursor-pointer text-blue">
                    Beast
                  </span>
                  ,
                  <span className="text-decoration-underline link cursor-pointer text-blue">
                    Earth
                  </span>
                </label>
                <div className="w-full py-2">
                  <input
                    type="text"
                    step="any"
                    name="tech_input"
                    id="tech_input"
                    className="input my-2"
                    aria-label="input"
                    value={formData.tech_input}
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

                  <div className="rounded-lg  flex items-center justify-center">
                    <div className="w-full bg-light-blue result p-3 radius-10 mt-3">
                      <div className="row">
                        <div className="w-full" id="res_step1">
                          <div className="row">
                            {/* {{-- harbw --}} */}

                            <p
                              className="w-full mt-2 text-[18px] cursor-pointer mb-3 lg:mb-0"
                              id="first_time5"
                              onClick={toggleSteps}
                            >
                              <strong className="flex items-center text-blue underline hover:opacity-80">
                                {data?.payload?.tech_lang_keys[9]}
                                <img
                                  src="/images/keyboard.png"
                                  width="30"
                                  height="30"
                                  alt="More info"
                                  className="ps-1"
                                />
                              </strong>
                            </p>

                            <p className="w-full text-center">
                              &quot;{techInput}&quot; ={" "}
                              <strong>{answerJG}</strong>
                            </p>

                            <div className="lg:w-7/12 mx-auto mt-2 overflow-auto">
                              <table className="w-full border-collapse bordered Gematria_Calculator">
                                <tbody>
                                  <tr className="bg-white">
                                    {innerAlpha.map((row, index) => (
                                      <>
                                        {row.map((value, i) => (
                                          <td
                                            key={`alpha-${index}-${i}`}
                                            className="bordered p-2 text-center"
                                          >
                                            {value}
                                          </td>
                                        ))}
                                        <td
                                          rowSpan="2"
                                          className="bordered p-2 text-center font-bold"
                                        >
                                          {answerJG}
                                        </td>
                                      </>
                                    ))}
                                    {innerAlpha.length > 1 && (
                                      <td
                                        rowSpan="2"
                                        className="bordered p-2 text-center font-bold"
                                      >
                                        {answerJG}
                                      </td>
                                    )}
                                  </tr>

                                  <tr className="bg-white">
                                    {innerAnsJG.map((row, index) =>
                                      row.map((value, i) => (
                                        <td
                                          key={`ans-${index}-${i}`}
                                          className="bordered p-2 text-center"
                                        >
                                          {value}
                                        </td>
                                      ))
                                    )}
                                  </tr>
                                </tbody>
                              </table>
                            </div>

                            {/* Hidden Step Table */}
                            {/* Conditionally Rendered Table */}
                            {showSteps && (
                              <>
                                <div className="w-full" id="res_step5">
                                  <div className="w-full mt-3 overflow-auto">
                                    <table className="w-full border-collapse bordered Gematria_Calculator">
                                      <thead>
                                        <tr className="bg-gray-200">
                                          <td
                                            colSpan="13"
                                            className="bordered p-2 text-center text-[18px] font-bold text-blue"
                                          >
                                            {data?.payload?.tech_lang_keys[7]}
                                          </td>
                                        </tr>
                                        <tr className="bg-white">
                                          {"abcdefghijklm"
                                            .split("")
                                            .map((char, index) => (
                                              <td
                                                key={`head1-${index}`}
                                                className="bordered p-2 text-center"
                                              >
                                                {char}
                                              </td>
                                            ))}
                                        </tr>
                                        <tr className="bg-white">
                                          {[
                                            1, 2, 3, 4, 5, 6, 7, 8, 9, 600, 10,
                                            20, 30,
                                          ].map((num, index) => (
                                            <td
                                              key={`head2-${index}`}
                                              className="bordered p-2 text-center"
                                            >
                                              {num}
                                            </td>
                                          ))}
                                        </tr>
                                      </thead>
                                      <tbody>
                                        <tr className="bg-white">
                                          {"nopqrstuvwxyz"
                                            .split("")
                                            .map((char, index) => (
                                              <td
                                                key={`head3-${index}`}
                                                className="bordered p-2 text-center"
                                              >
                                                {char}
                                              </td>
                                            ))}
                                        </tr>
                                        <tr className="bg-white">
                                          {[
                                            40, 50, 60, 70, 80, 90, 100, 200,
                                            700, 900, 300, 400, 500,
                                          ].map((num, index) => (
                                            <td
                                              key={`head4-${index}`}
                                              className="bordered p-2 text-center"
                                            >
                                              {num}
                                            </td>
                                          ))}
                                        </tr>
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                              </>
                            )}

                            {/* Clickable Paragraph to Toggle */}
                            <p
                              className="w-full mt-3 text-[18px] cursor-pointer mb-3 lg:mb-0"
                              id="first_time6"
                              onClick={toggleSteps1}
                            >
                              <strong className="flex items-center text-blue underline hover:opacity-80">
                                {data?.payload?.tech_lang_keys[8]}
                                <img
                                  src="/images/keyboard.png"
                                  width="30"
                                  height="30"
                                  alt="More info"
                                  className="ps-1"
                                />
                              </strong>
                            </p>

                            {/* Input & Answer */}
                            <p className="w-full text-center">
                              &quot;{input}&quot; = <strong>{answerEG}</strong>
                            </p>

                            {/* Matrix Table */}
                            <div className="lg:w-7/12 mx-auto mt-2 overflow-auto">
                              <table className="w-full border-collapse bordered Gematria_Calculator">
                                <tbody>
                                  <tr className="bg-white">
                                    {innerAlpha.map((row, rowIndex) => (
                                      <React.Fragment key={`row-${rowIndex}`}>
                                        {row.map((val, colIndex) => (
                                          <td
                                            key={`cell-${rowIndex}-${colIndex}`}
                                            className="bordered p-2 text-center"
                                          >
                                            {val}
                                          </td>
                                        ))}
                                        <td
                                          rowSpan="2"
                                          className="bordered p-2 text-center font-bold"
                                        >
                                          {answerEG}
                                        </td>
                                      </React.Fragment>
                                    ))}
                                    {innerAlpha.length > 1 && (
                                      <td
                                        rowSpan="2"
                                        className="bordered p-2 text-center font-bold"
                                      >
                                        {answerEG}
                                      </td>
                                    )}
                                  </tr>
                                  <tr className="bg-white">
                                    {innerAnsEG.map((row, rowIndex) =>
                                      row.map((val, colIndex) => (
                                        <td
                                          key={`ans-${rowIndex}-${colIndex}`}
                                          className="bordered p-2 text-center"
                                        >
                                          {val}
                                        </td>
                                      ))
                                    )}
                                  </tr>
                                </tbody>
                              </table>
                            </div>

                            {/* Toggleable Step Table */}
                            {showSteps1 && (
                              <div className="w-full" id="res_step6">
                                <div className="w-full mt-3 overflow-auto">
                                  <table className="w-full border-collapse bordered Gematria_Calculator">
                                    <thead>
                                      <tr className="bg-gray-200">
                                        <td
                                          colSpan="13"
                                          className="bordered p-2 text-center text-[18px] font-bold text-blue"
                                        >
                                          {data?.payload?.tech_lang_keys[8]}
                                        </td>
                                      </tr>
                                      <tr className="bg-white">
                                        {"abcdefghijklm"
                                          .split("")
                                          .map((char, index) => (
                                            <td
                                              key={`header1-${index}`}
                                              className="bordered p-2 text-center"
                                            >
                                              {char}
                                            </td>
                                          ))}
                                      </tr>
                                      <tr className="bg-white">
                                        {[
                                          6, 12, 18, 24, 30, 36, 42, 48, 54, 60,
                                          66, 72, 78,
                                        ].map((val, index) => (
                                          <td
                                            key={`header2-${index}`}
                                            className="bordered p-2 text-center"
                                          >
                                            {val}
                                          </td>
                                        ))}
                                      </tr>
                                    </thead>
                                    <tbody>
                                      <tr className="bg-white">
                                        {"nopqrstuvwxyz"
                                          .split("")
                                          .map((char, index) => (
                                            <td
                                              key={`row3-${index}`}
                                              className="bordered p-2 text-center"
                                            >
                                              {char}
                                            </td>
                                          ))}
                                      </tr>
                                      <tr className="bg-white">
                                        {[
                                          84, 90, 96, 102, 108, 114, 120, 126,
                                          132, 138, 144, 150, 156,
                                        ].map((val, index) => (
                                          <td
                                            key={`row4-${index}`}
                                            className="bordered p-2 text-center"
                                          >
                                            {val}
                                          </td>
                                        ))}
                                      </tr>
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            )}

                            {/* Toggle Header */}
                            <p
                              className="w-full mt-3 text-[18px] cursor-pointer mb-3"
                              id="first_time8"
                              onClick={toggleSteps2}
                            >
                              <strong className="flex items-center text-blue underline hover:opacity-80">
                                {data?.payload?.tech_lang_keys[3]}
                                <img
                                  src="/images/keyboard.png"
                                  width="30"
                                  height="30"
                                  alt="More info"
                                  className="ps-1"
                                />
                              </strong>
                            </p>

                            {/* Simple Answer */}
                            <p className="w-full text-center">
                              "{techInput}" = <strong>{techAnswer}</strong>
                            </p>

                            {/* First Table */}
                            <div className="lg:w-7/12 mx-auto mt-2 overflow-auto">
                              <table className="w-full border-collapse bordered Gematria_Calculator">
                                <tbody>
                                  <tr className="bg-white">
                                    {innerAlpha.map((row, rowIndex) => (
                                      <React.Fragment key={`row-${rowIndex}`}>
                                        {row.map((val, colIndex) => (
                                          <td
                                            key={`cell-${rowIndex}-${colIndex}`}
                                            className="bordered p-2 text-center"
                                          >
                                            {val}
                                          </td>
                                        ))}
                                        <td
                                          rowSpan="2"
                                          className="bordered p-2 text-center font-bold"
                                        >
                                          {techAnswer}
                                        </td>
                                      </React.Fragment>
                                    ))}
                                  </tr>
                                  <tr className="bg-white">
                                    {innerAns.map((row, rowIndex) =>
                                      row.map((val, colIndex) => (
                                        <td
                                          key={`ans-${rowIndex}-${colIndex}`}
                                          className="bordered p-2 text-center"
                                        >
                                          {val}
                                        </td>
                                      ))
                                    )}
                                  </tr>
                                </tbody>
                              </table>
                            </div>

                            {/* Conversion + Additional Info */}
                            {showSteps2 && (
                              <div id="res_step8">
                                {/* Base Conversion Table */}
                                <div className="w-full mt-3 overflow-auto">
                                  <table className="w-full border-collapse bordered Gematria_Calculator">
                                    <thead>
                                      <tr className="bg-gray-200">
                                        <td
                                          className="bordered p-2 text-center text-blue"
                                          colSpan="2"
                                        >
                                          <strong>
                                            {data?.payload?.tech_lang_keys[10]}{" "}
                                            {techAnswer}
                                          </strong>
                                        </td>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {[11, 12, 13, 14, 15, 16].map(
                                        (key, idx) => (
                                          <tr key={key} className="bg-white">
                                            <td className="bordered p-2 text-center text-blue">
                                              {
                                                data?.payload?.tech_lang_keys[
                                                  key
                                                ]
                                              }
                                            </td>
                                            <td className="bordered p-2 text-center">
                                              {
                                                [
                                                  of_octal,
                                                  of_duo,
                                                  of_hex,
                                                  in_octal,
                                                  in_duo,
                                                  in_hex,
                                                ][idx]
                                              }
                                            </td>
                                          </tr>
                                        )
                                      )}
                                    </tbody>
                                  </table>
                                </div>

                                {/* Placeholder for Additional Tables if Needed */}
                                {/* You can add additional tables from original code here */}
                              </div>
                            )}

                            {/* Toggle Button */}
                            <p
                              className="w-full mt-3 text-[18px] cursor-pointer mb-3"
                              onClick={() => setShowReduction(!showReduction)}
                            >
                              <strong className="flex items-center text-blue underline hover:opacity-80">
                                {data?.payload?.tech_lang_keys[4]}
                                <img
                                  src="/images/keyboard.png"
                                  width="30"
                                  height="30"
                                  alt="More info"
                                  className="ps-1"
                                />
                              </strong>
                            </p>

                            {/* Input and Answer */}
                            <p className="w-full text-center">
                              "{result?.tech_input}" ={" "}
                              <strong>{result?.tech_answer_fr}</strong>
                            </p>

                            {/* Inner Table */}
                            <div className="col-lg-7 mt-2 mx-auto overflow-auto">
                              <table className="w-full border-collapse bordered Gematria_Calculator">
                                <tbody>
                                  <tr className="bg-white">
                                    {innerAlpha.map((group, i) => (
                                      <React.Fragment key={i}>
                                        {group.map((value, j) => (
                                          <td
                                            key={`alpha-${i}-${j}`}
                                            className="bordered p-2 text-center"
                                          >
                                            {value}
                                          </td>
                                        ))}
                                        <td
                                          rowSpan="2"
                                          className="bordered p-2 text-center font-bold"
                                        >
                                          {result?.tech_answer_fr}
                                        </td>
                                      </React.Fragment>
                                    ))}
                                    {innerAlpha.length > 1 && (
                                      <td
                                        rowSpan="2"
                                        className="bordered p-2 text-center font-bold"
                                      >
                                        {result?.tech_answer_fr}
                                      </td>
                                    )}
                                  </tr>
                                  <tr className="bg-white">
                                    {innerAnsFr.map((group, i) =>
                                      group.map((value, j) => (
                                        <td
                                          key={`ans-${i}-${j}`}
                                          className="border p-2 text-center"
                                        >
                                          {value}
                                        </td>
                                      ))
                                    )}
                                  </tr>
                                </tbody>
                              </table>
                            </div>

                            {/* Toggle Table */}
                            {showReduction && (
                              <div
                                className="w-full mt-3 overflow-auto"
                                id="res_step2"
                              >
                                <table className="w-full border-collapse bordered Gematria_Calculator">
                                  <thead>
                                    <tr className="bg-gray-200">
                                      <td
                                        colSpan="13"
                                        className="bordered p-2 text-center text-blue text-[18px] font-bold"
                                      >
                                        {data?.payload?.tech_lang_keys[4]}
                                      </td>
                                    </tr>
                                    <tr className="bg-white">
                                      {"abcdefghijklm"
                                        .split("")
                                        .map((char, index) => (
                                          <td
                                            key={`r-head1-${index}`}
                                            className="bordered p-2 text-center"
                                          >
                                            {char}
                                          </td>
                                        ))}
                                    </tr>
                                    <tr className="bg-white">
                                      {[
                                        1, 2, 3, 4, 5, 6, 7, 8, 9, 1, 2, 3, 4,
                                      ].map((num, index) => (
                                        <td
                                          key={`r-head2-${index}`}
                                          className="bordered p-2 text-center"
                                        >
                                          {num}
                                        </td>
                                      ))}
                                    </tr>
                                    <tr className="bg-white">
                                      {"nopqrstuvwxyz"
                                        .split("")
                                        .map((char, index) => (
                                          <td
                                            key={`r-head3-${index}`}
                                            className="bordered p-2 text-center"
                                          >
                                            {char}
                                          </td>
                                        ))}
                                    </tr>
                                    <tr className="bg-white">
                                      {[
                                        5, 6, 7, 8, 9, 1, 2, 3, 4, 5, 6, 7, 8,
                                      ].map((num, index) => (
                                        <td
                                          key={`r-head4-${index}`}
                                          className="bordered p-2 text-center"
                                        >
                                          {num}
                                        </td>
                                      ))}
                                    </tr>
                                  </thead>
                                </table>
                              </div>
                            )}

                            {/** Reverse */}
                            <p
                              className="w-full mt-3 text-[18px] cursor-pointer mb-3"
                              id="first_time3"
                              onClick={() => setShowReverse(!showReverse)}
                            >
                              <strong className="flex items-center text-blue underline">
                                {data?.payload?.tech_lang_keys[5]}
                                <img
                                  src="/images/keyboard.png"
                                  width="30"
                                  height="30"
                                  alt="More info"
                                  className="ps-1"
                                />
                              </strong>
                            </p>

                            <p className="w-full text-center">
                              &quot;{result?.tech_input}&quot; ={" "}
                              <strong>{result?.tech_answer_ro}</strong>
                            </p>

                            {/* Table with results */}
                            <div className="col-lg-7 mx-auto mt-2 overflow-auto">
                              <table className="w-full border-collapse bordered Gematria_Calculator">
                                <tbody>
                                  <tr className="bg-white">
                                    {result?.tech_inner_alpha?.map(
                                      (row, index) => (
                                        <React.Fragment key={index}>
                                          {row.map((value, i) => (
                                            <td
                                              key={i}
                                              className="bordered p-2 text-center"
                                            >
                                              {value}
                                            </td>
                                          ))}
                                          <td
                                            rowSpan="2"
                                            className="bordered p-2 text-center font-bold"
                                          >
                                            {result?.tech_answer_ro}
                                          </td>
                                        </React.Fragment>
                                      )
                                    )}
                                    {result?.tech_inner_alpha?.length > 1 && (
                                      <td
                                        rowSpan="2"
                                        className="bordered p-2 text-center font-bold"
                                      >
                                        {result?.tech_answer_ro}
                                      </td>
                                    )}
                                  </tr>
                                  <tr className="bg-white">
                                    {result?.tech_inner_ans_ro?.map(
                                      (row, index) =>
                                        row.map((value, i) => (
                                          <td
                                            key={`${index}-${i}`}
                                            className="bordered p-2 text-center"
                                          >
                                            {value}
                                          </td>
                                        ))
                                    )}
                                  </tr>
                                </tbody>
                              </table>
                            </div>

                            {/* Reverse Step Table */}
                            {showReverse && (
                              <div className="w-full mt-3 " id="res_step3">
                                <div className="w-full mt-3 overflow-auto">
                                  <table className="w-full border-collapse bordered Gematria_Calculator">
                                    <thead>
                                      <tr className="bg-gray-200">
                                        <td
                                          colSpan="13"
                                          className="bordered p-2 text-center text-[18px] font-bold text-blue"
                                        >
                                          {data?.payload?.tech_lang_keys[5]}
                                        </td>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      <tr className="bg-white">
                                        {"abcdefghijklm"
                                          .split("")
                                          .map((char, index) => (
                                            <td
                                              key={index}
                                              className="bordered p-2 text-center"
                                            >
                                              {char}
                                            </td>
                                          ))}
                                      </tr>
                                      <tr className="bg-white">
                                        {[...Array(13).keys()].map((_, i) => (
                                          <td
                                            key={i}
                                            className="bordered p-2 text-center"
                                          >
                                            {26 - i}
                                          </td>
                                        ))}
                                      </tr>
                                      <tr className="bg-white">
                                        {"nopqrstuvwxyz"
                                          .split("")
                                          .map((char, index) => (
                                            <td
                                              key={index}
                                              className="bordered p-2 text-center"
                                            >
                                              {char}
                                            </td>
                                          ))}
                                      </tr>
                                      <tr className="bg-white">
                                        {[...Array(13).keys()].map((_, i) => (
                                          <td
                                            key={i}
                                            className="bordered p-2 text-center"
                                          >
                                            {13 - i}
                                          </td>
                                        ))}
                                      </tr>
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            )}

                            {/* Reverse Reduction */}
                            <p
                              className="w-full mt-3 text-[18px] cursor-pointer mb-3"
                              id="first_time4"
                              onClick={() => setShowReverse1(!showReverse1)}
                            >
                              <strong className="flex items-center text-blue underline">
                                {data?.payload?.tech_lang_keys[6]}
                                <img
                                  src="/images/keyboard.png"
                                  width="30"
                                  height="30"
                                  alt="More info"
                                  className="ps-1"
                                />
                              </strong>
                            </p>

                            <p className="w-full text-center">
                              &quot;{result?.tech_input}&quot; ={" "}
                              <strong>{result?.tech_answer_rfd}</strong>
                            </p>

                            {/* Table Display */}
                            <div className="w-full md:w-[80%] lg:w-[80%] mx-auto mt-2 overflow-auto">
                              <table className="w-full border-collapse bordered Gematria_Calculator">
                                <tbody>
                                  <tr className="bg-white">
                                    {result?.tech_inner_alpha?.map(
                                      (row, rowIndex) => (
                                        <React.Fragment key={rowIndex}>
                                          {row.map((value, i) => (
                                            <td
                                              key={i}
                                              className="bordered p-2 text-center"
                                            >
                                              {value}
                                            </td>
                                          ))}
                                          <td
                                            rowSpan="2"
                                            className="bordered p-2 text-center font-bold"
                                          >
                                            {result?.tech_answer_rfd}
                                          </td>
                                        </React.Fragment>
                                      )
                                    )}
                                    {result?.tech_inner_alpha?.length > 1 && (
                                      <td
                                        rowSpan="2"
                                        className="bordered p-2 text-center font-bold"
                                      >
                                        {result?.tech_answer_rfd}
                                      </td>
                                    )}
                                  </tr>
                                  <tr className="bg-white">
                                    {result?.tech_inner_ans_rfd?.map(
                                      (row, rowIndex) =>
                                        row.map((value, i) => (
                                          <td
                                            key={`${rowIndex}-${i}`}
                                            className="bordered p-2 text-center"
                                          >
                                            {value}
                                          </td>
                                        ))
                                    )}
                                  </tr>
                                </tbody>
                              </table>
                            </div>

                            {/* Reverse Step Table */}
                            {showReverse1 && (
                              <div className="w-full mt-3 " id="res_step4">
                                <div className="w-full mt-3 overflow-auto">
                                  <table className="w-full border-collapse bordered Gematria_Calculator">
                                    <thead>
                                      <tr className="bg-gray-200">
                                        <td
                                          colSpan="13"
                                          className="bordered p-2 text-center text-[18px] font-bold text-blue"
                                        >
                                          {data?.payload?.tech_lang_keys[6]}
                                        </td>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {/* Row a-m */}
                                      <tr className="bg-white">
                                        {"abcdefghijklm"
                                          .split("")
                                          .map((char, i) => (
                                            <td
                                              key={i}
                                              className="bordered p-2 text-center"
                                            >
                                              {char}
                                            </td>
                                          ))}
                                      </tr>
                                      {/* Row values for a-m */}
                                      <tr className="bg-white">
                                        {[
                                          8, 7, 6, 5, 4, 3, 2, 1, 9, 8, 7, 6, 5,
                                        ].map((num, i) => (
                                          <td
                                            key={i}
                                            className="bordered p-2 text-center"
                                          >
                                            {num}
                                          </td>
                                        ))}
                                      </tr>
                                      {/* Row n-z */}
                                      <tr className="bg-white">
                                        {"nopqrstuvwxyz"
                                          .split("")
                                          .map((char, i) => (
                                            <td
                                              key={i}
                                              className="bordered p-2 text-center"
                                            >
                                              {char}
                                            </td>
                                          ))}
                                      </tr>
                                      {/* Row values for n-z */}
                                      <tr className="bg-white">
                                        {[
                                          4, 3, 2, 1, 9, 8, 7, 6, 5, 4, 3, 2, 1,
                                        ].map((num, i) => (
                                          <td
                                            key={i}
                                            className="bordered p-2 text-center"
                                          >
                                            {num}
                                          </td>
                                        ))}
                                      </tr>
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            )}
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

export default GematriaCalculator;

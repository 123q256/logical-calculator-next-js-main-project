"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useFinalGradeCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const GradeCalculator = () => {
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
    tech_selection: "1", // 1 2 3
    tech_type: "first", //first  second
    tech_grading_system: "2",
    tech_current_grade: "4",
    tech_final_exam_grade2: "4",
    tech_current_grade2: [4],
    tech_final_exam_weight2: [4],
    tech_current_letter: ["A+"],
    tech_pollard: [4],
    tech_target_letter: "A+",
    tech_target_grade2: "4",
    tech_total_weight2: "8",
    tech_final_exam_weight3: "4",
    tech_grading_system2: "2",
    tech_you_want: "4",
    tech_final_exam_grade1: "4",
    tech_grade_was: [4],
    tech_worth: [4],
    tech_current_grade3: "A+",
    tech_target_grade3: "A+",
    tech_current_grade4: "A",
    tech_target_grade4: "A",
    tech_current_grade5: "Band6",
    tech_target_grade5: "Band6",
    tech_current_grade6: "HD",
    tech_target_grade6: "HD",
    tech_current_grade7: "A1",
    tech_target_grade7: "A1",
    tech_current_grade8: "A+",
    tech_target_grade8: "A+",
    tech_current_grade9: "A*",
    tech_target_grade9: "A*",
    tech_final_exam_weight: "6",
    tech_c: ["A+"],
    tech_grade_was2: [4],
    tech_undertaker: "A+",
    tech_c2: ["A"],
    tech_grade_was3: [4],
    tech_undertaker2: "A",
    tech_c3: ["A+"],
    tech_grade_was4: [4],
    tech_undertaker3: "A+",
    tech_c4: ["A*"],
    tech_grade_was5: [4],
    tech_undertaker4: "A*",
    tech_c5: ["Band6"],
    tech_grade_was6: [4],
    tech_undertaker5: "Band6",
    tech_c6: ["HD"],
    tech_grade_was7: [4],
    tech_undertaker6: "HD",
    tech_c7: ["A1"],
    tech_grade_was8: [4],
    tech_undertaker7: "A1",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useFinalGradeCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_selection) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_selection: formData.tech_selection,
        tech_type: formData.tech_type,
        tech_grading_system: formData.tech_grading_system,
        tech_current_grade: formData.tech_current_grade,
        tech_final_exam_grade2: formData.tech_final_exam_grade2,
        tech_current_grade2: formData.tech_current_grade2,
        tech_final_exam_weight2: formData.tech_final_exam_weight2,
        tech_current_letter: formData.tech_current_letter,
        tech_pollard: formData.tech_pollard,
        tech_target_letter: formData.tech_target_letter,
        tech_target_grade2: formData.tech_target_grade2,
        tech_total_weight2: formData.tech_total_weight2,
        tech_final_exam_weight3: formData.tech_final_exam_weight3,
        tech_grading_system2: formData.tech_grading_system2,
        tech_you_want: formData.tech_you_want,
        tech_final_exam_grade1: formData.tech_final_exam_grade1,
        tech_grade_was: formData.tech_grade_was,
        tech_worth: formData.tech_worth,
        tech_current_grade3: formData.tech_current_grade3,
        tech_target_grade3: formData.tech_target_grade3,
        tech_target_grade4: formData.tech_target_grade4,
        tech_current_grade5: formData.tech_current_grade5,
        tech_target_grade5: formData.tech_target_grade5,
        tech_current_grade6: formData.tech_current_grade6,
        tech_target_grade6: formData.tech_target_grade6,
        tech_current_grade7: formData.tech_current_grade7,
        tech_target_grade7: formData.tech_target_grade7,
        tech_current_grade8: formData.tech_current_grade8,
        tech_target_grade8: formData.tech_target_grade8,
        tech_current_grade9: formData.tech_current_grade9,
        tech_target_grade9: formData.tech_target_grade9,
        tech_final_exam_weight: formData.tech_final_exam_weight,
        tech_c: formData.tech_c,
        tech_grade_was2: formData.tech_grade_was2,
        tech_undertaker: formData.tech_undertaker,
        tech_c2: formData.tech_c2,
        tech_grade_was3: formData.tech_grade_was3,
        tech_undertaker2: formData.tech_undertaker2,
        tech_c3: formData.tech_c3,
        tech_grade_was4: formData.tech_grade_was4,
        tech_undertaker3: formData.tech_undertaker3,
        tech_c4: formData.tech_c4,
        tech_grade_was5: formData.tech_grade_was5,
        tech_undertaker4: formData.tech_undertaker4,
        tech_c5: formData.tech_c5,
        tech_grade_was6: formData.tech_grade_was6,
        tech_undertaker5: formData.tech_undertaker5,
        tech_c6: formData.tech_c6,
        tech_grade_was7: formData.tech_grade_was7,
        tech_undertaker6: formData.tech_undertaker6,
        tech_c7: formData.tech_c7,
        tech_grade_was8: formData.tech_grade_was8,
        tech_undertaker7: formData.tech_undertaker7,
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
      tech_selection: "1", // 1 2 3
      tech_type: "first", //first  second
      tech_grading_system: "2",
      tech_current_grade: "4",
      tech_final_exam_grade2: "4",
      tech_current_grade2: [4],
      tech_final_exam_weight2: [4],
      tech_current_letter: ["A+"],
      tech_pollard: [4],
      tech_target_letter: "A+",
      tech_target_grade2: "4",
      tech_total_weight2: "8",
      tech_final_exam_weight3: "4",
      tech_grading_system2: "2",
      tech_you_want: "4",
      tech_final_exam_grade1: "4",
      tech_grade_was: [4],
      tech_worth: [4],
      tech_current_grade3: "A+",
      tech_target_grade3: "A+",
      tech_current_grade4: "A",
      tech_target_grade4: "A",
      tech_current_grade5: "Band6",
      tech_target_grade5: "Band6",
      tech_current_grade6: "HD",
      tech_target_grade6: "HD",
      tech_current_grade7: "A1",
      tech_target_grade7: "A1",
      tech_current_grade8: "A+",
      tech_target_grade8: "A+",
      tech_current_grade9: "A*",
      tech_target_grade9: "A*",
      tech_final_exam_weight: "6",
      tech_c: ["A+"],
      tech_grade_was2: [4],
      tech_undertaker: "A+",
      tech_c2: ["A"],
      tech_grade_was3: [4],
      tech_undertaker2: "A",
      tech_c3: ["A+"],
      tech_grade_was4: [4],
      tech_undertaker3: "A+",
      tech_c4: ["A*"],
      tech_grade_was5: [4],
      tech_undertaker4: "A*",
      tech_c5: ["Band6"],
      tech_grade_was6: [4],
      tech_undertaker5: "Band6",
      tech_c6: ["HD"],
      tech_grade_was7: [4],
      tech_undertaker6: "HD",
      tech_c7: ["A1"],
      tech_grade_was8: [4],
      tech_undertaker7: "A1",
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

          <div className="lg:w-[60%] md:w-[60%] w-full mx-auto ">
            <div className="grid grid-cols-12 mt-3   gap-2 md:gap-4 lg:gap-4">
              <div className="col-span-12 " id="bit">
                <label htmlFor="tech_selection" className="label">
                  {data?.payload?.tech_lang_keys["5"]}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    aria-label="select"
                    name="tech_selection"
                    id="tech_selection"
                    value={formData.tech_selection}
                    onChange={handleChange}
                  >
                    <option value="1">
                      {data?.payload?.tech_lang_keys["2"]}{" "}
                    </option>
                    <option value="2">
                      {data?.payload?.tech_lang_keys["3"]}{" "}
                    </option>
                    <option value="3">
                      {data?.payload?.tech_lang_keys["4"]} &{" "}
                      {data?.payload?.tech_lang_keys["5"]}{" "}
                    </option>
                  </select>
                </div>
              </div>
              {formData.tech_selection == "3" && (
                <>
                  <div className="col-span-12   tabs mt-2">
                    <div className="col-12 col-lg-9 mx-auto mt-2  w-full">
                      <input
                        type="hidden"
                        name="tech_type"
                        id="calculator_time"
                        value={formData.tech_type}
                      />
                      <div className="flex flex-wrap items-center bg-blue-100 border border-blue-500 text-center rounded-lg px-1">
                        {/* Date Cal Tab */}
                        <div className="lg:w-1/2 w-full px-2 py-1">
                          <div
                            className={`bg-white px-3 py-2 cursor-pointer rounded-md transition-colors duration-300 hover_tags hover:text-white pacetab  ${
                              formData.tech_type === "first" ? "tagsUnit" : ""
                            }`}
                            id="first"
                            onClick={() => {
                              setFormData({ ...formData, tech_type: "first" });
                              setResult(null);
                              setFormError(null);
                            }}
                          >
                            {data?.payload?.tech_lang_keys["7"]}
                          </div>
                        </div>
                        {/* Time Cal Tab */}
                        <div className="lg:w-1/2 w-full px-2 py-1">
                          <div
                            className={`bg-white px-3 py-2 cursor-pointer rounded-md transition-colors duration-300 hover_tags hover:text-white pacetab ${
                              formData.tech_type === "second" ? "tagsUnit" : ""
                            }`}
                            id="second"
                            onClick={() => {
                              setFormData({ ...formData, tech_type: "second" });
                              setResult(null);
                              setFormError(null);
                            }}
                          >
                            {data?.payload?.tech_lang_keys["8"]}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
              {formData.tech_selection == "1" && (
                <>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6 grading_system mt-2  ">
                    <label htmlFor="tech_grading_system" className="label">
                      {data?.payload?.tech_lang_keys["5"]}:
                    </label>
                    <div className="mt-2">
                      <select
                        className="input"
                        aria-label="select"
                        name="tech_grading_system"
                        id="tech_grading_system"
                        value={formData.tech_grading_system}
                        onChange={handleChange}
                      >
                        <option value="1">
                          {data?.payload?.tech_lang_keys["10"]}{" "}
                        </option>
                        <option value="2">
                          {data?.payload?.tech_lang_keys["7"]}{" "}
                        </option>
                        <option value="3">
                          USA ({data?.payload?.tech_lang_keys["11"]}){" "}
                        </option>
                        <option value="4">
                          USA ({data?.payload?.tech_lang_keys["12"]}){" "}
                        </option>
                        <option value="5">Canada </option>
                        <option value="6">GCSE </option>
                        <option value="7">
                          Australian ({data?.payload?.tech_lang_keys["13"]}){" "}
                        </option>
                        <option value="8">
                          Australian {data?.payload?.tech_lang_keys["14"]}{" "}
                        </option>
                        <option value="9">India (CCE) </option>
                      </select>
                    </div>
                    <div className="aggressive ">
                      <input
                        type="hidden"
                        step="any"
                        name="tech_current_grade"
                        id="tech_current_grade"
                        className="input my-2"
                        aria-label="input"
                        value={formData.tech_current_grade}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </>
              )}
              {/* final class grade */}
              {(formData.tech_selection == "1" ||
                (formData.tech_selection == "1" &&
                  formData.tech_grading_system == "1") ||
                (formData.tech_selection == "1" &&
                  formData.tech_grading_system == "2")) && (
                <>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6 current_grade  ">
                    <label htmlFor="tech_current_grade" className="label">
                      {data?.payload?.tech_lang_keys["2"]}:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_current_grade"
                        id="tech_current_grade"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_current_grade}
                        onChange={handleChange}
                      />
                      <span className="input_unit">%</span>
                    </div>
                  </div>
                </>
              )}
              {/* <div className="col-span-12 md:col-span-6 lg:col-span-6 final_exam_grade  ">
                    <label htmlFor="tech_final_exam_grade2" className="label">
                      {data?.payload?.tech_lang_keys["15"]}:
                        </label>
                        <div className=" relative">
                        <input
                          type="number"
                          step="any"
                          name="tech_final_exam_grade2"
                          id="tech_final_exam_grade2"
                          className="input my-2"
                          aria-label="input"
                  	       placeholder="00"
                          value={formData.tech_final_exam_grade2}
                          onChange={handleChange}
                        />
                        <span className="input_unit">%</span>
                    </div>
                </div> */}
              {/* loop 1 */}
              {/* <div className="col-span-12 md:col-span-6 lg:col-span-6 current_grade2  ">
                   <label htmlFor="tech_current_grade2" className="label">
                      {data?.payload?.tech_lang_keys["15"]}:
                        </label>
                        <div className=" relative">
                        <input
                          type="number"
                          step="any"
                          name="tech_current_grade2"
                          id="tech_current_grade2"
                          className="input my-2"
                          aria-label="input"
                  	       placeholder="00"
                          value={formData.tech_current_grade2[]}
                          onChange={handleChange}
                        />
                        <span className="input_unit">%</span>
                    </div>
                </div>
                <div className="col-span-12 md:col-span-6 lg:col-span-6 weight2  ">
                   <label htmlFor="tech_final_exam_weight2" className="label">
                      {data?.payload?.tech_lang_keys["16"]}:
                        </label>
                        <div className=" relative">
                        <input
                          type="number"
                          step="any"
                          name="tech_final_exam_weight2"
                          id="tech_final_exam_weight2"
                          className="input my-2"
                          aria-label="input"
                  	       placeholder="00"
                          value={formData.tech_final_exam_weight2[]}
                          onChange={handleChange}
                        />
                        <span className="input_unit">%</span>
                    </div>
                </div> */}

              {/* loop 2 */}
              {/* <div className="col-span-12 md:col-span-6 lg:col-span-6 cur_letter mt-2  ">
                     <label htmlFor="tech_current_letter" className="label">
                      {data?.payload?.tech_lang_keys["2"]} {data?.payload?.tech_lang_keys["8"]}
                    </label>
                    <div className="mt-2">
                      <select
                        className="input"
                        aria-label="select"
                        name="tech_current_letter"
                        id="tech_current_letter"
                        value={formData.tech_current_letter[]}
                        onChange={handleChange}
                      >
                        <option value="A+">A+</option>
                        <option value="A">A </option>
                        <option value="A-">A- </option>
                        <option value="B+">B+ </option>
                        <option value="B">B </option>
                        <option value="B-">B- </option>
                        <option value="C+">C+ </option>
                        <option value="C">C </option>
                        <option value="C-">C- </option>
                        <option value="D+">D+ </option>
                        <option value="D">D </option>
                        <option value="D-">D- </option>
                        <option value="F">F </option>
                      </select>
                    </div>
                </div>
                <div className="col-span-12 md:col-span-6 lg:col-span-6 pollard  ">
                  <label htmlFor="tech_pollard" className="label">
                      {data?.payload?.tech_lang_keys["16"]}:
                        </label>
                        <div className=" relative">
                        <input
                          type="number"
                          step="any"
                          name="tech_pollard"
                          id="tech_pollard"
                          className="input my-2"
                          aria-label="input"
                  	       placeholder="00"
                          value={formData.tech_pollard[]}
                          onChange={handleChange}
                        />
                        <span className="input_unit">%</span>
                    </div>
                </div> */}

              {/* <div className="col-span-12 md:col-span-6 lg:col-span-6 target_grade mt-2  ">
                   <label htmlFor="tech_target_letter" className="label">
                      {data?.payload?.tech_lang_keys["2"]} {data?.payload?.tech_lang_keys["8"]}
                    </label>
                    <div className="mt-2">
                      <select
                        className="input"
                        aria-label="select"
                        name="tech_target_letter"
                        id="tech_target_letter"
                        value={formData.tech_target_letter}
                        onChange={handleChange}
                      >
                        <option value="A+">A+</option>
                        <option value="A">A </option>
                        <option value="A-">A- </option>
                        <option value="B+">B+ </option>
                        <option value="B">B </option>
                        <option value="B-">B- </option>
                        <option value="C+">C+ </option>
                        <option value="C">C </option>
                        <option value="C-">C- </option>
                        <option value="D+">D+ </option>
                        <option value="D">D </option>
                        <option value="D-">D- </option>
                        <option value="F">F </option>
                      </select>
                    </div>
                 
                </div>
                <div className="col-span-12 md:col-span-6 lg:col-span-6 target_grade2  ">
                   <label htmlFor="tech_target_grade2" className="label">
                      {data?.payload?.tech_lang_keys["5"]}:
                        </label>
                        <div className=" relative">
                        <input
                          type="number"
                          step="any"
                          name="tech_target_grade2"
                          id="tech_target_grade2"
                          className="input my-2"
                          aria-label="input"
                  	       placeholder="00"
                          value={formData.tech_target_grade2}
                          onChange={handleChange}
                        />
                      <span className="input_unit">%</span>
                      </div>
                </div>
                <div className="col-span-12 md:col-span-6 lg:col-span-6 total_weights2  ">
                    <label htmlFor="tech_total_weight2" className="label">
                      {data?.payload?.tech_lang_keys["17"]}:
                        </label>
                        <div className=" relative">
                        <input
                          type="number"
                          step="any"
                          name="tech_total_weight2"
                          id="tech_total_weight2"
                          className="input my-2"
                          aria-label="input"
                  	       placeholder="00"
                          value={formData.tech_total_weight2}
                          onChange={handleChange}
                        />
                      <span className="input_unit">%</span>
                      </div>
                </div>
                <div className="col-span-12 md:col-span-6 lg:col-span-6 final_exam_weight2  ">
                   <label htmlFor="tech_final_exam_weight3" className="label">
                      {data?.payload?.tech_lang_keys["18"]}:
                        </label>
                        <div className=" relative">
                        <input
                          type="number"
                          step="any"
                          name="tech_final_exam_weight3"
                          id="tech_final_exam_weight3"
                          className="input my-2"
                          aria-label="input"
                  	       placeholder="00"
                          value={formData.tech_final_exam_weight3}
                          onChange={handleChange}
                        />
                      <span className="input_unit">%</span>
                      </div>
                </div>
                <div className="col-span-12 md:col-span-6 lg:col-span-6 grading_system2  ">
                   <label htmlFor="tech_grading_system2" className="label">
                      {data?.payload?.tech_lang_keys["19"]}:
                    </label>
                    <div className="mt-2">
                      <select
                        className="input"
                        aria-label="select"
                        name="tech_grading_system2"
                        id="tech_grading_system2"
                        value={formData.tech_grading_system2}
                        onChange={handleChange}
                      >
                        <option value="1">Numbers </option>
                        <option value="2">Percentage </option>
                        <option value="3">USA Standard </option>
                        <option value="4">USA (Advance Program) </option>
                        <option value="5">Canada </option>
                        <option value="6">GCSE </option>
                        <option value="7">Australian (Schools) </option>
                        <option value="8">Australian (University) </option>
                        <option value="9">India (CCE) </option>
                      </select>
                    </div>
                </div>
                <div className="col-span-12 md:col-span-6 lg:col-span-6 you_want  ">
                    <label htmlFor="tech_you_want" className="label">
                      {data?.payload?.tech_lang_keys["20"]}:
                        </label>
                        <div className=" relative">
                        <input
                          type="number"
                          step="any"
                          name="tech_you_want"
                          id="tech_you_want"
                          className="input my-2"
                          aria-label="input"
                  	      placeholder="00"
                          value={formData.tech_you_want}
                          onChange={handleChange}
                        />
                      <span className="input_unit">%</span>
                      </div>
                </div> */}

              {(formData.tech_selection == "1" ||
                (formData.tech_selection == "1" &&
                  formData.tech_grading_system == "1") ||
                (formData.tech_selection == "1" &&
                  formData.tech_grading_system == "2")) && (
                <>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6 grade_you_want  ">
                    <label htmlFor="tech_final_exam_grade1" className="label">
                      {data?.payload?.tech_lang_keys["21"]}:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_final_exam_grade1"
                        id="tech_final_exam_grade1"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_final_exam_grade1}
                        onChange={handleChange}
                      />
                      <span className="input_unit">%</span>
                    </div>
                  </div>
                </>
              )}
              {/* <div className="col-span-12 md:col-span-6 lg:col-span-6 your_grade_was  ">
                  <label htmlFor="tech_grade_was" className="label">
                      {data?.payload?.tech_lang_keys["22"]}:
                        </label>
                        <div className=" relative">
                        <input
                          type="number"
                          step="any"
                          name="tech_grade_was"
                          id="tech_grade_was"
                          className="input my-2"
                          aria-label="input"
                  	      placeholder="00"
                          value={formData.tech_grade_was[]}
                          onChange={handleChange}
                        />
                      <span className="input_unit">%</span>
                      </div>
                </div>
                <div className="col-span-12 md:col-span-6 lg:col-span-6 worth  ">
                   <label htmlFor="tech_worth" className="label">
                      {data?.payload?.tech_lang_keys["22"]}:
                        </label>
                        <div className=" relative">
                        <input
                          type="number"
                          step="any"
                          name="tech_worth"
                          id="tech_worth"
                          className="input my-2"
                          aria-label="input"
                  	      placeholder="00"
                          value={formData.tech_worth[]}
                          onChange={handleChange}
                        />
                      <span className="input_unit">%</span>
                      </div>
                </div> */}

              <div className="col-span-12 usa">
                <div className="grid grid-cols-12    gap-2 md:gap-4 lg:gap-4 ">
                  {/* final class grade */}
                  {(formData.tech_selection == "2" ||
                    (formData.tech_selection == "1" &&
                      formData.tech_grading_system == "3")) && (
                    <>
                      <div className="col-span-12 md:col-span-6 lg:col-span-6">
                        <label htmlFor="tech_current_grade3" className="label">
                          {data?.payload?.tech_lang_keys["2"]}
                        </label>
                        <div className="mt-2">
                          <select
                            className="input"
                            aria-label="select"
                            name="tech_current_grade3"
                            id="tech_current_grade3"
                            value={formData.tech_current_grade3}
                            onChange={handleChange}
                          >
                            <option value="A+">A+</option>
                            <option value="A">A </option>
                            <option value="A-">A- </option>
                            <option value="B+">B+ </option>
                            <option value="B">B </option>
                            <option value="B-">B- </option>
                            <option value="C+">C+ </option>
                            <option value="C">C </option>
                            <option value="C-">C- </option>
                            <option value="D+">D+ </option>
                            <option value="D">D </option>
                            <option value="D-">D- </option>
                            <option value="F">F </option>
                            <option
                              value={`${data?.payload?.tech_lang_keys["24"]} (0)`}
                            >
                              {data?.payload?.tech_lang_keys["24"]} (0){" "}
                            </option>
                          </select>
                        </div>
                      </div>
                    </>
                  )}

                  {formData.tech_selection == "1" &&
                    formData.tech_grading_system == "3" && (
                      <>
                        <div className="col-span-12 md:col-span-6 lg:col-span-6">
                          <label htmlFor="tech_target_grade3" className="label">
                            {data?.payload?.tech_lang_keys["5"]}
                          </label>
                          <div className="mt-2">
                            <select
                              className="input"
                              aria-label="select"
                              name="tech_target_grade3"
                              id="tech_target_grade3"
                              value={formData.tech_target_grade3}
                              onChange={handleChange}
                            >
                              <option value="A+">A+</option>
                              <option value="A">A </option>
                              <option value="A-">A- </option>
                              <option value="B+">B+ </option>
                              <option value="B">B </option>
                              <option value="B-">B- </option>
                              <option value="C+">C+ </option>
                              <option value="C">C </option>
                              <option value="C-">C- </option>
                              <option value="D+">D+ </option>
                              <option value="D">D </option>
                              <option value="D-">D- </option>
                              <option value="F">F </option>
                              <option
                                value={`${data?.payload?.tech_lang_keys["24"]} (0)`}
                              >
                                {data?.payload?.tech_lang_keys["24"]} (0){" "}
                              </option>
                            </select>
                          </div>
                        </div>
                      </>
                    )}
                </div>
              </div>
              <div className="col-span-12 advanced_usa">
                <div className="grid grid-cols-12    gap-2 md:gap-4 lg:gap-4 ">
                  {formData.tech_selection == "1" &&
                    formData.tech_grading_system == "4" && (
                      <>
                        <div className="col-span-12 md:col-span-6 lg:col-span-6">
                          <label
                            htmlFor="tech_current_grade4"
                            className="label"
                          >
                            {data?.payload?.tech_lang_keys["2"]}
                          </label>
                          <div className="mt-2">
                            <select
                              className="input"
                              aria-label="select"
                              name="tech_current_grade4"
                              id="tech_current_grade4"
                              value={formData.tech_current_grade4}
                              onChange={handleChange}
                            >
                              <option value="A">A </option>
                              <option value="B">B </option>
                              <option value="C">C </option>
                              <option value="D">D </option>
                              <option value="E/F">E/F </option>
                              <option
                                value={`${data?.payload?.tech_lang_keys["24"]} (0)`}
                              >
                                {data?.payload?.tech_lang_keys["24"]} (0){" "}
                              </option>
                            </select>
                          </div>
                        </div>
                      </>
                    )}
                  {formData.tech_selection == "1" &&
                    formData.tech_grading_system == "4" && (
                      <>
                        <div className="col-span-12 md:col-span-6 lg:col-span-6">
                          <label htmlFor="tech_target_grade4" className="label">
                            {data?.payload?.tech_lang_keys["5"]}
                          </label>
                          <div className="mt-2">
                            <select
                              className="input"
                              aria-label="select"
                              name="tech_target_grade4"
                              id="tech_target_grade4"
                              value={formData.tech_target_grade4}
                              onChange={handleChange}
                            >
                              <option value="A">A </option>
                              <option value="B">B </option>
                              <option value="C">C </option>
                              <option value="D">D </option>
                              <option value="E/F">E/F </option>
                              <option
                                value={`${data?.payload?.tech_lang_keys["24"]} (0)`}
                              >
                                {data?.payload?.tech_lang_keys["24"]} (0){" "}
                              </option>
                            </select>
                          </div>
                        </div>
                      </>
                    )}
                </div>
              </div>
              <div className="col-span-12 australian_schools">
                <div className="grid grid-cols-12    gap-2 md:gap-4 lg:gap-4 ">
                  {formData.tech_selection == "1" &&
                    formData.tech_grading_system == "7" && (
                      <>
                        <div className="col-span-12 md:col-span-6 lg:col-span-6">
                          <label
                            htmlFor="tech_current_grade5"
                            className="label"
                          >
                            {data?.payload?.tech_lang_keys["2"]}
                          </label>
                          <div className="mt-2">
                            <select
                              className="input"
                              aria-label="select"
                              name="tech_current_grade5"
                              id="tech_current_grade5"
                              value={formData.tech_current_grade5}
                              onChange={handleChange}
                            >
                              <option value="Band6">Band6 </option>
                              <option value="Band5">Band5 </option>
                              <option value="Band4">Band4 </option>
                              <option value="Band3">Band3 </option>
                              <option value="Band2">Band2 </option>
                              <option value="Band1">Band1 </option>
                              <option
                                value={`${data?.payload?.tech_lang_keys["24"]} (0)`}
                              >
                                {data?.payload?.tech_lang_keys["24"]} (0){" "}
                              </option>
                            </select>
                          </div>
                        </div>
                      </>
                    )}
                  {formData.tech_selection == "1" &&
                    formData.tech_grading_system == "7" && (
                      <>
                        <div className="col-span-12 md:col-span-6 lg:col-span-6">
                          <label htmlFor="tech_target_grade5" className="label">
                            {data?.payload?.tech_lang_keys["5"]}
                          </label>
                          <div className="mt-2">
                            <select
                              className="input"
                              aria-label="select"
                              name="tech_target_grade5"
                              id="tech_target_grade5"
                              value={formData.tech_target_grade5}
                              onChange={handleChange}
                            >
                              <option value="Band6">Band6 </option>
                              <option value="Band5">Band5 </option>
                              <option value="Band4">Band4 </option>
                              <option value="Band3">Band3 </option>
                              <option value="Band2">Band2 </option>
                              <option value="Band1">Band1 </option>
                              <option
                                value={`${data?.payload?.tech_lang_keys["24"]} (0)`}
                              >
                                {data?.payload?.tech_lang_keys["24"]} (0){" "}
                              </option>
                            </select>
                          </div>
                        </div>
                      </>
                    )}
                </div>
              </div>
              <div className="col-span-12 australian_university">
                <div className="grid grid-cols-12    gap-2 md:gap-4 lg:gap-4 ">
                  {formData.tech_selection == "1" &&
                    formData.tech_grading_system == "8" && (
                      <>
                        <div className="col-span-12 md:col-span-6 lg:col-span-6">
                          <label
                            htmlFor="tech_current_grade6"
                            className="label"
                          >
                            {data?.payload?.tech_lang_keys["2"]}
                          </label>
                          <div className="mt-2">
                            <select
                              className="input"
                              aria-label="select"
                              name="tech_current_grade6"
                              id="tech_current_grade6"
                              value={formData.tech_current_grade6}
                              onChange={handleChange}
                            >
                              <option value="HD">HD </option>
                              <option value="D">D </option>
                              <option value="Cr">Cr </option>
                              <option value="P">P </option>
                              <option value="F">F </option>
                              <option
                                value={`${data?.payload?.tech_lang_keys["24"]} (0)`}
                              >
                                {data?.payload?.tech_lang_keys["24"]} (0){" "}
                              </option>
                            </select>
                          </div>
                        </div>
                      </>
                    )}
                  {formData.tech_selection == "1" &&
                    formData.tech_grading_system == "8" && (
                      <>
                        <div className="col-span-12 md:col-span-6 lg:col-span-6">
                          <label htmlFor="tech_target_grade6" className="label">
                            {data?.payload?.tech_lang_keys["5"]}
                          </label>
                          <div className="mt-2">
                            <select
                              className="input"
                              aria-label="select"
                              name="tech_target_grade6"
                              id="tech_target_grade6"
                              value={formData.tech_target_grade6}
                              onChange={handleChange}
                            >
                              <option value="HD">HD </option>
                              <option value="D">D </option>
                              <option value="Cr">Cr </option>
                              <option value="P">P </option>
                              <option value="F">F </option>
                              <option
                                value={`${data?.payload?.tech_lang_keys["24"]} (0)`}
                              >
                                {data?.payload?.tech_lang_keys["24"]} (0){" "}
                              </option>
                            </select>
                          </div>
                        </div>
                      </>
                    )}
                </div>
              </div>
              <div className="col-span-12 india">
                <div className="grid grid-cols-12    gap-2 md:gap-4 lg:gap-4 ">
                  {formData.tech_selection == "1" &&
                    formData.tech_grading_system == "9" && (
                      <>
                        <div className="col-span-12 md:col-span-6 lg:col-span-6">
                          <label
                            htmlFor="tech_current_grade7"
                            className="label"
                          >
                            {data?.payload?.tech_lang_keys["2"]}
                          </label>
                          <div className="mt-2">
                            <select
                              className="input"
                              aria-label="select"
                              name="tech_current_grade7"
                              id="tech_current_grade7"
                              value={formData.tech_current_grade7}
                              onChange={handleChange}
                            >
                              <option value="A1">A1 </option>
                              <option value="A2">A2 </option>
                              <option value="B1">B1 </option>
                              <option value="B2">B2 </option>
                              <option value="C1">C1 </option>
                              <option value="C2">C2 </option>
                              <option value="D">D </option>
                              <option value="E1">E1 </option>
                              <option value="E2">E2 </option>
                              <option
                                value={`${data?.payload?.tech_lang_keys["24"]} (0)`}
                              >
                                {data?.payload?.tech_lang_keys["24"]} (0){" "}
                              </option>
                            </select>
                          </div>
                        </div>
                      </>
                    )}
                  {formData.tech_selection == "1" &&
                    formData.tech_grading_system == "9" && (
                      <>
                        <div className="col-span-12 md:col-span-6 lg:col-span-6">
                          <label htmlFor="tech_target_grade7" className="label">
                            {data?.payload?.tech_lang_keys["2"]}
                          </label>
                          <div className="mt-2">
                            <select
                              className="input"
                              aria-label="select"
                              name="tech_target_grade7"
                              id="tech_target_grade7"
                              value={formData.tech_target_grade7}
                              onChange={handleChange}
                            >
                              <option value="A1">A1 </option>
                              <option value="A2">A2 </option>
                              <option value="B1">B1 </option>
                              <option value="B2">B2 </option>
                              <option value="C1">C1 </option>
                              <option value="C2">C2 </option>
                              <option value="D">D </option>
                              <option value="E1">E1 </option>
                              <option value="E2">E2 </option>
                              <option
                                value={`${data?.payload?.tech_lang_keys["24"]} (0)`}
                              >
                                {data?.payload?.tech_lang_keys["24"]} (0){" "}
                              </option>
                            </select>
                          </div>
                        </div>
                      </>
                    )}
                </div>
              </div>
              <div className="col-span-12 canada">
                <div className="grid grid-cols-12 gap-2 md:gap-4 lg:gap-4 ">
                  {formData.tech_selection == "1" &&
                    formData.tech_grading_system == "5" && (
                      <>
                        <div className="col-span-12 md:col-span-6 lg:col-span-6">
                          <label
                            htmlFor="tech_current_grade8"
                            className="label"
                          >
                            {data?.payload?.tech_lang_keys["2"]}
                          </label>
                          <div className="mt-2">
                            <select
                              className="input"
                              aria-label="select"
                              name="tech_current_grade8"
                              id="tech_current_grade8"
                              value={formData.tech_current_grade8}
                              onChange={handleChange}
                            >
                              <option value="A+">A+ </option>
                              <option value="A">A </option>
                              <option value="A-">A- </option>
                              <option value="B+">B+ </option>
                              <option value="B">B </option>
                              <option value="B-">B- </option>
                              <option value="C+">C+ </option>
                              <option value="C">C </option>
                              <option value="C-">C- </option>
                              <option value="D+">D+ </option>
                              <option value="D">D </option>
                              <option value="D-">D- </option>
                              <option value="R">R </option>
                              <option
                                value={`${data?.payload?.tech_lang_keys["24"]} (0)`}
                              >
                                {data?.payload?.tech_lang_keys["24"]} (0){" "}
                              </option>
                            </select>
                          </div>
                        </div>
                      </>
                    )}

                  {formData.tech_selection == "1" &&
                    formData.tech_grading_system == "5" && (
                      <>
                        <div className="col-span-12 md:col-span-6 lg:col-span-6">
                          <label htmlFor="tech_target_grade8" className="label">
                            {data?.payload?.tech_lang_keys["5"]}
                          </label>
                          <div className="mt-2">
                            <select
                              className="input"
                              aria-label="select"
                              name="tech_target_grade8"
                              id="tech_target_grade8"
                              value={formData.tech_target_grade8}
                              onChange={handleChange}
                            >
                              <option value="A+">A+ </option>
                              <option value="A">A </option>
                              <option value="A-">A- </option>
                              <option value="B+">B+ </option>
                              <option value="B">B </option>
                              <option value="B-">B- </option>
                              <option value="C+">C+ </option>
                              <option value="C">C </option>
                              <option value="C-">C- </option>
                              <option value="D+">D+ </option>
                              <option value="D">D </option>
                              <option value="D-">D- </option>
                              <option value="R">R </option>
                              <option
                                value={`${data?.payload?.tech_lang_keys["24"]} (0)`}
                              >
                                {data?.payload?.tech_lang_keys["24"]} (0){" "}
                              </option>
                            </select>
                          </div>
                        </div>
                      </>
                    )}
                </div>
              </div>
              <div className="col-span-12 gcse">
                <div className="grid grid-cols-12  gap-2 md:gap-4 lg:gap-4 ">
                  {formData.tech_selection == "1" &&
                    formData.tech_grading_system == "6" && (
                      <>
                        <div className="col-span-12 md:col-span-6 lg:col-span-6">
                          <label
                            htmlFor="tech_current_grade9"
                            className="label"
                          >
                            {data?.payload?.tech_lang_keys["2"]}
                          </label>
                          <div className="mt-2">
                            <select
                              className="input"
                              aria-label="select"
                              name="tech_current_grade9"
                              id="tech_current_grade9"
                              value={formData.tech_current_grade9}
                              onChange={handleChange}
                            >
                              <option value="A*">A* </option>
                              <option value="A">A </option>
                              <option value="B">B </option>
                              <option value="C">C </option>
                              <option value="D">D </option>
                              <option value="E">E </option>
                              <option value="Fail">Fail </option>
                              <option
                                value={`${data?.payload?.tech_lang_keys["24"]} (0)`}
                              >
                                {data?.payload?.tech_lang_keys["24"]} (0){" "}
                              </option>
                            </select>
                          </div>
                        </div>
                      </>
                    )}
                  {formData.tech_selection == "1" &&
                    formData.tech_grading_system == "6" && (
                      <>
                        <div className="col-span-12 md:col-span-6 lg:col-span-6">
                          <label htmlFor="tech_target_grade9" className="label">
                            {data?.payload?.tech_lang_keys["5"]}
                          </label>
                          <div className="mt-2">
                            <select
                              className="input"
                              aria-label="select"
                              name="tech_target_grade9"
                              id="tech_target_grade9"
                              value={formData.tech_target_grade9}
                              onChange={handleChange}
                            >
                              <option value="A*">A* </option>
                              <option value="A">A </option>
                              <option value="B">B </option>
                              <option value="C">C </option>
                              <option value="D">D </option>
                              <option value="E">E </option>
                              <option value="Fail">Fail </option>
                              <option
                                value={`${data?.payload?.tech_lang_keys["24"]} (0)`}
                              >
                                {data?.payload?.tech_lang_keys["24"]} (0){" "}
                              </option>
                            </select>
                          </div>
                        </div>
                      </>
                    )}
                </div>
              </div>
              {/* final class grade */}
              {(formData.tech_selection == "1" ||
                (formData.tech_selection == "1" &&
                  formData.tech_grading_system == "1") ||
                (formData.tech_selection == "1" &&
                  formData.tech_grading_system == "2") ||
                (formData.tech_selection == "1" &&
                  formData.tech_grading_system == "3") ||
                (formData.tech_selection == "1" &&
                  formData.tech_grading_system == "4") ||
                (formData.tech_selection == "1" &&
                  formData.tech_grading_system == "5") ||
                (formData.tech_selection == "1" &&
                  formData.tech_grading_system == "6") ||
                (formData.tech_selection == "1" &&
                  formData.tech_grading_system == "7") ||
                (formData.tech_selection == "2" &&
                  formData.tech_grading_system == "8") ||
                (formData.tech_selection == "1" &&
                  formData.tech_grading_system == "9")) && (
                <>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6 final_exam_weight relative">
                    <label htmlFor="tech_final_exam_weight" className="label">
                      {data?.payload?.tech_lang_keys["18"]}:
                    </label>
                    <div className=" relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_final_exam_weight"
                        id="tech_final_exam_weight"
                        className="input my-2"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_final_exam_weight}
                        onChange={handleChange}
                      />
                      <span className="input_unit">%</span>
                    </div>
                  </div>
                </>
              )}
              <div className="col-span-12 usa_div">
                <div className="grid grid-cols-12    gap-2 md:gap-4 lg:gap-4 ">
                  {/* <div className="col-span-12 md:col-span-6 lg:col-span-6">
                         <label htmlFor="tech_c" className="label">
                      {data?.payload?.tech_lang_keys["22"]}
                    </label>
                      <div className="mt-2">
                      <select
                        className="input"
                        aria-label="select"
                        name="tech_c"
                        id="tech_c"
                        value={formData.tech_c[]}
                        onChange={handleChange}
                      >
                        <option value="A+">A+ </option>
                        <option value="A">A </option>
                        <option value="A-">A- </option>
                        <option value="B+">B+ </option>
                        <option value="B">B </option>
                        <option value="B-">B- </option>
                        <option value="C+">C+ </option>
                        <option value="C">C </option>
                        <option value="C-">C- </option>
                        <option value="D+">D+ </option>
                        <option value="D">D </option>
                        <option value="D-">D- </option>
                        <option value="F">F </option>
                       <option value={`${data?.payload?.tech_lang_keys["24"]} (0)`}>{data?.payload?.tech_lang_keys["24"]} (0) </option>
                      </select>
                    </div>
                    </div>
                    <div className="col-span-12 md:col-span-6 lg:col-span-6 relative">
                       <label htmlFor="tech_grade_was2" className="label">
                      {data?.payload?.tech_lang_keys["23"]}:
                        </label>
                        <div className=" relative">
                        <input
                          type="number"
                          step="any"
                          name="tech_grade_was2"
                          id="tech_grade_was2"
                          className="input my-2"
                          aria-label="input"
                  	        placeholder="00"
                          value={formData.tech_grade_was2[]}
                          onChange={handleChange}
                        />
                        <span className="input_unit">%</span>
                        </div>
                    </div> */}
                  {/* <div className="col-span-12 md:col-span-6 lg:col-span-6">
                          <label htmlFor="tech_undertaker" className="label">
                          {data?.payload?.tech_lang_keys["20"]}
                        </label>
                          <div className="mt-2">
                          <select
                            className="input"
                            aria-label="select"
                            name="tech_undertaker"
                            id="tech_undertaker"
                            value={formData.tech_undertaker}
                            onChange={handleChange}
                          >
                            <option value="A+">A+ </option>
                            <option value="A">A </option>
                            <option value="A-">A- </option>
                            <option value="B+">B+ </option>
                            <option value="B">B </option>
                            <option value="B-">B- </option>
                            <option value="C+">C+ </option>
                            <option value="C">C </option>
                            <option value="C-">C- </option>
                            <option value="D+">D+ </option>
                            <option value="D">D </option>
                            <option value="D-">D- </option>
                            <option value="F">F </option>
                          <option value={`${data?.payload?.tech_lang_keys["24"]} (0)`}>{data?.payload?.tech_lang_keys["24"]} (0) </option>
                          </select>
                        </div>
                    
                    </div> */}
                </div>
              </div>
              <div className="col-span-12 advanced_div">
                <div className="grid grid-cols-12    gap-2 md:gap-4 lg:gap-4 ">
                  {/* <div className="col-span-12 md:col-span-6 lg:col-span-6">
                        <label htmlFor="tech_c2" className="label">
                            {data?.payload?.tech_lang_keys["22"]}
                          </label>
                            <div className="mt-2">
                            <select
                              className="input"
                              aria-label="select"
                              name="tech_c2"
                              id="tech_c2"
                              value={formData.tech_c2[]}
                              onChange={handleChange}
                            >
                              <option value="A">A </option>
                              <option value="B">B </option>
                              <option value="C">C </option>
                              <option value="D">D </option>
                              <option value="E/F">E/F </option>
                            <option value={`${data?.payload?.tech_lang_keys["24"]} (0)`}>{data?.payload?.tech_lang_keys["24"]} (0) </option>
                            </select>
                          </div>
                    </div>
                    <div className="col-span-12 md:col-span-6 lg:col-span-6 relative">
                        <label htmlFor="tech_grade_was3" className="label">
                        {data?.payload?.tech_lang_keys["23"]}:
                          </label>
                          <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_grade_was3"
                            id="tech_grade_was3"
                            className="input my-2"
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_grade_was3[]}
                            onChange={handleChange}
                          />
                          <span className="input_unit">%</span>
                          </div>
                    </div> */}
                  {/* <div className="col-span-12 md:col-span-6 lg:col-span-6">
                      <label htmlFor="tech_undertaker2" className="label">
                            {data?.payload?.tech_lang_keys["20"]}
                          </label>
                            <div className="mt-2">
                            <select
                              className="input"
                              aria-label="select"
                              name="tech_undertaker2"
                              id="tech_undertaker2"
                              value={formData.tech_undertaker2}
                              onChange={handleChange}
                            >
                              <option value="A">A </option>
                              <option value="B">B </option>
                              <option value="C">C </option>
                              <option value="D">D </option>
                              <option value="E/F">E/F </option>
                            <option value={`${data?.payload?.tech_lang_keys["24"]} (0)`}>{data?.payload?.tech_lang_keys["24"]} (0) </option>
                            </select>
                          </div>
                    </div> */}
                </div>
              </div>
              <div className="col-span-12 canada_div">
                <div className="grid grid-cols-12    gap-2 md:gap-4 lg:gap-4 ">
                  {/* <div className="col-span-12 md:col-span-6 lg:col-span-6">
                        <label htmlFor="tech_c3[]" className="label">
                            {data?.payload?.tech_lang_keys["22"]}
                          </label>
                            <div className="mt-2">
                            <select
                              className="input"
                              aria-label="select"
                              name="tech_c3[]"
                              id="tech_c3[]"
                              value={formData.tech_c3[]}
                              onChange={handleChange}
                            >
                            <option value="A+">A+ </option>
                              <option value="A">A </option>
                              <option value="A-">A- </option>
                              <option value="B+">B+ </option>
                              <option value="B">B </option>
                              <option value="B-">B- </option>
                              <option value="C+">C+ </option>
                              <option value="C">C </option>
                              <option value="C-">C- </option>
                              <option value="D+">D+ </option>
                              <option value="D">D </option>
                              <option value="D-">D- </option>
                              <option value="R">R </option>
                            <option value={`${data?.payload?.tech_lang_keys["24"]} (0)`}>{data?.payload?.tech_lang_keys["24"]} (0) </option>
                            </select>
                          </div>
                    </div>
                    <div className="col-span-12 md:col-span-6 lg:col-span-6 relative">
                        <label htmlFor="tech_grade_was4" className="label">
                        {data?.payload?.tech_lang_keys["23"]}:
                          </label>
                          <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_grade_was4"
                            id="tech_grade_was4"
                            className="input my-2"
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_grade_was4[]}
                            onChange={handleChange}
                          />
                          <span className="input_unit">%</span>
                          </div>
                    </div> */}
                  {/* <div className="col-span-12 md:col-span-6 lg:col-span-6">

                      <label htmlFor="tech_undertaker3" className="label">
                            {data?.payload?.tech_lang_keys["20"]}
                          </label>
                            <div className="mt-2">
                            <select
                              className="input"
                              aria-label="select"
                              name="tech_undertaker3"
                              id="tech_undertaker3"
                              value={formData.tech_undertaker3}
                              onChange={handleChange}
                            >
                            <option value="A+">A+ </option>
                              <option value="A">A </option>
                              <option value="A-">A- </option>
                              <option value="B+">B+ </option>
                              <option value="B">B </option>
                              <option value="B-">B- </option>
                              <option value="C+">C+ </option>
                              <option value="C">C </option>
                              <option value="C-">C- </option>
                              <option value="D+">D+ </option>
                              <option value="D">D </option>
                              <option value="D-">D- </option>
                              <option value="R">R </option>
                            <option value={`${data?.payload?.tech_lang_keys["24"]} (0)`}>{data?.payload?.tech_lang_keys["24"]} (0) </option>
                            </select>
                          </div>
                    </div> */}
                </div>
              </div>
              <div className="col-span-12 gcse_div">
                <div className="grid grid-cols-12    gap-2 md:gap-4 lg:gap-4 ">
                  {/* <div className="col-span-12 md:col-span-6 lg:col-span-6">
                    <label htmlFor="tech_c4" className="label">
                          {data?.payload?.tech_lang_keys["22"]}
                        </label>
                          <div className="mt-2">
                          <select
                            className="input"
                            aria-label="select"
                            name="tech_c4"
                            id="tech_c4"
                            value={formData.tech_c4[]}
                            onChange={handleChange}
                          >
                          <option value="A*">A* </option>
                            <option value="A">A </option>
                            <option value="B">B </option>
                            <option value="C">C </option>
                            <option value="D">D </option>
                            <option value="E">E </option>
                            <option value="Fail">Fail </option>
                          <option value={`${data?.payload?.tech_lang_keys["24"]} (0)`}>{data?.payload?.tech_lang_keys["24"]} (0) </option>
                          </select>
                        </div>
                  </div>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6 relative">
                      <label htmlFor="tech_grade_was5" className="label">
                      {data?.payload?.tech_lang_keys["23"]}:
                        </label>
                        <div className=" relative">
                        <input
                          type="number"
                          step="any"
                          name="tech_grade_was5"
                          id="tech_grade_was5"
                          className="input my-2"
                          aria-label="input"
                          placeholder="00"
                          value={formData.tech_grade_was5[]}
                          onChange={handleChange}
                        />
                        <span className="input_unit">%</span>
                        </div>
                  </div> */}
                  <div className="col-span-12 md:col-span-6 lg:col-span-6">
                    <label htmlFor="tech_undertaker4" className="label">
                      {data?.payload?.tech_lang_keys["20"]}
                    </label>
                    <div className="mt-2">
                      <select
                        className="input"
                        aria-label="select"
                        name="tech_undertaker4"
                        id="tech_undertaker4"
                        value={formData.tech_undertaker4}
                        onChange={handleChange}
                      >
                        <option value="A*">A* </option>
                        <option value="A">A </option>
                        <option value="B">B </option>
                        <option value="C">C </option>
                        <option value="D">D </option>
                        <option value="E">E </option>
                        <option value="Fail">Fail </option>
                        <option
                          value={`${data?.payload?.tech_lang_keys["24"]} (0)`}
                        >
                          {data?.payload?.tech_lang_keys["24"]} (0){" "}
                        </option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-span-12 australian_school_div">
                <div className="grid grid-cols-12    gap-2 md:gap-4 lg:gap-4 gcse_div">
                  {/* <div className="col-span-12 md:col-span-6 lg:col-span-6">
                      <label htmlFor="tech_c5" className="label">
                        {data?.payload?.tech_lang_keys["22"]}
                      </label>
                      <div className="mt-2">
                        <select
                          className="input"
                          aria-label="select"
                          name="tech_c5"
                          id="tech_c5"
                          value={formData.tech_c5[]}
                          onChange={handleChange}
                        >
                          <option value="Band6">Band6 </option>
                          <option value="Band5">Band5 </option>
                          <option value="Band4">Band4 </option>
                          <option value="Band3">Band3 </option>
                          <option value="Band2">Band2 </option>
                          <option value="Band1">Band1 </option>
                        <option value={`${data?.payload?.tech_lang_keys["24"]} (0)`}>{data?.payload?.tech_lang_keys["24"]} (0) </option>
                        </select>
                      </div>
                      </div>
                      <div className="col-span-12 md:col-span-6 lg:col-span-6 relative">
                          <label htmlFor="tech_grade_was6" className="label">
                          {data?.payload?.tech_lang_keys["23"]}:
                            </label>
                            <div className=" relative">
                            <input
                              type="number"
                              step="any"
                              name="tech_grade_was6"
                              id="tech_grade_was6"
                              className="input my-2"
                              aria-label="input"
                              placeholder="00"
                              value={formData.tech_grade_was6[]}
                              onChange={handleChange}
                            />
                            <span className="input_unit">%</span>
                            </div>
                      </div> */}
                  {/* <div className="col-span-12 md:col-span-6 lg:col-span-6">
                          <label htmlFor="tech_undertaker5" className="label">
                          {data?.payload?.tech_lang_keys["20"]}
                        </label>
                        <div className="mt-2">
                          <select
                            className="input"
                            aria-label="select"
                            name="tech_undertaker5"
                            id="tech_undertaker5"
                            value={formData.tech_undertaker5}
                            onChange={handleChange}
                          >
                            <option value="Band6">Band6 </option>
                            <option value="Band5">Band5 </option>
                            <option value="Band4">Band4 </option>
                            <option value="Band3">Band3 </option>
                            <option value="Band2">Band2 </option>
                            <option value="Band1">Band1 </option>
                          <option value={`${data?.payload?.tech_lang_keys["24"]} (0)`}>{data?.payload?.tech_lang_keys["24"]} (0) </option>
                          </select>
                        </div>
                      </div> */}
                </div>
              </div>
              <div className="col-span-12 australian_university_div">
                <div className="grid grid-cols-12    gap-2 md:gap-4 lg:gap-4 gcse_div">
                  {/* <div className="col-span-12 md:col-span-6 lg:col-span-6">
                            <label htmlFor="tech_c6" className="label">
                            {data?.payload?.tech_lang_keys["20"]}
                          </label>
                          <div className="mt-2">
                            <select
                              className="input"
                              aria-label="select"
                              name="tech_c6"
                              id="tech_c6"
                              value={formData.tech_c6[]}
                              onChange={handleChange}
                            >
                              <option value="HD">HD </option>
                              <option value="D">D </option>
                              <option value="Cr">Cr </option>
                              <option value="P">P </option>
                              <option value="F">F </option>
                            <option value={`${data?.payload?.tech_lang_keys["24"]} (0)`}>{data?.payload?.tech_lang_keys["24"]} (0) </option>
                            </select>
                          </div>
                          </div> */}
                  {/* <div className="col-span-12 md:col-span-6 lg:col-span-6 relative">
                              <label htmlFor="tech_grade_was7" className="label">
                              {data?.payload?.tech_lang_keys["23"]}:
                                </label>
                                <div className=" relative">
                                <input
                                  type="number"
                                  step="any"
                                  name="tech_grade_was7"
                                  id="tech_grade_was7"
                                  className="input my-2"
                                  aria-label="input"
                                  placeholder="00"
                                  value={formData.tech_grade_was7}
                                  onChange={handleChange}
                                />
                                <span className="input_unit">%</span>
                                </div>
                          </div>
                            <div className="col-span-12 md:col-span-6 lg:col-span-6">
                                <label htmlFor="tech_undertaker6" className="label">
                              {data?.payload?.tech_lang_keys["20"]}
                            </label>
                            <div className="mt-2">
                              <select
                                className="input"
                                aria-label="select"
                                name="tech_undertaker6"
                                id="tech_undertaker6"
                                value={formData.tech_undertaker6}
                                onChange={handleChange}
                              >
                                <option value="HD">HD </option>
                                <option value="D">D </option>
                                <option value="Cr">Cr </option>
                                <option value="P">P </option>
                                <option value="F">F </option>
                              <option value={`${data?.payload?.tech_lang_keys["24"]} (0)`}>{data?.payload?.tech_lang_keys["24"]} (0) </option>
                              </select>
                            </div>
                          </div> */}
                </div>
              </div>
              <div className="col-span-12 india_div">
                <div className="grid grid-cols-12    gap-2 md:gap-4 lg:gap-4 india_div">
                  {/* <div className="col-span-12 md:col-span-6 lg:col-span-6">
                            <label htmlFor="tech_c7" className="label">
                        {data?.payload?.tech_lang_keys["22"]}
                      </label>
                      <div className="mt-2">
                        <select
                          className="input"
                          aria-label="select"
                          name="tech_c7"
                          id="tech_c7"
                          value={formData.tech_c7[]}
                          onChange={handleChange}
                        >
                          <option value="A1">A1 </option>
                          <option value="A2">A2 </option>
                          <option value="B1">B1 </option>
                          <option value="B2">B2 </option>
                          <option value="C1">C1 </option>
                          <option value="C2">C2 </option>
                          <option value="D">D </option>
                          <option value="E1">E1 </option>
                          <option value="E2">E2 </option>
                        <option value={`${data?.payload?.tech_lang_keys["24"]} (0)`}>{data?.payload?.tech_lang_keys["24"]} (0) </option>
                        </select>
                      </div>
                      </div>
                      <div className="col-span-12 md:col-span-6 lg:col-span-6 relative">
                          <label htmlFor="tech_grade_was8" className="label">
                          {data?.payload?.tech_lang_keys["23"]}:
                            </label>
                            <div className=" relative">
                            <input
                              type="number"
                              step="any"
                              name="tech_grade_was8"
                              id="tech_grade_was8"
                              className="input my-2"
                                aria-label="input"
                              placeholder="00"
                              value={formData.tech_grade_was8[]}
                              onChange={handleChange}
                            />
                            <span className="input_unit">%</span>
                            </div>
                      </div> */}
                  {/* <div className="col-span-12 md:col-span-6 lg:col-span-6">
                          <label htmlFor="tech_undertaker7" className="label">
                                {data?.payload?.tech_lang_keys["20"]}
                              </label>
                              <div className="mt-2">
                                <select
                                  className="input"
                                  aria-label="select"
                                  name="tech_undertaker7"
                                  id="tech_undertaker7"
                                  value={formData.tech_undertaker7}
                                  onChange={handleChange}
                                >
                                  <option value="A1">A1 </option>
                                  <option value="A2">A2 </option>
                                  <option value="B1">B1 </option>
                                  <option value="B2">B2 </option>
                                  <option value="C1">C1 </option>
                                  <option value="C2">C2 </option>
                                  <option value="D">D </option>
                                  <option value="E1">E1 </option>
                                  <option value="E2">E2 </option>
                                <option value={`${data?.payload?.tech_lang_keys["24"]} (0)`}>{data?.payload?.tech_lang_keys["24"]} (0) </option>
                                </select>
                              </div>
                      </div> */}
                </div>
              </div>
              {/* loop 1 */}
              <div className="col-span-12 mt-2" id="btn2">
                <button
                  type="button"
                  title="Add More Fields"
                  className="tagsUnit border p-2 cursor-pointer bg-[#2845F5] text-white rounded-lg"
                >
                  <b>
                    <span className="font-s-18">+</span>
                    {data?.payload?.tech_lang_keys[26]}
                  </b>
                </button>
              </div>
              {/* loop 2 */}
              <div className="col-span-12 mt-2" id="btn3">
                <button
                  type="button"
                  title="Add More Fields"
                  className="tagsUnit border p-2 cursor-pointer bg-[#2845F5] text-white rounded-lg"
                >
                  <b>
                    <span className="font-s-18">+</span>
                    {data?.payload?.tech_lang_keys[26]}
                  </b>
                </button>
              </div>
              {/* <div className="col-span-12 mt-2" id="btn4">
                  <button type="button" title="Add Exam" className="tagsUnit border p-2 cursor-pointer bg-[#99EA48] rounded-lg" ><b><span className="font-s-18">+</span>{data?.payload?.tech_lang_keys[27]}</b></button>
                </div> 
                <div className="col-span-12 mt-2" id="btn5">
                  <button type="button" title="Add Exam" className="tagsUnit border p-2 cursor-pointer bg-[#99EA48] rounded-lg" ><b><span className="font-s-18">+</span>{data?.payload?.tech_lang_keys[28]}2</b></button>
                </div>  */}
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
          <div className="w-full mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg  space-y-6 result">
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
              <div className="w-full mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg  space-y-6 result">
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="w-full text-[18px] text-center">
                        {result?.tech_subtraction && result?.tech_read && (
                          <>
                            <p>
                              <strong>{result?.tech_read}</strong>
                            </p>
                            <p>
                              <span className="text-blue text-[20px]">
                                {data?.payload?.tech_lang_keys[29]}{" "}
                              </span>
                              <span className="text-blue text-[20px] my-2">
                                {result?.tech_subtraction}
                              </span>
                              <span className="black-text">%</span>{" "}
                              {data?.payload?.tech_lang_keys[32]}
                            </p>
                          </>
                        )}

                        {result?.tech_final_result && (
                          <>
                            <p>{data?.payload?.tech_lang_keys[33]}</p>
                            <p className="text-blue text-[20px] my-2">
                              <strong>
                                {Number(result?.tech_final_result).toFixed(2)}
                              </strong>
                            </p>
                          </>
                        )}

                        {result?.tech_fg && (
                          <>
                            <p>{data?.payload?.tech_lang_keys[33]}</p>
                            <p className="text-blue text-[20px] my-2">
                              <strong>
                                {Number(result?.tech_fg).toFixed(2)} (
                                {result?.tech_assign}{" "}
                                {data?.payload?.tech_lang_keys[34]})
                              </strong>
                            </p>
                            <div className="w-full md:w-[80%] lg:w-[80%]">
                              <h5 className="text-start">
                                <b>{data?.payload?.tech_lang_keys[35]}</b>
                              </h5>
                              <table className="w-full striped">
                                <thead>
                                  <tr>
                                    <td className="border-b py-2">
                                      {data?.payload?.tech_lang_keys[2]} (%)
                                    </td>
                                    <td className="border-b py-2">
                                      {data?.payload?.tech_lang_keys[15]} (%)
                                    </td>
                                    <td className="border-b py-2">
                                      {data?.payload?.tech_lang_keys[36]} (%)
                                    </td>
                                  </tr>
                                </thead>
                              </table>
                            </div>
                          </>
                        )}

                        {result?.tech_Grades && (
                          <p className="text-blue text-[20px] my-2">
                            {data?.payload?.tech_lang_keys[30]}{" "}
                            {result?.tech_Grades}{" "}
                            {data?.payload?.tech_lang_keys[31]}
                          </p>
                        )}

                        {result?.tech_fg2 && (
                          <>
                            <div id="fgl" />
                            <p>{data?.payload?.tech_lang_keys[33]}</p>
                            <p>
                              <strong>
                                {Number(result?.tech_fg2).toFixed(2)} (
                                {result?.tech_assign_grade}{" "}
                                {data?.payload?.tech_lang_keys[34]})
                              </strong>
                            </p>
                            <p className="asad">
                              <b>{data?.payload?.tech_lang_keys[35]}</b>
                            </p>
                            <table className="w-full">
                              <thead>
                                <tr>
                                  <td className="border-b py-2">
                                    {data?.payload?.tech_lang_keys[2]} (%)
                                  </td>
                                  <td className="border-b py-2">
                                    {data?.payload?.tech_lang_keys[15]} (%)
                                  </td>
                                  <td className="border-b py-2">
                                    {data?.payload?.tech_lang_keys[36]} (%)
                                  </td>
                                </tr>
                              </thead>
                            </table>
                          </>
                        )}

                        {result?.tech_nawaz && (
                          <>
                            {result?.tech_nawaz.includes("CONGRATULATIONS") ||
                            result?.tech_nawaz.includes("impossible") ? (
                              <p className="text-blue text-[20px] my-2">
                                {result?.tech_nawaz}
                              </p>
                            ) : (
                              <p>
                                <span className="text-blue text-[20px] my-2">
                                  {data?.payload?.tech_lang_keys[30]}
                                </span>{" "}
                                <span className="text-blue text-[20px] my-2">
                                  {result?.tech_nawaz}
                                </span>{" "}
                                {data?.payload?.tech_lang_keys[31]}
                              </p>
                            )}
                          </>
                        )}

                        {result?.tech_final_ten &&
                          result?.tech_final_eleven && (
                            <>
                              {result?.tech_final > 10000 ? (
                                <p className="text-blue text-[20px] my-2">
                                  {result?.tech_final_eleven}
                                </p>
                              ) : result?.tech_final < 0 ? (
                                <p className="text-accent-4 text-[20px] my-2">
                                  {result?.tech_final_eleven}
                                </p>
                              ) : (
                                <p>
                                  <span>
                                    {data?.payload?.tech_lang_keys[30]}
                                  </span>{" "}
                                  <span className="text-blue text-[20px] my-2">
                                    {result?.tech_final_eleven}
                                  </span>{" "}
                                  {data?.payload?.tech_lang_keys[31]}
                                </p>
                              )}
                              <p>
                                <span>{data?.payload?.tech_lang_keys[29]}</span>{" "}
                                <span className="text-blue text-[20px] my-2">
                                  {result?.tech_final_ten}
                                </span>{" "}
                                <span className="black-text">%</span>{" "}
                                {data?.payload?.tech_lang_keys[32]}
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

export default GradeCalculator;

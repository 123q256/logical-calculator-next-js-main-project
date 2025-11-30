"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";

import {
  useGetSingleCalculatorDetailsMutation,
  useFinalGradeCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency";
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const GradeCalculator = () => {
  const pathname = usePathname();
  const parts = pathname.split("/").filter(Boolean);

  let url = "";
  if (parts.length === 1) {
    url = parts[0];
  } else {
    url = parts[0] + "/" + parts[1];
  }

  const [getSingleCalculatorDetails, { data, error, isLoading }] =
    useGetSingleCalculatorDetailsMutation();

  const handleFetchDetails = async () => {
    try {
      await getSingleCalculatorDetails({ tech_calculator_link: url });
    } catch (err) {
      console.error("Error fetching calculator details:", err);
    }
  };

  useEffect(() => {
    handleFetchDetails();
  }, [url]);

  // Dynamic array fields state
  const [currentGrade2, setCurrentGrade2] = useState(["4"]);
  const [finalExamWeight2, setFinalExamWeight2] = useState(["4"]);
  const [currentLetter, setCurrentLetter] = useState(["A+"]);
  const [pollard, setPollard] = useState([""]);
  const [gradeWas, setGradeWas] = useState([""]);
  const [worth, setWorth] = useState([""]);
  const [techC, setTechC] = useState(["A+"]);
  const [gradeWas2, setGradeWas2] = useState([""]);
  const [techC2, setTechC2] = useState(["A"]);
  const [gradeWas3, setGradeWas3] = useState([""]);
  const [techC3, setTechC3] = useState(["A+"]);
  const [gradeWas4, setGradeWas4] = useState([""]);
  const [techC4, setTechC4] = useState(["A*"]);
  const [gradeWas5, setGradeWas5] = useState([""]);
  const [techC5, setTechC5] = useState(["Band6"]);
  const [gradeWas6, setGradeWas6] = useState([""]);
  const [techC6, setTechC6] = useState(["HD"]);
  const [gradeWas7, setGradeWas7] = useState([""]);
  const [techC7, setTechC7] = useState(["A1"]);
  const [gradeWas8, setGradeWas8] = useState([""]);

  // Initialize grades state for second type
  const [grades, setGrades] = useState([
    { tech_target_letter: "A+", tech_pollard: "4" },
  ]);

  const [formData, setFormData] = useState({
    tech_selection: "3",
    tech_type: "first",
    tech_grading_system: "1",
    tech_current_grade: "4",
    tech_final_exam_grade2: "4",
    tech_target_letter: "A+",
    tech_target_grade2: "4",
    tech_total_weight2: "8",
    tech_final_exam_weight3: "4",
    tech_grading_system2: "2",
    tech_you_want: "4",
    tech_final_exam_grade1: "4",
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
    tech_final_exam_weight: "",
    tech_undertaker: "A+",
    tech_undertaker2: "A",
    tech_undertaker3: "A+",
    tech_undertaker4: "A*",
    tech_undertaker5: "Band6",
    tech_undertaker6: "HD",
    tech_undertaker7: "A1",
    tech_submit: "calculate",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  const [calculateEbitCalculator, { isLoading: roundToTheNearestLoading }] =
    useFinalGradeCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  // Handle grade change for dynamic grades array
  const handleGradeChange = (index, field, value) => {
    const newGrades = [...grades];
    newGrades[index][field] = value;
    setGrades(newGrades);
    setResult(null);
    setFormError(null);
  };

  // Handle dynamic array field changes
  const handleArrayChange = (index, value, setter, array) => {
    const newArray = [...array];
    newArray[index] = value;
    setter(newArray);
    setResult(null);
    setFormError(null);
  };

  // Add more fields functions
  const addMoreFields = (setter, array, defaultValue) => {
    setter([...array, defaultValue]);
  };

  const removeField = (index, setter, array) => {
    if (array.length > 1) {
      const newArray = array.filter((_, i) => i !== index);
      setter(newArray);
    }
  };

  // Add more grade function
  const addMoreGrade = () => {
    setGrades([...grades, { tech_target_letter: "A+", tech_pollard: "4" }]);
  };

  // Remove grade function
  const removeGrade = (index) => {
    if (grades.length > 1) {
      const newGrades = grades.filter((_, i) => i !== index);
      setGrades(newGrades);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_selection) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      // Prepare all array data for submission
      const submissionData = {
        ...formData,
        tech_current_grade2: currentGrade2,
        tech_final_exam_weight2: finalExamWeight2,
        tech_current_letter: currentLetter,
        tech_pollard: pollard,
        tech_grade_was: gradeWas,
        tech_worth: worth,
        tech_c: techC,
        tech_grade_was2: gradeWas2,
        tech_c2: techC2,
        tech_grade_was3: gradeWas3,
        tech_c3: techC3,
        tech_grade_was4: gradeWas4,
        tech_c4: techC4,
        tech_grade_was5: gradeWas5,
        tech_c5: techC5,
        tech_grade_was6: gradeWas6,
        tech_c6: techC6,
        tech_grade_was7: gradeWas7,
        tech_c7: techC7,
        tech_grade_was8: gradeWas8,
        tech_target_letter: grades.map((g) => g.tech_target_letter),
        tech_pollard: grades.map((g) => g.tech_pollard),
        tech_submit: "calculate",
      };

      const response = await calculateEbitCalculator(submissionData).unwrap();

      setResult(response?.payload);
      toast.success("Successfully Calculated");
    } catch (err) {
      setFormError(err.data.payload.error);
      toast.error(err.data.payload.error);
    }
  };

  const handleReset = () => {
    setFormData({
      tech_selection: "3",
      tech_type: "first",
      tech_grading_system: "1",
      tech_current_grade: "",
      tech_final_exam_grade2: "",
      tech_target_letter: "A+",
      tech_target_grade2: "",
      tech_total_weight2: "",
      tech_final_exam_weight3: "",
      tech_grading_system2: "2",
      tech_you_want: "",
      tech_final_exam_grade1: "",
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
      tech_final_exam_weight: "",
      tech_undertaker: "A+",
      tech_undertaker2: "A",
      tech_undertaker3: "A+",
      tech_undertaker4: "A*",
      tech_undertaker5: "Band6",
      tech_undertaker6: "HD",
      tech_undertaker7: "A1",
      tech_submit: "calculate",
    });

    // Reset all array states
    setCurrentGrade2([""]);
    setFinalExamWeight2([""]);
    setCurrentLetter(["A+"]);
    setPollard([""]);
    setGradeWas([""]);
    setWorth([""]);
    setTechC(["A+"]);
    setGradeWas2([""]);
    setTechC2(["A"]);
    setGradeWas3([""]);
    setTechC3(["A+"]);
    setGradeWas4([""]);
    setTechC4(["A*"]);
    setGradeWas5([""]);
    setTechC5(["Band6"]);
    setGradeWas6([""]);
    setTechC6(["HD"]);
    setGradeWas7([""]);
    setTechC7(["A1"]);
    setGradeWas8([""]);

    // Reset grades array
    setGrades([{ tech_target_letter: "A+", tech_pollard: "" }]);

    setResult(null);
    setFormError(null);
  };

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

  const lang = result?.lang || [];

  // FIXED: Get values from result instead of formData for table calculations
  const method = result?.tech_method;
  const cgw = parseFloat(result?.tech_cgw) || 0;
  const cg = parseFloat(result?.tech_cg) || 0;
  const fgw = parseFloat(result?.tech_fgw) || 0;

  const method4 = result?.tech_method4;
  const cgw2 = parseFloat(result?.tech_cgw2) || 0;
  const cg2 = parseFloat(result?.tech_cg2) || 0;
  const fg2 = parseFloat(result?.tech_fg2) || 0;
  const difference = parseFloat(result?.tech_difference) || 0;

  // ----------- METHOD 3 (PERCENTAGE TABLE) -----------
  function drawTable(cg, cgw, fgw) {
    const rows = [];

    // Check if values are valid numbers
    if (isNaN(cg) || isNaN(cgw) || isNaN(fgw) || cgw === 0 || fgw === 0) {
      return rows;
    }

    for (let g = 50; g <= 100; g += 5) {
      const grade = (cgw * cg + fgw * g) / (fgw + cgw);
      rows.push({
        cg: cg.toFixed(0),
        g: g,
        grade: grade.toFixed(0),
      });
    }

    return rows;
  }

  // ----------- METHOD 4 (LETTER TABLE) -----------
  function getLetterFromGPA(gpa) {
    const lettertbl = [
      "A+",
      "A",
      "A-",
      "B+",
      "B",
      "B-",
      "C+",
      "C",
      "C-",
      "D+",
      "D",
      "D-",
      "F",
    ];
    const gpatbl = [
      4.33, 4.0, 3.67, 3.33, 3.0, 2.67, 2.33, 2.0, 1.67, 1.33, 1.0, 0.67, 0,
    ];

    for (let i = 0; i < gpatbl.length; i++) {
      if (gpa >= gpatbl[i]) return lettertbl[i];
    }
    return "";
  }

  function drawLetterTable(cg2, cgw2, diff) {
    const gpaList = [
      0.67, 1.0, 1.33, 1.67, 2.0, 2.33, 2.67, 3.0, 3.33, 3.67, 4.0, 4.33,
    ];
    const rows = [];

    // Check if values are valid numbers
    if (isNaN(cg2) || isNaN(cgw2) || isNaN(diff) || cgw2 === 0 || diff === 0) {
      return rows;
    }

    gpaList.forEach((g) => {
      const gradeCalc = (cgw2 * cg2 + diff * g) / (cgw2 + diff);
      rows.push({
        cg: getLetterFromGPA(cg2),
        g: getLetterFromGPA(g),
        grade: getLetterFromGPA(gradeCalc),
      });
    });

    return rows;
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
          path: pathname,
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

          <div className="lg:w-[60%] md:w-[60%] w-full mx-auto">
            <div className="grid grid-cols-12 mt-3 gap-2 md:gap-4 lg:gap-4">
              {/* Selection Type */}
              <div className="col-span-12">
                <label htmlFor="tech_selection" className="label">
                  {data?.payload?.tech_lang_keys?.["5"] || "Selection"}:
                </label>
                <div className="mt-2">
                  <select
                    className="input"
                    name="tech_selection"
                    id="tech_selection"
                    value={formData.tech_selection}
                    onChange={handleChange}
                  >
                    <option value="1">
                      {data?.payload?.tech_lang_keys?.["2"] || "Option 1"}
                    </option>
                    <option value="2">
                      {data?.payload?.tech_lang_keys?.["3"] || "Option 2"}
                    </option>
                    <option value="3">
                      {data?.payload?.tech_lang_keys?.["4"] || "Option 3"} &{" "}
                      {data?.payload?.tech_lang_keys?.["5"] || "Option 4"}
                    </option>
                  </select>
                </div>
              </div>

              {formData.tech_selection == "1" && (
                <>
                  {/* Grading System */}
                  <div className="col-span-12 grading_system mt-2">
                    <label htmlFor="tech_grading_system" className="label">
                      {data?.payload?.tech_lang_keys?.["5"] || "Grading System"}
                      :
                    </label>
                    <div className="">
                      <select
                        className="input"
                        name="tech_grading_system"
                        id="tech_grading_system"
                        value={formData.tech_grading_system}
                        onChange={handleChange}
                      >
                        <option value="1">
                          {data?.payload?.tech_lang_keys?.["10"] || "Numbers"}
                        </option>
                        <option value="2">
                          {data?.payload?.tech_lang_keys?.["7"] || "Percentage"}
                        </option>
                        <option value="3">
                          USA (
                          {data?.payload?.tech_lang_keys?.["11"] || "Standard"})
                        </option>
                        <option value="4">
                          USA (
                          {data?.payload?.tech_lang_keys?.["12"] || "Advanced"})
                        </option>
                        <option value="5">Canada</option>
                        <option value="6">GCSE</option>
                        <option value="7">
                          Australian (
                          {data?.payload?.tech_lang_keys?.["13"] || "Schools"})
                        </option>
                        <option value="8">
                          Australian{" "}
                          {data?.payload?.tech_lang_keys?.["14"] ||
                            "University"}
                        </option>
                        <option value="9">India (CCE)</option>
                      </select>
                    </div>
                  </div>

                  {(formData.tech_grading_system === "1" ||
                    formData.tech_grading_system === "2") && (
                    <>
                      <div className="col-span-12 md:col-span-6 lg:col-span-6 current_grade">
                        <label htmlFor="tech_current_grade" className="label">
                          {data?.payload?.tech_lang_keys?.["2"] ||
                            "Current Grade"}
                          :
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_current_grade"
                            id="tech_current_grade"
                            className="input my-2"
                            placeholder="00"
                            value={formData.tech_current_grade}
                            onChange={handleChange}
                          />
                          <span className="input_unit">%</span>
                        </div>
                      </div>
                      <div className="col-span-12 md:col-span-6 lg:col-span-6 final_exam_grade1">
                        <label
                          htmlFor="tech_final_exam_grade1"
                          className="label"
                        >
                          {data?.payload?.tech_lang_keys?.["21"] ||
                            "Grade You Want:"}
                          :
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_final_exam_grade1"
                            id="tech_final_exam_grade1"
                            className="input my-2"
                            placeholder="00"
                            value={formData.tech_final_exam_grade1}
                            onChange={handleChange}
                          />
                          <span className="input_unit">%</span>
                        </div>
                      </div>
                      <div className="col-span-12 md:col-span-6 lg:col-span-6 final_exam_weight relative">
                        <label
                          htmlFor="tech_final_exam_weight"
                          className="label"
                        >
                          {data?.payload?.tech_lang_keys?.["18"] ||
                            "Final Exam Weight"}
                          :
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_final_exam_weight"
                            id="tech_final_exam_weight"
                            className="input my-2"
                            placeholder="00"
                            value={formData.tech_final_exam_weight}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {formData.tech_grading_system === "3" && (
                    <>
                      <div className="col-span-12 md:col-span-6 lg:col-span-6">
                        <label htmlFor="tech_current_grade3" className="label">
                          {data?.payload?.tech_lang_keys?.["2"] ||
                            "Current Grade"}
                        </label>
                        <div className="mt-2">
                          <select
                            className="input"
                            name="tech_current_grade3"
                            id="tech_current_grade3"
                            value={formData.tech_current_grade3}
                            onChange={handleChange}
                          >
                            <option value="A+">A+</option>
                            <option value="A">A</option>
                            <option value="A-">A-</option>
                            <option value="B+">B+</option>
                            <option value="B">B</option>
                            <option value="B-">B-</option>
                            <option value="C+">C+</option>
                            <option value="C">C</option>
                            <option value="C-">C-</option>
                            <option value="D+">D+</option>
                            <option value="D">D</option>
                            <option value="D-">D-</option>
                            <option value="F">F</option>
                            <option
                              value={`${data?.payload?.tech_lang_keys?.["24"]} (0)`}
                            >
                              {data?.payload?.tech_lang_keys?.["24"]} (0)
                            </option>
                          </select>
                        </div>
                      </div>
                      <div className="col-span-12 md:col-span-6 lg:col-span-6">
                        <label htmlFor="tech_target_grade3" className="label">
                          {data?.payload?.tech_lang_keys?.["5"] ||
                            "Target Grade"}
                        </label>
                        <div className="mt-2">
                          <select
                            className="input"
                            name="tech_target_grade3"
                            id="tech_target_grade3"
                            value={formData.tech_target_grade3}
                            onChange={handleChange}
                          >
                            <option value="A+">A+</option>
                            <option value="A">A</option>
                            <option value="A-">A-</option>
                            <option value="B+">B+</option>
                            <option value="B">B</option>
                            <option value="B-">B-</option>
                            <option value="C+">C+</option>
                            <option value="C">C</option>
                            <option value="C-">C-</option>
                            <option value="D+">D+</option>
                            <option value="D">D</option>
                            <option value="D-">D-</option>
                            <option value="F">F</option>
                            <option
                              value={`${data?.payload?.tech_lang_keys?.["24"]} (0)`}
                            >
                              {data?.payload?.tech_lang_keys?.["24"]} (0)
                            </option>
                          </select>
                        </div>
                      </div>
                    </>
                  )}

                  {formData.tech_grading_system === "4" && (
                    <>
                      <div className="col-span-12 md:col-span-6 lg:col-span-6">
                        <label htmlFor="tech_current_grade4" className="label">
                          {data?.payload?.tech_lang_keys?.["2"] ||
                            "Current Grade"}
                        </label>
                        <div className="mt-2">
                          <select
                            className="input"
                            name="tech_current_grade4"
                            id="tech_current_grade4"
                            value={formData.tech_current_grade4}
                            onChange={handleChange}
                          >
                            <option value="A">A</option>
                            <option value="B">B</option>
                            <option value="C">C</option>
                            <option value="D">D</option>
                            <option value="E/F">E/F</option>
                            <option
                              value={`${data?.payload?.tech_lang_keys?.["24"]} (0)`}
                            >
                              {data?.payload?.tech_lang_keys?.["24"]} (0)
                            </option>
                          </select>
                        </div>
                      </div>
                      <div className="col-span-12 md:col-span-6 lg:col-span-6">
                        <label htmlFor="tech_target_grade4" className="label">
                          {data?.payload?.tech_lang_keys?.["5"] ||
                            "Target Grade"}
                        </label>
                        <div className="mt-2">
                          <select
                            className="input"
                            name="tech_target_grade4"
                            id="tech_target_grade4"
                            value={formData.tech_target_grade4}
                            onChange={handleChange}
                          >
                            <option value="A">A</option>
                            <option value="B">B</option>
                            <option value="C">C</option>
                            <option value="D">D</option>
                            <option value="E/F">E/F</option>
                            <option
                              value={`${data?.payload?.tech_lang_keys?.["24"]} (0)`}
                            >
                              {data?.payload?.tech_lang_keys?.["24"]} (0)
                            </option>
                          </select>
                        </div>
                      </div>
                    </>
                  )}

                  {formData.tech_grading_system === "5" && (
                    <>
                      <div className="col-span-12 md:col-span-6 lg:col-span-6">
                        <label htmlFor="tech_current_grade8" className="label">
                          {data?.payload?.tech_lang_keys?.["2"] ||
                            "Current Grade"}
                        </label>
                        <div className="mt-2">
                          <select
                            className="input"
                            name="tech_current_grade8"
                            id="tech_current_grade8"
                            value={formData.tech_current_grade8}
                            onChange={handleChange}
                          >
                            <option value="A+">A+</option>
                            <option value="A">A</option>
                            <option value="A-">A-</option>
                            <option value="B+">B+</option>
                            <option value="B">B</option>
                            <option value="B-">B-</option>
                            <option value="C+">C+</option>
                            <option value="C">C</option>
                            <option value="C-">C-</option>
                            <option value="D+">D+</option>
                            <option value="D">D</option>
                            <option value="D-">D-</option>
                            <option value="R">R</option>
                            <option
                              value={`${data?.payload?.tech_lang_keys?.["24"]} (0)`}
                            >
                              {data?.payload?.tech_lang_keys?.["24"]} (0)
                            </option>
                          </select>
                        </div>
                      </div>
                      <div className="col-span-12 md:col-span-6 lg:col-span-6">
                        <label htmlFor="tech_target_grade8" className="label">
                          {data?.payload?.tech_lang_keys?.["5"] ||
                            "Target Grade"}
                        </label>
                        <div className="mt-2">
                          <select
                            className="input"
                            name="tech_target_grade8"
                            id="tech_target_grade8"
                            value={formData.tech_target_grade8}
                            onChange={handleChange}
                          >
                            <option value="A+">A+</option>
                            <option value="A">A</option>
                            <option value="A-">A-</option>
                            <option value="B+">B+</option>
                            <option value="B">B</option>
                            <option value="B-">B-</option>
                            <option value="C+">C+</option>
                            <option value="C">C</option>
                            <option value="C-">C-</option>
                            <option value="D+">D+</option>
                            <option value="D">D</option>
                            <option value="D-">D-</option>
                            <option value="R">R</option>
                            <option
                              value={`${data?.payload?.tech_lang_keys?.["24"]} (0)`}
                            >
                              {data?.payload?.tech_lang_keys?.["24"]} (0)
                            </option>
                          </select>
                        </div>
                      </div>
                    </>
                  )}

                  {formData.tech_grading_system === "6" && (
                    <>
                      <div className="col-span-12 md:col-span-6 lg:col-span-6">
                        <label htmlFor="tech_current_grade9" className="label">
                          {data?.payload?.tech_lang_keys?.["2"] ||
                            "Current Grade"}
                        </label>
                        <div className="mt-2">
                          <select
                            className="input"
                            name="tech_current_grade9"
                            id="tech_current_grade9"
                            value={formData.tech_current_grade9}
                            onChange={handleChange}
                          >
                            <option value="A*">A*</option>
                            <option value="A">A</option>
                            <option value="B">B</option>
                            <option value="C">C</option>
                            <option value="D">D</option>
                            <option value="E">E</option>
                            <option value="Fail">Fail</option>
                            <option
                              value={`${data?.payload?.tech_lang_keys?.["24"]} (0)`}
                            >
                              {data?.payload?.tech_lang_keys?.["24"]} (0)
                            </option>
                          </select>
                        </div>
                      </div>
                      <div className="col-span-12 md:col-span-6 lg:col-span-6">
                        <label htmlFor="tech_target_grade9" className="label">
                          {data?.payload?.tech_lang_keys?.["5"] ||
                            "Target Grade"}
                        </label>
                        <div className="mt-2">
                          <select
                            className="input"
                            name="tech_target_grade9"
                            id="tech_target_grade9"
                            value={formData.tech_target_grade9}
                            onChange={handleChange}
                          >
                            <option value="A*">A*</option>
                            <option value="A">A</option>
                            <option value="B">B</option>
                            <option value="C">C</option>
                            <option value="D">D</option>
                            <option value="E">E</option>
                            <option value="Fail">Fail</option>
                            <option
                              value={`${data?.payload?.tech_lang_keys?.["24"]} (0)`}
                            >
                              {data?.payload?.tech_lang_keys?.["24"]} (0)
                            </option>
                          </select>
                        </div>
                      </div>
                    </>
                  )}

                  {formData.tech_grading_system === "7" && (
                    <>
                      <div className="col-span-12 md:col-span-6 lg:col-span-6">
                        <label htmlFor="tech_current_grade5" className="label">
                          {data?.payload?.tech_lang_keys?.["2"] ||
                            "Current Grade"}
                        </label>
                        <div className="mt-2">
                          <select
                            className="input"
                            name="tech_current_grade5"
                            id="tech_current_grade5"
                            value={formData.tech_current_grade5}
                            onChange={handleChange}
                          >
                            <option value="Band6">Band6</option>
                            <option value="Band5">Band5</option>
                            <option value="Band4">Band4</option>
                            <option value="Band3">Band3</option>
                            <option value="Band2">Band2</option>
                            <option value="Band1">Band1</option>
                            <option
                              value={`${data?.payload?.tech_lang_keys?.["24"]} (0)`}
                            >
                              {data?.payload?.tech_lang_keys?.["24"]} (0)
                            </option>
                          </select>
                        </div>
                      </div>
                      <div className="col-span-12 md:col-span-6 lg:col-span-6">
                        <label htmlFor="tech_target_grade5" className="label">
                          {data?.payload?.tech_lang_keys?.["5"] ||
                            "Target Grade"}
                        </label>
                        <div className="mt-2">
                          <select
                            className="input"
                            name="tech_target_grade5"
                            id="tech_target_grade5"
                            value={formData.tech_target_grade5}
                            onChange={handleChange}
                          >
                            <option value="Band6">Band6</option>
                            <option value="Band5">Band5</option>
                            <option value="Band4">Band4</option>
                            <option value="Band3">Band3</option>
                            <option value="Band2">Band2</option>
                            <option value="Band1">Band1</option>
                            <option
                              value={`${data?.payload?.tech_lang_keys?.["24"]} (0)`}
                            >
                              {data?.payload?.tech_lang_keys?.["24"]} (0)
                            </option>
                          </select>
                        </div>
                      </div>
                    </>
                  )}

                  {formData.tech_grading_system === "8" && (
                    <>
                      <div className="col-span-12 md:col-span-6 lg:col-span-6">
                        <label htmlFor="tech_current_grade6" className="label">
                          {data?.payload?.tech_lang_keys?.["2"] ||
                            "Current Grade"}
                        </label>
                        <div className="mt-2">
                          <select
                            className="input"
                            name="tech_current_grade6"
                            id="tech_current_grade6"
                            value={formData.tech_current_grade6}
                            onChange={handleChange}
                          >
                            <option value="HD">HD</option>
                            <option value="D">D</option>
                            <option value="Cr">Cr</option>
                            <option value="P">P</option>
                            <option value="F">F</option>
                            <option
                              value={`${data?.payload?.tech_lang_keys?.["24"]} (0)`}
                            >
                              {data?.payload?.tech_lang_keys?.["24"]} (0)
                            </option>
                          </select>
                        </div>
                      </div>
                      <div className="col-span-12 md:col-span-6 lg:col-span-6">
                        <label htmlFor="tech_target_grade6" className="label">
                          {data?.payload?.tech_lang_keys?.["5"] ||
                            "Target Grade"}
                        </label>
                        <div className="mt-2">
                          <select
                            className="input"
                            name="tech_target_grade6"
                            id="tech_target_grade6"
                            value={formData.tech_target_grade6}
                            onChange={handleChange}
                          >
                            <option value="HD">HD</option>
                            <option value="D">D</option>
                            <option value="Cr">Cr</option>
                            <option value="P">P</option>
                            <option value="F">F</option>
                            <option
                              value={`${data?.payload?.tech_lang_keys?.["24"]} (0)`}
                            >
                              {data?.payload?.tech_lang_keys?.["24"]} (0)
                            </option>
                          </select>
                        </div>
                      </div>
                    </>
                  )}

                  {formData.tech_grading_system === "9" && (
                    <>
                      <div className="col-span-12 md:col-span-6 lg:col-span-6">
                        <label htmlFor="tech_current_grade7" className="label">
                          {data?.payload?.tech_lang_keys?.["2"] ||
                            "Current Grade"}
                        </label>
                        <div className="mt-2">
                          <select
                            className="input"
                            name="tech_current_grade7"
                            id="tech_current_grade7"
                            value={formData.tech_current_grade7}
                            onChange={handleChange}
                          >
                            <option value="A1">A1</option>
                            <option value="A2">A2</option>
                            <option value="B1">B1</option>
                            <option value="B2">B2</option>
                            <option value="C1">C1</option>
                            <option value="C2">C2</option>
                            <option value="D">D</option>
                            <option value="E1">E1</option>
                            <option value="E2">E2</option>
                            <option
                              value={`${data?.payload?.tech_lang_keys?.["24"]} (0)`}
                            >
                              {data?.payload?.tech_lang_keys?.["24"]} (0)
                            </option>
                          </select>
                        </div>
                      </div>
                      <div className="col-span-12 md:col-span-6 lg:col-span-6">
                        <label htmlFor="tech_target_grade7" className="label">
                          {data?.payload?.tech_lang_keys?.["5"] ||
                            "Target Grade"}
                        </label>
                        <div className="mt-2">
                          <select
                            className="input"
                            name="tech_target_grade7"
                            id="tech_target_grade7"
                            value={formData.tech_target_grade7}
                            onChange={handleChange}
                          >
                            <option value="A1">A1</option>
                            <option value="A2">A2</option>
                            <option value="B1">B1</option>
                            <option value="B2">B2</option>
                            <option value="C1">C1</option>
                            <option value="C2">C2</option>
                            <option value="D">D</option>
                            <option value="E1">E1</option>
                            <option value="E2">E2</option>
                            <option
                              value={`${data?.payload?.tech_lang_keys?.["24"]} (0)`}
                            >
                              {data?.payload?.tech_lang_keys?.["24"]} (0)
                            </option>
                          </select>
                        </div>
                      </div>
                    </>
                  )}

                  {(formData.tech_grading_system === "3" ||
                    formData.tech_grading_system === "4" ||
                    formData.tech_grading_system === "5" ||
                    formData.tech_grading_system === "6" ||
                    formData.tech_grading_system === "7" ||
                    formData.tech_grading_system === "8" ||
                    formData.tech_grading_system === "9") && (
                    <>
                      <div className="col-span-12 md:col-span-6 lg:col-span-6 final_exam_weight relative">
                        <label
                          htmlFor="tech_final_exam_weight"
                          className="label"
                        >
                          {data?.payload?.tech_lang_keys?.["18"] ||
                            "Final Exam Weight"}
                          :
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_final_exam_weight"
                            id="tech_final_exam_weight"
                            className="input my-2"
                            placeholder="00"
                            value={formData.tech_final_exam_weight}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                    </>
                  )}
                </>
              )}

              {formData.tech_selection === "2" && (
                <>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6 current_grade">
                    <label htmlFor="tech_current_grade" className="label">
                      {data?.payload?.tech_lang_keys?.["2"] || "Current Grade"}:
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_current_grade"
                        id="tech_current_grade"
                        className="input my-2"
                        placeholder="00"
                        value={formData.tech_current_grade}
                        onChange={handleChange}
                      />
                      <span className="input_unit">%</span>
                    </div>
                  </div>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6 final_exam_grade1">
                    <label htmlFor="tech_final_exam_grade2" className="label">
                      {data?.payload?.tech_lang_keys?.["21"] ||
                        "Grade You Want:"}
                      :
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_final_exam_grade2"
                        id="tech_final_exam_grade2"
                        className="input my-2"
                        placeholder="00"
                        value={formData.tech_final_exam_grade2}
                        onChange={handleChange}
                      />
                      <span className="input_unit">%</span>
                    </div>
                  </div>
                  <div className="col-span-12 md:col-span-6 lg:col-span-6 final_exam_weight relative">
                    <label htmlFor="tech_final_exam_weight" className="label">
                      {data?.payload?.tech_lang_keys?.["18"] ||
                        "Final Exam Weight"}
                      :
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step="any"
                        name="tech_final_exam_weight"
                        id="tech_final_exam_weight"
                        className="input my-2"
                        placeholder="00"
                        value={formData.tech_final_exam_weight}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Type Selection Tabs */}
              {formData.tech_selection === "3" && (
                <>
                  <div className="col-span-12 tabs mt-2">
                    <div className="col-12 col-lg-9 mx-auto mt-2 w-full">
                      <div className="flex flex-wrap items-center bg-green-100 border border-green-500 text-center rounded-lg px-1">
                        <div className="lg:w-1/2 w-full px-2 py-1">
                          <div
                            className={`bg-white px-3 py-2 cursor-pointer rounded-md transition-colors duration-300 hover_tags hover:text-white pacetab ${
                              formData.tech_type === "first" ? "tagsUnit" : ""
                            }`}
                            onClick={() => {
                              setFormData({ ...formData, tech_type: "first" });
                              setResult(null);
                              setFormError(null);
                            }}
                          >
                            {data?.payload?.tech_lang_keys?.["7"] || "First"}
                          </div>
                        </div>
                        <div className="lg:w-1/2 w-full px-2 py-1">
                          <div
                            className={`bg-white px-3 py-2 cursor-pointer rounded-md transition-colors duration-300 hover_tags hover:text-white pacetab ${
                              formData.tech_type === "second" ? "tagsUnit" : ""
                            }`}
                            onClick={() => {
                              setFormData({ ...formData, tech_type: "second" });
                              setResult(null);
                              setFormError(null);
                            }}
                          >
                            {data?.payload?.tech_lang_keys?.["8"] || "Second"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {formData.tech_type === "first" && (
                    <>
                      {/* Dynamic Grade Fields - Loop 1 */}
                      {currentGrade2.map((grade, index) => (
                        <React.Fragment key={`grade2-${index}`}>
                          <div className="col-span-12 md:col-span-6 lg:col-span-6 current_grade2">
                            <label className="label">
                              {data?.payload?.tech_lang_keys?.["15"] || "Grade"}{" "}
                              {index + 1}:
                            </label>
                            <div className="relative">
                              <input
                                type="number"
                                step="any"
                                className="input my-2"
                                placeholder="00"
                                value={grade}
                                onChange={(e) =>
                                  handleArrayChange(
                                    index,
                                    e.target.value,
                                    setCurrentGrade2,
                                    currentGrade2
                                  )
                                }
                              />
                              <span className="input_unit">%</span>
                            </div>
                          </div>
                          <div className="col-span-12 md:col-span-6 lg:col-span-6 weight2">
                            <div className="flex justify-between">
                              <div>
                                <label className="label">
                                  {data?.payload?.tech_lang_keys?.["16"] ||
                                    "Weight"}{" "}
                                  {index + 1}:
                                </label>
                              </div>
                              <div>
                                {index > 0 && (
                                  <button
                                    type="button"
                                    className="ml-2 text-red-500 cursor-pointer"
                                    onClick={() =>
                                      removeField(
                                        index,
                                        setCurrentGrade2,
                                        currentGrade2
                                      )
                                    }
                                  >
                                    ✕
                                  </button>
                                )}
                              </div>
                            </div>
                            <div className="relative">
                              <input
                                type="number"
                                step="any"
                                className="input my-2"
                                placeholder="00"
                                value={finalExamWeight2[index]}
                                onChange={(e) =>
                                  handleArrayChange(
                                    index,
                                    e.target.value,
                                    setFinalExamWeight2,
                                    finalExamWeight2
                                  )
                                }
                              />
                              <span className="input_unit">%</span>
                            </div>
                          </div>
                        </React.Fragment>
                      ))}

                      <div className="col-span-12 md:col-span-6 lg:col-span-6 target_grade2">
                        <label htmlFor="tech_target_grade2" className="label">
                          {data?.payload?.tech_lang_keys?.["5"] ||
                            "Target Grade"}
                          :
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_target_grade2"
                            id="tech_target_grade2"
                            className="input my-2"
                            placeholder="00"
                            value={formData.tech_target_grade2}
                            onChange={handleChange}
                          />
                          <span className="input_unit">%</span>
                        </div>
                      </div>

                      <div className="col-span-12 md:col-span-6 lg:col-span-6 target_grade2">
                        <label htmlFor="tech_total_weight2" className="label">
                          {data?.payload?.tech_lang_keys?.["17"] ||
                            "Total weights:"}
                          :
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_total_weight2"
                            id="tech_total_weight2"
                            className="input my-2"
                            placeholder="00"
                            value={formData.tech_total_weight2}
                            onChange={handleChange}
                          />
                          <span className="input_unit">%</span>
                        </div>
                      </div>

                      <div className="col-span-12 md:col-span-6 lg:col-span-6 target_grade2">
                        <label
                          htmlFor="tech_final_exam_weight3"
                          className="label"
                        >
                          {data?.payload?.tech_lang_keys?.["18"] ||
                            "Final Exam Weight:"}
                          :
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_final_exam_weight3"
                            id="tech_final_exam_weight3"
                            className="input my-2"
                            placeholder="00"
                            value={formData.tech_final_exam_weight3}
                            onChange={handleChange}
                          />
                          <span className="input_unit">%</span>
                        </div>
                      </div>

                      {/* Add More Fields Button - Loop 1 */}
                      <div className="col-span-12 mt-2">
                        <button
                          type="button"
                          className="tagsUnit border p-2 cursor-pointer bg-[#99EA48] rounded-lg"
                          onClick={() =>
                            addMoreFields(setCurrentGrade2, currentGrade2, "")
                          }
                        >
                          <b>
                            <span className="font-s-18">+</span>
                            {data?.payload?.tech_lang_keys?.["26"] ||
                              "Add More"}
                          </b>
                        </button>
                      </div>
                    </>
                  )}

                  {formData.tech_type === "second" && (
                    <>
                      {/* Dynamic Grade Fields - Loop 2 */}
                      {grades.map((grade, index) => (
                        <React.Fragment key={`grade-${index}`}>
                          <div className="col-span-12 md:col-span-6 lg:col-span-6">
                            <div className="flex justify-between">
                              <label className="label">
                                {data?.payload?.tech_lang_keys?.["2"] ||
                                  "Grade"}{" "}
                                {index + 1}:
                              </label>
                              {index > 0 && (
                                <button
                                  type="button"
                                  className="ml-2 text-red-500 cursor-pointer"
                                  onClick={() => removeGrade(index)}
                                >
                                  ✕
                                </button>
                              )}
                            </div>
                            <div className="mt-2">
                              <select
                                className="input"
                                value={grade.tech_target_letter}
                                onChange={(e) =>
                                  handleGradeChange(
                                    index,
                                    "tech_target_letter",
                                    e.target.value
                                  )
                                }
                              >
                                <option value="A+">A+</option>
                                <option value="A">A</option>
                                <option value="A-">A-</option>
                                <option value="B+">B+</option>
                                <option value="B">B</option>
                                <option value="B-">B-</option>
                                <option value="C+">C+</option>
                                <option value="C">C</option>
                                <option value="C-">C-</option>
                                <option value="D+">D+</option>
                                <option value="D">D</option>
                                <option value="D-">D-</option>
                                <option value="F">F</option>
                              </select>
                            </div>
                          </div>
                          <div className="col-span-12 md:col-span-6 lg:col-span-6">
                            <label className="label">
                              {data?.payload?.tech_lang_keys?.["16"] ||
                                "Weight"}{" "}
                              {index + 1}:
                            </label>
                            <div className="relative">
                              <input
                                type="number"
                                step="any"
                                className="input my-2"
                                placeholder="00"
                                value={grade.tech_pollard}
                                onChange={(e) =>
                                  handleGradeChange(
                                    index,
                                    "tech_pollard",
                                    e.target.value
                                  )
                                }
                              />
                              <span className="input_unit">%</span>
                            </div>
                          </div>
                        </React.Fragment>
                      ))}

                      {/* Add More Fields Button - Loop 2 */}
                      <div className="col-span-12 mt-2">
                        <button
                          type="button"
                          className="tagsUnit border p-2 cursor-pointer bg-[#99EA48] rounded-lg"
                          onClick={addMoreGrade}
                        >
                          <b>
                            <span className="font-s-18">+</span>
                            {data?.payload?.tech_lang_keys?.["26"] ||
                              "Add More"}
                          </b>
                        </button>
                      </div>

                      <div className="col-span-12 md:col-span-6 lg:col-span-6">
                        <label htmlFor="tech_target_letter" className="label">
                          {data?.payload?.tech_lang_keys?.["5"] ||
                            "Target Grade"}
                          :
                        </label>
                        <div className="mt-2">
                          <select
                            className="input"
                            name="tech_target_letter"
                            id="tech_target_letter"
                            value={formData.tech_target_letter}
                            onChange={handleChange}
                          >
                            <option value="A+">A+</option>
                            <option value="A">A</option>
                            <option value="A-">A-</option>
                            <option value="B+">B+</option>
                            <option value="B">B</option>
                            <option value="B-">B-</option>
                            <option value="C+">C+</option>
                            <option value="C">C</option>
                            <option value="C-">C-</option>
                            <option value="D+">D+</option>
                            <option value="D">D</option>
                            <option value="D-">D-</option>
                            <option value="F">F</option>
                          </select>
                        </div>
                      </div>

                      <div className="col-span-12 md:col-span-6 lg:col-span-6 target_grade2">
                        <label htmlFor="tech_total_weight2" className="label">
                          {data?.payload?.tech_lang_keys?.["17"] ||
                            "Total weights:"}
                          :
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_total_weight2"
                            id="tech_total_weight2"
                            className="input my-2"
                            placeholder="00"
                            value={formData.tech_total_weight2}
                            onChange={handleChange}
                          />
                          <span className="input_unit">%</span>
                        </div>
                      </div>

                      <div className="col-span-12 md:col-span-6 lg:col-span-6 target_grade2">
                        <label
                          htmlFor="tech_final_exam_weight3"
                          className="label"
                        >
                          {data?.payload?.tech_lang_keys?.["18"] ||
                            "Final Exam Weight:"}
                          :
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_final_exam_weight3"
                            id="tech_final_exam_weight3"
                            className="input my-2"
                            placeholder="00"
                            value={formData.tech_final_exam_weight3}
                            onChange={handleChange}
                          />
                          <span className="input_unit">%</span>
                        </div>
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Submit and Reset Buttons */}
          <div className="mb-6 mt-10 text-center space-x-2">
            <Button type="submit" isLoading={roundToTheNearestLoading}>
              {data?.payload?.tech_lang_keys?.["calculate"] || "CALCULATE"}
            </Button>
            {result && (
              <ResetButton type="button" onClick={handleReset}>
                {data?.payload?.tech_lang_keys?.["locale"] === "en"
                  ? "RESET"
                  : data?.payload?.tech_lang_keys?.["reset"] || "RESET"}
              </ResetButton>
            )}
          </div>
        </div>

        {/* Loading State */}
        {roundToTheNearestLoading && (
          <div className="w-full mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg space-y-6 result">
            <div className="animate-pulse">
              <div className="w-full h-[30px] bg-gray-200 animate-pulse rounded-[10px] mb-4"></div>
              <div className="w-[75%] h-[20px] bg-gray-200 animate-pulse rounded-[10px] mb-3"></div>
              <div className="w-[50%] h-[20px] bg-gray-200 animate-pulse rounded-[10px] mb-3"></div>
              <div className="w-[25%] h-[20px] bg-gray-200 animate-pulse rounded-[10px]"></div>
            </div>
          </div>
        )}

        {/* Results Display */}
        {!roundToTheNearestLoading && result && (
          <div className="w-full result mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg space-y-6">
            <div>
              <ResultActions lang={data?.payload?.tech_lang_keys} />

              <div className="rounded-lg flex items-center justify-center">
                <div className="w-full mt-3">
                  <div className="w-full text-[18px] text-center">
                    <div className="w-full text-[18px] text-center">
                      {/* tech_subtraction + tech_read */}
                      {result?.tech_subtraction && result?.tech_read && (
                        <>
                          <p>
                            <strong>{result?.tech_read}</strong>
                          </p>

                          <p>
                            <span className="text-blue text-[20px]">
                              {data?.payload?.tech_lang_keys[29]}
                            </span>
                          {" "}
                            <span className="text-blue font-semibold text-[20px] my-2">
                              {result?.tech_subtraction}
                            </span>
                              {" "}
                            <span className="black-text">%</span>
                            {data?.payload?.tech_lang_keys[32]}
                          </p>
                        </>
                      )}

                      {/* tech_final_result */}
                      {result?.tech_final_result && (
                        <>
                          <p>{data?.payload?.tech_lang_keys[33]}</p>
                          {" "}
                          <p className="text-blue font-semibold text-[20px] my-2">
                            <strong>
                              {Math.round(result?.tech_final_result, 2)}
                            </strong>
                          </p>
                        </>
                      )}

                      {/* tech_fg */}
                      {result?.tech_fg && (
                        <>
                          <p>{data?.payload?.tech_lang_keys[33]}</p>
                          {" "}
                          <p className="text-blue font-semibold text-[20px] my-2">
                            <strong>
                              {result?.tech_fg.toFixed(2)} (
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

                              <tbody>
                                {result?.tech_method == "3" &&
                                  drawTable(cg, cgw, fgw).map((row, i) => (
                                    <tr key={i}>
                                      <td className="border-b py-2">
                                        {row.cg}
                                      </td>
                                      <td className="border-b py-2">{row.g}</td>
                                      <td className="border-b py-2">
                                        {row.grade}
                                      </td>
                                    </tr>
                                  ))}
                              </tbody>
                            </table>
                          </div>
                        </>
                      )}

                      {/* tech_Grades */}
                      {result?.tech_Grades && (
                        <p className="text-blue font-semibold text-[20px] my-2">
                          {data?.payload?.tech_lang_keys[30]}{" "}
                          {result?.tech_Grades}{" "}
                          {data?.payload?.tech_lang_keys[31]}
                        </p>
                      )}

                      {result?.tech_fg2 && (
                        <>
                          <p>{data?.payload?.tech_lang_keys[33]}</p>
                          {" "}
                          <p>
                            <strong>
                              {result?.tech_fg2.toFixed(2)} (
                              {result?.tech_assign_grade}{" "}
                              {data?.payload?.tech_lang_keys[34]})
                            </strong>
                          </p>
                               {" "}   
                          <p>
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

                            <tbody>
                              {result?.tech_method4 == "4" &&
                                drawLetterTable(cg2, cgw2, difference).map(
                                  (row, i) => (
                                    <tr key={i}>
                                      <td className="border-b py-2">
                                        {row.cg}
                                      </td>
                                      <td className="border-b py-2">{row.g}</td>
                                      <td className="border-b py-2">
                                        {row.grade}
                                      </td>
                                    </tr>
                                  )
                                )}
                            </tbody>
                          </table>
                        </>
                      )}

                      {/* tech_nawaz Messages */}
                      {result?.tech_nawaz && (
                        <>
                          {(result?.tech_nawaz ===
                            "CONGRATULATIONS!!\nNo matter what you do, you will get your desired grade or higher!\nJust check the requirements of your particular subject" ||
                            result?.tech_nawaz ===
                              "I am sorry, but with your current grades it is impossible to get the grade you want.") && (
                            <p>
                              {" "}
                              <span className="text-blue font-semibold text-[20px] my-2">
                                {result?.tech_nawaz}
                              </span>
                            </p>
                          )}

                          {!(
                            result?.tech_nawaz ===
                              "CONGRATULATIONS!!\nNo matter what you do, you will get your desired grade or higher!\nJust check the requirements of your particular subject" ||
                            result?.tech_nawaz ===
                              "I am sorry, but with your current grades it is impossible to get the grade you want."
                          ) && (
                            <p>
                              {" "}
                              <span className="text-blue font-semibold text-[20px] my-2">
                                {data?.payload?.tech_lang_keys[30]}
                              </span>
                              {" "}
                              <span className="text-blue font-semibold text-[20px] my-2">
                                {result?.tech_nawaz} 
                              </span> 
                              {" "}
                              {data?.payload?.tech_lang_keys[31]}
                            </p>
                          )}
                        </>
                      )}

                      {/* final_ten + final_eleven */}
                      {result?.tech_final_ten && result?.tech_final_eleven && (
                        <>
                          {result?.tech_final > 10000 && (
                            <p>
                              <span className="text-blue font-semibold text-[20px] my-2">
                                {result?.tech_final_eleven}
                              </span>
                            </p>
                          )}

                          {result?.tech_final < 0 && (
                            <p>
                              <span className="font_size28 center margin_top_10 text-accent-4">
                                {result?.tech_final_eleven}
                              </span>
                            </p>
                          )}

                          {result?.tech_final > 0 &&
                            result?.tech_final < 10000 && (
                              <p>
                                <span>{data?.payload?.tech_lang_keys[30]}</span>
                              {" "}
                                <span className="text-blue font text-[20px] my-2">
                                  {result?.tech_final_eleven}
                                </span>
                                {" "}
                                {data?.payload?.tech_lang_keys[31]}
                              </p>
                            )}

                          <p>
                            <span>{data?.payload?.tech_lang_keys[29]} </span>
                              {" "}
                            <span className="text-blue font-semibold text-[20px] my-2">
                              {result?.tech_final_ten}
                            </span>
                              {" "}
                            <span className="black-text">%</span>

                            {data?.payload?.tech_lang_keys[32]}
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </form>

      {result && (
        <CalculatorFeedback calName={data?.payload?.tech_calculator_title} />
      )}
    </Calculator>
  );
};

export default GradeCalculator;

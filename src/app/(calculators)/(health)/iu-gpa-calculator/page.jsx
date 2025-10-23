"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import {
  useGetSingleCalculatorDetailsMutation,
  useMidpointCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const IUGPACalculator = () => {
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
  // data get

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook   // data get
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useMidpointCalculatorMutation();
  // data get

  const [courses, setCourses] = useState([
    { id: 1, name: "", credits: "", grade: "", gradePoints: 0 },
  ]);
  const [currentGPA, setCurrentGPA] = useState("");
  const [currentCredits, setCurrentCredits] = useState("");
  const [targetGPA, setTargetGPA] = useState("");
  const [results, setResults] = useState(null);
  const [calculatorMode, setCalculatorMode] = useState("semester"); // semester, cumulative, target

  // Indiana University Grade Scale
  const gradeScale = {
    "A+": 4.0,
    A: 4.0,
    "A-": 3.7,
    "B+": 3.3,
    B: 3.0,
    "B-": 2.7,
    "C+": 2.3,
    C: 2.0,
    "C-": 1.7,
    "D+": 1.3,
    D: 1.0,
    "D-": 0.7,
    F: 0.0,
    I: 0.0,
    W: 0.0,
    P: 0.0,
    NP: 0.0,
  };

  const addCourse = () => {
    const newId = Math.max(...courses.map((c) => c.id)) + 1;
    setCourses([
      ...courses,
      { id: newId, name: "", credits: "", grade: "", gradePoints: 0 },
    ]);
  };

  const removeCourse = (id) => {
    if (courses.length > 1) {
      setCourses(courses.filter((course) => course.id !== id));
    }
  };

  const updateCourse = (id, field, value) => {
    setCourses(
      courses.map((course) => {
        if (course.id === id) {
          const updatedCourse = { ...course, [field]: value };
          if (field === "grade") {
            updatedCourse.gradePoints = gradeScale[value] || 0;
          }
          return updatedCourse;
        }
        return course;
      })
    );
  };

  const calculateSemesterGPA = () => {
    const validCourses = courses.filter(
      (c) => c.credits && c.grade && c.grade !== "W"
    );
    if (validCourses.length === 0) return null;

    const totalCredits = validCourses.reduce(
      (sum, course) => sum + parseFloat(course.credits),
      0
    );
    const totalPoints = validCourses.reduce(
      (sum, course) =>
        sum + parseFloat(course.credits) * gradeScale[course.grade],
      0
    );

    return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(3) : 0;
  };

  const calculateCumulativeGPA = () => {
    if (!currentGPA || !currentCredits) return null;

    const validCourses = courses.filter(
      (c) => c.credits && c.grade && c.grade !== "W"
    );
    const newCredits = validCourses.reduce(
      (sum, course) => sum + parseFloat(course.credits),
      0
    );
    const newPoints = validCourses.reduce(
      (sum, course) =>
        sum + parseFloat(course.credits) * gradeScale[course.grade],
      0
    );

    const totalCredits = parseFloat(currentCredits) + newCredits;
    const totalPoints =
      parseFloat(currentGPA) * parseFloat(currentCredits) + newPoints;

    return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(3) : 0;
  };

  const calculateTargetGPA = () => {
    if (!targetGPA || !currentGPA || !currentCredits) return null;

    const target = parseFloat(targetGPA);
    const current = parseFloat(currentGPA);
    const currentCreds = parseFloat(currentCredits);

    const validCourses = courses.filter(
      (c) => c.credits && c.grade && c.grade !== "W"
    );
    const newCredits = validCourses.reduce(
      (sum, course) => sum + parseFloat(course.credits),
      0
    );

    const requiredPoints =
      target * (currentCreds + newCredits) - current * currentCreds;
    const requiredGPA = newCredits > 0 ? requiredPoints / newCredits : 0;

    return {
      requiredGPA: Math.max(0, requiredGPA).toFixed(3),
      achievable: requiredGPA <= 4.0,
      newCredits,
    };
  };

  const resetCalculator = () => {
    setCourses([{ id: 1, name: "", credits: "", grade: "", gradePoints: 0 }]);
    setCurrentGPA("");
    setCurrentCredits("");
    setTargetGPA("");
    setResults(null);
  };

  const exportData = () => {
    const data = {
      courses,
      currentGPA,
      currentCredits,
      targetGPA,
      calculatorMode,
      timestamp: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `iu-gpa-calculation-${
      new Date().toISOString().split("T")[0]
    }.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importData = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          setCourses(
            data.courses || [
              { id: 1, name: "", credits: "", grade: "", gradePoints: 0 },
            ]
          );
          setCurrentGPA(data.currentGPA || "");
          setCurrentCredits(data.currentCredits || "");
          setTargetGPA(data.targetGPA || "");
          setCalculatorMode(data.calculatorMode || "semester");
        } catch (error) {
          alert("Invalid file format");
        }
      };
      reader.readAsText(file);
    }
  };

  const calculateResults = () => {
    let result = {};

    if (calculatorMode === "semester") {
      const semesterGPA = calculateSemesterGPA();
      result = {
        semesterGPA,
        totalCredits: courses.reduce(
          (sum, course) =>
            course.credits && course.grade && course.grade !== "W"
              ? sum + parseFloat(course.credits)
              : sum,
          0
        ),
        validCourses: courses.filter(
          (c) => c.credits && c.grade && c.grade !== "W"
        ).length,
      };
    } else if (calculatorMode === "cumulative") {
      const cumulativeGPA = calculateCumulativeGPA();
      const semesterGPA = calculateSemesterGPA();
      result = {
        cumulativeGPA,
        semesterGPA,
        totalCredits:
          parseFloat(currentCredits || 0) +
          courses.reduce(
            (sum, course) =>
              course.credits && course.grade && course.grade !== "W"
                ? sum + parseFloat(course.credits)
                : sum,
            0
          ),
      };
    } else if (calculatorMode === "target") {
      const targetResult = calculateTargetGPA();
      const semesterGPA = calculateSemesterGPA();
      result = {
        targetResult,
        semesterGPA,
        currentGPA: parseFloat(currentGPA),
      };
    }

    setResults(result);
  };

  const getGPAStatus = (gpa) => {
    if (gpa >= 3.7)
      return {
        status: "Excellent",
        color: "text-green-600",
        bg: "bg-green-50",
      };
    if (gpa >= 3.3)
      return { status: "Good", color: "text-blue-600", bg: "bg-blue-50" };
    if (gpa >= 3.0)
      return {
        status: "Satisfactory",
        color: "text-yellow-600",
        bg: "bg-yellow-50",
      };
    if (gpa >= 2.0)
      return {
        status: "Below Average",
        color: "text-orange-600",
        bg: "bg-orange-50",
      };
    return { status: "Poor", color: "text-red-600", bg: "bg-red-50" };
  };

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
      <div className="w-full mx-auto p-4 lg:p-8 md:p-8 input_form rounded-lg space-y-6 mb-3">
        {formError && (
          <p className="text-red-500 text-lg font-semibold w-full">
            {formError}
          </p>
        )}
        <div className="max-w-6xl mx-auto  ">
          {/* Calculator Mode Selector */}
          <div className=" rounded-xl  mb-6">
            <h2 className="text-xl font-semibold mb-4"> Calculator Mode</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  mode: "semester",
                  title: "Semester GPA",
                  desc: "Calculate GPA for current semester",
                },
                {
                  mode: "cumulative",
                  title: "Cumulative GPA",
                  desc: "Calculate overall GPA including previous terms",
                },
                {
                  mode: "target",
                  title: "Target GPA",
                  desc: "Find required GPA to reach your goal",
                },
              ].map(({ mode, title, desc, emoji }) => (
                <button
                  key={mode}
                  onClick={() => setCalculatorMode(mode)}
                  className={`p-4 rounded-lg border-2 transition-all text-left cursor-pointer ${
                    calculatorMode === mode
                      ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                      : "border-gray-200 hover:border-indigo-300"
                  }`}
                >
                  <h3 className="font-semibold">{title}</h3>
                  <p className="text-sm text-gray-600">{desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Previous GPA Input (for cumulative and target modes) */}
          {(calculatorMode === "cumulative" || calculatorMode === "target") && (
            <div className=" rounded-xl  mb-6">
              <h2 className="text-xl font-semibold mb-4">
                {" "}
                Previous Academic Record
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Cumulative GPA
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="4"
                    value={currentGPA}
                    onChange={(e) => setCurrentGPA(e.target.value)}
                    className="input"
                    placeholder="e.g., 3.25"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Total Completed Credit Hours
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    value={currentCredits}
                    onChange={(e) => setCurrentCredits(e.target.value)}
                    className="input"
                    placeholder="e.g., 60"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Target GPA Input (for target mode) */}
          {calculatorMode === "target" && (
            <div className=" rounded-xl  p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4"> Target GPA Goal</h2>
              <div className="max-w-md">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Desired Cumulative GPA
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="4"
                  value={targetGPA}
                  onChange={(e) => setTargetGPA(e.target.value)}
                  className="input"
                  placeholder="e.g., 3.5"
                />
              </div>
            </div>
          )}

          {/* Course Input Section */}
          <div className=" rounded-xl  mb-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold"> Course Information</h2>
              <button
                onClick={addCourse}
                className="px-4 py-2 bg-indigo-600 cursor-pointer text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Add Course
              </button>
            </div>

            <div className="space-y-4">
              {courses.map((course, index) => (
                <div
                  key={course.id}
                  className="grid grid-cols-12 gap-3 items-end p-4 bg-gray-50 rounded-lg"
                >
                  <div className="col-span-12 md:col-span-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Course Name
                    </label>
                    <input
                      type="text"
                      value={course.name}
                      onChange={(e) =>
                        updateCourse(course.id, "name", e.target.value)
                      }
                      className="input"
                      placeholder="e.g., MATH-M 215"
                    />
                  </div>

                  <div className="col-span-6 md:col-span-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Credit Hours
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      max="6"
                      value={course.credits}
                      onChange={(e) =>
                        updateCourse(course.id, "credits", e.target.value)
                      }
                      className="input"
                      placeholder="3"
                    />
                  </div>

                  <div className="col-span-6 md:col-span-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Grade
                    </label>
                    <select
                      value={course.grade}
                      onChange={(e) =>
                        updateCourse(course.id, "grade", e.target.value)
                      }
                      className="input"
                    >
                      <option value="">Select Grade</option>
                      {Object.keys(gradeScale).map((grade) => (
                        <option key={grade} value={grade}>
                          {grade} ({gradeScale[grade].toFixed(1)})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-span-12 md:col-span-2 flex justify-end">
                    <button
                      onClick={() => removeCourse(course.id)}
                      disabled={courses.length === 1}
                      className="p-2 text-red-500 cursor-pointer hover:bg-red-50 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Remove Course"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-6 mt-10 text-center space-x-2">
            <Button
              type="submit"
              isLoading={roundToTheNearestLoading}
              onClick={calculateResults}
            >
              {data?.payload?.tech_lang_keys["calculate"]}
            </Button>
            {results && (
              <ResetButton type="button" onClick={resetCalculator}>
                {data?.payload?.tech_lang_keys["locale"] === "en"
                  ? "RESET"
                  : data?.payload?.tech_lang_keys["reset"] || "RESET"}
              </ResetButton>
            )}
            {results && (
              <>
                <button
                  onClick={exportData}
                  className="calculate px-6 py-3  font-semibold bg-[#2845F5] text-white cursor-pointer rounded-[30px] focus:outline-none focus:ring-2 text-[14px]"
                >
                  Export Data
                </button>

                <label className="calculate px-6 py-3  font-semibold bg-[#2845F5] text-white cursor-pointer rounded-[30px] focus:outline-none focus:ring-2 text-[14px]">
                  Import Data
                  <input
                    type="file"
                    accept=".json"
                    onChange={importData}
                    className="hidden"
                  />
                </label>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Results Section */}
      {results && (
        <>
          <div className="w-full result mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg space-y-6 result">
            <div>
              <ResultActions lang={data?.payload?.tech_lang_keys} />

              <div className="rounded-xl  mt-2">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {calculatorMode === "semester" && results.semesterGPA && (
                    <div
                      className={`p-6 rounded-lg ${
                        getGPAStatus(parseFloat(results.semesterGPA)).bg
                      }`}
                    >
                      <h3 className="font-semibold text-gray-700 mb-2">
                        {" "}
                        Semester GPA
                      </h3>
                      <div
                        className={`text-3xl font-bold ${
                          getGPAStatus(parseFloat(results.semesterGPA)).color
                        }`}
                      >
                        {results.semesterGPA}
                      </div>
                      <p
                        className={`text-sm ${
                          getGPAStatus(parseFloat(results.semesterGPA)).color
                        }`}
                      >
                        {getGPAStatus(parseFloat(results.semesterGPA)).status}
                      </p>
                      <p className="text-sm text-gray-600 mt-2">
                        Total Credits: {results.totalCredits}
                      </p>
                    </div>
                  )}

                  {calculatorMode === "cumulative" && results.cumulativeGPA && (
                    <>
                      <div
                        className={`p-6 rounded-lg ${
                          getGPAStatus(parseFloat(results.cumulativeGPA)).bg
                        }`}
                      >
                        <h3 className="font-semibold text-gray-700 mb-2">
                          {" "}
                          Cumulative GPA
                        </h3>
                        <div
                          className={`text-3xl font-bold ${
                            getGPAStatus(parseFloat(results.cumulativeGPA))
                              .color
                          }`}
                        >
                          {results.cumulativeGPA}
                        </div>
                        <p
                          className={`text-sm ${
                            getGPAStatus(parseFloat(results.cumulativeGPA))
                              .color
                          }`}
                        >
                          {
                            getGPAStatus(parseFloat(results.cumulativeGPA))
                              .status
                          }
                        </p>
                        <p className="text-sm text-gray-600 mt-2">
                          Total Credits: {results.totalCredits}
                        </p>
                      </div>

                      {results.semesterGPA && (
                        <div
                          className={`p-6 rounded-lg ${
                            getGPAStatus(parseFloat(results.semesterGPA)).bg
                          }`}
                        >
                          <h3 className="font-semibold text-gray-700 mb-2">
                            {" "}
                            This Semester
                          </h3>
                          <div
                            className={`text-3xl font-bold ${
                              getGPAStatus(parseFloat(results.semesterGPA))
                                .color
                            }`}
                          >
                            {results.semesterGPA}
                          </div>
                          <p
                            className={`text-sm ${
                              getGPAStatus(parseFloat(results.semesterGPA))
                                .color
                            }`}
                          >
                            {
                              getGPAStatus(parseFloat(results.semesterGPA))
                                .status
                            }
                          </p>
                        </div>
                      )}
                    </>
                  )}

                  {calculatorMode === "target" && results.targetResult && (
                    <>
                      <div
                        className={`p-6 rounded-lg ${
                          results.targetResult.achievable
                            ? "bg-green-50"
                            : "bg-red-50"
                        }`}
                      >
                        <h3 className="font-semibold text-gray-700 mb-2">
                          {" "}
                          Required Semester GPA
                        </h3>
                        <div
                          className={`text-3xl font-bold ${
                            results.targetResult.achievable
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {results.targetResult.requiredGPA}
                        </div>
                        <p
                          className={`text-sm ${
                            results.targetResult.achievable
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {results.targetResult.achievable
                            ? "✅ Achievable"
                            : "❌ Not Achievable"}
                        </p>
                        <p className="text-sm text-gray-600 mt-2">
                          For {results.targetResult.newCredits} new credits
                        </p>
                      </div>

                      {results.semesterGPA && (
                        <div
                          className={`p-6 rounded-lg ${
                            getGPAStatus(parseFloat(results.semesterGPA)).bg
                          }`}
                        >
                          <h3 className="font-semibold text-gray-700 mb-2">
                            {" "}
                            Current Semester
                          </h3>
                          <div
                            className={`text-3xl font-bold ${
                              getGPAStatus(parseFloat(results.semesterGPA))
                                .color
                            }`}
                          >
                            {results.semesterGPA}
                          </div>
                          <p
                            className={`text-sm ${
                              getGPAStatus(parseFloat(results.semesterGPA))
                                .color
                            }`}
                          >
                            {
                              getGPAStatus(parseFloat(results.semesterGPA))
                                .status
                            }
                          </p>
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* Additional Insights */}
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-700 mb-2">
                    {" "}
                    Academic Insights
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                    {calculatorMode === "semester" && results.semesterGPA && (
                      <>
                        <p>
                          • Dean's List requires 3.5+ GPA with 12+ credit hours
                        </p>
                        <p>• Graduation with honors: 3.7+ (cum laude)</p>
                        <p>• High Distinction: 3.9+ GPA</p>
                        <p>• Academic Excellence: Above 3.5 GPA</p>
                      </>
                    )}
                    {calculatorMode === "cumulative" && (
                      <>
                        <p>• Academic probation: Below 2.0 cumulative GPA</p>
                        <p>• Good academic standing: 2.0+ cumulative GPA</p>
                        <p>
                          • Honor society eligibility: 3.5+ GPA typically
                          required
                        </p>
                        <p>
                          • Graduate school competitive: 3.0+ GPA recommended
                        </p>
                      </>
                    )}
                    {calculatorMode === "target" && results.targetResult && (
                      <>
                        <p>
                          •{" "}
                          {results.targetResult.achievable
                            ? "🎉 Your goal is achievable!"
                            : "⚠️ Consider adjusting your target or taking more credits"}
                        </p>
                        <p>• Focus on courses where you can excel</p>
                        <p>• Consider retaking courses with low grades</p>
                        <p>• Seek academic support services if needed</p>
                      </>
                    )}
                  </div>
                </div>
              </div>
              {/* Grade Scale Reference */}
              <div className=" rounded-xl mt-2">
                <h2 className="text-xl font-semibold mb-4">
                  {" "}
                  Indiana University Grade Scale
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {Object.entries(gradeScale).map(([grade, points]) => (
                    <div
                      key={grade}
                      className="text-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="font-bold text-lg">{grade}</div>
                      <div className="text-sm text-gray-600">
                        {points.toFixed(1)} points
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Course Summary */}
              <div className=" rounded-xl mt-2 ">
                <h2 className="text-xl font-semibold mb-4"> Course Summary</h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 bg-white">
                        <th className="text-left py-3 px-2">Course</th>
                        <th className="text-center py-3 px-2">Credits</th>
                        <th className="text-center py-3 px-2">Grade</th>
                        <th className="text-center py-3 px-2">Grade Points</th>
                        <th className="text-center py-3 px-2">
                          Quality Points
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {courses.map((course) => (
                        <tr
                          key={course.id}
                          className="border-b border-gray-100 hover:bg-gray-50"
                        >
                          <td className="py-3 px-2">
                            {course.name || "Unnamed Course"}
                          </td>
                          <td className="text-center py-3 px-2">
                            {course.credits || "-"}
                          </td>
                          <td className="text-center py-3 px-2">
                            <span
                              className={`px-2 py-1 rounded text-sm font-medium ${
                                course.grade
                                  ? "bg-indigo-100 text-indigo-800"
                                  : "text-gray-400"
                              }`}
                            >
                              {course.grade || "-"}
                            </span>
                          </td>
                          <td className="text-center py-3 px-2">
                            {course.gradePoints.toFixed(1)}
                          </td>
                          <td className="text-center py-3 px-2">
                            {course.credits && course.grade
                              ? (
                                  parseFloat(course.credits) *
                                  course.gradePoints
                                ).toFixed(1)
                              : "-"}
                          </td>
                        </tr>
                      ))}
                      <tr className="border-t-2 border-gray-300 font-semibold bg-gray-50">
                        <td className="py-3 px-2"> TOTALS</td>
                        <td className="text-center py-3 px-2 text-indigo-600">
                          {courses
                            .reduce(
                              (sum, course) =>
                                course.credits &&
                                course.grade &&
                                course.grade !== "W"
                                  ? sum + parseFloat(course.credits)
                                  : sum,
                              0
                            )
                            .toFixed(1)}
                        </td>
                        <td className="text-center py-3 px-2">-</td>
                        <td className="text-center py-3 px-2">-</td>
                        <td className="text-center py-3 px-2 text-indigo-600">
                          {courses
                            .reduce(
                              (sum, course) =>
                                course.credits &&
                                course.grade &&
                                course.grade !== "W"
                                  ? sum +
                                    parseFloat(course.credits) *
                                      course.gradePoints
                                  : sum,
                              0
                            )
                            .toFixed(1)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <CalculatorFeedback calName={data?.payload?.tech_calculator_title} />
    </Calculator>
  );
};

export default IUGPACalculator;

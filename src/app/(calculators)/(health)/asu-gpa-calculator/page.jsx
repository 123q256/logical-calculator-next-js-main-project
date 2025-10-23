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

const AsuGpaCalculator = () => {
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
      await getSingleCalculatorDetails({ tech_calculator_link: url });
    } catch (err) {
      console.error("Error fetching calculator details:", err);
    }
  };

  useEffect(() => {
    handleFetchDetails();
  }, [url]);

  // GPA Calculator State
  const [courses, setCourses] = useState([
    { id: 1, courseName: "", creditHours: "", grade: "", gradePoints: 0 },
  ]);
  const [currentGPA, setCurrentGPA] = useState("");
  const [currentCredits, setCurrentCredits] = useState("");
  const [results, setResults] = useState(null);
  const [activeTab, setActiveTab] = useState("semester");

  // ASU Grade Scale
  const gradeScale = {
    "A+": 4.33,
    A: 4.0,
    "A-": 3.67,
    "B+": 3.33,
    B: 3.0,
    "B-": 2.67,
    "C+": 2.33,
    C: 2.0,
    "C-": 1.67,
    "D+": 1.33,
    D: 1.0,
    "D-": 0.67,
    F: 0.0,
    W: 0.0,
    I: 0.0,
  };

  const addCourse = () => {
    const newId = Math.max(...courses.map((c) => c.id)) + 1;
    setCourses([
      ...courses,
      {
        id: newId,
        courseName: "",
        creditHours: "",
        grade: "",
        gradePoints: 0,
      },
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

  const calculateGPA = () => {
    const validCourses = courses.filter(
      (course) => course.creditHours && course.grade && course.courseName.trim()
    );

    if (validCourses.length === 0) {
      alert("Please add at least one complete course!");
      return;
    }

    let totalPoints = 0;
    let totalCredits = 0;

    validCourses.forEach((course) => {
      const credits = parseFloat(course.creditHours);
      const points = gradeScale[course.grade] || 0;
      totalPoints += credits * points;
      totalCredits += credits;
    });

    const semesterGPA = totalCredits > 0 ? totalPoints / totalCredits : 0;

    let cumulativeGPA = semesterGPA;
    let totalCumulativeCredits = totalCredits;

    if (activeTab === "cumulative" && currentGPA && currentCredits) {
      const prevCredits = parseFloat(currentCredits);
      const prevGPA = parseFloat(currentGPA);
      const prevPoints = prevCredits * prevGPA;

      totalCumulativeCredits = totalCredits + prevCredits;
      cumulativeGPA =
        totalCumulativeCredits > 0
          ? (totalPoints + prevPoints) / totalCumulativeCredits
          : 0;
    }

    setResults({
      semesterGPA: semesterGPA.toFixed(3),
      cumulativeGPA: cumulativeGPA.toFixed(3),
      totalCredits: totalCredits,
      totalCumulativeCredits: totalCumulativeCredits,
      courses: validCourses,
      gradeDistribution: getGradeDistribution(validCourses),
    });
  };

  const getGradeDistribution = (validCourses) => {
    const distribution = {};
    validCourses.forEach((course) => {
      distribution[course.grade] = (distribution[course.grade] || 0) + 1;
    });
    return distribution;
  };

  const resetCalculator = () => {
    setCourses([
      { id: 1, courseName: "", creditHours: "", grade: "", gradePoints: 0 },
    ]);
    setCurrentGPA("");
    setCurrentCredits("");
    setResults(null);
  };

  const getGPAColor = (gpa) => {
    const numGPA = parseFloat(gpa);
    if (numGPA >= 3.7) return "text-green-600";
    if (numGPA >= 3.0) return "text-blue-600";
    if (numGPA >= 2.0) return "text-yellow-600";
    return "text-red-600";
  };

  const getGPAStatus = (gpa) => {
    const numGPA = parseFloat(gpa);
    if (numGPA >= 3.85)
      return { text: "Summa Cum Laude", color: "text-yellow-600" };
    if (numGPA >= 3.6)
      return { text: "Magna Cum Laude", color: "text-blue-600" };
    if (numGPA >= 3.4) return { text: "Cum Laude", color: "text-green-600" };
    if (numGPA >= 2.0) return { text: "Good Standing", color: "text-gray-600" };
    return { text: "Academic Probation", color: "text-red-600" };
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
          path: pathname,
        },
      ]}
    >
      <div className="w-full mx-auto p-4 lg:p-8 md:p-8 input_form rounded-lg space-y-6 mb-3">
        <div className="w-full mx-auto">
          {/* Tab Navigation */}
          <div className="flex justify-center mb-6">
            <div className="bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setActiveTab("semester")}
                className={`px-6 py-3 rounded-md font-medium transition-all flex items-center cursor-pointer gap-2 ${
                  activeTab === "semester"
                    ? "bg-white text-red-600 shadow-sm transform scale-105"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
                </svg>
                Semester GPA
              </button>
              <button
                onClick={() => setActiveTab("cumulative")}
                className={`px-6 py-3 rounded-md font-medium transition-all flex items-center cursor-pointer gap-2 ${
                  activeTab === "cumulative"
                    ? "bg-white text-red-600 shadow-sm transform scale-105"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z" />
                </svg>
                Cumulative GPA
              </button>
            </div>
          </div>
          {/* Current GPA Input (for cumulative) */}
          {activeTab === "cumulative" && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl mb-6 bordered border-blue-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-blue-600"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4zm2.5 2.25l1.77-1.77-1.06-1.06L18.5 17.5l-1.77-1.77-1.06 1.06L17.44 18.5l-1.77 1.77 1.06 1.06L18.5 19.56l1.77 1.77 1.06-1.06L19.56 18.5z" />
                </svg>
                Current Academic Record
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Cumulative GPA
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="4.33"
                    value={currentGPA}
                    onChange={(e) => setCurrentGPA(e.target.value)}
                    className="w-full px-4 py-3 bordered border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                    placeholder="e.g., 3.25"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Total Credit Hours
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={currentCredits}
                    onChange={(e) => setCurrentCredits(e.target.value)}
                    className="w-full px-4 py-3 bordered border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                    placeholder="e.g., 60"
                  />
                </div>
              </div>
            </div>
          )}
          {/* Grade Scale Reference */}
          <div className="bg-gray-50 p-6 rounded-xl mb-6 bordered">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <svg
                className="w-5 h-5 text-yellow-600"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              ASU Official Grading Scale
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {Object.entries(gradeScale).map(([grade, points]) => (
                <div
                  key={grade}
                  className="flex justify-between bg-white p-3 rounded-lg bordered shadow-sm hover:shadow-md transition-shadow"
                >
                  <span className="font-bold text-gray-800">{grade}</span>
                  <span className="text-gray-600 font-medium">
                    {points.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>
          {/* Course Input Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-800">
                Course Information
              </h3>
              <button
                onClick={addCourse}
                className="flex items-center gap-2 px-6 py-3 bg-black to-yellow-500 text-white rounded-lg hover:from-red-700 hover:to-yellow-600 transition-all transform hover:scale-105 shadow-lg"
              >
                <span className="text-lg">+</span>
                Add Course
              </button>
            </div>

            {courses.map((course, index) => (
              <div
                key={course.id}
                className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all"
              >
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                  <div className="md:col-span-5">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Course Name
                    </label>
                    <input
                      type="text"
                      value={course.courseName}
                      onChange={(e) =>
                        updateCourse(course.id, "courseName", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                      placeholder="e.g., Calculus I, Biology 101"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Credit Hours
                    </label>
                    <input
                      type="number"
                      min="0.5"
                      max="6"
                      step="0.5"
                      value={course.creditHours}
                      onChange={(e) =>
                        updateCourse(course.id, "creditHours", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                      placeholder="3"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Grade
                    </label>
                    <select
                      value={course.grade}
                      onChange={(e) =>
                        updateCourse(course.id, "grade", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                    >
                      <option value="">Select Grade</option>
                      {Object.keys(gradeScale).map((grade) => (
                        <option key={grade} value={grade}>
                          {grade} ({gradeScale[grade].toFixed(2)})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Grade Points
                    </label>
                    <input
                      type="text"
                      value={course.gradePoints.toFixed(2)}
                      readOnly
                      className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg text-gray-600 font-medium"
                    />
                  </div>

                  <div className="md:col-span-1">
                    {courses.length > 1 && (
                      <button
                        onClick={() => removeCourse(course.id)}
                        className="w-full flex items-center justify-center p-3 text-red-600 hover:bg-red-50 rounded-lg transition-all border border-red-200 hover:border-red-300"
                        title="Remove Course"
                      >
                        <span className="text-xl">🗑️</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* Action Buttons */}
          <div className="mb-6 mt-10 text-center space-x-2">
            <Button type="submit" onClick={calculateGPA}>
              {data?.payload?.tech_lang_keys["calculate"]}
            </Button>
            {results && (
              <ResetButton type="button" onClick={resetCalculator}>
                {data?.payload?.tech_lang_keys["locale"] === "en"
                  ? "RESET"
                  : data?.payload?.tech_lang_keys["reset"] || "RESET"}
              </ResetButton>
            )}
          </div>
        </div>
      </div>
      {/* Results Section */}
      {results && (
        <>
          <div className="w-full mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg space-y-6 result">
            <div>
              <ResultActions lang={data?.payload?.tech_lang_keys} />

              <div className="mt-8 space-y-6 animate-fadeIn">
                {/* Main GPA Results */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200 shadow-lg hover:shadow-xl transition-all">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-2xl"></span>
                      <h3 className="text-lg font-semibold text-gray-800">
                        Semester GPA
                      </h3>
                    </div>
                    <p
                      className={`text-4xl font-bold ${getGPAColor(
                        results.semesterGPA
                      )} mb-2`}
                    >
                      {results.semesterGPA}
                    </p>
                    <p className="text-sm text-gray-600">
                      {results.totalCredits} credit hours this semester
                    </p>
                  </div>

                  {activeTab === "cumulative" && (
                    <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200 shadow-lg hover:shadow-xl transition-all">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-2xl"></span>
                        <h3 className="text-lg font-semibold text-gray-800">
                          Cumulative GPA
                        </h3>
                      </div>
                      <p
                        className={`text-4xl font-bold ${getGPAColor(
                          results.cumulativeGPA
                        )} mb-2`}
                      >
                        {results.cumulativeGPA}
                      </p>
                      <p className="text-sm text-gray-600">
                        {results.totalCumulativeCredits} total credit hours
                      </p>
                    </div>
                  )}

                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200 shadow-lg hover:shadow-xl transition-all">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-2xl"></span>
                      <h3 className="text-lg font-semibold text-gray-800">
                        Academic Standing
                      </h3>
                    </div>
                    <p
                      className={`text-xl font-bold ${
                        getGPAStatus(
                          activeTab === "cumulative"
                            ? results.cumulativeGPA
                            : results.semesterGPA
                        ).color
                      } mb-2`}
                    >
                      {
                        getGPAStatus(
                          activeTab === "cumulative"
                            ? results.cumulativeGPA
                            : results.semesterGPA
                        ).text
                      }
                    </p>
                    <p className="text-sm text-gray-600">
                      Based on ASU standards
                    </p>
                  </div>
                </div>

                {/* Detailed Course Breakdown */}
                <div className="bg-white bordered rounded-xl p-6 shadow-lg">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    Detailed Course Breakdown
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b-2 border-gray-200 bg-gray-50">
                          <th className="text-left py-4 px-3 font-semibold text-gray-700">
                            Course Name
                          </th>
                          <th className="text-center py-4 px-3 font-semibold text-gray-700">
                            Credits
                          </th>
                          <th className="text-center py-4 px-3 font-semibold text-gray-700">
                            Grade
                          </th>
                          <th className="text-center py-4 px-3 font-semibold text-gray-700">
                            Grade Points
                          </th>
                          <th className="text-right py-4 px-3 font-semibold text-gray-700">
                            Quality Points
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {results.courses.map((course, index) => (
                          <tr
                            key={index}
                            className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                          >
                            <td className="py-4 px-3 font-medium text-gray-800">
                              {course.courseName}
                            </td>
                            <td className="text-center py-4 px-3 text-gray-600 font-medium">
                              {course.creditHours}
                            </td>
                            <td className="text-center py-4 px-3">
                              <span
                                className={`font-bold text-lg ${getGPAColor(
                                  course.gradePoints.toString()
                                )}`}
                              >
                                {course.grade}
                              </span>
                            </td>
                            <td className="text-center py-4 px-3 text-gray-600 font-medium">
                              {course.gradePoints.toFixed(2)}
                            </td>
                            <td className="text-right py-4 px-3 font-bold text-gray-800">
                              {(
                                parseFloat(course.creditHours) *
                                course.gradePoints
                              ).toFixed(2)}
                            </td>
                          </tr>
                        ))}
                        <tr className="border-t-2 border-gray-300 bg-gray-50 font-bold">
                          <td className="py-4 px-3 text-gray-800">TOTAL</td>
                          <td className="text-center py-4 px-3 text-gray-800">
                            {results.totalCredits}
                          </td>
                          <td className="text-center py-4 px-3">-</td>
                          <td className="text-center py-4 px-3">-</td>
                          <td className="text-right py-4 px-3 text-gray-800">
                            {results.courses
                              .reduce(
                                (total, course) =>
                                  total +
                                  parseFloat(course.creditHours) *
                                    course.gradePoints,
                                0
                              )
                              .toFixed(2)}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Grade Distribution */}
                <div className="bg-white bordered rounded-xl p-6 shadow-lg">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">
                    {" "}
                    Grade Distribution
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {Object.entries(results.gradeDistribution).map(
                      ([grade, count]) => (
                        <div
                          key={grade}
                          className="text-center p-4 bg-gradient-to-b from-gray-50 to-gray-100 rounded-lg bordered hover:shadow-md transition-all"
                        >
                          <div
                            className={`text-3xl font-bold mb-1 ${getGPAColor(
                              gradeScale[grade].toString()
                            )}`}
                          >
                            {grade}
                          </div>
                          <div className="text-sm text-gray-600">
                            {count} course{count !== 1 ? "s" : ""}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {gradeScale[grade].toFixed(2)} pts
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>

                {/* ASU Academic Information */}
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    {" "}
                    ASU Academic Standards & Requirements
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-sm text-gray-700">
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                        GPA Requirements
                      </h4>
                      <ul className="space-y-2">
                        <li className="flex justify-between">
                          <span>Minimum to Graduate:</span>
                          <span className="font-bold text-red-600">2.00</span>
                        </li>
                        <li className="flex justify-between">
                          <span>Good Standing:</span>
                          <span className="font-bold text-green-600">
                            2.00+
                          </span>
                        </li>
                        <li className="flex justify-between">
                          <span>Academic Probation:</span>
                          <span className="font-bold text-red-600">
                            &lt; 2.00
                          </span>
                        </li>
                      </ul>
                    </div>

                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                        Honors Recognition
                      </h4>
                      <ul className="space-y-2">
                        <li className="flex justify-between">
                          <span>Summa Cum Laude:</span>
                          <span className="font-bold text-yellow-600">
                            3.85+
                          </span>
                        </li>
                        <li className="flex justify-between">
                          <span>Magna Cum Laude:</span>
                          <span className="font-bold text-blue-600">
                            3.60-3.84
                          </span>
                        </li>
                        <li className="flex justify-between">
                          <span>Cum Laude:</span>
                          <span className="font-bold text-green-600">
                            3.40-3.59
                          </span>
                        </li>
                      </ul>
                    </div>

                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                        Dean's List
                      </h4>
                      <ul className="space-y-2">
                        <li className="flex justify-between">
                          <span>Minimum GPA:</span>
                          <span className="font-bold text-purple-600">
                            3.50
                          </span>
                        </li>
                        <li className="flex justify-between">
                          <span>Minimum Credits:</span>
                          <span className="font-bold text-purple-600">
                            12 hours
                          </span>
                        </li>
                        <li className="text-xs text-gray-500 mt-2">
                          Per semester requirement
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Performance Insights */}
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    {" "}
                    Performance Insights
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <h4 className="font-semibold mb-2"> GPA Analysis</h4>
                      <p className="text-gray-600">
                        Your {activeTab} GPA of{" "}
                        <span
                          className={`font-bold ${getGPAColor(
                            activeTab === "cumulative"
                              ? results.cumulativeGPA
                              : results.semesterGPA
                          )}`}
                        >
                          {activeTab === "cumulative"
                            ? results.cumulativeGPA
                            : results.semesterGPA}
                        </span>{" "}
                        places you in
                        <span
                          className={`font-bold ${
                            getGPAStatus(
                              activeTab === "cumulative"
                                ? results.cumulativeGPA
                                : results.semesterGPA
                            ).color
                          }`}
                        >
                          {" " +
                            getGPAStatus(
                              activeTab === "cumulative"
                                ? results.cumulativeGPA
                                : results.semesterGPA
                            ).text}
                        </span>{" "}
                        category.
                      </p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <h4 className="font-semibold mb-2">
                        {" "}
                        Graduation Progress
                      </h4>
                      <p className="text-gray-600">
                        You've completed{" "}
                        <span className="font-bold text-blue-600">
                          {results.totalCredits}
                        </span>{" "}
                        credit hours this semester.
                        {activeTab === "cumulative" && (
                          <span>
                            {" "}
                            Total:{" "}
                            <span className="font-bold text-green-600">
                              {results.totalCumulativeCredits}
                            </span>{" "}
                            credits.
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {results && (
        <CalculatorFeedback calName={data?.payload?.tech_calculator_title} />
      )}
    </Calculator>
  );
};

export default AsuGpaCalculator;

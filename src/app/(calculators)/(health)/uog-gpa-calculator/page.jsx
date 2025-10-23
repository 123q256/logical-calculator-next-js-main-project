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

const UogGpaCalculator = () => {
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

  // RTK mutation hook   // data get
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useMidpointCalculatorMutation();
  // data get

  const [courses, setCourses] = useState([
    { id: 1, courseName: "", creditHours: "", grade: "", gradePoints: 0 },
  ]);

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // Grade to GPA mapping (4.0 scale)
  const gradeMapping = {
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
    F: 0.0,
  };

  // Add new course
  const addCourse = () => {
    const newCourse = {
      id: Date.now(),
      courseName: "",
      creditHours: "",
      grade: "",
      gradePoints: 0,
    };
    setCourses([...courses, newCourse]);
  };

  // Remove course
  const removeCourse = (id) => {
    if (courses.length > 1) {
      setCourses(courses.filter((course) => course.id !== id));
    }
  };

  // Handle input changes
  const handleCourseChange = (id, field, value) => {
    setCourses(
      courses.map((course) => {
        if (course.id === id) {
          const updatedCourse = { ...course, [field]: value };

          // Calculate grade points when grade or credit hours change
          if (field === "grade" || field === "creditHours") {
            const gradeValue = field === "grade" ? value : course.grade;
            const creditValue =
              field === "creditHours"
                ? parseFloat(value) || 0
                : parseFloat(course.creditHours) || 0;
            updatedCourse.gradePoints =
              (gradeMapping[gradeValue] || 0) * creditValue;
          }

          return updatedCourse;
        }
        return course;
      })
    );
  };

  // Calculate GPA
  const calculateGPA = () => {
    // Validate inputs
    const validCourses = courses.filter(
      (course) =>
        course.courseName.trim() &&
        course.creditHours &&
        course.grade &&
        parseFloat(course.creditHours) > 0
    );

    if (validCourses.length === 0) {
      setFormError("Please add at least one complete course with valid data.");
      return;
    }

    setFormError("");

    // Calculate total grade points and credit hours
    let totalGradePoints = 0;
    let totalCreditHours = 0;

    validCourses.forEach((course) => {
      const creditHours = parseFloat(course.creditHours);
      const gradePoints = gradeMapping[course.grade] || 0;

      totalGradePoints += gradePoints * creditHours;
      totalCreditHours += creditHours;
    });

    const gpa =
      totalCreditHours > 0
        ? (totalGradePoints / totalCreditHours).toFixed(2)
        : 0;

    // Determine GPA status
    let status = "";
    let statusColor = "";

    if (gpa >= 3.5) {
      status = "Excellent";
      statusColor = "text-green-600";
    } else if (gpa >= 3.0) {
      status = "Good";
      statusColor = "text-blue-600";
    } else if (gpa >= 2.5) {
      status = "Satisfactory";
      statusColor = "text-yellow-600";
    } else if (gpa >= 2.0) {
      status = "Needs Improvement";
      statusColor = "text-orange-600";
    } else {
      status = "Poor";
      statusColor = "text-red-600";
    }

    setResult({
      gpa: parseFloat(gpa),
      totalCreditHours,
      totalGradePoints: totalGradePoints.toFixed(2),
      coursesCount: validCourses.length,
      status,
      statusColor,
      courses: validCourses,
    });
  };

  // Reset calculator
  const handleReset = () => {
    setCourses([
      { id: 1, courseName: "", creditHours: "", grade: "", gradePoints: 0 },
    ]);
    setResult(null);
    setFormError("");
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
      <div className="w-full mx-auto p-4 lg:p-8 md:p-8 input_form rounded-lg  space-y-6 mb-3">
        {formError && (
          <p className="text-red-500 text-lg font-semibold w-full">
            {formError}
          </p>
        )}
        <div className="from-blue-50 to-indigo-100 md:p-2">
          <div className=" mx-auto">
            {/* Main Calculator */}
            <div className=" rounded-xl  mb-6">
              {/* Course Input Form */}
              <div className="space-y-4">
                {courses.map((course, index) => (
                  <div
                    key={course.id}
                    className="bg-gray-50 p-4 rounded-lg bordered"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium text-gray-700">
                        Course {index + 1}
                      </h3>
                      {courses.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeCourse(course.id)}
                          className="text-red-500 hover:text-red-700 transition-colors px-2 py-1 rounded"
                        >
                          🗑️
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Course Name
                        </label>
                        <input
                          type="text"
                          value={course.courseName}
                          onChange={(e) =>
                            handleCourseChange(
                              course.id,
                              "courseName",
                              e.target.value
                            )
                          }
                          placeholder="e.g., Mathematics"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Credit Hours
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="6"
                          step="0.5"
                          value={course.creditHours}
                          onChange={(e) =>
                            handleCourseChange(
                              course.id,
                              "creditHours",
                              e.target.value
                            )
                          }
                          placeholder="3"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Grade
                        </label>
                        <select
                          value={course.grade}
                          onChange={(e) =>
                            handleCourseChange(
                              course.id,
                              "grade",
                              e.target.value
                            )
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select Grade</option>
                          {Object.keys(gradeMapping).map((grade) => (
                            <option key={grade} value={grade}>
                              {grade} ({gradeMapping[grade]})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Grade Points
                        </label>
                        <input
                          type="text"
                          value={course.gradePoints.toFixed(2)}
                          readOnly
                          className="w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-100 text-gray-600"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {/* Add Course Button */}
              <button
                type="button"
                onClick={addCourse}
                className="mt-4 flex items-center justify-center w-full py-2 px-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors"
              >
                <span className="mr-2">➕</span>
                Add Another Course
              </button>
              {/* Action Buttons */}
              <div className="mb-6 mt-10 text-center space-x-2">
                <Button
                  onClick={calculateGPA}
                  type="button"
                  disabled={isLoading}
                  className="px-8 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed font-semibold transition-colors"
                >
                  {isLoading ? "Calculating..." : "Calculate GPA"}
                </Button>

                {result && (
                  <ResetButton
                    type="button"
                    onClick={handleReset}
                    className="px-8 py-3 bg-gray-600 text-white rounded-md hover:bg-gray-700 font-semibold transition-colors"
                  >
                    RESET
                  </ResetButton>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Results */}
      {result && (
        <>
          <div className="w-full result mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg space-y-6 result">
            <div>
              <ResultActions lang={data?.payload?.tech_lang_keys} />
              <div className="rounded-lg  flex items-center justify-center">
                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-12  rounded-xl ">
                    {/* GPA Summary */}
                    <div className="bg-sky bordered mt-3 from-blue-500 to-indigo-600  rounded-lg p-6 mb-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                        <div>
                          <h3 className="text-lg font-medium ">Your GPA</h3>
                          <p className="text-3xl font-bold">{result.gpa}</p>
                          <p
                            className={`text-sm font-medium ${result.statusColor} bg-white px-2 py-1 rounded mt-2`}
                          >
                            {result.status}
                          </p>
                        </div>
                        <div>
                          <h3 className="text-lg font-medium ">
                            Total Credit Hours
                          </h3>
                          <p className="text-3xl font-bold">
                            {result.totalCreditHours}
                          </p>
                        </div>
                        <div>
                          <h3 className="text-lg font-medium ">Courses</h3>
                          <p className="text-3xl font-bold">
                            {result.coursesCount}
                          </p>
                        </div>
                      </div>
                    </div>
                    {/* Detailed Breakdown */}
                    <div className="mb-6">
                      <h3 className="text-xl font-semibold mb-4 text-gray-800">
                        Course Breakdown
                      </h3>
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse border border-gray-200">
                          <thead>
                            <tr className="bg-gray-50">
                              <th className="border border-gray-200 px-4 py-2 text-left">
                                Course Name
                              </th>
                              <th className="border border-gray-200 px-4 py-2 text-center">
                                Credit Hours
                              </th>
                              <th className="border border-gray-200 px-4 py-2 text-center">
                                Grade
                              </th>
                              <th className="border border-gray-200 px-4 py-2 text-center">
                                Grade Points
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {result.courses.map((course, index) => (
                              <tr key={index} className="hover:bg-gray-50">
                                <td className="border border-gray-200 px-4 py-2">
                                  {course.courseName}
                                </td>
                                <td className="border border-gray-200 px-4 py-2 text-center">
                                  {course.creditHours}
                                </td>
                                <td className="border border-gray-200 px-4 py-2 text-center">
                                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                    {course.grade}
                                  </span>
                                </td>
                                <td className="border border-gray-200 px-4 py-2 text-center">
                                  {course.gradePoints.toFixed(2)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                          <tfoot>
                            <tr className="bg-blue-50 font-semibold">
                              <td className="border border-gray-200 px-4 py-2">
                                Total
                              </td>
                              <td className="border border-gray-200 px-4 py-2 text-center">
                                {result.totalCreditHours}
                              </td>
                              <td className="border border-gray-200 px-4 py-2 text-center">
                                -
                              </td>
                              <td className="border border-gray-200 px-4 py-2 text-center">
                                {result.totalGradePoints}
                              </td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    </div>
                    {/* GPA Scale Reference */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="text-lg font-semibold mb-3 text-gray-800">
                        UOG Grading Scale (4.0 Scale)
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2 text-sm">
                        {Object.entries(gradeMapping).map(([grade, points]) => (
                          <div
                            key={grade}
                            className="bg-white px-3 py-2 rounded border text-center"
                          >
                            <div className="font-semibold">{grade}</div>
                            <div className="text-gray-600">{points}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                    {/* GPA Interpretation */}
                    <div className="mt-6 bg-blue-100 rounded-lg p-4">
                      <h3 className="text-lg font-semibold mb-2 text-gray-800">
                        GPA Interpretation
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="flex justify-between py-1">
                            <span>3.5 - 4.0:</span>
                            <span className="text-green-600 font-medium">
                              Excellent
                            </span>
                          </div>
                          <div className="flex justify-between py-1">
                            <span>3.0 - 3.49:</span>
                            <span className="text-blue-600 font-medium">
                              Good
                            </span>
                          </div>
                          <div className="flex justify-between py-1">
                            <span>2.5 - 2.99:</span>
                            <span className="text-yellow-600 font-medium">
                              Satisfactory
                            </span>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between py-1">
                            <span>2.0 - 2.49:</span>
                            <span className="text-orange-600 font-medium">
                              Needs Improvement
                            </span>
                          </div>
                          <div className="flex justify-between py-1">
                            <span>Below 2.0:</span>
                            <span className="text-red-600 font-medium">
                              Poor
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-span-12 bg-white rounded-xl shadow-lg p-6 mt-6">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">
                      How to Use This Calculator
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-semibold text-gray-700 mb-2">
                          Instructions:
                        </h3>
                        <ol className="list-decimal list-inside space-y-2 text-gray-600">
                          <li>Enter your course name</li>
                          <li>Input the credit hours for each course</li>
                          <li>Select your grade from the dropdown</li>
                          <li>
                            Add more courses using the "Add Another Course"
                            button
                          </li>
                          <li>Click "Calculate GPA" to see your results</li>
                        </ol>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-700 mb-2">
                          Features:
                        </h3>
                        <ul className="list-disc list-inside space-y-2 text-gray-600">
                          <li>Automatic grade point calculation</li>
                          <li>Detailed course breakdown</li>
                          <li>GPA status interpretation</li>
                          <li>University of Gujrat standard grading scale</li>
                          <li>Add/remove courses dynamically</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      {result && (
        <>
          <CalculatorFeedback calName={data?.payload?.tech_calculator_title} />
        </>
      )}
    </Calculator>
  );
};

export default UogGpaCalculator;

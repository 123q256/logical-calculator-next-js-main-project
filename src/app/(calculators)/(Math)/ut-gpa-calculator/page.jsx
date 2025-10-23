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

const UtGpaCalculator = () => {
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
  const [getSingleCalculatorDetails, { data, error }] =
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

  // Your existing state structure
  const [formData, setFormData] = useState({
    tech_x: "5",
    tech_y: "19",
    courses: [{ id: 1, courseName: "", creditHours: "", grade: "" }],
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Grade point mapping (4.0 scale)
  const gradePoints = {
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

  // Handle course changes
  const handleCourseChange = (id, field, value) => {
    const updatedCourses = formData.courses.map((course) =>
      course.id === id ? { ...course, [field]: value } : course
    );

    setFormData((prevData) => ({
      ...prevData,
      courses: updatedCourses,
    }));

    setResult(null);
    setFormError("");
  };

  // Add new course
  const addCourse = () => {
    const newId = Math.max(...formData.courses.map((c) => c.id)) + 1;
    const newCourse = { id: newId, courseName: "", creditHours: "", grade: "" };

    setFormData((prevData) => ({
      ...prevData,
      courses: [...prevData.courses, newCourse],
    }));
  };

  // Remove course
  const removeCourse = (id) => {
    if (formData.courses.length > 1) {
      const filteredCourses = formData.courses.filter(
        (course) => course.id !== id
      );
      setFormData((prevData) => ({
        ...prevData,
        courses: filteredCourses,
      }));
    }
  };

  // Handle regular form data change (for tech_x, tech_y if needed)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setResult(null);
    setFormError("");
  };

  // Validate form
  const validateForm = () => {
    for (let course of formData.courses) {
      if (!course.courseName.trim()) {
        return "Please enter course name for all courses.";
      }
      if (!course.creditHours || parseFloat(course.creditHours) <= 0) {
        return "Please enter valid credit hours for all courses.";
      }
      if (!course.grade) {
        return "Please select grade for all courses.";
      }
    }
    return null;
  };

  // Calculate GPA locally (since your API might not support this specific calculation)
  const calculateGPA = () => {
    const error = validateForm();
    if (error) {
      setFormError(error);
      return;
    }

    setFormError("");
    setIsLoading(true);

    // Calculate GPA
    let totalGradePoints = 0;
    let totalCreditHours = 0;

    const courseResults = formData.courses.map((course) => {
      const creditHours = parseFloat(course.creditHours);
      const gradePoint = gradePoints[course.grade];
      const qualityPoints = creditHours * gradePoint;

      totalGradePoints += qualityPoints;
      totalCreditHours += creditHours;

      return {
        courseName: course.courseName,
        creditHours: creditHours,
        grade: course.grade,
        gradePoint: gradePoint,
        qualityPoints: qualityPoints,
      };
    });

    const gpa = totalCreditHours > 0 ? totalGradePoints / totalCreditHours : 0;

    // Simulate API delay
    setTimeout(() => {
      setResult({
        gpa: gpa.toFixed(2),
        totalCreditHours: totalCreditHours,
        totalQualityPoints: totalGradePoints.toFixed(2),
        courses: courseResults,
      });
      setIsLoading(false);
    }, 500);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    calculateGPA();
  };

  // Handle reset
  const handleReset = () => {
    setFormData({
      tech_x: "5",
      tech_y: "19",
      courses: [{ id: 1, courseName: "", creditHours: "", grade: "" }],
    });
    setResult(null);
    setFormError("");
  };

  const getGPAClass = (gpa) => {
    const numGpa = parseFloat(gpa);
    if (numGpa >= 3.5) return "text-green-600";
    if (numGpa >= 3.0) return "text-blue-600";
    if (numGpa >= 2.5) return "text-yellow-600";
    return "text-red-600";
  };

  const getGPAStatus = (gpa) => {
    const numGpa = parseFloat(gpa);
    if (numGpa >= 3.5) return "Excellent";
    if (numGpa >= 3.0) return "Good";
    if (numGpa >= 2.5) return "Satisfactory";
    if (numGpa >= 2.0) return "Below Average";
    return "Poor";
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
        <div className=" mx-auto">
          {/* Calculator Form */}
          <div className="w-full mx-auto p-2  rounded-lg  space-y-6 mb-3">
            {formError && (
              <p className="text-red-500 text-lg font-semibold w-full">
                {formError}
              </p>
            )}
            {/* Course Input Section */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-800">
                Enter Your Course Information
              </h2>

              {/* Course Headers */}
              <div className="grid grid-cols-12 md:grid-cols-12 gap-4 mb-4">
                <div className="col-span-5">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Course Name
                  </label>
                </div>
                <div className="col-span-3">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Credit Hours
                  </label>
                </div>
                <div className="col-span-3">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Grade
                  </label>
                </div>
                <div className="col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Action
                  </label>
                </div>
              </div>
              {/* Course Inputs */}
              {formData.courses.map((course, index) => (
                <div
                  key={course.id}
                  className="grid grid-cols-12 md:grid-cols-12 gap-4 mb-4 items-end"
                >
                  <div className="col-span-5">
                    <input
                      type="text"
                      placeholder={`Course ${index + 1} (e.g., Mathematics)`}
                      value={course.courseName}
                      onChange={(e) =>
                        handleCourseChange(
                          course.id,
                          "courseName",
                          e.target.value
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="col-span-3">
                    <input
                      type="number"
                      step="0.5"
                      min="0.5"
                      max="6"
                      placeholder="3"
                      value={course.creditHours}
                      onChange={(e) =>
                        handleCourseChange(
                          course.id,
                          "creditHours",
                          e.target.value
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="col-span-3">
                    <select
                      value={course.grade}
                      onChange={(e) =>
                        handleCourseChange(course.id, "grade", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Grade</option>
                      <option value="A+">A+ (4.0)</option>
                      <option value="A">A (4.0)</option>
                      <option value="A-">A- (3.7)</option>
                      <option value="B+">B+ (3.3)</option>
                      <option value="B">B (3.0)</option>
                      <option value="B-">B- (2.7)</option>
                      <option value="C+">C+ (2.3)</option>
                      <option value="C">C (2.0)</option>
                      <option value="C-">C- (1.7)</option>
                      <option value="D+">D+ (1.3)</option>
                      <option value="D">D (1.0)</option>
                      <option value="F">F (0.0)</option>
                    </select>
                  </div>
                  <div className="col-span-1">
                    <button
                      type="button"
                      onClick={() => removeCourse(course.id)}
                      disabled={formData.courses.length === 1}
                      className="w-full p-2 text-red-600 hover:text-red-800 disabled:text-gray-300 disabled:cursor-not-allowed text-xl cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}

              {/* Add Course Button */}
              <div className="mb-6">
                <button
                  type="button"
                  onClick={addCourse}
                  className="flex items-center px-4 py-2 bg-[#2845F5] text-white bordered rounded-lg cursor-pointer"
                >
                  <span className="mr-2">➕</span>
                  Add Another Course
                </button>
              </div>
            </div>
            <div className="mb-6 mt-10 text-center space-x-2">
              <Button
                type="button"
                onClick={handleSubmit}
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
      {/* Loading State */}
      {isLoading && (
        <div className="w-full mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg space-y-6 result">
          <div className="animate-pulse">
            <div className=" w-full h-[30px] bg-gray-300 animate-pulse rounded-[10px] mb-4"></div>
            <div className="w-[75%] h-[20px] bg-gray-300 animate-pulse rounded-[10px] mb-3"></div>
            <div className="w-[50%] h-[20px] bg-gray-300 animate-pulse rounded-[10px] mb-3"></div>
            <div className="w-[25%] h-[20px] bg-gray-300 animate-pulse rounded-[10px]"></div>
          </div>
        </div>
      )}

      {/* Results */}
      {result && !isLoading && (
        <div className="w-full mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg space-y-6 result">
          <div>
            <ResultActions lang={data?.payload?.tech_lang_keys} />
            <div className="w-full mx-auto rounded-lg   result">
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center mt-4">
                  Your GPA Results
                </h3>

                {/* Main GPA Display */}
                <div className="text-center mb-8 p-6 bg-white rounded-lg bordered">
                  <div
                    className={`text-6xl  font-bold mb-2 ${getGPAClass(
                      result.gpa
                    )}`}
                  >
                    {result.gpa}
                  </div>
                  <div className="text-lg text-gray-600 mb-2">
                    Grade Point Average
                  </div>
                  <div
                    className={`text-xl font-semibold ${getGPAClass(
                      result.gpa
                    )}`}
                  >
                    {getGPAStatus(result.gpa)}
                  </div>
                </div>

                {/* Summary Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-white rounded-lg bordered p-4 text-center">
                    <div className="text-3xl font-bold text-gray-800 ">
                      {result.totalCreditHours}
                    </div>
                    <div className="text-gray-600">Total Credit Hours</div>
                  </div>
                  <div className="bg-white rounded-lg bordered p-4 text-center">
                    <div className="text-3xl font-bold text-gray-800 ">
                      {result.totalQualityPoints}
                    </div>
                    <div className="text-gray-600">Total Quality Points</div>
                  </div>
                </div>

                {/* Course Breakdown */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">
                    Course Breakdown
                  </h4>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300 text-sm">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="border border-gray-300 px-4 py-2 text-left">
                            Course
                          </th>
                          <th className="border border-gray-300 px-4 py-2 text-center">
                            Credit Hours
                          </th>
                          <th className="border border-gray-300 px-4 py-2 text-center">
                            Grade
                          </th>
                          <th className="border border-gray-300 px-4 py-2 text-center">
                            Grade Points
                          </th>
                          <th className="border border-gray-300 px-4 py-2 text-center">
                            Quality Points
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {result.courses.map((course, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="border border-gray-300 px-4 py-2">
                              {course.courseName}
                            </td>
                            <td className="border border-gray-300 px-4 py-2 text-center">
                              {course.creditHours}
                            </td>
                            <td className="border border-gray-300 px-4 py-2 text-center font-semibold">
                              {course.grade}
                            </td>
                            <td className="border border-gray-300 px-4 py-2 text-center">
                              {course.gradePoint}
                            </td>
                            <td className="border border-gray-300 px-4 py-2 text-center">
                              {course.qualityPoints.toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* GPA Scale Reference */}
                <div className="bg-white bordered p-4 rounded-lg">
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">
                    GPA Scale Reference
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                    <div>
                      <span className="font-semibold">A+/A:</span> 4.0
                    </div>
                    <div>
                      <span className="font-semibold">A-:</span> 3.7
                    </div>
                    <div>
                      <span className="font-semibold">B+:</span> 3.3
                    </div>
                    <div>
                      <span className="font-semibold">B:</span> 3.0
                    </div>
                    <div>
                      <span className="font-semibold">B-:</span> 2.7
                    </div>
                    <div>
                      <span className="font-semibold">C+:</span> 2.3
                    </div>
                    <div>
                      <span className="font-semibold">C:</span> 2.0
                    </div>
                    <div>
                      <span className="font-semibold">C-:</span> 1.7
                    </div>
                    <div>
                      <span className="font-semibold">D+:</span> 1.3
                    </div>
                    <div>
                      <span className="font-semibold">D:</span> 1.0
                    </div>
                    <div>
                      <span className="font-semibold">F:</span> 0.0
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Information Section */}
          <div className="bg-white rounded-lg p-3 bordered  mt-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              How to Use This Calculator
            </h3>
            <div className="space-y-3 text-gray-600">
              <p>
                <strong>Step 1:</strong> Enter the name of each course you've
                taken.
              </p>
              <p>
                <strong>Step 2:</strong> Input the credit hours for each course
                (typically 1-6 hours).
              </p>
              <p>
                <strong>Step 3:</strong> Select the grade you received for each
                course.
              </p>
              <p>
                <strong>Step 4:</strong> Click "Add Another Course" to include
                more courses.
              </p>
              <p>
                <strong>Step 5:</strong> Click "Calculate GPA" to see your
                results.
              </p>
            </div>

            <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <h4 className="font-semibold text-yellow-800 mb-2">
                Important Note:
              </h4>
              <p className="text-yellow-700 text-sm">
                This calculator uses the standard 4.0 GPA scale. Different
                institutions may have slight variations in their grading scales.
                Always verify with your specific university's academic policies
                for the most accurate GPA calculation.
              </p>
            </div>
          </div>
        </div>
      )}

      <CalculatorFeedback calName={data?.payload?.tech_calculator_title} />
    </Calculator>
  );
};

export default UtGpaCalculator;

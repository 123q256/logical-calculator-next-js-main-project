"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useEbitCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const UfGpaCalculator = () => {
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
    { id: 1, courseName: "", grade: "", creditHours: "" },
  ]);

  const [currentGPA, setCurrentGPA] = useState("");
  const [currentCredits, setCurrentCredits] = useState("");
  const [calculateCumulative, setCalculateCumulative] = useState(false);

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // UF Grade Scale
  const gradePoints = {
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
    I: 0.0,
    W: 0.0,
    WF: 0.0,
  };

  const [
    calculateEbitCalculator,
    { isLoading: calculationLoading, isError, error: calculateError },
  ] = useEbitCalculatorMutation();

  // Add new course
  const addCourse = () => {
    setCourses([
      ...courses,
      {
        id: Date.now(),
        courseName: "",
        grade: "",
        creditHours: "",
      },
    ]);
  };

  // Remove course
  const removeCourse = (id) => {
    if (courses.length > 1) {
      setCourses(courses.filter((course) => course.id !== id));
    }
  };

  // Update course data
  const updateCourse = (id, field, value) => {
    setCourses(
      courses.map((course) =>
        course.id === id ? { ...course, [field]: value } : course
      )
    );
    setResult(null);
  };

  // Calculate GPA
  const calculateGPA = () => {
    const validCourses = courses.filter(
      (course) =>
        course.grade &&
        course.creditHours &&
        !isNaN(parseFloat(course.creditHours)) &&
        parseFloat(course.creditHours) > 0
    );

    if (validCourses.length === 0) return { gpa: 0, totalCredits: 0 };

    let totalPoints = 0;
    let totalCredits = 0;

    validCourses.forEach((course) => {
      const credits = parseFloat(course.creditHours);
      const points = gradePoints[course.grade] || 0;
      totalPoints += credits * points;
      totalCredits += credits;
    });

    const semesterGPA = totalCredits > 0 ? totalPoints / totalCredits : 0;

    let cumulativeGPA = semesterGPA;
    let totalCumulativeCredits = totalCredits;

    if (calculateCumulative && currentGPA && currentCredits) {
      const currentGPANum = parseFloat(currentGPA);
      const currentCreditsNum = parseFloat(currentCredits);

      if (
        !isNaN(currentGPANum) &&
        !isNaN(currentCreditsNum) &&
        currentCreditsNum > 0
      ) {
        const currentPoints = currentGPANum * currentCreditsNum;
        const newTotalPoints = currentPoints + totalPoints;
        totalCumulativeCredits = currentCreditsNum + totalCredits;
        cumulativeGPA =
          totalCumulativeCredits > 0
            ? newTotalPoints / totalCumulativeCredits
            : 0;
      }
    }

    return {
      semesterGPA,
      cumulativeGPA: calculateCumulative ? cumulativeGPA : semesterGPA,
      semesterCredits: totalCredits,
      totalCredits: totalCumulativeCredits,
      validCourses: validCourses.length,
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate at least one complete course
    const validCourses = courses.filter(
      (course) =>
        course.grade &&
        course.creditHours &&
        !isNaN(parseFloat(course.creditHours)) &&
        parseFloat(course.creditHours) > 0
    );

    if (validCourses.length === 0) {
      setFormError(
        "Please add at least one course with grade and credit hours."
      );
      return;
    }

    if (calculateCumulative && (!currentGPA || !currentCredits)) {
      setFormError(
        "Please enter current GPA and credit hours for cumulative calculation."
      );
      return;
    }

    setFormError("");

    try {
      const gpaResult = calculateGPA();
      setResult(gpaResult);
      toast.success("GPA calculated successfully!");
    } catch (err) {
      setFormError("Error in calculating GPA.");
      toast.error("Error in calculating GPA.");
    }
  };

  const handleReset = () => {
    setCourses([{ id: 1, courseName: "", grade: "", creditHours: "" }]);
    setCurrentGPA("");
    setCurrentCredits("");
    setCalculateCumulative(false);
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

  const getAcademicStanding = (gpa) => {
    if (gpa >= 3.8)
      return { status: "President's Honor Roll", color: "text-green-600" };
    if (gpa >= 3.5) return { status: "Dean's List", color: "text-blue-600" };
    if (gpa >= 2.0) return { status: "Good Standing", color: "text-gray-600" };
    return { status: "Academic Probation", color: "text-red-600" };
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
      <form className="row" onSubmit={handleSubmit}>
        <div className="w-full mx-auto p-4 lg:p-8 md:p-8 input_form rounded-lg  space-y-6 mb-3">
          {formError && (
            <p className="text-red-500 text-lg font-semibold w-full">
              {formError}
            </p>
          )}

          {/* Cumulative GPA Toggle */}
          <div className="mb-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={calculateCumulative}
                onChange={(e) => setCalculateCumulative(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="font-medium text-gray-700">
                Calculate Cumulative GPA
              </span>
            </label>

            {calculateCumulative && (
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current GPA
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="4"
                    value={currentGPA}
                    onChange={(e) => setCurrentGPA(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., 3.25"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current Credit Hours
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={currentCredits}
                    onChange={(e) => setCurrentCredits(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., 45"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Courses Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Course Information
            </h3>

            {courses.map((course, index) => (
              <div
                key={course.id}
                className="grid grid-cols-1 md:grid-cols-12 gap-3 p-4 bg-gray-50 rounded-lg bordered"
              >
                <div className="md:col-span-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Course Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={course.courseName}
                    onChange={(e) =>
                      updateCourse(course.id, "courseName", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Calculus I"
                  />
                </div>

                <div className="md:col-span-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Grade *
                  </label>
                  <select
                    value={course.grade}
                    onChange={(e) =>
                      updateCourse(course.id, "grade", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select Grade</option>
                    <option value="A">A (4.0)</option>
                    <option value="A-">A- (3.67)</option>
                    <option value="B+">B+ (3.33)</option>
                    <option value="B">B (3.0)</option>
                    <option value="B-">B- (2.67)</option>
                    <option value="C+">C+ (2.33)</option>
                    <option value="C">C (2.0)</option>
                    <option value="C-">C- (1.67)</option>
                    <option value="D+">D+ (1.33)</option>
                    <option value="D">D (1.0)</option>
                    <option value="D-">D- (0.67)</option>
                    <option value="F">F (0.0)</option>
                    <option value="W">W (0.0)</option>
                    <option value="WF">WF (0.0)</option>
                    <option value="I">I (0.0)</option>
                  </select>
                </div>

                <div className="md:col-span-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Credit Hours *
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    value={course.creditHours}
                    onChange={(e) =>
                      updateCourse(course.id, "creditHours", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="3"
                    required
                  />
                </div>

                <div className="md:col-span-1 flex items-end justify-center">
                  <button
                    type="button"
                    onClick={() => removeCourse(course.id)}
                    className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                    disabled={courses.length === 1}
                  >
                    <svg
                      className="w-5 h-5 cursor-pointer"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addCourse}
              className="flex calculate cursor-pointer repeat px-6 py-3 font-semibold text-[#ffffff] bg-[#2845F5] text-[14px] rounded-lg focus:outline-none focus:ring-2"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add Another Course
            </button>
          </div>

          {/* UF Grade Scale Reference */}
          <div className="bg-gray-50 rounded-lg p-4 bordered">
            <h4 className="font-semibold text-gray-800 mb-3">
              UF Grade Scale Reference
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2 text-sm">
              {Object.entries(gradePoints).map(([grade, points]) => (
                <div
                  key={grade}
                  className="flex justify-between bg-white bordered px-2 py-1 rounded"
                >
                  <span className="font-medium">{grade}</span>
                  <span className="text-gray-600">{points.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-6 mt-10 text-center space-x-2">
            <Button type="submit" isLoading={calculationLoading}>
              {data?.payload?.tech_lang_keys?.["calculate"] || "Calculate GPA"}
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

        {calculationLoading ? (
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
            <div className="w-full mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg space-y-6 result">
              <div>
                <ResultActions lang={data?.payload?.tech_lang_keys} />

                {/* GPA Results */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  {/* Semester GPA */}
                  <div className="bg-white bordered rounded-lg p-6 s">
                    <h3 className="text-lg font-semibold mb-2">Semester GPA</h3>
                    <div className="text-3xl font-bold mb-1">
                      {result.semesterGPA.toFixed(2)}
                    </div>
                    <div className="">
                      {result.semesterCredits} credit hours
                    </div>
                    <div className=" text-sm">
                      {result.validCourses} courses calculated
                    </div>
                  </div>

                  {/* Cumulative GPA */}
                  {calculateCumulative && (
                    <div className="bg-white bordered rounded-lg p-6 ">
                      <h3 className="text-lg font-semibold mb-2">
                        Cumulative GPA
                      </h3>
                      <div className="text-3xl font-bold mb-1">
                        {result.cumulativeGPA.toFixed(2)}
                      </div>
                      <div className="text-orange-800">
                        {result.totalCredits} total credit hours
                      </div>
                    </div>
                  )}
                </div>

                {/* Academic Standing */}
                <div className="mt-6 p-4 bg-sky bordered rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-2">
                    Academic Standing
                  </h4>
                  {(() => {
                    const standing = getAcademicStanding(
                      calculateCumulative
                        ? result.cumulativeGPA
                        : result.semesterGPA
                    );
                    return (
                      <p className={`text-lg font-medium ${standing.color}`}>
                        {standing.status}
                      </p>
                    );
                  })()}

                  <div className="mt-3 text-sm text-gray-600 space-y-1">
                    <p>
                      <strong>Good Standing:</strong> 2.0 GPA or higher
                    </p>
                    <p>
                      <strong>Dean's List:</strong> 3.5 GPA or higher (12+
                      credit hours)
                    </p>
                    <p>
                      <strong>President's Honor Roll:</strong> 3.8 GPA or higher
                      (12+ credit hours)
                    </p>
                    <p>
                      <strong>Academic Probation:</strong> Below 2.0 GPA
                    </p>
                  </div>
                </div>

                {/* Course Details Table */}
                <div className="mt-6">
                  <h4 className="font-semibold text-gray-800 mb-3">
                    Course Details
                  </h4>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-white">
                          <th className="border border-gray-300 px-4 py-2 text-left">
                            Course
                          </th>
                          <th className="border border-gray-300 px-4 py-2 text-center">
                            Grade
                          </th>
                          <th className="border border-gray-300 px-4 py-2 text-center">
                            Credits
                          </th>
                          <th className="border border-gray-300 px-4 py-2 text-center">
                            Quality Points
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {courses
                          .filter(
                            (course) => course.grade && course.creditHours
                          )
                          .map((course) => {
                            const credits = parseFloat(course.creditHours) || 0;
                            const points = gradePoints[course.grade] || 0;
                            const qualityPoints = credits * points;

                            return (
                              <tr key={course.id}>
                                <td className="bordered px-4 py-2">
                                  {course.courseName ||
                                    `Course ${courses.indexOf(course) + 1}`}
                                </td>
                                <td className="bordered px-4 py-2 text-center font-medium">
                                  {course.grade}
                                </td>
                                <td className="bordered  px-4 py-2 text-center">
                                  {credits}
                                </td>
                                <td className="bordered px-4 py-2 text-center">
                                  {qualityPoints.toFixed(2)}
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )
        )}
      </form>

      {result && (
        <CalculatorFeedback calName={data?.payload?.tech_calculator_title} />
      )}
    </Calculator>
  );
};

export default UfGpaCalculator;

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

const GpaCalculator = () => {
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

  // GPA Scale options
  const gpaScales = [
    { value: "4.0", label: "4.0 Scale" },
    { value: "5.0", label: "5.0 Scale" },
    { value: "10.0", label: "10.0 Scale" },
    { value: "percentage", label: "Percentage" },
  ];

  // Grade options for 4.0 scale
  const gradesOptions = {
    "4.0": [
      { grade: "A+", points: 4.0 },
      { grade: "A", points: 4.0 },
      { grade: "A-", points: 3.7 },
      { grade: "B+", points: 3.3 },
      { grade: "B", points: 3.0 },
      { grade: "B-", points: 2.7 },
      { grade: "C+", points: 2.3 },
      { grade: "C", points: 2.0 },
      { grade: "C-", points: 1.7 },
      { grade: "D+", points: 1.3 },
      { grade: "D", points: 1.0 },
      { grade: "F", points: 0.0 },
    ],
    "5.0": [
      { grade: "A+", points: 5.0 },
      { grade: "A", points: 4.5 },
      { grade: "B+", points: 4.0 },
      { grade: "B", points: 3.5 },
      { grade: "C+", points: 3.0 },
      { grade: "C", points: 2.5 },
      { grade: "D+", points: 2.0 },
      { grade: "D", points: 1.5 },
      { grade: "F", points: 0.0 },
    ],
    "10.0": [
      { grade: "A+", points: 10.0 },
      { grade: "A", points: 9.0 },
      { grade: "B+", points: 8.0 },
      { grade: "B", points: 7.0 },
      { grade: "C+", points: 6.0 },
      { grade: "C", points: 5.0 },
      { grade: "D", points: 4.0 },
      { grade: "F", points: 0.0 },
    ],
  };

  // Initial form data with one course
  const [formData, setFormData] = useState({
    gpaScale: "4.0",
    courses: [
      {
        id: 1,
        courseName: "",
        grade: "",
        gradePoints: "",
        creditHours: "",
        isCustomPoints: false,
      },
    ],
    currentGPA: "",
    currentCreditHours: "",
    includeCurrentGPA: false,
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  const [
    calculateEbitCalculator,
    { isLoading: calculationLoading, isError, error: calculateError },
  ] = useEbitCalculatorMutation();

  // Add new course
  const addCourse = () => {
    const newCourse = {
      id: Date.now(),
      courseName: "",
      grade: "",
      gradePoints: "",
      creditHours: "",
      isCustomPoints: false,
    };
    setFormData((prev) => ({
      ...prev,
      courses: [...prev.courses, newCourse],
    }));
  };

  // Remove course
  const removeCourse = (courseId) => {
    if (formData.courses.length > 1) {
      setFormData((prev) => ({
        ...prev,
        courses: prev.courses.filter((course) => course.id !== courseId),
      }));
    }
  };

  // Handle course data change
  const handleCourseChange = (courseId, field, value) => {
    setFormData((prev) => ({
      ...prev,
      courses: prev.courses.map((course) => {
        if (course.id === courseId) {
          const updatedCourse = { ...course, [field]: value };

          // Auto-fill grade points when grade is selected (if not custom)
          if (
            field === "grade" &&
            !course.isCustomPoints &&
            formData.gpaScale !== "percentage"
          ) {
            const selectedGrade = gradesOptions[formData.gpaScale]?.find(
              (g) => g.grade === value
            );
            if (selectedGrade) {
              updatedCourse.gradePoints = selectedGrade.points.toString();
            }
          }

          // Toggle custom points mode
          if (field === "isCustomPoints") {
            if (value) {
              updatedCourse.gradePoints = "";
            } else {
              const selectedGrade = gradesOptions[formData.gpaScale]?.find(
                (g) => g.grade === course.grade
              );
              if (selectedGrade) {
                updatedCourse.gradePoints = selectedGrade.points.toString();
              }
            }
          }

          return updatedCourse;
        }
        return course;
      }),
    }));

    setResult(null);
    setFormError("");
  };

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Reset courses when scale changes
    if (name === "gpaScale") {
      setFormData((prev) => ({
        ...prev,
        courses: prev.courses.map((course) => ({
          ...course,
          grade: "",
          gradePoints: "",
          isCustomPoints: false,
        })),
      }));
    }

    setResult(null);
    setFormError("");
  };

  // Calculate GPA
  const calculateGPA = () => {
    let totalGradePoints = 0;
    let totalCreditHours = 0;

    // Validate courses
    for (let course of formData.courses) {
      if (!course.creditHours || !course.gradePoints) {
        throw new Error("Please fill in all course details");
      }

      const credits = parseFloat(course.creditHours);
      const points = parseFloat(course.gradePoints);

      if (isNaN(credits) || isNaN(points) || credits <= 0) {
        throw new Error("Please enter valid credit hours and grade points");
      }

      totalGradePoints += points * credits;
      totalCreditHours += credits;
    }

    if (totalCreditHours === 0) {
      throw new Error("Total credit hours cannot be zero");
    }

    let newGPA = totalGradePoints / totalCreditHours;

    // If including current GPA
    if (
      formData.includeCurrentGPA &&
      formData.currentGPA &&
      formData.currentCreditHours
    ) {
      const currentGPA = parseFloat(formData.currentGPA);
      const currentCredits = parseFloat(formData.currentCreditHours);

      if (!isNaN(currentGPA) && !isNaN(currentCredits) && currentCredits > 0) {
        const totalCurrentPoints = currentGPA * currentCredits;
        const combinedGradePoints = totalGradePoints + totalCurrentPoints;
        const combinedCreditHours = totalCreditHours + currentCredits;

        newGPA = combinedGradePoints / combinedCreditHours;

        return {
          semesterGPA: (totalGradePoints / totalCreditHours).toFixed(2),
          cumulativeGPA: newGPA.toFixed(2),
          totalCreditHours: combinedCreditHours.toFixed(1),
          semesterCreditHours: totalCreditHours.toFixed(1),
          courses: formData.courses.length,
        };
      }
    }

    return {
      gpa: newGPA.toFixed(2),
      totalCreditHours: totalCreditHours.toFixed(1),
      totalGradePoints: totalGradePoints.toFixed(2),
      courses: formData.courses.length,
      scale: formData.gpaScale,
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const calculationResult = calculateGPA();
      setResult(calculationResult);
      toast.success("GPA calculated successfully!");
    } catch (err) {
      setFormError(err.message);
      toast.error(err.message);
    }
  };

  // Handle reset
  const handleReset = () => {
    setFormData({
      gpaScale: "4.0",
      courses: [
        {
          id: 1,
          courseName: "",
          grade: "",
          gradePoints: "",
          creditHours: "",
          isCustomPoints: false,
        },
      ],
      currentGPA: "",
      currentCreditHours: "",
      includeCurrentGPA: false,
    });
    setResult(null);
    setFormError("");
  };

  // Currency code
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

          {/* GPA Scale Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              GPA Scale
            </label>
            <select
              name="gpaScale"
              value={formData.gpaScale}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {gpaScales.map((scale) => (
                <option key={scale.value} value={scale.value}>
                  {scale.label}
                </option>
              ))}
            </select>
          </div>

          {/* Include Current GPA Option */}
          <div className="mb-6">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                name="includeCurrentGPA"
                checked={formData.includeCurrentGPA}
                onChange={handleChange}
                className="w-4 h-4 cursor-pointer text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">
                Include Current GPA in Calculation
              </span>
            </label>
          </div>

          {/* Current GPA Fields */}
          {formData.includeCurrentGPA && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current GPA
                </label>
                <input
                  type="number"
                  name="currentGPA"
                  value={formData.currentGPA}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  max={
                    formData.gpaScale === "percentage"
                      ? "100"
                      : formData.gpaScale
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., 3.25"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Credit Hours
                </label>
                <input
                  type="number"
                  name="currentCreditHours"
                  value={formData.currentCreditHours}
                  onChange={handleChange}
                  step="0.5"
                  min="0"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., 60"
                />
              </div>
            </div>
          )}

          {/* Courses Section */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-700">Courses</h3>
              <button
                type="button"
                onClick={addCourse}
                className="px-4 py-2 cursor-pointer bg-[#2845F5] text-white rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200"
              >
                Add Course
              </button>
            </div>

            {formData.courses.map((course, index) => (
              <div
                key={course.id}
                className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50"
              >
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-medium text-gray-700">
                    Course {index + 1}
                  </h4>
                  {formData.courses.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeCourse(course.id)}
                      className="text-red-500 cursor-pointer hover:text-red-700 font-medium"
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Course Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Course Name (Optional)
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
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., Mathematics"
                    />
                  </div>

                  {/* Grade Selection */}
                  {formData.gpaScale !== "percentage" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Grade
                      </label>
                      <select
                        value={course.grade}
                        onChange={(e) =>
                          handleCourseChange(course.id, "grade", e.target.value)
                        }
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        disabled={course.isCustomPoints}
                      >
                        <option value="">Select Grade</option>
                        {gradesOptions[formData.gpaScale]?.map(
                          (gradeOption) => (
                            <option
                              key={gradeOption.grade}
                              value={gradeOption.grade}
                            >
                              {gradeOption.grade} ({gradeOption.points})
                            </option>
                          )
                        )}
                      </select>
                    </div>
                  )}

                  {/* Grade Points */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {formData.gpaScale === "percentage"
                        ? "Percentage"
                        : "Grade Points"}
                    </label>
                    <input
                      type="number"
                      value={course.gradePoints}
                      onChange={(e) =>
                        handleCourseChange(
                          course.id,
                          "gradePoints",
                          e.target.value
                        )
                      }
                      step="0.01"
                      min="0"
                      max={
                        formData.gpaScale === "percentage"
                          ? "100"
                          : formData.gpaScale
                      }
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder={
                        formData.gpaScale === "percentage"
                          ? "e.g., 85"
                          : "e.g., 3.7"
                      }
                    />
                  </div>

                  {/* Credit Hours */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Credit Hours
                    </label>
                    <input
                      type="number"
                      value={course.creditHours}
                      onChange={(e) =>
                        handleCourseChange(
                          course.id,
                          "creditHours",
                          e.target.value
                        )
                      }
                      step="0.5"
                      min="0.5"
                      max="10"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., 3"
                    />
                  </div>
                </div>

                {/* Custom Points Toggle */}
                {formData.gpaScale !== "percentage" && (
                  <div className="mt-3">
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={course.isCustomPoints}
                        onChange={(e) =>
                          handleCourseChange(
                            course.id,
                            "isCustomPoints",
                            e.target.checked
                          )
                        }
                        className="w-4 h-4 cursor-pointer text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-600">
                        Use custom grade points
                      </span>
                    </label>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Submit and Reset Buttons */}
          <div className="mb-6 mt-10 text-center space-x-2">
            <Button type="submit" isLoading={calculationLoading}>
              Calculate GPA
            </Button>
            {(result ||
              formData.courses.some(
                (c) => c.courseName || c.grade || c.gradePoints || c.creditHours
              )) && (
              <ResetButton type="button" onClick={handleReset}>
                RESET
              </ResetButton>
            )}
          </div>
        </div>

        {/* Results Section */}
        {calculationLoading ? (
          <div className="w-full mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg space-y-6 result">
            <div className="animate-pulse">
              <div className="w-full h-[30px] bg-gray-300 animate-pulse rounded-[10px] mb-4"></div>
              <div className="w-[75%] h-[20px] bg-gray-300 animate-pulse rounded-[10px] mb-3"></div>
              <div className="w-[50%] h-[20px] bg-gray-300 animate-pulse rounded-[10px] mb-3"></div>
              <div className="w-[25%] h-[20px] bg-gray-300 animate-pulse rounded-[10px]"></div>
            </div>
          </div>
        ) : (
          result && (
            <div className="w-full mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg space-y-6">
              <div>
                <ResultActions lang={data?.payload?.tech_lang_keys} />

                <div className="mt-6 space-y-4">
                  {result.cumulativeGPA ? (
                    <>
                      <div className="text-center p-6 bg-sky bordered  rounded-lg ">
                        <h3 className="text-2xl font-bold text-blue-800 mb-2">
                          Cumulative GPA: {result.cumulativeGPA}
                        </h3>
                        <p className="text-lg text-blue-600">
                          Semester GPA: {result.semesterGPA}
                        </p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-600">
                            Total Credit Hours
                          </p>
                          <p className="text-xl font-bold text-gray-800">
                            {result.totalCreditHours}
                          </p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-600">
                            Semester Credit Hours
                          </p>
                          <p className="text-xl font-bold text-gray-800">
                            {result.semesterCreditHours}
                          </p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-600">Courses</p>
                          <p className="text-xl font-bold text-gray-800">
                            {result.courses}
                          </p>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="text-center p-6 bg-sky bordered rounded-lg ">
                        <h3 className="text-3xl font-bold text-green-800 mb-2">
                          GPA: {result.gpa}
                        </h3>
                        <p className="text-lg text-green-600">
                          Scale: {result.scale}
                        </p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                        <div className="p-4 bg-gray-50 bordered rounded-lg">
                          <p className="text-sm text-gray-600">
                            Total Credit Hours
                          </p>
                          <p className="text-xl font-bold text-gray-800">
                            {result.totalCreditHours}
                          </p>
                        </div>
                        <div className="p-4 bg-gray-50 bordered rounded-lg">
                          <p className="text-sm text-gray-600">
                            Total Grade Points
                          </p>
                          <p className="text-xl font-bold text-gray-800">
                            {result.totalGradePoints}
                          </p>
                        </div>
                        <div className="p-4 bg-gray-50 bordered rounded-lg">
                          <p className="text-sm text-gray-600">Courses</p>
                          <p className="text-xl font-bold text-gray-800">
                            {result.courses}
                          </p>
                        </div>
                      </div>
                    </>
                  )}

                  {/* GPA Interpretation */}
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg bordered">
                    <h4 className="font-semibold text-blue-800 mb-2">
                      GPA Interpretation:
                    </h4>
                    <div className="text-sm text-blue-700 space-y-1">
                      {formData.gpaScale === "4.0" && (
                        <>
                          <p>• 3.5-4.0: Excellent (A range)</p>
                          <p>• 3.0-3.49: Good (B range)</p>
                          <p>• 2.0-2.99: Average (C range)</p>
                          <p>• Below 2.0: Below Average</p>
                        </>
                      )}
                      {formData.gpaScale === "5.0" && (
                        <>
                          <p>• 4.5-5.0: Excellent</p>
                          <p>• 3.5-4.49: Good</p>
                          <p>• 2.5-3.49: Average</p>
                          <p>• Below 2.5: Below Average</p>
                        </>
                      )}
                      {formData.gpaScale === "10.0" && (
                        <>
                          <p>• 8.0-10.0: Excellent</p>
                          <p>• 6.0-7.99: Good</p>
                          <p>• 4.0-5.99: Average</p>
                          <p>• Below 4.0: Below Average</p>
                        </>
                      )}
                    </div>
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

export default GpaCalculator;

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

const UcGpaCalculator = () => {
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

  // State for courses and GPA calculation
  const [courses, setCourses] = useState([
    {
      id: 1,
      courseName: "",
      grade: "",
      credits: "",
      courseType: "regular", // regular, honors, ap
    },
  ]);

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: calculatingLoading, isError, error: calculateError },
  ] = useEbitCalculatorMutation();

  // Grade point values for UC system
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
    "D-": 0.7,
    F: 0.0,
  };

  // Add course function
  const addCourse = () => {
    const newCourse = {
      id: courses.length + 1,
      courseName: "",
      grade: "",
      credits: "",
      courseType: "regular",
    };
    setCourses([...courses, newCourse]);
  };

  // Remove course function
  const removeCourse = (id) => {
    if (courses.length > 1) {
      setCourses(courses.filter((course) => course.id !== id));
    }
  };

  // Handle course input changes
  const handleCourseChange = (id, field, value) => {
    setCourses(
      courses.map((course) =>
        course.id === id ? { ...course, [field]: value } : course
      )
    );
    setResult(null);
    setFormError("");
  };

  // Calculate GPA
  const calculateGPA = () => {
    let totalPoints = 0;
    let totalCredits = 0;
    let validCourses = 0;

    for (let course of courses) {
      if (course.grade && course.credits) {
        const credits = parseFloat(course.credits);
        let points = gradePoints[course.grade] || 0;

        // Add extra points for honors and AP courses
        if (course.courseType === "honors" && points > 0) {
          points += 1.0;
        } else if (course.courseType === "ap" && points > 0) {
          points += 1.0;
        }

        totalPoints += points * credits;
        totalCredits += credits;
        validCourses++;
      }
    }

    if (validCourses === 0) {
      setFormError("Please add at least one course with grade and credits.");
      return;
    }

    const gpa = totalCredits > 0 ? (totalPoints / totalCredits).toFixed(3) : 0;

    setResult({
      gpa: gpa,
      totalCredits: totalCredits,
      totalCourses: validCourses,
      weightedPoints: totalPoints.toFixed(2),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    calculateGPA();

    try {
      // You can also send data to your backend if needed
      // const response = await calculateEbitCalculator({
      //   courses: courses,
      //   calculationType: "uc_gpa"
      // }).unwrap();

      toast.success("GPA Calculated Successfully");
    } catch (err) {
      setFormError("Error in calculating GPA.");
      toast.error("Error in calculating GPA.");
    }
  };

  // Handle reset form
  const handleReset = () => {
    setCourses([
      {
        id: 1,
        courseName: "",
        grade: "",
        credits: "",
        courseType: "regular",
      },
    ]);
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
          name: data?.payload?.tech_calculator_title || "UC GPA Calculator",
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

          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Enter Your Courses
            </h3>

            {courses.map((course, index) => (
              <div key={course.id} className=" rounded-lg  space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-semibold text-gray-700">
                    Course {index + 1}
                  </h4>
                  {courses.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeCourse(course.id)}
                      className="text-red-500 hover:text-red-700 cursor-pointer font-bold text-sm"
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-12  gap-2">
                  {/* Course Name */}
                  <div className="col-span-6 md:col-span-3">
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
                      placeholder="e.g., Calculus I"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  {/* Credits */}
                  <div className="col-span-6 md:col-span-3">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Credits *
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      max="20"
                      value={course.credits}
                      onChange={(e) =>
                        handleCourseChange(course.id, "credits", e.target.value)
                      }
                      placeholder="e.g., 3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  {/* Grade */}
                  <div className="col-span-6 md:col-span-3">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Grade *
                    </label>
                    <select
                      value={course.grade}
                      onChange={(e) =>
                        handleCourseChange(course.id, "grade", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
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
                      <option value="D-">D- (0.7)</option>
                      <option value="F">F (0.0)</option>
                    </select>
                  </div>
                  {/* Course Type */}
                  <div className="col-span-6 md:col-span-3">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Course Type
                    </label>
                    <select
                      value={course.courseType}
                      onChange={(e) =>
                        handleCourseChange(
                          course.id,
                          "courseType",
                          e.target.value
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="regular">Regular</option>
                      <option value="honors">Honors (+1.0)</option>
                      <option value="ap">AP (+1.0)</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}

            {/* Add Course Button */}
            <div className="">
              <button
                type="button"
                onClick={addCourse}
                className="calculate repeat px-6 py-3 font-semibold text-[#ffffff] cursor-pointer bg-[#2845F5] text-[14px] rounded-lg"
              >
                + Add Another Course
              </button>
            </div>
          </div>

          {/* Calculate Button */}
          <div className="mb-6 mt-10 text-center space-x-2">
            <Button type="submit" isLoading={calculatingLoading}>
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

        {/* Loading State */}
        {calculatingLoading ? (
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
                <div className="space-y-4">
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  {/* GPA Results */}
                  <div className=" from-blue-50 to-indigo-50 rounded-lg ">
                    <h3 className="text-2xl font-bold text-center text-gray-800 mb-4">
                      Your UC GPA Results
                    </h3>

                    <div className="grid grid-cols-2 md:grid-cols-2 gap-6">
                      <div className="text-center">
                        <div className="bg-white bordered rounded-lg p-4 shadow-sm">
                          <h4 className="text-lg font-semibold text-gray-600 mb-2">
                            UC GPA
                          </h4>
                          <p className="text-3xl font-bold text-blue-600">
                            {result.gpa}
                          </p>
                        </div>
                      </div>

                      <div className="text-center">
                        <div className="bg-white bordered rounded-lg p-4 shadow-sm">
                          <h4 className="text-lg font-semibold text-gray-600 mb-2">
                            Total Credits
                          </h4>
                          <p className="text-3xl font-bold text-green-600">
                            {result.totalCredits}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 grid grid-cols-2 md:grid-cols-2 gap-4">
                      <div className="bg-white bordered rounded-lg p-4 shadow-sm">
                        <h4 className="text-sm font-semibold text-gray-600 mb-1">
                          Courses Calculated
                        </h4>
                        <p className="text-xl font-bold text-purple-600">
                          {result.totalCourses}
                        </p>
                      </div>

                      <div className="bg-white bordered rounded-lg p-4 shadow-sm">
                        <h4 className="text-sm font-semibold text-gray-600 mb-1">
                          Total Grade Points
                        </h4>
                        <p className="text-xl font-bold text-orange-600">
                          {result.weightedPoints}
                        </p>
                      </div>
                    </div>

                    {/* GPA Scale Information */}
                    <div className="  rounded-lg my-4 ">
                      <h4 className="text-lg font-semibold text-gray-700 mb-3">
                        UC GPA Scale Guide
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                        <div className="text-center p-2 bg-green-50 bordered rounded-lg">
                          <span className="font-semibold">4.0+</span>
                          <br />
                          Excellent
                        </div>
                        <div className="text-center p-2 bg-blue-50 bordered rounded-lg">
                          <span className="font-semibold">3.5-3.9</span>
                          <br />
                          Very Good
                        </div>
                        <div className="text-center p-2 bg-yellow-50 bordered rounded-lg">
                          <span className="font-semibold">3.0-3.4</span>
                          <br />
                          Good
                        </div>
                        <div className="text-center p-2 bg-orange-50 bordered rounded-lg">
                          <span className="font-semibold">2.5-2.9</span>
                          <br />
                          Fair
                        </div>
                      </div>
                    </div>

                    {/* UC Admission Information */}
                    {result.gpa && (
                      <div className="mt-6 bg-white bordered rounded-lg p-4 shadow-sm">
                        <h4 className="text-lg font-semibold text-gray-700 mb-3">
                          UC Admission Competitiveness
                        </h4>
                        <div className="text-sm text-gray-600">
                          {parseFloat(result.gpa) >= 4.0 && (
                            <p className="text-green-600 font-semibold">
                              🎉 Highly competitive for all UC schools
                            </p>
                          )}
                          {parseFloat(result.gpa) >= 3.7 &&
                            parseFloat(result.gpa) < 4.0 && (
                              <p className="text-blue-600 font-semibold">
                                ✅ Competitive for most UC schools
                              </p>
                            )}
                          {parseFloat(result.gpa) >= 3.4 &&
                            parseFloat(result.gpa) < 3.7 && (
                              <p className="text-yellow-600 font-semibold">
                                ⚠️ Consider applying to mid-tier UC schools
                              </p>
                            )}
                          {parseFloat(result.gpa) < 3.4 && (
                            <p className="text-orange-600 font-semibold">
                              📚 Focus on improving GPA and consider community
                              college transfer pathway
                            </p>
                          )}
                          <p className="mt-2 text-xs text-gray-500">
                            Note: UC admissions consider many factors beyond GPA
                            including extracurriculars, essays, and test scores.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          )
        )}
      </form>

      {result && (
        <CalculatorFeedback
          calName={data?.payload?.tech_calculator_title || "UC GPA Calculator"}
        />
      )}
    </Calculator>
  );
};

export default UcGpaCalculator;

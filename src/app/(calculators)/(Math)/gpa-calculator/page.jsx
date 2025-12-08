"use client";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency";
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";
import {
  useGetSingleCalculatorDetailsMutation,
  useGpaCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

const GPACalculator = () => {
  const pathname = usePathname();
  const parts = pathname.split("/").filter(Boolean);

  let url = "";
  if (parts.length === 1) {
    url = parts[0];
  } else {
    url = parts[0] + "/" + parts[1];
  }

  // Fetch calculator details
  const [getSingleCalculatorDetails, { data, error, isLoading }] =
    useGetSingleCalculatorDetailsMutation();

  useEffect(() => {
    const handleFetchDetails = async () => {
      try {
        await getSingleCalculatorDetails({ tech_calculator_link: url });
      } catch (err) {
        console.error("Error fetching calculator details:", err);
      }
    };
    handleFetchDetails();
  }, [url]);

  // Initial form state
  const [formData, setFormData] = useState({
    type_gpa: "college",
    grade_format: "1",
    current_gpa: "",
    credits_completed: "",
    target_gpa: "",
    additional_credits: "",
    semesters: [
      {
        semesterNumber: 1,
        courses: [
          { id: 1, course_name: "", credit: "", grade: "", weight: "Regular" },
          { id: 2, course_name: "", credit: "", grade: "", weight: "Regular" },
          { id: 3, course_name: "", credit: "", grade: "", weight: "Regular" },
        ],
      },
    ],
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");
  const [showCurrentGPA, setShowCurrentGPA] = useState(false);

  // RTK mutation hooks
  const [calculateGPA, { isLoading: calculateLoading }] =
    useGpaCalculatorMutation();

  // Currency state
  const [currency, setCurrency] = useState({
    code: "USD",
    symbol: "$",
    name: "US Dollar",
  });

  useEffect(() => {
    const fetchCurrency = async () => {
      const result = await getUserCurrency();
      if (result) setCurrency(result);
    };
    fetchCurrency();
  }, []);

  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setResult(null);
  };

  const handleCourseChange = (semesterIndex, courseIndex, field, value) => {
    setFormData((prev) => {
      const newSemesters = [...prev.semesters];
      const newCourses = [...newSemesters[semesterIndex].courses];
      newCourses[courseIndex] = { ...newCourses[courseIndex], [field]: value };
      newSemesters[semesterIndex] = {
        ...newSemesters[semesterIndex],
        courses: newCourses,
      };
      return { ...prev, semesters: newSemesters };
    });
  };

  // Add new course to a semester
  const addCourse = (semesterIndex) => {
    setFormData((prev) => {
      const newSemesters = [...prev.semesters];
      const newCourse = {
        id: Date.now(),
        course_name: "",
        credit: "",
        grade: "",
        weight: "Regular",
      };
      newSemesters[semesterIndex].courses.push(newCourse);
      return { ...prev, semesters: newSemesters };
    });
  };

  // Remove course from semester
  const removeCourse = (semesterIndex, courseIndex) => {
    setFormData((prev) => {
      const newSemesters = [...prev.semesters];
      if (newSemesters[semesterIndex].courses.length > 1) {
        newSemesters[semesterIndex].courses.splice(courseIndex, 1);
      }
      return { ...prev, semesters: newSemesters };
    });
  };

  // Add new semester
  const addSemester = () => {
    setFormData((prev) => ({
      ...prev,
      semesters: [
        ...prev.semesters,
        {
          semesterNumber: prev.semesters.length + 1,
          courses: [
            {
              id: Date.now(),
              course_name: "",
              credit: "",
              grade: "",
              weight: "Regular",
            },
          ],
        },
      ],
    }));
  };

  // Remove semester
  const removeSemester = (semesterIndex) => {
    if (formData.semesters.length > 1) {
      setFormData((prev) => {
        const newSemesters = [...prev.semesters];
        newSemesters.splice(semesterIndex, 1);
        // Re-number semesters
        newSemesters.forEach((sem, index) => {
          sem.semesterNumber = index + 1;
        });
        return { ...prev, semesters: newSemesters };
      });
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    const hasCourses = formData.semesters.some((semester) =>
      semester.courses.some(
        (course) => course.course_name && course.credit && course.grade
      )
    );

    if (!hasCourses && formData.type_gpa !== "planning") {
      setFormError("Please add at least one course with all fields filled");
      toast.error("Please add at least one course with all fields filled");
      return;
    }

    if (formData.type_gpa === "planning") {
      if (
        !formData.current_gpa ||
        !formData.credits_completed ||
        !formData.target_gpa ||
        !formData.additional_credits
      ) {
        setFormError("Please fill all planning fields");
        toast.error("Please fill all planning fields");
        return;
      }
    }

    setFormError("");

    // Prepare data for API - EXACTLY as shown in your examples
    let apiData;

    if (formData.type_gpa === "planning") {
      apiData = {
        type_gpa: "planning",
        current_gpa: parseFloat(formData.current_gpa),
        credits_completed: parseFloat(formData.credits_completed),
        target_gpa: parseFloat(formData.target_gpa),
        additional_credits: parseFloat(formData.additional_credits),
      };
    } else {
      // For high_school or college
      apiData = {
        type_gpa: formData.type_gpa,
        current_gpa: formData.current_gpa
          ? parseFloat(formData.current_gpa)
          : 0,
        credits_completed: formData.credits_completed
          ? parseFloat(formData.credits_completed)
          : 0,
        grade_format: parseInt(formData.grade_format),
        semesters: formData.semesters
          .map((semester) => ({
            courses: semester.courses
              .filter(
                (course) => course.course_name && course.credit && course.grade
              )
              .map((course) => ({
                course_name: course.course_name,
                credit: parseFloat(course.credit),
                grade:
                  formData.grade_format === "1"
                    ? course.grade
                    : parseFloat(course.grade),
                weight: course.weight,
              })),
          }))
          .filter((semester) => semester.courses.length > 0),
      };
    }

    try {
      const response = await calculateGPA(apiData).unwrap();

      setResult(response);
      toast.success("Calculated Successfully");
    } catch (err) {
      console.error("API Error:", err);
      setFormError(
        err.data?.payload?.error || err.data?.message || "Calculation failed"
      );
      toast.error(
        err.data?.payload?.error || err.data?.message || "Calculation failed"
      );
    }
  };

  // Handle reset form
  const handleReset = () => {
    setFormData({
      type_gpa: "college",
      grade_format: "1",
      current_gpa: "",
      credits_completed: "",
      target_gpa: "",
      additional_credits: "",
      semesters: [
        {
          semesterNumber: 1,
          courses: [
            {
              id: 1,
              course_name: "",
              credit: "",
              grade: "",
              weight: "Regular",
            },
            {
              id: 2,
              course_name: "",
              credit: "",
              grade: "",
              weight: "Regular",
            },
            {
              id: 3,
              course_name: "",
              credit: "",
              grade: "",
              weight: "Regular",
            },
          ],
        },
      ],
    });
    setResult(null);
    setFormError("");
    setShowCurrentGPA(false);
  };

  // Grade options based on format
  const gradeOptions = {
    1: [
      { value: "A+", label: "A+" },
      { value: "A", label: "A" },
      { value: "A-", label: "A-" },
      { value: "B+", label: "B+" },
      { value: "B", label: "B" },
      { value: "B-", label: "B-" },
      { value: "C+", label: "C+" },
      { value: "C", label: "C" },
      { value: "C-", label: "C-" },
      { value: "D+", label: "D+" },
      { value: "D", label: "D" },
      { value: "D-", label: "D-" },
      { value: "F", label: "F" },
    ],
  };

  // Weight options
  const weightOptions = [
    {
      value: "Regular",
      label: data?.payload?.tech_lang_keys["14"] || "Regular",
    },
    { value: "Honors", label: data?.payload?.tech_lang_keys["15"] || "Honors" },
    {
      value: "AP / IB",
      label: data?.payload?.tech_lang_keys["16"] || "AP / IB",
    },
    {
      value: "College",
      label: data?.payload?.tech_lang_keys["17"] || "College",
    },
  ];

  // Credit options
  const creditOptions = [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];

  // Format grade based on selected format
  const getGradeFormatText = () => {
    if (formData.grade_format === "1")
      return data?.payload?.tech_lang_keys["7"] || "Letter";
    if (formData.grade_format === "2")
      return data?.payload?.tech_lang_keys["8"] || "Percentage";
    return data?.payload?.tech_lang_keys["9"] || "Point Value";
  };

  // Helper function to get result data based on response structure
  const getResultData = () => {
    if (!result) return null;

    // Check different response structures
    if (result?.payload?.type === "Planning") {
      // Planning response structure 1
      return {
        type: "planning",
        ...result.payload.data,
      };
    } else if (result?.payload?.data?.type_gpa) {
      // High School/College response structure 1
      return result.payload.data;
    } else if (result?.payload?.cumulative_gpa !== undefined) {
      // High School/College response structure 2
      return result.payload;
    } else if (result?.payload?.data) {
      // Planning response structure 2
      return result.payload.data;
    }

    return result?.payload || result;
  };

  // Render planning result
  const renderPlanningResult = (resultData) => {
    return (
      <div className="w-full mx-auto p-4 lg:p-8 md:p-8 bg-white rounded-lg space-y-6 mt-6">
        <div className="col-12 bg-light-blue result p-6 radius-10 mt-3">
          <p className="text-center text-lg mb-4">
            {resultData.message ||
              `${
                data?.payload?.tech_lang_keys["21"] ||
                "To reach a target GPA of"
              } 
              <b className="tgpa mx-1">${resultData.target_gpa}</b>,
              ${data?.payload?.tech_lang_keys["22"] || "with"} 
              <b className="thour mx-1">${resultData.additional_credits}</b>
              ${
                data?.payload?.tech_lang_keys["23"] ||
                "additional credits, you need a GPA of"
              }
              <b className="mx-1">${resultData.required_gpa?.toFixed(2)}</b>
              ${data?.payload?.tech_lang_keys["24"] || "in future courses"}`}
          </p>
          <div className="flex justify-center">
            <div
              className="knob-container center z-depth-1 gpa_knob"
              style={{
                width: "180px",
                height: "180px",
                borderRadius: "50%",
                background:
                  resultData.is_achievable === false
                    ? "#FF6B6B"
                    : resultData.required_gpa >= 3.5
                    ? "#13699E"
                    : resultData.required_gpa > 2.9
                    ? "#54B725"
                    : "#FF6B6B",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div className="inner_knob1 white-text text-center">
                <p className="text-center font-s-20 mt-3">
                  <strong className="text-white">
                    {data?.payload?.tech_lang_keys["res"] || "Result"}
                  </strong>
                </p>
                <p className="text-center text-3xl font-bold">
                  <b className="t_cpga text-white">
                    {resultData.required_gpa?.toFixed(2)}
                  </b>
                </p>
                <p className="text-center font-s-20">
                  <b className="text-white">
                    {data?.payload?.tech_lang_keys["10"] || "GPA"}
                  </b>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render regular GPA result
  const renderRegularGPAResult = (resultData) => {
    return (
      <div className="rounded-lg flex items-center justify-center">
        <div className="w-full bg-light-blue result p-3 rounded-lg mt-3">
          <div className="flex justify-center">
            <div className="w-full text-center text-lg">
              {/* Cumulative GPA Display */}
              <div
                className="knob-container text-center z-depth-1 my-2 gpa_knob mx-auto"
                style={{
                  width: "200px",
                  height: "200px",
                  borderRadius: "50%",
                  background:
                    resultData.cumulative_gpa >= 3.5
                      ? "#13699E"
                      : resultData.cumulative_gpa > 2.9
                      ? "#54B725"
                      : "#FF6B6B",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto",
                }}
              >
                <div className="inner_knob text-white">
                  <p className="text-4xl font-bold mb-2">
                    {resultData.cumulative_gpa?.toFixed(2) || "0.00"}
                  </p>
                  <p className="text-xl">
                    {data?.payload?.tech_lang_keys["cum"] || "Cumulative"}
                  </p>
                  <p className="text-xl">
                    {data?.payload?.tech_lang_keys["10"] || "GPA"}
                  </p>
                </div>
              </div>

              {/* Total Grades and Hours */}
              <p className="w-full text-center mb-2 mt-6">
                <strong>
                  {data?.payload?.tech_lang_keys["total_g"] ||
                    "Total Grade Points"}{" "}
                  =
                  <span className="black-text font-s-20 ml-2">
                    {resultData.total_grade_points?.toFixed(1) ||
                      resultData.total_grade_points ||
                      "0.0"}
                  </span>
                </strong>
              </p>
              <p className="w-full text-center border-b pb-3">
                <strong>
                  {data?.payload?.tech_lang_keys["total_h"] ||
                    "Total No. of Credits"}{" "}
                  =
                  <span className="black-text font-s-20 ml-2">
                    {resultData.total_credits?.toFixed(1) ||
                      resultData.total_credits ||
                      "0.0"}
                  </span>
                </strong>
              </p>

              {/* Semester-wise Results */}
              <div className="semester_res mt-6">
                {(resultData.semesters || []).map((semesterResult, index) => (
                  <div key={index} className="mb-8 result_table">
                    <strong className="text-blue text-2xl block mb-4">
                      {semesterResult.semester ||
                        semesterResult.semester_name ||
                        `Semester ${index + 1}`}
                    </strong>
                    <table className="w-full text-center">
                      <thead>
                        <tr className="bg-[#2845F5] text-[#fff]">
                          <th className="text-blue border-b py-3">
                            <strong>
                              {data?.payload?.tech_lang_keys["course"] ||
                                "Course"}
                            </strong>
                          </th>
                          <th className="text-blue border-b py-3">
                            <strong>
                              {data?.payload?.tech_lang_keys["grade"] ||
                                "Grade"}
                            </strong>
                          </th>
                          <th className="text-blue border-b py-3">
                            <strong>
                              {data?.payload?.tech_lang_keys["credit"] ||
                                "Credit"}
                            </strong>
                          </th>
                          <th className="text-blue border-b py-3">
                            <strong>
                              {data?.payload?.tech_lang_keys["11"] ||
                                "Grade Point"}
                            </strong>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {(semesterResult.courses || []).map(
                          (course, courseIndex) => (
                            <tr key={courseIndex}>
                              <td className="border-b py-2">
                                {course.course || course.course_name}
                              </td>
                              <td className="border-b py-2">{course.grade}</td>
                              <td className="border-b py-2">{course.credit}</td>
                              <td className="border-b py-2">
                                {course.grade_point}
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                      <tfoot>
                        <tr className="bg-sky-100">
                          <td className="py-3" colSpan="2">
                            <strong>
                              {data?.payload?.tech_lang_keys["12"] ||
                                "Total Credit"}
                            </strong>
                          </td>
                          <td colSpan="2" className="py-3">
                            <strong className="hour1">
                              {semesterResult.total_credit}
                            </strong>
                          </td>
                        </tr>
                        <tr className="bg-[#2845F5] text-[#fff]">
                          <td className="py-3" colSpan="2">
                            <strong>
                              {data?.payload?.tech_lang_keys["10"] || "GPA"}
                            </strong>
                          </td>
                          <td colSpan="2" className="py-3">
                            <strong className="gpa1">
                              {semesterResult.gpa}
                            </strong>
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
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
        {/* Main Calculator Container */}
        <div className="w-full mx-auto p-4 lg:p-8 md:p-8 input_form rounded-lg space-y-6 mb-3">
          {formError && (
            <p className="text-red-500 text-lg font-semibold w-full text-center">
              {formError}
            </p>
          )}

          {/* GPA Type Selector */}
          <div className="lg:w-[90%] md:w-[90%] w-full mx-auto">
            <div className="col-12 col-lg-9 mx-auto mt-2 w-full">
              <div className="flex flex-wrap items-center bg-blue-100 border border-blue-500 text-center rounded-lg px-1">
                <div className="lg:w-1/2 w-full px-2 py-1">
                  <button
                    type="button"
                    className={`w-full px-3 py-2 cursor-pointer bordered rounded-md transition-colors duration-300 ${
                      formData.type_gpa === "college" ||
                      formData.type_gpa === "high_school"
                        ? "bg-[#2845F5] text-[#fff] font-semibold"
                        : "hover:bg-[#2845F5] hover:text-[#fff]"
                    }`}
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        type_gpa:
                          formData.type_gpa === "high_school"
                            ? "college"
                            : "high_school",
                      }))
                    }
                  >
                    {formData.type_gpa === "high_school"
                      ? data?.payload?.tech_lang_keys["1"] || "High School"
                      : data?.payload?.tech_lang_keys["2"] || "College"}
                  </button>
                </div>
                <div className="lg:w-1/2 w-full px-2 py-1">
                  <button
                    type="button"
                    className={`w-full px-3 py-2 cursor-pointer bordered rounded-md transition-colors duration-300 ${
                      formData.type_gpa === "planning"
                        ? "bg-[#2845F5] text-[#fff] font-semibold"
                        : "hover:bg-[#2845F5] hover:text-[#fff]"
                    }`}
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, type_gpa: "planning" }))
                    }
                  >
                    {data?.payload?.tech_lang_keys["25"] ||
                      "GPA Planning Calculator"}
                  </button>
                </div>
              </div>
            </div>

            {/* Grade Format Selector (Outside of semesters) */}
            {formData.type_gpa !== "planning" && (
              <div className="mt-6 mb-4">
                <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                  <span className="font-semibold">
                    {data?.payload?.tech_lang_keys["grade_format"] ||
                      "Grade Format"}
                    :
                  </span>
                  <select
                    name="grade_format"
                    value={formData.grade_format}
                    onChange={handleChange}
                    className="bordered rounded px-3 py-1"
                  >
                    <option value="1">
                      {data?.payload?.tech_lang_keys["7"] || "Letter"}
                    </option>
                    <option value="2">
                      {data?.payload?.tech_lang_keys["8"] || "Percentage"}
                    </option>
                    <option value="3">
                      {data?.payload?.tech_lang_keys["9"] || "Point Value"}
                    </option>
                  </select>
                </div>
              </div>
            )}

            {/* Current GPA Section */}
            {formData.type_gpa !== "planning" && (
              <div className="grid grid-cols-12 gap-2 md:gap-4 lg:gap-4 mt-6">
                <div className="col-span-12 row radius-5 bordered p-4 mt-3">
                  <div className="grid grid-cols-12 gap-2 md:gap-4 lg:gap-4">
                    <div
                      className="col-span-12 current_gpa cursor-pointer flex justify-between items-center"
                      onClick={() => setShowCurrentGPA(!showCurrentGPA)}
                    >
                      <strong className="font-size16">
                        {data?.payload?.tech_lang_keys["26"] ||
                          "Current Cumulative Information"}
                        <span className="text-sm font-normal ml-2">
                          ({data?.payload?.tech_lang_keys["4"] || "Optional"})
                        </span>
                      </strong>
                      <span>{showCurrentGPA ? "▲" : "▼"}</span>
                    </div>

                    {showCurrentGPA && (
                      <>
                        <div className="col-span-12 md:col-span-6 lg:col-span-6 current_input">
                          <p className="text-blue font-s-14 mb-1">
                            {data?.payload?.tech_lang_keys["3"] || "GPA"}
                          </p>
                          <input
                            type="number"
                            step="any"
                            min="0"
                            max="5"
                            name="current_gpa"
                            className="input w-full"
                            placeholder="0.0"
                            value={formData.current_gpa}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="col-span-12 md:col-span-6 lg:col-span-6 current_input">
                          <p className="text-blue font-s-14 mb-1">
                            {data?.payload?.tech_lang_keys["5"] || "Credits"}
                          </p>
                          <input
                            type="number"
                            step="any"
                            min="0"
                            name="credits_completed"
                            className="input w-full"
                            placeholder="0.0"
                            value={formData.credits_completed}
                            onChange={handleChange}
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Semesters Section */}
            {formData.type_gpa !== "planning" && (
              <div className="grid grid-cols-12 gap-2 md:gap-4 lg:gap-4 mt-6">
                {formData.semesters.map((semester, semesterIndex) => (
                  <div
                    key={semesterIndex}
                    className="col-span-12 semester bordered p-4 radius-5 mt-3"
                  >
                    {/* Semester Header */}
                    <div className="grid grid-cols-12 gap-2 md:gap-4 lg:gap-4 mb-4">
                      <div className="col-span-12 flex justify-between items-center">
                        <strong className="heading_on_mbl text-lg">
                          {data?.payload?.tech_lang_keys["semester"] ||
                            "Semester"}{" "}
                          {semester.semesterNumber}
                        </strong>
                        {formData.semesters.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeSemester(semesterIndex)}
                            className="text-red-500 hover:text-red-700 text-sm"
                          >
                            Remove Semester
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Course Headers */}
                    <div className="grid grid-cols-12 gap-4 mb-3 font-semibold text-blue text-sm">
                      <div className="col-span-3">
                        {data?.payload?.tech_lang_keys["course"] || "Course"}
                      </div>
                      <div className="col-span-2">
                        {data?.payload?.tech_lang_keys["credit"] || "Credit"}
                      </div>
                      <div className="col-span-2">
                        {data?.payload?.tech_lang_keys["grade"] || "Grade"}
                      </div>
                      <div className="col-span-3">{getGradeFormatText()}</div>
                      <div className="col-span-2"></div>
                    </div>

                    {/* Courses List */}
                    <div className="space-y-3">
                      {semester.courses.map((course, courseIndex) => (
                        <div
                          key={course.id}
                          className="grid grid-cols-12 gap-4 items-center"
                        >
                          {/* Course Name */}
                          <div className="col-span-3">
                            <input
                              type="text"
                              name={`course_name_${semesterIndex}_${courseIndex}`}
                              className="input w-full text-sm"
                              placeholder={
                                data?.payload?.tech_lang_keys["13"] ||
                                "Course Name"
                              }
                              value={course.course_name}
                              onChange={(e) =>
                                handleCourseChange(
                                  semesterIndex,
                                  courseIndex,
                                  "course_name",
                                  e.target.value
                                )
                              }
                            />
                          </div>

                          {/* Credit Hours */}
                          <div className="col-span-2">
                            <select
                              name={`credit_${semesterIndex}_${courseIndex}`}
                              className="input w-full text-sm"
                              value={course.credit}
                              onChange={(e) =>
                                handleCourseChange(
                                  semesterIndex,
                                  courseIndex,
                                  "credit",
                                  e.target.value
                                )
                              }
                            >
                              <option value="" disabled>
                                {data?.payload?.tech_lang_keys["credit"] ||
                                  "Credit"}
                              </option>
                              {creditOptions.map((credit) => (
                                <option key={credit} value={credit}>
                                  {credit}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Grade Input */}
                          <div className="col-span-2">
                            {formData.grade_format === "1" ? (
                              <select
                                name={`grade_${semesterIndex}_${courseIndex}`}
                                className="input w-full text-sm"
                                value={course.grade}
                                onChange={(e) =>
                                  handleCourseChange(
                                    semesterIndex,
                                    courseIndex,
                                    "grade",
                                    e.target.value
                                  )
                                }
                              >
                                <option value="" disabled>
                                  {data?.payload?.tech_lang_keys["grade"] ||
                                    "Grade"}
                                </option>
                                {gradeOptions["1"].map((option) => (
                                  <option
                                    key={option.label}
                                    value={option.value}
                                  >
                                    {option.label}
                                  </option>
                                ))}
                              </select>
                            ) : formData.grade_format === "2" ? (
                              <input
                                type="number"
                                name={`grade_${semesterIndex}_${courseIndex}`}
                                min="0"
                                max="100"
                                step="any"
                                className="input w-full text-sm"
                                placeholder="0"
                                value={course.grade}
                                onChange={(e) =>
                                  handleCourseChange(
                                    semesterIndex,
                                    courseIndex,
                                    "grade",
                                    e.target.value
                                  )
                                }
                              />
                            ) : (
                              <input
                                type="number"
                                name={`grade_${semesterIndex}_${courseIndex}`}
                                min="0"
                                max="5"
                                step="any"
                                className="input w-full text-sm"
                                placeholder="0.0"
                                value={course.grade}
                                onChange={(e) =>
                                  handleCourseChange(
                                    semesterIndex,
                                    courseIndex,
                                    "grade",
                                    e.target.value
                                  )
                                }
                              />
                            )}
                          </div>

                          {/* Weight Type */}
                          <div className="col-span-3">
                            <select
                              name={`weight_${semesterIndex}_${courseIndex}`}
                              className="input w-full text-sm"
                              value={course.weight}
                              onChange={(e) =>
                                handleCourseChange(
                                  semesterIndex,
                                  courseIndex,
                                  "weight",
                                  e.target.value
                                )
                              }
                            >
                              {weightOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Remove Course Button */}
                          <div className="col-span-2">
                            <button
                              type="button"
                              onClick={() =>
                                removeCourse(semesterIndex, courseIndex)
                              }
                              className="text-red-500 hover:text-red-700 text-sm"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Add Course Button */}
                    <div className="grid grid-cols-12 gap-4 mt-4">
                      <div className="col-span-6">
                        <button
                          type="button"
                          onClick={() => addCourse(semesterIndex)}
                          className="w-full tagsUnit p-2 bordered radius-5 cursor-pointer bg-[#2845F5] rounded-lg text-sm"
                        >
                          +{" "}
                          {data?.payload?.tech_lang_keys["add_course"] ||
                            "ADD COURSE"}
                        </button>
                      </div>
                      <div className="col-span-6 text-right">
                        {semesterIndex === formData.semesters.length - 1 && (
                          <button
                            type="button"
                            onClick={addSemester}
                            className="w-full tagsUnit p-2 bordered radius-5 cursor-pointer bg-[#2845F5] rounded-lg text-sm"
                          >
                            +{" "}
                            {data?.payload?.tech_lang_keys["add_semester"] ||
                              "Add Semester"}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Planning Mode Section */}
            {formData.type_gpa === "planning" && (
              <div className="grid grid-cols-12 gap-2 md:gap-4 lg:gap-4 mt-6">
                <div className="col-span-12 row bordered py-4 px-3 mt-3 rounded-lg">
                  <div className="grid grid-cols-12 gap-2 md:gap-4 lg:gap-4">
                    <div className="col-span-12 text-center mb-4">
                      <p className="text-lg font-bold">
                        <b>
                          {data?.payload?.tech_lang_keys["25"] ||
                            "GPA Planning Calculator"}
                        </b>
                      </p>
                    </div>

                    <div className="col-span-12 md:col-span-6 lg:col-span-6">
                      <label
                        htmlFor="current_gpa"
                        className="font-s-14 text-blue block mb-1"
                      >
                        {data?.payload?.tech_lang_keys["3"] || "Current GPA"}:
                      </label>
                      <input
                        type="number"
                        id="current_gpa"
                        step="any"
                        min="0"
                        max="5"
                        name="current_gpa"
                        className="input w-full"
                        placeholder="0.0"
                        value={formData.current_gpa}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="col-span-12 md:col-span-6 lg:col-span-6">
                      <label
                        htmlFor="credits_completed"
                        className="font-s-14 text-blue block mb-1"
                      >
                        {data?.payload?.tech_lang_keys["5"] ||
                          "Credits Completed"}
                        :
                      </label>
                      <input
                        type="number"
                        id="credits_completed"
                        step="any"
                        min="0"
                        name="credits_completed"
                        className="input w-full"
                        placeholder="0.0"
                        value={formData.credits_completed}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="col-span-12 md:col-span-6 lg:col-span-6">
                      <label
                        htmlFor="target_gpa"
                        className="font-s-14 text-blue block mb-1"
                      >
                        {data?.payload?.tech_lang_keys["18"] || "Target GPA"}:
                      </label>
                      <input
                        type="number"
                        id="target_gpa"
                        step="any"
                        min="0"
                        name="target_gpa"
                        className="input w-full"
                        placeholder="0.0"
                        value={formData.target_gpa}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="col-span-12 md:col-span-6 lg:col-span-6">
                      <label
                        htmlFor="additional_credits"
                        className="font-s-14 text-blue block mb-1"
                      >
                        {data?.payload?.tech_lang_keys["19"] ||
                          "Additional Credits"}
                        :
                      </label>
                      <input
                        type="number"
                        id="additional_credits"
                        step="any"
                        min="0"
                        name="additional_credits"
                        className="input w-full"
                        placeholder="0.0"
                        value={formData.additional_credits}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Calculate Button */}
            <div className="mb-6 mt-10 text-center space-x-2">
              <Button type="submit" isLoading={calculateLoading}>
                {data?.payload?.tech_lang_keys["calculate"] ?? "Calculate"}
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
        </div>

        {/* Results Section */}
        {result && (
          <div className="lg:w-[100%] w-full mx-auto">
            <div className="col-span-12">
              <div className="w-full result mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg shadow-md space-y-6">
                <ResultActions lang={data?.payload?.tech_lang_keys} />

                {/* Render appropriate result based on type */}
                {(() => {
                  const resultData = getResultData();

                  if (!resultData) return null;

                  // Check if it's planning result
                  if (
                    resultData.type == "planning" ||
                    resultData.required_gpa !== undefined ||
                    resultData.target_gpa !== undefined
                  ) {
                    return renderPlanningResult(resultData);
                  }
                  // Regular GPA result
                  else if (resultData.cumulative_gpa !== undefined) {
                    return renderRegularGPAResult(resultData);
                  }
                  // Data structure with nested data
                  else if (resultData.data?.cumulative_gpa !== undefined) {
                    return renderRegularGPAResult(resultData.data);
                  }

                  return null;
                })()}
              </div>
            </div>
          </div>
        )}
      </form>

      {/* Feedback Component */}
      {result && (
        <CalculatorFeedback calName={data?.payload?.tech_calculator_title} />
      )}
    </Calculator>
  );
};

export default GPACalculator;

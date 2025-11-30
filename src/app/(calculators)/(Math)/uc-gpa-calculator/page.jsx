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
  useUcGpaCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

const UcGpaCalculator = () => {
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

  // State for form data
  const [formData, setFormData] = useState({
    currentCGPA: "",
    creditsCompleted: "",
    semesters: [
      {
        semesterName: "Semester 1",
        courses: [
          { courseName: "", credits: "", grade: "" },
          { courseName: "", credits: "", grade: "" },
          { courseName: "", credits: "", grade: "" }
        ]
      }
    ]
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");
  const [showCurrentGPA, setShowCurrentGPA] = useState(false);

  const [calculateUcGpa, { isLoading: calculateGpaLoading }] = useUcGpaCalculatorMutation();

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
  };

  // Handle course changes
  const handleCourseChange = (semesterIndex, courseIndex, field, value) => {
    const newSemesters = [...formData.semesters];
    newSemesters[semesterIndex].courses[courseIndex][field] = value;
    setFormData(prev => ({ ...prev, semesters: newSemesters }));
    setResult(null);
  };

  // Add new course to semester
  const addCourse = (semesterIndex) => {
    const newSemesters = [...formData.semesters];
    newSemesters[semesterIndex].courses.push({
      courseName: "",
      credits: "",
      grade: ""
    });
    setFormData(prev => ({ ...prev, semesters: newSemesters }));
  };

  // Remove course from semester
  const removeCourse = (semesterIndex, courseIndex) => {
    const newSemesters = [...formData.semesters];
    if (newSemesters[semesterIndex].courses.length > 1) {
      newSemesters[semesterIndex].courses.splice(courseIndex, 1);
      setFormData(prev => ({ ...prev, semesters: newSemesters }));
    }
  };

  // Add new semester
  const addSemester = () => {
    const newSemester = {
      semesterName: `Semester ${formData.semesters.length + 1}`,
      courses: [
        { courseName: "", credits: "", grade: "" },
        { courseName: "", credits: "", grade: "" },
        { courseName: "", credits: "", grade: "" }
      ]
    };
    setFormData(prev => ({
      ...prev,
      semesters: [...prev.semesters, newSemester]
    }));
  };

  // Remove semester
  const removeSemester = (semesterIndex) => {
    if (formData.semesters.length > 1) {
      const newSemesters = formData.semesters.filter((_, index) => index !== semesterIndex);
      setFormData(prev => ({ ...prev, semesters: newSemesters }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form data
    let hasData = false;
    
    // Check if current GPA section has data
    if (formData.currentCGPA || formData.creditsCompleted) {
      if (!formData.currentCGPA || !formData.creditsCompleted) {
        setFormError("Please fill both current GPA and credits completed");
        return;
      }
      hasData = true;
    }

    // Check if any semester has course data
    for (const semester of formData.semesters) {
      for (const course of semester.courses) {
        if (course.courseName || course.credits || course.grade) {
          if (!course.credits || !course.grade) {
            setFormError("Please fill all credits and grade fields for courses");
            return;
          }
          hasData = true;
        }
      }
    }

    if (!hasData) {
      setFormError("Please fill in at least one course or current GPA information");
      return;
    }

    // Prepare submission data with proper number conversion
    const submissionData = {
      currentCGPA: formData.currentCGPA ? parseFloat(formData.currentCGPA) : "",
      creditsCompleted: formData.creditsCompleted ? parseFloat(formData.creditsCompleted) : "",
      semesters: formData.semesters.map(semester => ({
        semesterName: semester.semesterName,
        courses: semester.courses
          .filter(course => course.credits && course.grade)
          .map(course => ({
            courseName: course.courseName || `Course ${Math.random().toString(36).substr(2, 5)}`,
            credits: course.credits,
            grade: course.grade
          }))
      })).filter(semester => semester.courses.length > 0)
    };

    setFormError("");
    try {
      const response = await calculateUcGpa(submissionData).unwrap();
      setResult(response?.payload);
      toast.success("GPA Calculated Successfully");
    } catch (err) {
      setFormError(err.data?.payload?.error || "Calculation failed");
      toast.error(err.data?.payload?.error || "Calculation failed");
    }
  };

  // Handle reset form
  const handleReset = () => {
    setFormData({
      currentCGPA: "",
      creditsCompleted: "",
      semesters: [
        {
          semesterName: "Semester 1",
          courses: [
            { courseName: "", credits: "", grade: "" },
            { courseName: "", credits: "", grade: "" },
            { courseName: "", credits: "", grade: "" }
          ]
        }
      ]
    });
    setResult(null);
    setFormError(null);
    setShowCurrentGPA(false);
  };

  // Currency state
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
        <div className="w-full mx-auto p-4 lg:p-8 md:p-8 input_form rounded-lg space-y-6 mb-3">
          {formError && (
            <p className="text-red-500 text-lg font-semibold w-full">
              {formError}
            </p>
          )}

          <div className="lg:w-[80%] md:w-[80%] w-full mx-auto">
            <div className="grid grid-cols-12 mt-3 gap-2 md:gap-4 lg:gap-4">

              {/* Current GPA Section */}
              <div className="col-span-12 rounded-lg p-2 mt-3">
                <div className="grid grid-cols-12 mt-3 gap-2 md:gap-4 lg:gap-4">
                  <div className="col-span-12 current_gpa cursor-pointer bg-[#2845F5] text-[#fff] p-2 rounded-lg">
                    <strong 
                      className="font-size-16 padding-0"
                      onClick={() => setShowCurrentGPA(!showCurrentGPA)}
                    >
                      {data?.payload?.tech_lang_keys?.["14"] || "Current"} {data?.payload?.tech_lang_keys?.["4"] || "GPA"}
                    </strong>
                  </div>
                  <div className={`col-span-12 md:col-span-6 lg:col-span-6 ${showCurrentGPA ? 'block' : 'hidden'}`}>
                    <p className="text-[#2845F5] text-sm mb-1">
                      {data?.payload?.tech_lang_keys?.["3"] || "GPA"}
                    </p>
                    <input 
                      type="number" 
                      step="any" 
                      min="0" 
                      max="5" 
                      id="currentCGPA"
                      name="currentCGPA"
                      className="input w-full p-2 border rounded"
                      placeholder="0.0"
                      value={formData.currentCGPA}
                      onChange={handleChange}
                    />
                  </div>
                  <div className={`col-span-12 md:col-span-6 lg:col-span-6 ${showCurrentGPA ? 'block' : 'hidden'}`}>
                    <p className="text-[#2845F5] text-sm mb-1">
                      {data?.payload?.tech_lang_keys?.["5"] || "Credits"}
                    </p>
                    <input 
                      type="number" 
                      step="any" 
                      min="0" 
                      id="creditsCompleted"
                      name="creditsCompleted"
                      className="input w-full p-2 border rounded"
                      placeholder="0.0"
                      value={formData.creditsCompleted}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              {/* Semesters */}
              {formData.semesters.map((semester, semesterIndex) => (
                <div key={semesterIndex} className="col-span-12 overflow-auto">
                  <div className="grid grid-cols-12 gap-2 md:gap-4 lg:gap-4 semester mt-3 md:w-auto w-[400px] rounded-lg">
                    <div className="col-span-12">
                      <div className="mb-2">
                        <div className="left">
                          <strong className="text-[20px]">
                            {semester.semesterName}
                          </strong>
                        </div>
                      </div>
                      <div className="grid grid-cols-12 gap-2 mb-2">
                        <strong className="col-span-4 text-[#2845F5]">
                          {data?.payload?.tech_lang_keys?.["course"] || "Course"}
                        </strong>
                        <strong className="col-span-4 text-[#2845F5]">
                          {data?.payload?.tech_lang_keys?.["credit"] || "Credit"}
                        </strong>
                        <strong className="col-span-4 text-[#2845F5]">
                          {data?.payload?.tech_lang_keys?.["grade"] || "Grade"}
                        </strong>
                      </div>
                      <div className=" pb-2" id={`accept_row${semesterIndex + 1}`}>
                        <ul className="get_html">
                          {semester.courses.map((course, courseIndex) => (
                            <li key={courseIndex} className="grid grid-cols-12 gap-2 mt-2">
                              <div className="col-span-4">
                                <input
                                  type="text"
                                  className="input w-full p-2 border rounded"
                                  placeholder={data?.payload?.tech_lang_keys?.["13"] || "Course name"}
                                  value={course.courseName}
                                  onChange={(e) => handleCourseChange(semesterIndex, courseIndex, "courseName", e.target.value)}
                                />
                              </div>
                              <div className="col-span-4">
                                <input
                                  type="number"
                                  step="any"
                                  min="1"
                                  className="input w-full p-2 border rounded"
                                  placeholder="Credit"
                                  value={course.credits}
                                  onChange={(e) => handleCourseChange(semesterIndex, courseIndex, "credits", e.target.value)}
                                />
                              </div>
                              <div className="col-span-3">
                                <select
                                  className="input w-full p-2 border rounded"
                                  value={course.grade}
                                  onChange={(e) => handleCourseChange(semesterIndex, courseIndex, "grade", e.target.value)}
                                >
                                  <option value="" disabled>
                                    {data?.payload?.tech_lang_keys?.["grade"] || "Grade"}
                                  </option>
                                  <option value="4.0">A+</option>
                                  <option value="4.0">A</option>
                                  <option value="3.7">A-</option>
                                  <option value="3.3">B+</option>
                                  <option value="3.0">B</option>
                                  <option value="2.7">B-</option>
                                  <option value="2.3">C+</option>
                                  <option value="2.0">C</option>
                                  <option value="1.7">C-</option>
                                  <option value="1.3">D+</option>
                                  <option value="1.0">D</option>
                                  <option value="0.7">D-</option>
                                  <option value="0.0">F</option>
                                </select>
                              </div>
                              <div className="col-span-1 flex items-center">
                                <button
                                  type="button"
                                  className="text-red-500 cursor-pointer"
                                  onClick={() => removeCourse(semesterIndex, courseIndex)}
                                >
                                  ✕
                                </button>
                              </div>
                            </li>
                          ))}
                        </ul>
                        <div className="grid grid-cols-12 gap-2 mt-2">
                          <div className="col-span-6 text-left">
                            <button
                              type="button"
                              className="units_active border rounded-lg cursor-pointer add_course bg-[#2845F5] text-white p-2"
                              onClick={() => addCourse(semesterIndex)}
                            >
                              <b>+ {data?.payload?.tech_lang_keys?.["add_course"] || "Add Course"}</b>
                            </button>
                          </div>
                          <div className="col-span-6 text-right">
                            {semesterIndex === formData.semesters.length - 1 && (
                              <button
                                type="button"
                                className="units_active border rounded-lg cursor-pointer add_semester bg-[#2845F5] text-white p-2"
                                onClick={addSemester}
                              >
                                <b>+ {data?.payload?.tech_lang_keys?.["add_semester"] || "Add Semester"}</b>
                              </button>
                            )}
                            {formData.semesters.length > 1 && (
                              <button
                                type="button"
                                className="units_active border rounded-lg cursor-pointer bg-red-500 text-white p-2 ml-2"
                                onClick={() => removeSemester(semesterIndex)}
                              >
                                <b>Remove Semester</b>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Submit Button */}
            <div className="col-span-12 text-center mt-3">
              <Button type="submit" isLoading={calculateGpaLoading}>
                {data?.payload?.tech_lang_keys?.["calculate"] || "Calculate"}
              </Button>
              {result && (
                <ResetButton type="button" onClick={handleReset} className="ml-2">
                  {data?.payload?.tech_lang_keys?.["reset"] || "RESET"}
                </ResetButton>
              )}
            </div>
          </div>
        </div>

        {/* Results Display */}
        {!calculateGpaLoading && result && (
          <div className="w-full result mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg  space-y-6">
            <ResultActions lang={data?.payload?.tech_lang_keys} />
            
            <div className="rounded-lg flex items-center justify-center">
              <div className="w-full mt-3">
                {/* Main Result */}
                <div className="w-full text-center mt-4">
                  <div className="bg-blue-100 rounded-lg p-4 bordered">
                    <p className="text-[32px] mt-2">
                      <b>{result.cumulativeGPA?.toFixed(2)}</b>
                    </p>
                    <p>
                      <strong className="text-[25px]">
                        {data?.payload?.tech_lang_keys?.["cum"] || "Cumulative"}
                      </strong>
                    </p>
                    <strong className="text-[25px]">
                      {data?.payload?.tech_lang_keys?.["10"] || "GPA"}
                    </strong>
                  </div>
                </div>

                {/* Total Points and Credits */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 text-center">
                  <div>
                    <p className="text-[#2845F5] text-[18px]">
                      <strong>
                        {data?.payload?.tech_lang_keys?.["total_g"] || "Total Grade Points"} ={" "}
                        <span className="text-[25px]">{result.totalGradePoints?.toFixed(2)}</span>
                      </strong>
                    </p>
                  </div>
                  <div>
                    <p className="text-[#2845F5] text-[18px]">
                      <strong>
                        {data?.payload?.tech_lang_keys?.["total_h"] || "Total Credits"} ={" "}
                        <span className="text-[25px]">{result.totalCredits}</span>
                      </strong>
                    </p>
                  </div>
                </div>

                {/* Semester-wise Results */}
                {result.semesters && result.semesters.map((semester, semesterIndex) => (
                  <div key={semesterIndex} className="mt-2 overflow-auto">
                    <strong className="text-[#2845F5] text-[25px]">
                      {semester.semesterName}
                    </strong>
                    <table className="w-full text-[18px] mt-2">
                      <thead>
                        <tr className="bg-[#2845F5] text-white">
                          <td className="border-b py-2">
                            <strong>{data?.payload?.tech_lang_keys?.["course"] || "Course"}</strong>
                          </td>
                          <td className="border-b py-2">
                            <strong>{data?.payload?.tech_lang_keys?.["grade"] || "Grade"}</strong>
                          </td>
                          <td className="border-b py-2">
                            <strong>{data?.payload?.tech_lang_keys?.["credit"] || "Credit"}</strong>
                          </td>
                          <td className="border-b py-2">
                            <strong>{data?.payload?.tech_lang_keys?.["11"] || "Grade Points"}</strong>
                          </td>
                        </tr>
                      </thead>
                      <tbody className={`table${semesterIndex + 1}`}>
                        {semester.courses && semester.courses.map((course, courseIndex) => (
                          <tr key={courseIndex}>
                            <td className="border-b py-2">
                              {course.courseName}
                            </td>
                            <td className="border-b py-2">
                              {course.grade}
                            </td>
                            <td className="border-b py-2">
                              {course.credits}
                            </td>
                            <td className="border-b py-2">
                              {course.gradePoints?.toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="bg-white text-center">
                          <td className="border-b py-2" colSpan="2">
                            <strong>{data?.payload?.tech_lang_keys?.["12"] || "Total Credit"}</strong>
                          </td>
                          <td colSpan="2" className="border-b py-2">
                            <strong>{semester.totalCredits}</strong>
                          </td>
                        </tr>
                        <tr className="bg-white text-center">
                          <td className="border-b py-2" colSpan="2">
                            <strong>{data?.payload?.tech_lang_keys?.["10"] || "GPA"}</strong>
                          </td>
                          <td colSpan="2" className="border-b py-2">
                            <strong>{semester.semesterGPA?.toFixed(2)}</strong>
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                ))}
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

export default UcGpaCalculator;
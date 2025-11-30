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
  useUtGpaCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

const UtGpaCalculator = () => {
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
  const [showCurrentGPA, setShowCurrentGPA] = useState(true);

  const [calculateUtGpa, { isLoading: calculateGpaLoading }] = useUtGpaCalculatorMutation();

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
      const response = await calculateUtGpa(submissionData).unwrap();
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
        <div className="w-full mx-auto p-4 lg:p-8 md:p-8 input_form rounded-lg  space-y-6 mb-3">
          {formError && (
            <p className="text-red-500 text-lg font-semibold w-full">
              {formError}
            </p>
          )}

          <div className="lg:w-[90%] md:w-[90%] w-full mx-auto">
            <div className="grid grid-cols-12 mt-3 gap-2 md:gap-4 lg:gap-4">

              {/* Current GPA Section */}
              <div className="col-span-12">
                <div className="grid grid-cols-12 mt-3 gap-2 md:gap-4 lg:gap-4">
                  <div className="col-span-12 current_gpa bg-[#2845F5] text-[#fff] p-2 rounded-lg">
                    <strong 
                      className="col-8 cursor-pointer"
                      onClick={() => setShowCurrentGPA(!showCurrentGPA)}
                    >
                      {data?.payload?.tech_lang_keys?.["14"] || "Current"} {data?.payload?.tech_lang_keys?.["4"] || "GPA"}
                    </strong>
                  </div>
                  <div className={`col-span-12 row current_inp  ${showCurrentGPA ? 'block' : 'hidden'}`}>
                    <div className="grid grid-cols-12 mt-3 gap-2 md:gap-4 lg:gap-4">
                      <div className="col-span-12 md:col-span-6 lg:col-span-6">
                        <label htmlFor="currentCGPA" className="text-[#2845F5] text-sm">
                          {data?.payload?.tech_lang_keys?.["3"] || "GPA"}
                        </label>
                        <input 
                          type="number" 
                          step="any" 
                          min="0" 
                          max="5" 
                          id="currentCGPA"
                          name="currentCGPA"
                          className="input mt-2 w-full p-2 border rounded"
                          placeholder="0.0"
                          value={formData.currentCGPA}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="col-span-12 md:col-span-6 lg:col-span-6">
                        <label htmlFor="creditsCompleted" className="text-[#2845F5] text-sm">
                          {data?.payload?.tech_lang_keys?.["5"] || "Credits"}
                        </label>
                        <input 
                          type="number" 
                          step="any" 
                          min="0" 
                          id="creditsCompleted"
                          name="creditsCompleted"
                          className="input mt-2 w-full p-2 border rounded"
                          placeholder="0.0"
                          value={formData.creditsCompleted}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Semesters */}
              {formData.semesters.map((semester, semesterIndex) => (
                <div key={semesterIndex} className="col-span-12 overflow-auto">
                  <div className="semester rounded-lg p-3 mt-2 md:w-auto w-[400px]">
                    <p>
                      <strong className="text-[20px] text-[#2845F5]">
                        {semester.semesterName}
                      </strong>
                    </p>
                    
                    <div className="row mt-3">
                      <div className="grid grid-cols-12 gap-2 md:gap-4 lg:gap-4">
                        <strong className="col-span-4 text-[14px] px-1">
                          {data?.payload?.tech_lang_keys?.["course"] || "Course"}
                        </strong>
                        <strong className="col-span-4 text-[14px] px-1">
                          {data?.payload?.tech_lang_keys?.["credit"] || "Credit"}
                        </strong>
                        <strong className="col-span-4 text-[14px] px-1">
                          {data?.payload?.tech_lang_keys?.["grade"] || "Grade"}
                        </strong>
                      </div>
                    </div>

                    <div className="row addCourse mt-2" id={`accept_row${semesterIndex + 1}`}>
                      <ul className="get_html">
                        {semester.courses.map((course, courseIndex) => (
                          <li key={courseIndex} className="row relative grid grid-cols-12 gap-2 md:gap-4 lg:gap-4 mb-3" style={{listStyle: "none"}}>
                            <div className="col-span-4 px-1">
                              <input
                                type="text"
                                className="input w-full p-2 border rounded"
                                placeholder={data?.payload?.tech_lang_keys?.["13"] || "Course name"}
                                value={course.courseName}
                                onChange={(e) => handleCourseChange(semesterIndex, courseIndex, "courseName", e.target.value)}
                              />
                            </div>
                            <div className="col-span-3 px-1">
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
                            <div className="col-span-4 px-1">
                              <select
                                className="input w-full p-2 border rounded"
                                value={course.grade}
                                onChange={(e) => handleCourseChange(semesterIndex, courseIndex, "grade", e.target.value)}
                              >
                                <option value="" disabled>
                                  {data?.payload?.tech_lang_keys?.["grade"] || "Grade"}
                                </option>
                                <option value="4.0">A</option>
                                <option value="3.67">A-</option>
                                <option value="3.33">B+</option>
                                <option value="3.0">B</option>
                                <option value="2.67">B-</option>
                                <option value="2.33">C+</option>
                                <option value="2.0">C</option>
                                <option value="1.67">C-</option>
                                <option value="1.33">D+</option>
                                <option value="1.0">D</option>
                                <option value="0.67">D-</option>
                                <option value="0.0">F</option>
                              </select>
                            </div>
                            <div className="col-span-1 px-1 flex items-center">
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

                      <div className="w-full pb-2 mt-3 flex flex-wrap gap-2">
                        <button
                          type="button"
                          className="col-6 col-md-4 units_active  rounded-lg cursor-pointer add_course bg-[#2845F5] text-white p-3"
                          onClick={() => addCourse(semesterIndex)}
                        >
                          <strong className="flex items-center justify-center">
                            <span className="pe-2">+</span>
                            {data?.payload?.tech_lang_keys?.["add_course"] || "Add Course"}
                          </strong>
                        </button>
                        
                        {semesterIndex === formData.semesters.length - 1 && (
                          <button
                            type="button"
                            className="col-6 col-md-4 units_active  rounded-lg cursor-pointer add_semester bg-[#2845F5] text-white p-3"
                            onClick={addSemester}
                          >
                            <strong className="flex items-center justify-center">
                              <span className="pe-2">+</span>
                              {data?.payload?.tech_lang_keys?.["add_semester"] || "Add Semester"}
                            </strong>
                          </button>
                        )}
                        {formData.semesters.length > 1 && (
                          <button
                            type="button"
                            className="col-6 col-md-4 units_active border rounded-lg cursor-pointer bg-red-500 text-white p-3"
                            onClick={() => removeSemester(semesterIndex)}
                          >
                            <strong className="flex items-center justify-center">
                              Remove Semester
                            </strong>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Submit Button */}
            <div className="mb-6 mt-10 text-center space-x-2">
              <Button type="submit" isLoading={calculateGpaLoading}>
                {data?.payload?.tech_lang_keys?.["calculate"] || "Calculate"}
              </Button>
              {result && (
                <ResetButton type="button" onClick={handleReset}>
                  {data?.payload?.tech_lang_keys?.["reset"] || "RESET"}
                </ResetButton>
              )}
            </div>
          </div>
        </div>

        {/* Results Display */}
        {!calculateGpaLoading && result && (
          <div className="w-full result mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg space-y-6">
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
                  <div key={semesterIndex} className="w-full pb-2 mt-6">
                    <strong className="text-[#2845F5] text-[20px]">
                      {semester.semesterName}
                    </strong>
                    
                    <div className="w-full overflow-auto mt-2">
                      <table className="w-full border-collapse border border-gray-300">
                        <thead>
                          <tr className="bg-[#2845F5] text-[#fff]">
                            <th className="p-2 text-left">
                              <strong>{data?.payload?.tech_lang_keys?.["course"] || "Course"}</strong>
                            </th>
                            <th className="p-2 text-center">
                              <strong>{data?.payload?.tech_lang_keys?.["grade"] || "Grade"}</strong>
                            </th>
                            <th className="p-2 text-center">
                              <strong>{data?.payload?.tech_lang_keys?.["credit"] || "Credit"}</strong>
                            </th>
                            <th className="p-2 text-center">
                              <strong>{data?.payload?.tech_lang_keys?.["11"] || "Grade Points"}</strong>
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {semester.courses && semester.courses.map((course, courseIndex) => (
                            <tr key={courseIndex} className="hover:bg-gray-50">
                              <td className="p-2 border-b border-gray-300">
                                {course.courseName}
                              </td>
                              <td className="p-2 border-b border-gray-300 text-center">
                                {course.grade}
                              </td>
                              <td className="p-2 border-b border-gray-300 text-center">
                                {course.credits}
                              </td>
                              <td className="p-2 border-b border-gray-300 text-center font-semibold">
                                {course.gradePoints?.toFixed(2)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr className="bg-blue-50">
                            <td className="p-2 border-b border-gray-300 font-semibold text-right" colSpan="2">
                              <strong>{data?.payload?.tech_lang_keys?.["12"] || "Total Credit"}</strong>
                            </td>
                            <td className="p-2 border-b border-gray-300 text-center font-semibold">
                              {semester.totalCredits}
                            </td>
                            <td className="p-2 border-b border-gray-300 text-center font-semibold text-blue-600">
                              {semester.semesterGradePoints?.toFixed(2)}
                            </td>
                          </tr>
                          <tr className="bg-blue-50">
                            <td className="p-2 border-b border-gray-300 font-semibold text-right" colSpan="2">
                              <strong>{data?.payload?.tech_lang_keys?.["10"] || "GPA"}</strong>
                            </td>
                            <td className="p-2 border-b border-gray-300 text-center font-semibold">
                              {semester.semesterGPA?.toFixed(2)}
                            </td>
                            <td className="p-2 border-b border-gray-300 text-center"></td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
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

export default UtGpaCalculator;
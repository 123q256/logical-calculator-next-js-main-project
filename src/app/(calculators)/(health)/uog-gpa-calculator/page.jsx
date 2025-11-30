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
  useUogGpaCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";
import { string } from "mathjs";

const UogGpaCalculator = () => {
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

  // State for form data matching API structure
  const [formData, setFormData] = useState({
    currentCgpa: "",
    creditsCompleted: "",
    gradeFormat: "letter", // letter, percentage, point - SINGLE FORMAT FOR ALL
    semesters: [
      {
        semesterName: "Semester 1",
        courses: [
          { courseName: "", grade: "", credit: "" },
          { courseName: "", grade: "", credit: "" },
          { courseName: "", grade: "", credit: "" }
        ]
      }
    ]
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");
  const [showCurrentGPA, setShowCurrentGPA] = useState(true);
  const [showGradeType, setShowGradeType] = useState(false); // SINGLE DROPDOWN

  const [calculateGpa, { isLoading: calculateGpaLoading }] = useUogGpaCalculatorMutation();

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
      grade: "",
      credit: ""
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
        { courseName: "", grade: "", credit: "" },
        { courseName: "", grade: "", credit: "" },
        { courseName: "", grade: "", credit: "" }
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

  // Change grade format - APPLIES TO ALL SEMESTERS
  const changeGradeFormat = (format) => {
    setFormData(prev => ({ ...prev, gradeFormat: format }));
    setShowGradeType(false);
  };

  // Get grade format display text
  const getGradeFormatText = () => {
    switch(formData.gradeFormat) {
      case "letter": return data?.payload?.tech_lang_keys?.["7"] || "Letter";
      case "percentage": return data?.payload?.tech_lang_keys?.["8"] || "Percentage";
      case "point": return data?.payload?.tech_lang_keys?.["9"] || "Point Value";
      default: return "Letter";
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Convert string values to numbers before sending to API
    const submissionData = {
      ...formData,
      currentCgpa: formData.currentCgpa ? parseFloat(formData.currentCgpa) : 0.0,
      creditsCompleted: formData.creditsCompleted ? parseFloat(formData.creditsCompleted) : 0.0,
      semesters: formData.semesters.map(semester => ({
        ...semester,
        courses: semester.courses.map(course => ({
          ...course,
          credit: course.credit ? parseFloat(course.credit) : 0,
          grade: course.grade ? course.grade : "A"
        }))
      }))
    };


    setFormError("");
    try {
      const response = await calculateGpa(submissionData).unwrap();
      setResult(response?.payload);
      toast.success("GPA Calculated Successfully");
    } catch (err) {
      const errorMessage = err.data?.payload?.message || err.data?.payload?.error || "Calculation failed";
      // setFormError(errorMessage);
      // toast.error(errorMessage);
       setFormError(err.data.payload.error);
      toast.error(err.data.payload.error);
    }
  };

  // Handle reset form
  const handleReset = () => {
    setFormData({
      currentCgpa: "",
      creditsCompleted: "",
      gradeFormat: "letter",
      semesters: [
        {
          semesterName: "Semester 1",
          courses: [
            { courseName: "", grade: "", credit: "" },
            { courseName: "", grade: "", credit: "" },
            { courseName: "", grade: "", credit: "" }
          ]
        }
      ]
    });
    setResult(null);
    setFormError(null);
    setShowCurrentGPA(false);
    setShowGradeType(false);
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

              {/* GLOBAL GRADE FORMAT SELECTOR - ONLY ONE AT TOP */}
              <div className="col-span-12 mb-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg bordered ">
                  <strong className="text-[#2845F5]">
                    {data?.payload?.tech_lang_keys?.["6"] || "Grade Format"}:
                  </strong>
                  <div className="relative">
                    <div 
                      className="flex items-center cursor-pointer bg-white px-3 py-2 bordered rounded"
                      onClick={() => setShowGradeType(!showGradeType)}
                    >
                      <span className="mr-2">{getGradeFormatText()}</span>
                      <span className={`transform transition-transform ${showGradeType ? 'rotate-180' : ''}`}>
                        ▼
                      </span>
                    </div>
                    {showGradeType && (
                      <div className="absolute right-0 mt-1 bg-white bordered rounded shadow-lg z-20 w-48">
                        <div 
                          className="flex items-center p-3 cursor-pointer hover:bg-gray-100 borderbblack"
                          onClick={() => changeGradeFormat("letter")}
                        >
                          <span>{data?.payload?.tech_lang_keys?.["7"] || "Letter"}</span>
                        </div>
                        <div 
                          className="flex items-center p-3 cursor-pointer hover:bg-gray-100 borderbblack"
                          onClick={() => changeGradeFormat("percentage")}
                        >
                          <span>{data?.payload?.tech_lang_keys?.["8"] || "Percentage"}</span>
                        </div>
                        <div 
                          className="flex items-center p-3 cursor-pointer hover:bg-gray-100 borderbblack"
                          onClick={() => changeGradeFormat("point")}
                        >
                          <span>{data?.payload?.tech_lang_keys?.["9"] || "Point Value"}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Current GPA Section */}
              <div className="col-span-12 p-2  rounded-lg mt-2">
                <div className="grid grid-cols-12 gap-2 md:gap-4 lg:gap-4">
                  <div className="col-span-12 current_gpa bg-[#2845F5] p-2 text-white rounded-lg">
                    <strong 
                      className="col-8 cursor-pointer"
                      onClick={() => setShowCurrentGPA(!showCurrentGPA)}
                    >
                      {data?.payload?.tech_lang_keys?.["14"] || "Current"} {data?.payload?.tech_lang_keys?.["4"] || "GPA"}
                    </strong>
                  </div>
                  <div className={`col-span-12 row current_inp ${showCurrentGPA ? 'block' : 'hidden'}`}>
                    <div className="grid grid-cols-12 gap-2 md:gap-4 lg:gap-4">
                      <div className="col-span-12 md:col-span-6 lg:col-span-6 mt-2 pe-1">
                        <label htmlFor="currentCgpa" className="text-[#2845F5] text-sm">
                          {data?.payload?.tech_lang_keys?.["3"] || "GPA"}
                        </label>
                        <input 
                          type="number" 
                          step="any" 
                          min="0" 
                          max="5" 
                          id="currentCgpa"
                          name="currentCgpa"
                          className="input mt-2 w-full p-2 border rounded"
                          placeholder="0.0"
                          value={formData.currentCgpa}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="col-span-12 md:col-span-6 lg:col-span-6 mt-2 ps-1">
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
                  <div className="semester  rounded-lg p-3 mt-2 md:w-auto w-[470px]">
                    <div className="flex justify-between items-center mb-3">
                      <p>
                        <strong className="text-[20px] text-[#2845F5]">
                          {semester.semesterName}
                        </strong>
                      </p>
                      {formData.semesters.length > 1 && (
                        <button
                          type="button"
                          className="text-red-500 text-sm cursor-pointer"
                          onClick={() => removeSemester(semesterIndex)}
                        >
                          Remove Semester
                        </button>
                      )}
                    </div>

                    <div className="row mt-3 grid grid-cols-12 gap-2">
                      <strong className="col-span-5 text-sm px-1">
                        {data?.payload?.tech_lang_keys?.["course"] || "Course"}
                      </strong>
                      <strong className="col-span-3 text-sm px-1">
                        {data?.payload?.tech_lang_keys?.["grade"] || "Grade"}
                      </strong>
                      <strong className="col-span-3 text-sm px-1">
                        {data?.payload?.tech_lang_keys?.["credit"] || "Credit"}
                      </strong>
                      <strong className="col-span-1 text-sm px-1">
                        {data?.payload?.tech_lang_keys?.["action"] || "Action"}
                      </strong>
                    </div>

                    <div className="addCourse mt-2">
                      <ul className="get_html">
                        {semester.courses.map((course, courseIndex) => (
                          <li key={courseIndex} className="row relative grid grid-cols-12 gap-2 mb-2">
                            <div className="col-span-5 px-1">
                              <input
                                type="text"
                                className="input w-full p-2 border rounded"
                                placeholder={data?.payload?.tech_lang_keys?.["13"] || "Course name"}
                                value={course.courseName}
                                onChange={(e) => handleCourseChange(semesterIndex, courseIndex, "courseName", e.target.value)}
                              />
                            </div>

                            {/* Grade Input based on GLOBAL format */}
                            <div className="col-span-3 px-1">
                              {formData.gradeFormat === "letter" && (
                                <select
                                  className="input w-full p-2 border rounded"
                                  value={course.grade}
                                  onChange={(e) => handleCourseChange(semesterIndex, courseIndex, "grade", e.target.value)}
                                >
                                  <option value="" disabled>
                                    Select Grade
                                  </option>
                                  <option value="A+">A+</option>
                                  <option value="A">A</option>
                                  <option value="B+">B+</option>
                                  <option value="B">B</option>
                                  <option value="B">B-</option>
                                  <option value="C+">C+</option>
                                  <option value="C">C</option>
                                  <option value="D">D</option>
                                  <option value="F">F</option>
                                </select>
                              )}
                              {formData.gradeFormat === "percentage" && (
                                <input
                                  type="number"
                                  max="100"
                                  min="0"
                                  step="any"
                                  className="input w-full p-2 border rounded"
                                  placeholder="Grade %"
                                  value={course.grade}
                                  onChange={(e) => handleCourseChange(semesterIndex, courseIndex, "grade", e.target.value)}
                                />
                              )}
                              {formData.gradeFormat === "point" && (
                                <input
                                  type="number"
                                  max="5"
                                  min="0"
                                  step="any"
                                  className="input w-full p-2 border rounded"
                                  placeholder="Grade"
                                  value={course.grade}
                                  onChange={(e) => handleCourseChange(semesterIndex, courseIndex, "grade", e.target.value)}
                                />
                              )}
                            </div>

                            <div className="col-span-3 px-1">
                              <select
                                className="input w-full p-2 border rounded"
                                value={course.credit}
                                onChange={(e) => handleCourseChange(semesterIndex, courseIndex, "credit", e.target.value)}
                              >
                                <option value="" disabled>
                                  Credit
                                </option>
                                <option value="1">1</option>
                                <option value="1.5">1.5</option>
                                <option value="2">2</option>
                                <option value="2.5">2.5</option>
                                <option value="3">3</option>
                                <option value="3.5">3.5</option>
                                <option value="4">4</option>
                                <option value="4.5">4.5</option>
                                <option value="5">5</option>
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

                      <div className="row pb-2 mt-3 flex justify-between">
                        <button
                          type="button"
                          className="col-6 col-md-4 units_active  rounded-lg cursor-pointer add_course bg-[#2845F5] text-white p-3"
                          onClick={() => addCourse(semesterIndex)}
                        >
                          <strong className="flex items-center justify-center">
                            <span className="text-[18px] pe-2">+</span>
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
                              <span className="text-[18px] pe-2">+</span>
                              {data?.payload?.tech_lang_keys?.["add_semester"] || "Add Semester"}
                            </strong>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Submit and Reset Buttons */}
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



                {/* Results Display */}
        {!calculateGpaLoading && result && (
          <div className="w-full result mx-auto p-4 lg:p-8 md:p-8 result_calculator rounded-lg space-y-6">
            <ResultActions lang={data?.payload?.tech_lang_keys} />
            
            <div className="rounded-lg flex items-center justify-center">
              <div className="w-full mt-3">
                {/* Main Result Card */}
                <div className="w-full text-center mt-4">
                  <div className="bg-blue-100 bordered rounded-lg p-4">
                    <p className="text-[32px] mt-2">
                      <b className="final_cgpa">{result.data?.overallCGPA?.toFixed(2) || "0.00"}</b>
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
                        <span className="text-[25px]">{result.data?.totalGradePoints?.toFixed(2)}</span>
                      </strong>
                    </p>
                  </div>
                  <div>
                    <p className="text-[#2845F5] text-[18px]">
                      <strong>
                        {data?.payload?.tech_lang_keys?.["total_h"] || "Total No. of Credits"} ={" "}
                        <span className="text-[25px]">{result.data?.totalCredits}</span>
                      </strong>
                    </p>
                  </div>
                </div>

                {/* Semester-wise Results */}
                <div className="mt-8 space-y-8">
                  {result.data?.semesterResults && result.data.semesterResults.map((semester, semesterIndex) => (
                    <div key={semesterIndex} className="w-full">
                      {/* Semester Header */}
                      <div className="mb-4">
                        <strong className="text-[#2845F5] text-[20px]">
                          {semester.semesterName}
                        </strong>
                      </div>

                      {/* Courses Table */}
                      <div className="w-full overflow-auto">
                        <table className="w-full border-collapse  bordered">
                          <thead>
                            <tr className="bg-[#2845F5] text-white">
                              <th className="p-3  text-left">
                                <strong>{data?.payload?.tech_lang_keys?.["course"] || "Course"}</strong>
                              </th>
                              <th className="p-3  text-center">
                                <strong>{data?.payload?.tech_lang_keys?.["grade"] || "Grade"}</strong>
                              </th>
                              <th className="p-3  text-center">
                                <strong>{data?.payload?.tech_lang_keys?.["credit"] || "Credit"}</strong>
                              </th>
                              <th className="p-3  text-center">
                                <strong>Grade Point</strong>
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {semester.courses && semester.courses.map((course, courseIndex) => (
                              <tr key={courseIndex} className="hover:bg-gray-50 border-b">
                                <td className="p-3 border-b">
                                  {course.courseName || `Course ${courseIndex + 1}`}
                                </td>
                                <td className="p-3 border-b text-center">
                                  {result.data.gradeFormat === "letter" ? course.letterGrade : course.gradePoint?.toFixed(1)}
                                </td>
                                <td className="p-3 border-b text-center">
                                  {course.credit}
                                </td>
                                <td className="p-3 border-b text-center font-semibold">
                                  {course.earnedPoints?.toFixed(2)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                          <tfoot>
                            <tr className="border-b">
                              <td className="p-3  font-semibold text-right" colSpan="2">
                                Total Credit
                              </td>
                              <td className="p-3  text-center font-semibold">
                                {semester.credits}
                              </td>
                              <td className="p-3  text-center"></td>
                            </tr>
                            <tr className="border-b">
                              <td className="p-3  font-semibold text-right" colSpan="2">
                                GPA
                              </td>
                              <td className="p-3  text-center font-semibold">
                                {semester.gpa?.toFixed(2)}
                              </td>
                              <td className="p-3  text-center"></td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    </div>
                  ))}

                  {/* Empty Semesters (if any) */}
                  {formData.semesters.slice(result.data?.semesterResults?.length || 0).map((emptySemester, emptyIndex) => (
                    <div key={`empty-${emptyIndex}`} className="w-full">
                      <div className="mb-4">
                        <strong className="text-[#2845F5] text-[20px]">
                          {emptySemester.semesterName}
                        </strong>
                      </div>
                      
                      <div className="w-full overflow-auto">
                        <table className="w-full border-collapse  bordered">
                          <thead>
                            <tr className="bg-[#2845F5] text-white border-b">
                              <th className="p-3  text-left">
                                <strong>{data?.payload?.tech_lang_keys?.["course"] || "Course"}</strong>
                              </th>
                              <th className="p-3  text-center">
                                <strong>{data?.payload?.tech_lang_keys?.["grade"] || "Grade"}</strong>
                              </th>
                              <th className="p-3  text-center">
                                <strong>{data?.payload?.tech_lang_keys?.["credit"] || "Credit"}</strong>
                              </th>
                              <th className="p-3  text-center">
                                <strong>Grade Point</strong>
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {emptySemester.courses.map((course, courseIndex) => (
                              <tr key={courseIndex} className="hover:bg-gray-50 border-b">
                                <td className="p-3 ">
                                  {course.courseName || `Course ${courseIndex + 1}`}
                                </td>
                                <td className="p-3  text-center">
                                  0.0
                                </td>
                                <td className="p-3  text-center">
                                  0.0
                                </td>
                                <td className="p-3  text-center">
                                  0.0
                                </td>
                              </tr>
                            ))}
                          </tbody>
                          <tfoot>
                            <tr className="border-b">
                              <td className="p-3  font-semibold text-right" colSpan="2">
                                Total Credit
                              </td>
                              <td className="p-3 border-b text-center font-semibold">
                                0.0
                              </td>
                              <td className="p-3 border-b text-center"></td>
                            </tr>
                            <tr className="border-b">
                              <td className="p-3  font-semibold text-right" colSpan="2">
                                GPA
                              </td>
                              <td className="p-3 border-b text-center font-semibold">
                                0.0
                              </td>
                              <td className="p-3 border-b text-center"></td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Previous GPA Information */}
                {result.data?.previousCGPA && (
                  <div className="mt-8 p-4 bg-gray-50 rounded-lg bordered">
                    <h3 className="text-center text-lg font-semibold text-[#2845F5] mb-3">
                      Previous Academic Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-gray-700">
                          <strong>Previous GPA:</strong>
                        </p>
                        <p className="text-[18px] font-semibold">
                          {result.data.previousCGPA.toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-700">
                          <strong>Previous Credits:</strong>
                        </p>
                        <p className="text-[18px] font-semibold">
                          {result.data.previousCredits}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-700">
                          <strong>New Credits Earned:</strong>
                        </p>
                        <p className="text-[18px] font-semibold">
                          {result.data.newCreditsEarned}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Calculation Details */}
                {result.data?.calculationDetails && (
                  <div className="mt-6 p-4 bg-green-50 rounded-lg bordered">
                    <h3 className="text-center text-lg font-semibold text-green-700 mb-3">
                      Calculation Details
                    </h3>
                    <div className="text-center">
                      <p className="text-green-700 text-sm mb-2">
                        <strong>Formula: CGPA = Total Grade Points ÷ Total Credits</strong>
                      </p>
                      <p className="text-green-700 text-sm">
                        {result.data.calculationDetails.finalTotalPoints?.toFixed(2)} ÷ {result.data.calculationDetails.finalTotalCredits} = {result.data.overallCGPA?.toFixed(2)}
                      </p>
                    </div>
                  </div>
                )}

                {/* Success Message */}
                {result.payload?.message && (
                  <div className="mt-4 p-3 bg-green-100 rounded-lg text-center">
                    <p className="text-green-700 font-semibold">
                      {result.payload.message}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Rest of the component remains the same for loading and result display */}
        {/* ... (loading and result display code from previous response) ... */}
      </form>

      {result && (
        <CalculatorFeedback calName={data?.payload?.tech_calculator_title} />
      )}
    </Calculator>
  );
};

export default UogGpaCalculator;
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
  useUfGpaCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

const UfGpaCalculator = () => {
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
    courses: [
      { credits: "", grade: "", g_p: "" },
      { credits: "", grade: "", g_p: "" },
      { credits: "", grade: "", g_p: "" },
      { credits: "", grade: "", g_p: "" }
    ]
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  const [calculateUfGpa, { isLoading: calculateGpaLoading }] = useUfGpaCalculatorMutation();

  // Handle course changes
  const handleCourseChange = (courseIndex, field, value) => {
    const newCourses = [...formData.courses];
    newCourses[courseIndex][field] = value;
    
    // Auto-calculate grade points if credits and grade are provided
    if ((field === "credits" || field === "grade") && value) {
      const credits = parseFloat(newCourses[courseIndex].credits) || 0;
      const grade = parseFloat(newCourses[courseIndex].grade) || 0;
      if (credits > 0 && grade >= 0) {
        newCourses[courseIndex].g_p = (credits * grade).toFixed(2);
      }
    }
    
    setFormData(prev => ({ ...prev, courses: newCourses }));
    setResult(null);
  };

  // Add new course
  const addCourse = () => {
    setFormData(prev => ({
      ...prev,
      courses: [...prev.courses, { credits: "", grade: "", g_p: "" }]
    }));
  };

  // Remove course
  const removeCourse = (courseIndex) => {
    if (formData.courses.length > 1) {
      const newCourses = formData.courses.filter((_, index) => index !== courseIndex);
      setFormData(prev => ({ ...prev, courses: newCourses }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form data
    let hasData = false;
    
    // Check if any course has data
    for (const course of formData.courses) {
      if (course.credits || course.grade) {
        if (!course.credits || !course.grade) {
          setFormError("Please fill all credits and grade fields for courses");
          return;
        }
        hasData = true;
      }
    }

    if (!hasData) {
      setFormError("Please fill in at least one course");
      return;
    }

    // Prepare submission data with proper number conversion
    const submissionData = {
      courses: formData.courses
        .filter(course => course.credits && course.grade)
        .map(course => ({
          credits: course.credits,
          grade: course.grade
        }))
    };

    setFormError("");
    try {
      const response = await calculateUfGpa(submissionData).unwrap();
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
      courses: [
        { credits: "", grade: "", g_p: "" },
        { credits: "", grade: "", g_p: "" },
        { credits: "", grade: "", g_p: "" },
        { credits: "", grade: "", g_p: "" }
      ]
    });
    setResult(null);
    setFormError(null);
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
              <div className="col-span-12 overflow-auto">
                <div className="semester md:w-auto w-[400px]">
                  <div className="row mt-3">
                    <div className="grid grid-cols-12 gap-2 md:gap-4 lg:gap-4">
                      <strong className="col-span-4 text-sm px-1">
                        {data?.payload?.tech_lang_keys?.["credit"] || "Credit"}
                      </strong>
                      <strong className="col-span-4 text-sm px-1">
                        {data?.payload?.tech_lang_keys?.["grade"] || "Grade"}
                      </strong>
                      <strong className="col-span-4 text-sm px-1">
                        {data?.payload?.tech_lang_keys?.["g_p"] || "Grade Points"}
                      </strong>
                    </div>
                  </div>
                  
                  <div className="row addCourse mt-2" id="accept_row1">
                    <ul className="get_html">
                      {formData.courses.map((course, courseIndex) => (
                        <li key={courseIndex} className="row relative" style={{listStyle: "none"}}>
                          <div className="grid grid-cols-12 gap-3 mb-3">
                            <div className="col-span-4 mt-3">
                              <input
                                id={`cradits${courseIndex + 1}`}
                                type="number"
                                max="100"
                                min="0"
                                step="any"
                                className="input w-full p-2 border rounded"
                                placeholder={data?.payload?.tech_lang_keys?.["credit"] || "Credit"}
                                value={course.credits}
                                onChange={(e) => handleCourseChange(courseIndex, "credits", e.target.value)}
                              />
                            </div>
                            <div className="col-span-4 mt-3">
                              <select
                                id={`grade${courseIndex + 1}`}
                                className="input w-full p-2 border rounded"
                                value={course.grade}
                                onChange={(e) => handleCourseChange(courseIndex, "grade", e.target.value)}
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
                                <option value="0.0">E</option>
                                <option value="0.0">WE</option>
                                <option value="0.0">S-U</option>
                              </select>
                            </div>
                            <div className="col-span-3 mt-3">
                              <input
                                id={`g_p${courseIndex + 1}`}
                                type="number"
                                min="0"
                                step="any"
                                className="input w-full p-2 border rounded"
                                placeholder="00"
                                value={course.g_p}
                                readOnly
                              />
                            </div>
                            <div className="col-span-1 mt-3 flex items-center">
                              <button
                                type="button"
                                className="text-red-500 cursor-pointer"
                                onClick={() => removeCourse(courseIndex)}
                              >
                                ✕
                              </button>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                    
                    <div className="col-12 pb-2 mt-3">
                      <button
                        type="button"
                        className="p-2 rounded-lg cursor-pointer add_course bg-[#2845F5] text-[#fff]"
                        onClick={addCourse}
                      >
                        <strong className="flex items-center">
                          <span className="text-[18px] pe-2">+</span>
                          {data?.payload?.tech_lang_keys?.["add_course"] || "Add Course"}
                        </strong>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
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
                  <div className="bg-blue-100 bordered rounded-lg p-4">
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 text-center">
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
                  {result.gradePointDeficit !== undefined && (
                    <div>
                      <p className="text-[#2845F5] text-[18px]">
                        <strong>
                          Grade Point Deficit ={" "}
                          <span className="text-[25px]">{result.gradePointDeficit}</span>
                        </strong>
                      </p>
                    </div>
                  )}
                </div>

                {/* Courses Table */}
                {result.courses && result.courses.length > 0 && (
                  <div className="mt-8">
                    <div className="w-full overflow-auto">
                      <table className="w-full border-collapse border border-gray-300">
                        <thead>
                          <tr className="bg-[#2845F5] text-white">
                            <th className="p-3 border-b border-gray-300 text-center">
                              <strong>{data?.payload?.tech_lang_keys?.["credit"] || "Credit"}</strong>
                            </th>
                            <th className="p-3 border-b border-gray-300 text-center">
                              <strong>{data?.payload?.tech_lang_keys?.["grade"] || "Grade"}</strong>
                            </th>
                            <th className="p-3 border-b border-gray-300 text-center">
                              <strong>{data?.payload?.tech_lang_keys?.["g_p"] || "Grade Points"}</strong>
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {result.courses.map((course, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                              <td className="p-3 border-b border-gray-300 text-center">
                                {course.credits}
                              </td>
                              <td className="p-3 border-b border-gray-300 text-center">
                                {course.grade}
                              </td>
                              <td className="p-3 border-b border-gray-300 text-center font-semibold">
                                {course.gradePoints?.toFixed(2)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
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

export default UfGpaCalculator;
"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useMarksPercentageCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const MarksPercentageCalculator = () => {
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

  const [formData, setFormData] = useState({
    tech_type: "first", // first  second
    tech_first: "34",
    tech_second: "50",
    tech_sub_name: ["Math", "English", "Science"],
    tech_s_marks: ["78", "65", "80"],
    tech_a_marks: ["100", "100", "100"],
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useMarksPercentageCalculatorMutation();

  const handleChange = (e, index) => {
    const { name, value } = e.target;

    const field = name.replace("[]", ""); // tech_sub_name, tech_s_marks, etc.

    // for array fields
    if (Array.isArray(formData[field])) {
      const updatedArray = [...formData[field]];
      updatedArray[index] = value;
      setFormData((prev) => ({ ...prev, [field]: updatedArray }));
    } else {
      // for single value fields
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    setResult(null);
    setFormError(null);
  };

  const addCourse = () => {
    setFormData((prev) => ({
      ...prev,
      tech_sub_name: [...prev.tech_sub_name, ""],
      tech_s_marks: [...prev.tech_s_marks, ""],
      tech_a_marks: [...prev.tech_a_marks, ""],
    }));
  };

  const removeCourse = (index) => {
    setFormData((prev) => ({
      ...prev,
      tech_sub_name: prev.tech_sub_name.filter((_, i) => i !== index),
      tech_s_marks: prev.tech_s_marks.filter((_, i) => i !== index),
      tech_a_marks: prev.tech_a_marks.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_type) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_type: formData.tech_type,
        tech_first: formData.tech_first,
        tech_second: formData.tech_second,
        tech_sub_name: formData.tech_sub_name,
        tech_s_marks: formData.tech_s_marks,
        tech_a_marks: formData.tech_a_marks,
      }).unwrap();
      setResult(response?.payload); // Assuming the response has 'lovePercentage'
      toast.success("Successfully Calculated");
    } catch (err) {
      setFormError(err.data.payload.error);
      toast.error(err.data.payload.error);
    }
  };

  // Handle reset form
  const handleReset = () => {
    setFormData({
      tech_type: "first", // first  second
      tech_first: "34",
      tech_second: "50",
      tech_sub_name: ["Math", "English", "Science"],
      tech_s_marks: ["78", "65", "80"],
      tech_a_marks: ["100", "100", "100"],
    });
    setResult(null);
    setFormError(null);
  };
  // currency code
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
  // currency code
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
      <form className="row" onSubmit={handleSubmit}>
        <div className="w-full mx-auto p-4 lg:p-8 md:p-8 input_form rounded-lg space-y-6 mb-3">
          {formError && (
            <p className="text-red-500 text-lg font-semibold w-full">
              {formError}
            </p>
          )}

          <div className="lg:w-[60%] md:w-[80%] w-full mx-auto ">
            <div className="grid grid-cols-12 mt-3 gap-2 md:gap-4 lg:gap-4">
              <div className="col-span-12">
                <p className="d-inline text-blue pe-4 font-s-14">
                  {data?.payload?.tech_lang_keys["17"]}
                </p>
                <label className="pe-2 cursor-pointer" htmlFor="first">
                  <input
                    type="radio"
                    name="tech_type"
                    value="first"
                    id="first"
                    className="mr-2 border cursor-pointer"
                    onChange={handleChange}
                    checked={formData.tech_type === "first"}
                  />
                  <span>{data?.payload?.tech_lang_keys["18"]}</span>
                </label>
                <label className="pe-2 cursor-pointer" htmlFor="second">
                  <input
                    type="radio"
                    name="tech_type"
                    value="second"
                    id="second"
                    className="mr-2 border cursor-pointer"
                    onChange={handleChange}
                    checked={formData.tech_type === "second"}
                  />
                  <span>{data?.payload?.tech_lang_keys["19"]}</span>
                </label>
              </div>
              {formData.tech_type === "first" && (
                <>
                  <div className="col-span-12 " id="calculator">
                    <div className="grid grid-cols-12 mt-3   gap-2 md:gap-4 lg:gap-4">
                      <div className="col-span-6">
                        <label htmlFor="tech_first" className="label">
                          {data?.payload?.tech_lang_keys["1"]}:
                        </label>
                        <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_first"
                            id="tech_first"
                            className="input my-2"
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_first}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="col-span-6">
                        <label htmlFor="tech_second" className="label">
                          {data?.payload?.tech_lang_keys["2"]}:
                        </label>
                        <div className=" relative">
                          <input
                            type="number"
                            step="any"
                            name="tech_second"
                            id="tech_second"
                            className="input my-2"
                            aria-label="input"
                            placeholder="00"
                            value={formData.tech_second}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
              {formData.tech_type === "second" && (
                <>
                  <div className="col-span-12 ">
                    <ul className="get_html">
                      {formData.tech_sub_name.map((_, index) => (
                        <li className="flex gap-3" key={index}>
                          <div className="col-span-4">
                            <label className="label">
                              {data?.payload?.tech_lang_keys["10"]}:
                            </label>
                            <input
                              type="text"
                              name="tech_sub_name[]"
                              className="input my-2"
                              placeholder="e.g. Math"
                              value={formData.tech_sub_name[index]}
                              onChange={(e) => handleChange(e, index)}
                            />
                          </div>

                          <div className="col-span-4">
                            <label className="label">
                              {data?.payload?.tech_lang_keys["11"]}:
                            </label>
                            <input
                              type="number"
                              step="any"
                              name="tech_s_marks[]"
                              className="input my-2"
                              placeholder="00"
                              value={formData.tech_s_marks[index]}
                              onChange={(e) => handleChange(e, index)}
                            />
                          </div>

                          <div className="col-span-4 gpa_weight">
                            <label className="label">
                              {data?.payload?.tech_lang_keys["12"]}:
                            </label>
                            <input
                              type="number"
                              step="any"
                              name="tech_a_marks[]"
                              className="input my-2"
                              placeholder="00"
                              value={formData.tech_a_marks[index]}
                              onChange={(e) => handleChange(e, index)}
                            />
                          </div>

                          <div className="flex items-center mt-4">
                            <button
                              type="button"
                              className="text-red-600 cursor-pointer font-bold px-2"
                              onClick={() => removeCourse(index)}
                              title="Remove Row"
                            >
                              ✕
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                    <div className="my-2">
                      <button
                        type="button"
                        onClick={addCourse}
                        className="units_active border p-2 cursor-pointer bg-[#2845F5] text-white rounded-lg font-bold"
                      >
                        <span className="text-[20px] font-bold">+</span>{" "}
                        {data?.payload?.tech_lang_keys["13"]}
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="mb-6 mt-10 text-center space-x-2">
            <Button type="submit" isLoading={roundToTheNearestLoading}>
              {data?.payload?.tech_lang_keys["calculate"]}
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
        {roundToTheNearestLoading ? (
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
                <div>
                  <ResultActions lang={data?.payload?.tech_lang_keys} />

                  <div className="rounded-lg flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="w-full">
                        {/* Main Percentage Result */}
                        <div className="text-center">
                          <p className="text-[20px]">
                            <strong>
                              {data?.payload?.tech_lang_keys["4"]}
                            </strong>
                          </p>
                          <p className="text-[32px] bg-[#2845F5] px-3 py-2 rounded-lg inline-block my-3">
                            <strong className="text-white">
                              {Number(result?.tech_percent).toFixed(2)} %
                            </strong>
                          </p>
                        </div>

                        {/* Total Scored and Total Marks (type: second) */}
                        {result?.tech_type === "second" && (
                          <div className="w-full mb-3 overfow-auto">
                            <div className="w-full md:w-[60%] lg:w-[60%]">
                              <p className="text-[20px] py-2">
                                <strong>
                                  {data?.payload?.tech_lang_keys[14]}
                                </strong>
                              </p>
                              <p className="text-blue text-[18px]">
                                <strong>
                                  {Number(result?.tech_total_scored).toFixed(2)}
                                </strong>
                              </p>
                            </div>
                            <div className="w-full md:w-[60%] lg:w-[60%]">
                              <p className="text-[20px] py-2">
                                <strong>
                                  {data?.payload?.tech_lang_keys[15]}
                                </strong>
                              </p>
                              <p className="text-blue text-[18px]">
                                <strong>
                                  {Number(result?.tech_total_marks).toFixed(2)}
                                </strong>
                              </p>
                            </div>
                          </div>
                        )}

                        {/* First Type: Calculation Steps */}
                        {result?.tech_type === "first" && (
                          <div>
                            <p className="text-[18px]">
                              <strong>
                                {data?.payload?.tech_lang_keys[5]}
                              </strong>
                            </p>

                            {/* Example formula 1 */}
                            <div className="overflow-auto">
                              <strong>
                                {data?.payload?.tech_lang_keys[4]} ={" "}
                              </strong>
                              <span className="fraction flex">
                                <span className="num">
                                  {data?.payload?.tech_lang_keys[6]}{" "}
                                  {data?.payload?.tech_lang_keys[7]}
                                </span>
                                <span className="den">
                                  {data?.payload?.tech_lang_keys[6]}{" "}
                                  {data?.payload?.tech_lang_keys[7]}
                                </span>
                              </span>
                              × 100
                            </div>

                            {/* Example formula 2 using formData */}
                            <div className="overflow-auto">
                              <strong>
                                {data?.payload?.tech_lang_keys[4]} ={" "}
                              </strong>
                              <span className="fraction flex">
                                <span className="num">
                                  {formData.tech_first}
                                </span>
                                <span className="den">
                                  {formData.tech_second}
                                </span>
                              </span>
                              × 100
                            </div>

                            {/* Final percent result */}
                            <p className="mt-2">
                              <strong>
                                {data?.payload?.tech_lang_keys[4]} ={" "}
                                {Number(result?.tech_percent).toFixed(2)} %
                              </strong>
                            </p>
                          </div>
                        )}

                        {/* Table (for second type) */}
                        {result?.tech_type === "second" && (
                          <div className="w-full overflow-auto">
                            <table className="w-full text-[16px] mt-4">
                              <thead>
                                <tr>
                                  <td className="border-b py-2">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[10]}
                                    </strong>
                                  </td>
                                  <td className="border-b py-2">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[11]}
                                    </strong>
                                  </td>
                                  <td className="border-b py-2">
                                    <strong>
                                      {data?.payload?.tech_lang_keys[12]}
                                    </strong>
                                  </td>
                                </tr>
                              </thead>
                              <tbody>
                                {result?.tech_s_array?.map((value, index) => (
                                  <tr key={index}>
                                    <td className="border-b py-2">
                                      {result?.tech_name_array?.[index]}
                                    </td>
                                    <td className="border-b py-2">
                                      {result?.tech_s_array?.[index]}
                                    </td>
                                    <td className="border-b py-2">
                                      {result?.tech_a_array?.[index]}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )
        )}
      </form>
      {result && (
        <CalculatorFeedback calName={data?.payload?.tech_calculator_title} />
      )}
    </Calculator>
  );
};

export default MarksPercentageCalculator;

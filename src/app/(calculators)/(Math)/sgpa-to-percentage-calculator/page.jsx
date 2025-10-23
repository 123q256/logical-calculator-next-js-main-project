"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  useGetSingleCalculatorDetailsMutation,
  useSgpaToPercentageCalculatorMutation,
} from "../../../../redux/services/calculator/calculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const SgpaToPercentageCalculator = () => {
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
    tech_selection: "1",
    tech_sgp: "8.5",
    tech_number_of_semesters: "8",
    tech_sum: "3.7",
    tech_sgpa: ["3", "2", "3", "4"],
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useSgpaToPercentageCalculatorMutation();

  const handleChange = (e, index = null) => {
    const { name, value } = e.target;

    // If it's an SGPA array field
    if (index !== null) {
      const updatedSGPA = [...formData.tech_sgpa];
      updatedSGPA[index] = value;

      setFormData((prev) => ({
        ...prev,
        tech_sgpa: updatedSGPA,
      }));
    } else {
      // Handle normal fields like dropdown/select/input
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    setResult(null);
    setFormError(null);
  };

  const addRow = () => {
    setFormData((prev) => ({
      ...prev,
      tech_sgpa: [...prev.tech_sgpa, ""],
    }));
  };

  const deleteRow = (index) => {
    const updatedSGPA = [...formData.tech_sgpa];
    updatedSGPA.splice(index, 1);

    setFormData((prev) => ({
      ...prev,
      tech_sgpa: updatedSGPA,
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
        tech_selection: formData.tech_selection,
        tech_sgp: formData.tech_sgp,
        tech_number_of_semesters: formData.tech_number_of_semesters,
        tech_sum: formData.tech_sum,
        tech_sgpa: formData.tech_sgpa,
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
      tech_selection: "1",
      tech_sgp: "8.5",
      tech_number_of_semesters: "8",
      tech_sum: "3.7",
      tech_sgpa: ["3", "2", "3", "4"],
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

          <div className="lg:w-[50%] md:w-[80%] w-full mx-auto ">
            <div className="col-12 col-lg-9 mx-auto mt-2  w-full">
              <input
                type="hidden"
                name="tech_type"
                id="calculator_time"
                value={formData.tech_type}
              />
              <div className="flex flex-wrap items-center bg-blue-100 border border-blue-500 text-center rounded-lg px-1">
                {/* Date Cal Tab */}
                <div className="lg:w-1/2 w-full px-2 py-1">
                  <div
                    className={`bg-white px-3 py-2 cursor-pointer rounded-md transition-colors duration-300 hover_tags hover:text-white pacetab  ${
                      formData.tech_type === "first" ? "tagsUnit" : ""
                    }`}
                    id="first"
                    onClick={() => {
                      setFormData({ ...formData, tech_type: "first" });
                      setResult(null);
                      setFormError(null);
                    }}
                  >
                    {data?.payload?.tech_lang_keys["4"]}
                  </div>
                </div>
                {/* Time Cal Tab */}
                <div className="lg:w-1/2 w-full px-2 py-1">
                  <div
                    className={`bg-white px-3 py-2 cursor-pointer rounded-md transition-colors duration-300 hover_tags hover:text-white pacetab ${
                      formData.tech_type === "second" ? "tagsUnit" : ""
                    }`}
                    id="second"
                    onClick={() => {
                      setFormData({ ...formData, tech_type: "second" });
                      setResult(null);
                      setFormError(null);
                    }}
                  >
                    {data?.payload?.tech_lang_keys["5"]}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-12 mt-5   gap-2 md:gap-4 lg:gap-4">
              {formData.tech_type == "first" && (
                <>
                  <div className="col-span-12 " id="simpleInput">
                    <div className="col-12 mt-0 mt-lg-2">
                      <label htmlFor="tech_selection" className="label">
                        {data?.payload?.tech_lang_keys["1"]}:
                      </label>
                      <div className="mt-2">
                        <select
                          className="input"
                          aria-label="select"
                          name="tech_selection"
                          id="tech_selection"
                          value={formData.tech_selection}
                          onChange={handleChange}
                        >
                          <option value="1">
                            SGPA {data?.payload?.tech_lang_keys["2"]}{" "}
                          </option>
                          <option value="2">
                            {" "}
                            {data?.payload?.tech_lang_keys["3"]} CGPA{" "}
                          </option>
                        </select>
                      </div>
                    </div>
                    {formData.tech_selection == "1" && (
                      <>
                        <div className="col-12 mt-0 mt-lg-2  ">
                          <label htmlFor="tech_sgp" className="label">
                            Enter Your SGPA:
                          </label>
                          <div className=" relative">
                            <input
                              type="number"
                              step="any"
                              name="tech_sgp"
                              id="tech_sgp"
                              className="input my-2"
                              aria-label="input"
                              placeholder="00"
                              value={formData.tech_sgp}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                      </>
                    )}
                    {formData.tech_selection == "2" && (
                      <>
                        <div className="col-12 mt-0 mt-lg-2">
                          <label
                            htmlFor="tech_number_of_semesters"
                            className="label"
                          >
                            {data?.payload?.tech_lang_keys["7"]}
                          </label>
                          <div className=" relative">
                            <input
                              type="number"
                              step="any"
                              name="tech_number_of_semesters"
                              id="tech_number_of_semesters"
                              className="input my-2"
                              aria-label="input"
                              placeholder="00"
                              value={formData.tech_number_of_semesters}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                        <div className="col-12 mt-0 mt-lg-2">
                          <label htmlFor="tech_sum" className="label">
                            {data?.payload?.tech_lang_keys["8"]} SGPAs{" "}
                            {data?.payload?.tech_lang_keys["9"]}
                          </label>
                          <div className=" relative">
                            <input
                              type="number"
                              step="any"
                              name="tech_sum"
                              id="tech_sum"
                              className="input my-2"
                              aria-label="input"
                              placeholder="00"
                              value={formData.tech_sum}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </>
              )}
              {formData.tech_type == "second" && (
                <>
                  <div id="advancedInput" className="col-span-12">
                    <div id="cd2">
                      {formData.tech_sgpa.map((value, index) => (
                        <div className="col-12 mt-0 mt-lg-2" key={index}>
                          <label
                            htmlFor={`tech_sgpa_${index}`}
                            className="label"
                          >
                            Enter Semester {index + 1} SGPA:
                          </label>
                          <div className="relative flex items-center gap-2">
                            <input
                              type="number"
                              step="any"
                              name={`tech_sgpa_${index}`}
                              id={`tech_sgpa_${index}`}
                              className="input my-2"
                              aria-label="input"
                              placeholder="00"
                              value={value}
                              onChange={(e) => handleChange(e, index)}
                            />
                            {formData.tech_sgpa.length > 1 && (
                              <button
                                type="button"
                                onClick={() => deleteRow(index)}
                                className="text-red-500 cursor-pointer font-bold px-2"
                                title="Delete this field"
                              >
                                ✕
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="col-12 text-end mt-3" id="btn2">
                      <button
                        type="button"
                        onClick={addRow}
                        title="Add More Fields"
                        className="px-3 py-2 mx-1 cursor-pointer bg-[#2845F5] text-white rounded-lg"
                      >
                        + Add More
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

                  <div className="rounded-lg  flex items-center justify-center">
                    <div className="w-full mt-3">
                      <div className="w-full">
                        {result?.tech_percentage && (
                          <>
                            <div className="w-full text-center text-[20px]">
                              <p>CGPA</p>
                              <p className="my-3">
                                <strong className="bg-[#2845F5] px-3 py-2 md:text-[25px] text-[18px] rounded-lg text-white">
                                  {result?.tech_percentage}
                                </strong>
                              </p>
                            </div>
                          </>
                        )}
                        {result?.tech_final_gpa && (
                          <>
                            <div className="w-full text-center text-[20px]">
                              <p>{data?.payload?.tech_lang_keys[10]}</p>
                              <p className="my-3">
                                <strong className="bg-[#2845F5] px-3 py-2 md:text-[25px] text-[18px] rounded-lg text-white">
                                  {result?.tech_final_gpa}%
                                </strong>
                              </p>
                            </div>
                          </>
                        )}
                        {result?.tech_final_result && (
                          <>
                            <div className="w-full text-center text-[20px]">
                              <p>
                                {data?.payload?.tech_lang_keys[11]} CGPA{" "}
                                {data?.payload?.tech_lang_keys[12]}
                              </p>
                              <p className="my-3">
                                <strong className="bg-[#2845F5] px-3 py-2 md:text-[25px] text-[18px] rounded-lg text-white">
                                  {result?.tech_final_result}
                                </strong>
                              </p>
                            </div>
                          </>
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

export default SgpaToPercentageCalculator;

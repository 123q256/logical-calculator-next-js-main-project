"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { useGetSingleCalculatorDetailsMutation } from "../../../../redux/services/calculator/calculatorApi";

import { useScaleCalculatorMutation } from "../../../../redux/services/datecalculator/dateCalculatorApi";

import { toast } from "react-toastify";
import ResultActions from "../../../../components/Calculator/ResultActions";
import CalculatorFeedback from "../../../../components/Calculator/CalculatorFeedback";
import Calculator from "../../Calculator";
import { getUserCurrency } from "../../../../components/Calculator/GetCurrency"; //currency import class
import ResetButton from "../../../../components/Calculator/ResetButton";
import Button from "../../../../components/Calculator/Button";

const ScaleFactorCalculator = () => {
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
    tech_choice: "1", //  1 2 3
    tech_scaled_length: "4",
    tech_scaled_length_unit: "m",
    tech_y1: "1",
    tech_y2: "2",
    tech_real_length: "1",
    tech_real_length_unit: "m",
  });

  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");

  // RTK mutation hook
  const [
    calculateEbitCalculator,
    { isLoading: roundToTheNearestLoading, isError, error: calculateLoveError },
  ] = useScaleCalculatorMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setResult(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tech_choice) {
      setFormError("Please fill in input.");
      return;
    }

    setFormError("");
    try {
      const response = await calculateEbitCalculator({
        tech_choice: formData.tech_choice,
        tech_scaled_length: formData.tech_scaled_length,
        tech_scaled_length_unit: formData.tech_scaled_length_unit,
        tech_y1: formData.tech_y1,
        tech_y2: formData.tech_y2,
        tech_real_length: formData.tech_real_length,
        tech_real_length_unit: formData.tech_real_length_unit,
      }).unwrap();
      setResult(response); // Assuming the response has 'lovePercentage'
      toast.success("Successfully Calculated");
    } catch (err) {
      setFormError(err.data.error);
      toast.error(err.data.error);
    }
  };

  // Handle reset form
  const handleReset = () => {
    setFormData({
      tech_choice: "1", //  1 2 3
      tech_scaled_length: "4",
      tech_scaled_length_unit: "m",
      tech_y1: "1",
      tech_y2: "2",
      tech_real_length: "1",
      tech_real_length_unit: "m",
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

  //dropdown states
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const setUnitHandler = (unit) => {
    setFormData((prev) => ({ ...prev, tech_units1: unit }));
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  //dropdown states
  const [dropdownVisible1, setDropdownVisible1] = useState(false);

  const setUnitHandler1 = (unit) => {
    setFormData((prev) => ({ ...prev, tech_units2: unit }));
    setDropdownVisible1(false);
  };

  const toggleDropdown1 = () => {
    setDropdownVisible1(!dropdownVisible1);
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
          <div className="lg:w-[60%] md:w-[60%] w-full mx-auto ">
            <input
              type="hidden"
              name="tech_choice"
              id="calculator_time"
              value={formData.tech_choice}
            />
            <div className="flex flex-wrap items-center bg-blue-100 border border-blue-500 text-center rounded-lg px-1">
              {/* Date Cal Tab */}
              <div className="lg:w-1/3 w-full px-2 py-1">
                <div
                  className={`bg-white px-3 py-2 cursor-pointer rounded-md transition-colors duration-300 hover_tags hover:text-white pacetab  ${
                    formData.tech_choice === "1" ? "tagsUnit" : ""
                  }`}
                  id="1"
                  onClick={() => {
                    setFormData({ ...formData, tech_choice: "1" });
                    setResult(null);
                    setFormError(null);
                  }}
                >
                  {data?.payload?.tech_lang_keys["6"]}
                </div>
              </div>
              {/* Time Cal Tab */}
              <div className="lg:w-1/3 w-full px-2 py-1">
                <div
                  className={`bg-white px-3 py-2 cursor-pointer rounded-md transition-colors duration-300 hover_tags hover:text-white pacetab ${
                    formData.tech_choice === "2" ? "tagsUnit" : ""
                  }`}
                  id="2"
                  onClick={() => {
                    setFormData({ ...formData, tech_choice: "2" });
                    setResult(null);
                    setFormError(null);
                  }}
                >
                  {data?.payload?.tech_lang_keys["7"]}
                </div>
              </div>
              <div className="lg:w-1/3 w-full px-2 py-1">
                <div
                  className={`bg-white px-3 py-2 cursor-pointer rounded-md transition-colors duration-300 hover_tags hover:text-white pacetab ${
                    formData.tech_choice === "3" ? "tagsUnit" : ""
                  }`}
                  id="3"
                  onClick={() => {
                    setFormData({ ...formData, tech_choice: "3" });
                    setResult(null);
                    setFormError(null);
                  }}
                >
                  {data?.payload?.tech_lang_keys["8"]}
                </div>
              </div>
            </div>
          </div>
          <div className="lg:w-[60%] md:w-[60%] w-full mx-auto ">
            <div className="grid grid-cols-12  gap-2 md:gap-4 lg:gap-4">
              {formData.tech_choice == "1" && (
                <>
                  <div className="col-span-6 scaled_fector ">
                    <label htmlFor="tech_scaled_length" className="label">
                      {data?.payload?.tech_lang_keys["7"]}
                    </label>
                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_scaled_length"
                        step="any"
                        min="1"
                        className="mt-1 input"
                        value={formData.tech_scaled_length}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown}
                      >
                        {formData.tech_scaled_length_unit} ▾
                      </label>
                      {dropdownVisible && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "mm", value: "mm" },
                            { label: "cm", value: "cm" },
                            { label: "m", value: "m" },
                            { label: "km", value: "km" },
                            { label: "in", value: "in" },
                            { label: "ft", value: "ft" },
                            { label: "yd", value: "yd" },
                            { label: "mi", value: "mi" },
                            { label: "nmi", value: "nmi" },
                          ].map((unit, index) => (
                            <p
                              key={index}
                              className="p-2 hover:bg-gray-100 cursor-pointer"
                              onClick={() => setUnitHandler(unit.value)}
                            >
                              {unit.label}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
              {(formData.tech_choice == "2" || formData.tech_choice == "3") && (
                <>
                  <div className="col-span-6 other_fector ">
                    <label htmlFor="tech_y1" className="label">
                      {data?.payload?.tech_lang_keys["6"]}:
                    </label>
                    <div className="w-full  flex justify-center items-center">
                      <input
                        type="number"
                        step="any"
                        name="tech_y1"
                        id="tech_y1"
                        className="input my-1"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_y1}
                        onChange={handleChange}
                      />
                      <span className="px-1 ">:</span>
                      <input
                        type="number"
                        step="any"
                        name="tech_y2"
                        id="tech_y2"
                        className="input my-1"
                        aria-label="input"
                        placeholder="00"
                        value={formData.tech_y2}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </>
              )}

              {(formData.tech_choice == "1" ||
                formData.tech_choice == "2" ||
                formData.tech_choice == "3") && (
                <>
                  <div className="col-span-6">
                    {(formData.tech_choice == "1" ||
                      formData.tech_choice == "2") && (
                      <>
                        <label htmlFor="tech_real_length" className="label">
                          {" "}
                          {data?.payload?.tech_lang_keys["8"]}{" "}
                        </label>
                      </>
                    )}
                    {formData.tech_choice == "3" && (
                      <>
                        <label htmlFor="tech_real_length" className="label">
                          {" "}
                          {data?.payload?.tech_lang_keys["7"]}{" "}
                        </label>
                      </>
                    )}

                    <div className="relative w-full ">
                      <input
                        type="number"
                        name="tech_real_length"
                        step="any"
                        min="1"
                        className="mt-1 input"
                        value={formData.tech_real_length}
                        placeholder="00"
                        onChange={handleChange}
                      />
                      <label
                        className="absolute cursor-pointer text-sm underline right-6 top-4"
                        onClick={toggleDropdown}
                      >
                        {formData.tech_real_length_unit} ▾
                      </label>
                      {dropdownVisible && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md w-auto mt-1 right-0">
                          {[
                            { label: "mm", value: "mm" },
                            { label: "cm", value: "cm" },
                            { label: "m", value: "m" },
                            { label: "km", value: "km" },
                            { label: "in", value: "in" },
                            { label: "ft", value: "ft" },
                            { label: "yd", value: "yd" },
                            { label: "mi", value: "mi" },
                            { label: "nmi", value: "nmi" },
                          ].map((unit, index) => (
                            <p
                              key={index}
                              className="p-2 hover:bg-gray-100 cursor-pointer"
                              onClick={() => setUnitHandler(unit.value)}
                            >
                              {unit.label}
                            </p>
                          ))}
                        </div>
                      )}
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
                      <div className="w-full my-2">
                        {formData?.tech_choice === "1" ? (
                          <div className="w-full text-center text-[20px]">
                            <p>{data?.payload?.tech_lang_keys[6]}</p>
                            <div className="flex justify-center">
                              <p className="text-[25px] bg-[#2845F5] text-white rounded-lg px-3 py-2  my-3">
                                <strong>{result?.tech_v5}</strong>
                              </p>
                            </div>
                          </div>
                        ) : formData?.tech_choice === "2" ? (
                          <div className="w-full text-center text-[20px]">
                            <p>{data?.payload?.tech_lang_keys[7]}</p>
                            <div className="my-3 bg-[#2845F5] text-white px-3 py-2 text-[32px] rounded-lg inline-block">
                              <strong id="circle_result">
                                {Number(result?.tech_answer).toFixed(2)}
                              </strong>
                              <span className="text-[16px]">
                                {formData?.tech_real_length_unit || ""}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="w-full text-center text-[20px]">
                            <p>{data?.payload?.tech_lang_keys[8]}</p>
                            <div className="my-3 bg-[#2845F5] text-white px-3 py-2 text-[32px] rounded-lg inline-block">
                              <strong id="circle_result">
                                {Number(result?.tech_answer).toFixed(2)}
                              </strong>
                              <span className="text-[16px]">
                                {formData?.tech_real_length_unit || ""}
                              </span>
                            </div>
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

export default ScaleFactorCalculator;
